import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlatformHubService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. TỔNG QUAN NỀN TẢNG (PLATFORM OVERVIEW)
  async getOverview() {
    try {
      const [heritageCount, museumCount, sportCount, raceCount, archiveCount] = await Promise.all([
        this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::text as c FROM public.vione_heritage_sites`),
        this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::text as c FROM public.vione_museums`),
        this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::text as c FROM public.vione_sport_tournaments`),
        this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::text as c FROM public.vione_races`),
        this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::text as c FROM public.vione_archives`),
      ]);

      const upcomingRaces = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT * FROM public.vione_races ORDER BY race_date ASC LIMIT 2
      `);

      const featuredHeritage = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT * FROM public.vione_heritage_sites ORDER BY stamps_count DESC LIMIT 3
      `);

      const liveTournaments = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT * FROM public.vione_sport_tournaments WHERE status = 'in_progress' OR status = 'upcoming' LIMIT 2
      `);

      return {
        stats: {
          heritageCount: parseInt(heritageCount[0]?.c || '0', 10),
          museumCount: parseInt(museumCount[0]?.c || '0', 10),
          sportTournamentsCount: parseInt(sportCount[0]?.c || '0', 10),
          racesCount: parseInt(raceCount[0]?.c || '0', 10),
          archivesCount: parseInt(archiveCount[0]?.c || '0', 10),
        },
        featuredHeritage,
        upcomingRaces,
        liveTournaments,
      };
    } catch (err: any) {
      console.error('[PlatformHubService.getOverview] error:', err);
      return {
        stats: { heritageCount: 0, museumCount: 0, sportTournamentsCount: 0, racesCount: 0, archivesCount: 0 },
        featuredHeritage: [],
        upcomingRaces: [],
        liveTournaments: [],
      };
    }
  }

  // 2. DI SẢN VĂN HÓA (VIONE HERITAGE)
  async getHeritageSites(query?: { search?: string; category?: string; province?: string }) {
    const conditions: string[] = [];
    if (query?.search) {
      const s = query.search.replace(/'/g, "''");
      conditions.push(`(name ILIKE '%${s}%' OR province ILIKE '%${s}%' OR description ILIKE '%${s}%')`);
    }
    if (query?.category && query.category !== 'all') {
      conditions.push(`category = '${query.category.replace(/'/g, "''")}'`);
    }
    if (query?.province && query.province !== 'all') {
      conditions.push(`province = '${query.province.replace(/'/g, "''")}'`);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const sites = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_heritage_sites
      ${where}
      ORDER BY stamps_count DESC, created_at DESC
    `);
    return sites;
  }

  async getHeritageDetail(idOrCode: string) {
    const clean = idOrCode.replace(/'/g, "''");
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
    const where = isUuid ? `id = '${clean}'::uuid` : `code = '${clean}'`;

    const sites = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_heritage_sites WHERE ${where} LIMIT 1
    `);
    if (!sites.length) {
      throw new NotFoundException('Không tìm thấy thông tin di sản');
    }
    const site = sites[0];

    // Lấy danh sách bảo tàng liên kết nếu có
    const museums = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_museums WHERE heritage_site_id = '${site.id}'::uuid
    `);
    return { ...site, museums };
  }

  async stampHeritage(userId: string, heritageSiteId: string, note?: string) {
    try {
      const stampCode = 'STAMP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.vione_user_heritage_stamps (user_id, heritage_site_id, stamp_code, note)
        VALUES ('${userId}'::uuid, '${heritageSiteId}'::uuid, '${stampCode}', '${(note || '').replace(/'/g, "''")}')
        ON CONFLICT (user_id, heritage_site_id) DO UPDATE SET stamped_at = NOW()
      `);

      await this.prisma.$executeRawUnsafe(`
        UPDATE public.vione_heritage_sites SET stamps_count = stamps_count + 1 WHERE id = '${heritageSiteId}'::uuid
      `);

      return { success: true, stampCode, message: 'Đóng dấu ấn di sản số thành công!' };
    } catch (err: any) {
      console.error('[stampHeritage] err:', err);
      throw new BadRequestException('Không thể đóng dấu di sản: ' + err.message);
    }
  }

  async getUserHeritageStamps(userId: string) {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT s.*, h.name as site_name, h.thumbnail_url, h.province, h.category
      FROM public.vione_user_heritage_stamps s
      JOIN public.vione_heritage_sites h ON s.heritage_site_id = h.id
      WHERE s.user_id = '${userId}'::uuid
      ORDER BY s.stamped_at DESC
    `);
    return rows;
  }

  // 3. BẢO TÀNG SỐ (VIONE MUSEUM)
  async getMuseums(query?: { province?: string; search?: string }) {
    const conditions: string[] = [];
    if (query?.search) {
      const s = query.search.replace(/'/g, "''");
      conditions.push(`(name ILIKE '%${s}%' OR address ILIKE '%${s}%')`);
    }
    if (query?.province && query.province !== 'all') {
      conditions.push(`province = '${query.province.replace(/'/g, "''")}'`);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const museums = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT m.*, COUNT(a.id)::int as artifacts_count
      FROM public.vione_museums m
      LEFT JOIN public.vione_museum_artifacts a ON a.museum_id = m.id
      ${where}
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `);
    return museums;
  }

  async getMuseumDetail(idOrCode: string) {
    const clean = idOrCode.replace(/'/g, "''");
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
    const where = isUuid ? `m.id = '${clean}'::uuid` : `m.code = '${clean}'`;

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT m.*, h.name as heritage_site_name
      FROM public.vione_museums m
      LEFT JOIN public.vione_heritage_sites h ON m.heritage_site_id = h.id
      WHERE ${where} LIMIT 1
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy bảo tàng');

    const museum = rows[0];
    const artifacts = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_museum_artifacts WHERE museum_id = '${museum.id}'::uuid ORDER BY is_national_treasure DESC, created_at DESC
    `);
    return { ...museum, artifacts };
  }

  async getArtifactByNfc(nfcUid: string) {
    const clean = nfcUid.replace(/'/g, "''");
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT a.*, m.name as museum_name, m.address as museum_address
      FROM public.vione_museum_artifacts a
      JOIN public.vione_museums m ON a.museum_id = m.id
      WHERE a.nfc_uid = '${clean}' LIMIT 1
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy hiện vật ứng với chip NFC này');
    return rows[0];
  }

  async getArtifactByCode(code: string) {
    const clean = code.replace(/'/g, "''");
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT a.*, m.name as museum_name, m.address as museum_address
      FROM public.vione_museum_artifacts a
      JOIN public.vione_museums m ON a.museum_id = m.id
      WHERE a.artifact_code = '${clean}' LIMIT 1
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy hiện vật');
    return rows[0];
  }

  // 4. GIẢI ĐẤU THỂ THAO (VIONE SPORT)
  async getSportTournaments(query?: { sportType?: string; status?: string }) {
    const conditions: string[] = [];
    if (query?.sportType && query.sportType !== 'all') {
      conditions.push(`sport_type = '${query.sportType.replace(/'/g, "''")}'`);
    }
    if (query?.status && query.status !== 'all') {
      conditions.push(`status = '${query.status.replace(/'/g, "''")}'`);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const tournaments = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_sport_tournaments
      ${where}
      ORDER BY start_date ASC
    `);
    return tournaments;
  }

  async getTournamentDetail(id: string) {
    const clean = id.replace(/'/g, "''");
    const tournaments = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_sport_tournaments WHERE id = '${clean}'::uuid OR code = '${clean}' LIMIT 1
    `);
    if (!tournaments.length) throw new NotFoundException('Không tìm thấy giải đấu');
    const tournament = tournaments[0];

    const matches = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_sport_matches WHERE tournament_id = '${tournament.id}'::uuid ORDER BY scheduled_time ASC, created_at ASC
    `);
    return { ...tournament, matches };
  }

  async updateMatchScore(matchId: string, data: { scoreA: number; scoreB: number; setsDetail?: string; status?: string; winner?: string }) {
    const cleanId = matchId.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`
      UPDATE public.vione_sport_matches
      SET score_a = ${data.scoreA},
          score_b = ${data.scoreB},
          sets_detail = '${(data.setsDetail || '').replace(/'/g, "''")}',
          status = '${(data.status || 'live').replace(/'/g, "''")}',
          winner = ${data.winner ? `'${data.winner.replace(/'/g, "''")}'` : 'NULL'}
      WHERE id = '${cleanId}'::uuid
    `);
    return { success: true };
  }

  async getSportClubs(query?: { sportType?: string }) {
    const conditions: string[] = [];
    if (query?.sportType && query.sportType !== 'all') {
      conditions.push(`sport_type = '${query.sportType.replace(/'/g, "''")}'`);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const clubs = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_sport_clubs ${where} ORDER BY members_count DESC
    `);
    return clubs;
  }

  // 5. GIẢI CHẠY & TIMING RFID (VIONE RUN)
  async getRaces(query?: { isHeritageRun?: boolean; status?: string }) {
    const conditions: string[] = [];
    if (typeof query?.isHeritageRun === 'boolean') {
      conditions.push(`is_heritage_run = ${query.isHeritageRun}`);
    }
    if (query?.status && query.status !== 'all') {
      conditions.push(`status = '${query.status.replace(/'/g, "''")}'`);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const races = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT r.*, COUNT(b.id)::int as runners_count
      FROM public.vione_races r
      LEFT JOIN public.vione_race_bibs b ON b.race_id = r.id
      ${where}
      GROUP BY r.id
      ORDER BY r.race_date ASC
    `);
    return races;
  }

  async getRaceDetail(idOrCode: string) {
    const clean = idOrCode.replace(/'/g, "''");
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
    const where = isUuid ? `r.id = '${clean}'::uuid` : `r.code = '${clean}'`;

    const races = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_races r WHERE ${where} LIMIT 1
    `);
    if (!races.length) throw new NotFoundException('Không tìm thấy giải chạy');
    const race = races[0];

    const distances = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_race_distances WHERE race_id = '${race.id}'::uuid ORDER BY distance_km DESC
    `);

    const bibCount = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT COUNT(*)::int as total,
             COUNT(CASE WHEN status = 'finished' THEN 1 END)::int as finished,
             COUNT(CASE WHEN status = 'racing' THEN 1 END)::int as racing
      FROM public.vione_race_bibs WHERE race_id = '${race.id}'::uuid
    `);

    return { ...race, distances, stats: bibCount[0] };
  }

  async registerRaceBib(userId: string, raceId: string, data: { distanceKm: number; runnerName: string; runnerGender?: string; runnerAge?: number }) {
    const cleanRaceId = raceId.replace(/'/g, "''");
    const prefix = Math.round(data.distanceKm).toString();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bibNumber = `${prefix}${randomSuffix}`;
    const rfidEpc = 'E28011' + Math.random().toString(16).substring(2, 14).toUpperCase();

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.vione_race_bibs (race_id, user_id, runner_name, runner_gender, runner_age, bib_number, distance_km, rfid_tag_epc, status)
      VALUES (
        '${cleanRaceId}'::uuid,
        '${userId}'::uuid,
        '${data.runnerName.replace(/'/g, "''")}',
        '${data.runnerGender || 'male'}',
        ${data.runnerAge || 30},
        '${bibNumber}',
        ${data.distanceKm},
        '${rfidEpc}',
        'registered'
      )
    `);

    // Đồng thời tạo vé trong ví vé điện tử
    const ticketCode = 'TICK-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.vione_platform_tickets (ticket_code, user_id, user_name, ticket_type, item_name, quantity, total_amount, valid_date, qr_payload)
      SELECT
        '${ticketCode}',
        '${userId}'::uuid,
        '${data.runnerName.replace(/'/g, "''")}',
        'race_bib',
        r.name || ' - BIB ' || '${bibNumber}',
        1,
        COALESCE(d.price, 850000),
        r.race_date,
        'VIONE:BIB:' || r.id || ':' || '${bibNumber}'
      FROM public.vione_races r
      LEFT JOIN public.vione_race_distances d ON d.race_id = r.id AND d.distance_km = ${data.distanceKm}
      WHERE r.id = '${cleanRaceId}'::uuid
      LIMIT 1
    `);

    return {
      success: true,
      bibNumber,
      rfidEpc,
      ticketCode,
      message: 'Đăng ký thành công! Số BIB của bạn là ' + bibNumber,
    };
  }

  // Giả lập/ghi nhận chíp RFID đạp qua các thảm sensor (Start / Split 5K / 10K / 21K / Finish)
  async recordRfidSplit(raceId: string, bibNumber: string, checkpoint: 'start' | 'split_5k' | 'split_10k' | 'split_21k' | 'finish') {
    const cleanRace = raceId.replace(/'/g, "''");
    const cleanBib = bibNumber.replace(/'/g, "''");

    const col = checkpoint === 'start' ? 'start_time' : checkpoint === 'finish' ? 'finish_time' : checkpoint;
    const now = new Date().toISOString();

    if (checkpoint === 'finish') {
      const chipTimeStr = '03:' + Math.floor(10 + Math.random() * 45) + ':' + Math.floor(10 + Math.random() * 50);
      const paceStr = '4:' + Math.floor(30 + Math.random() * 25) + ' min/km';
      const rank = Math.floor(1 + Math.random() * 50);

      await this.prisma.$executeRawUnsafe(`
        UPDATE public.vione_race_bibs
        SET finish_time = NOW(),
            status = 'finished',
            chip_time_str = '${chipTimeStr}',
            gun_time_str = '${chipTimeStr}',
            avg_pace_str = '${paceStr}',
            overall_rank = ${rank},
            gender_rank = ${Math.max(1, rank - 3)},
            certificate_url = 'https://cert.viconnect.vn/verify/' || '${cleanBib}'
        WHERE race_id = '${cleanRace}'::uuid AND bib_number = '${cleanBib}'
      `);
      return { success: true, checkpoint, status: 'finished', chipTime: chipTimeStr, pace: paceStr, rank };
    } else {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.vione_race_bibs
        SET ${col} = NOW(), status = 'racing'
        WHERE race_id = '${cleanRace}'::uuid AND bib_number = '${cleanBib}'
      `);
      return { success: true, checkpoint, recordedAt: now, status: 'racing' };
    }
  }

  async getLeaderboard(raceId: string, distanceKm?: number) {
    const clean = raceId.replace(/'/g, "''");
    let distClause = '';
    if (distanceKm) {
      distClause = `AND distance_km = ${distanceKm}`;
    }

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT *
      FROM public.vione_race_bibs
      WHERE race_id = '${clean}'::uuid ${distClause}
      ORDER BY 
        CASE WHEN status = 'finished' THEN 1 WHEN status = 'racing' THEN 2 ELSE 3 END,
        overall_rank ASC NULLS LAST,
        chip_time_str ASC NULLS LAST
    `);
    return rows;
  }

  async getFinisherCertificate(bibNumber: string) {
    const clean = bibNumber.replace(/'/g, "''");
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT b.*, r.name as race_name, r.race_date, r.location as race_location
      FROM public.vione_race_bibs b
      JOIN public.vione_races r ON b.race_id = r.id
      WHERE b.bib_number = '${clean}' LIMIT 1
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy thông tin BIB VĐV');
    return rows[0];
  }

  // 6. VÉ ĐIỆN TỬ VÀ SOÁT VÉ (VIONE TICKET)
  async getUserTickets(userId: string) {
    const clean = userId.replace(/'/g, "''");
    const tickets = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_platform_tickets
      WHERE user_id = '${clean}'::uuid
      ORDER BY created_at DESC
    `);
    return tickets;
  }

  async purchaseTicket(userId: string, data: { ticketType: string; itemName: string; totalAmount: number; validDate?: string; quantity?: number }) {
    const ticketCode = 'TICK-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const qrPayload = `VIONE:TICKET:${ticketCode}:${data.ticketType}`;
    const validDate = data.validDate || new Date().toISOString().split('T')[0];

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.vione_platform_tickets (ticket_code, user_id, user_name, ticket_type, item_name, quantity, total_amount, payment_status, checkin_status, valid_date, qr_payload)
      VALUES (
        '${ticketCode}',
        '${userId}'::uuid,
        'Khách tham quan ViOne',
        '${data.ticketType.replace(/'/g, "''")}',
        '${data.itemName.replace(/'/g, "''")}',
        ${data.quantity || 1},
        ${data.totalAmount},
        'paid',
        'valid',
        '${validDate}',
        '${qrPayload}'
      )
    `);

    return {
      success: true,
      ticketCode,
      qrPayload,
      message: 'Mua vé thành công! Mã vé của bạn: ' + ticketCode,
    };
  }

  // 7. KHO TƯ LIỆU SỐ (VIONE ARCHIVE)
  async getArchives(query?: { category?: string; search?: string }) {
    const conditions: string[] = [];
    if (query?.category && query.category !== 'all') {
      conditions.push(`category = '${query.category.replace(/'/g, "''")}'`);
    }
    if (query?.search) {
      const s = query.search.replace(/'/g, "''");
      conditions.push(`(title ILIKE '%${s}%' OR summary ILIKE '%${s}%' OR dynasty ILIKE '%${s}%')`);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const items = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_archives ${where} ORDER BY created_at DESC
    `);
    return items;
  }

  // 8. SOÁT VÉ ĐIỆN TỬ (VIONE TICKET VALIDATOR)
  async validateTicket(ticketCode: string, staffName?: string) {
    const cleanCode = ticketCode.trim().replace(/'/g, "''");
    const tickets = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_platform_tickets WHERE ticket_code = '${cleanCode}' LIMIT 1
    `);
    if (!tickets.length) {
      throw new NotFoundException('Không tìm thấy vé trong hệ thống');
    }
    const ticket = tickets[0];
    if (ticket.status === 'used') {
      return {
        valid: false,
        message: `Vé này ĐÃ ĐƯỢC SỬ DỤNG trước đó vào lúc ${ticket.redeemed_at ? new Date(ticket.redeemed_at).toLocaleString('vi-VN') : 'không xác định'} bởi ${ticket.redeemed_by || 'Nhân viên soát vé'}.`,
        ticket,
      };
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.vione_platform_tickets
      SET status = 'used',
          redeemed_at = NOW(),
          redeemed_by = '${(staffName || 'Soát vé ViConnect').replace(/'/g, "''")}'
      WHERE id = '${ticket.id}'::uuid
    `);

    return {
      valid: true,
      message: 'Soát vé thành công! Vé hợp lệ.',
      ticket: { ...ticket, status: 'used', redeemed_at: new Date() },
    };
  }

  // 9. VIONE REVIEW (CHẠM NFC TĂNG ĐÁNH GIÁ CỬA HÀNG)
  async getReviewStores() {
    const stores = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_nfc_reviews ORDER BY rating DESC, total_reviews DESC
    `);
    return stores;
  }

  async submitNfcReview(storeId: string, data: { rating: number; comment?: string; customerName?: string; customerPhone?: string }) {
    const cleanStoreId = storeId.replace(/'/g, "''");
    const rating = Math.max(1, Math.min(5, Number(data.rating) || 5));
    const comment = (data.comment || '').replace(/'/g, "''");
    const name = (data.customerName || 'Khách hàng ViConnect').replace(/'/g, "''");
    const phone = (data.customerPhone || '').replace(/'/g, "''");

    const stores = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_nfc_reviews WHERE id = '${cleanStoreId}'::uuid LIMIT 1
    `);
    if (!stores.length) throw new NotFoundException('Không tìm thấy cửa hàng NFC');
    const store = stores[0];

    const voucher = store.reward_voucher || 'VIONE-DISCOUNT-10K';

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.vione_store_feedback (review_store_id, customer_name, customer_phone, rating, comment, voucher_code)
      VALUES ('${cleanStoreId}'::uuid, '${name}', '${phone}', ${rating}, '${comment}', '${voucher}')
    `);

    // Update aggregate rating
    await this.prisma.$executeRawUnsafe(`
      UPDATE public.vione_nfc_reviews
      SET total_reviews = total_reviews + 1,
          rating = ROUND(((rating * total_reviews + ${rating}) / (total_reviews + 1))::numeric, 2)
      WHERE id = '${cleanStoreId}'::uuid
    `);

    return {
      success: true,
      voucher,
      message: `Cảm ơn bạn đã đánh giá ${rating} sao! Bạn nhận được mã ưu đãi: ${voucher}`,
    };
  }

  // ── SPORT TOURNAMENTS CRUD (RESTFUL) ──
  async createSportTournament(data: any) {
    const code = data.code || 'SPORT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const name = (data.name || 'Giải đấu mới').replace(/'/g, "''");
    const sportType = (data.sport_type || data.sportType || 'pickleball').replace(/'/g, "''");
    const format = (data.format || 'knockout').replace(/'/g, "''");
    const startDate = data.start_date || data.startDate || new Date().toISOString().split('T')[0];
    const endDate = data.end_date || data.endDate || new Date().toISOString().split('T')[0];
    const venue = (data.venue || 'Sân vận động ViConnect').replace(/'/g, "''");
    const province = (data.province || 'Hà Nội').replace(/'/g, "''");
    const status = (data.status || 'upcoming').replace(/'/g, "''");
    const teamsCount = Number(data.teams_count || data.teamsCount) || 16;
    const bannerUrl = (data.banner_url || data.bannerUrl || '').replace(/'/g, "''");

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.vione_sport_tournaments 
      (code, name, sport_type, format, start_date, end_date, venue, province, status, teams_count, banner_url, is_platform_managed, created_at, updated_at)
      VALUES 
      ('${code}', '${name}', '${sportType}', '${format}', '${startDate}'::date, '${endDate}'::date, '${venue}', '${province}', '${status}', ${teamsCount}, '${bannerUrl}', true, NOW(), NOW())
      RETURNING *
    `);
    return rows[0];
  }

  async updateSportTournament(id: string, data: any) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = ['updated_at = NOW()'];
    if (data.name) sets.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.sport_type || data.sportType) sets.push(`sport_type = '${(data.sport_type || data.sportType).replace(/'/g, "''")}'`);
    if (data.format) sets.push(`format = '${data.format.replace(/'/g, "''")}'`);
    if (data.start_date || data.startDate) sets.push(`start_date = '${data.start_date || data.startDate}'::date`);
    if (data.end_date || data.endDate) sets.push(`end_date = '${data.end_date || data.endDate}'::date`);
    if (data.venue) sets.push(`venue = '${data.venue.replace(/'/g, "''")}'`);
    if (data.province) sets.push(`province = '${data.province.replace(/'/g, "''")}'`);
    if (data.status) sets.push(`status = '${data.status.replace(/'/g, "''")}'`);
    if (data.teams_count !== undefined || data.teamsCount !== undefined) sets.push(`teams_count = ${Number(data.teams_count ?? data.teamsCount) || 0}`);
    if (data.banner_url !== undefined || data.bannerUrl !== undefined) sets.push(`banner_url = '${(data.banner_url || data.bannerUrl || '').replace(/'/g, "''")}'`);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      UPDATE public.vione_sport_tournaments
      SET ${sets.join(', ')}
      WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'
      RETURNING *
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy giải đấu');
    return rows[0];
  }

  async deleteSportTournament(id: string) {
    const cleanId = id.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`
      DELETE FROM public.vione_sport_tournaments WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'
    `);
    return { ok: true, message: 'Đã xóa giải đấu thành công' };
  }

  // ── SPORT CLUBS CRUD (RESTFUL) ──
  async createSportClub(data: any) {
    const code = data.code || 'CLUB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const name = (data.name || 'CLB mới').replace(/'/g, "''");
    const sportType = (data.sport_type || data.sportType || 'pickleball').replace(/'/g, "''");
    const leaderName = (data.leader_name || data.leaderName || 'Chủ nhiệm CLB').replace(/'/g, "''");
    const membersCount = Number(data.members_count || data.membersCount) || 1;
    const venue = (data.venue || '').replace(/'/g, "''");
    const scheduleInfo = (data.schedule_info || data.scheduleInfo || '').replace(/'/g, "''");

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.vione_sport_clubs (code, name, sport_type, leader_name, members_count, venue, schedule_info, created_at)
      VALUES ('${code}', '${name}', '${sportType}', '${leaderName}', ${membersCount}, '${venue}', '${scheduleInfo}', NOW())
      RETURNING *
    `);
    return rows[0];
  }

  async updateSportClub(id: string, data: any) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = [];
    if (data.name) sets.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.sport_type || data.sportType) sets.push(`sport_type = '${(data.sport_type || data.sportType).replace(/'/g, "''")}'`);
    if (data.leader_name || data.leaderName) sets.push(`leader_name = '${(data.leader_name || data.leaderName).replace(/'/g, "''")}'`);
    if (data.members_count !== undefined || data.membersCount !== undefined) sets.push(`members_count = ${Number(data.members_count ?? data.membersCount) || 0}`);
    if (data.venue !== undefined) sets.push(`venue = '${data.venue.replace(/'/g, "''")}'`);
    if (data.schedule_info !== undefined || data.scheduleInfo !== undefined) sets.push(`schedule_info = '${(data.schedule_info || data.scheduleInfo || '').replace(/'/g, "''")}'`);

    if (sets.length) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.vione_sport_clubs SET ${sets.join(', ')} WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'
      `);
    }
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`SELECT * FROM public.vione_sport_clubs WHERE id = '${cleanId}'::uuid OR code = '${cleanId}' LIMIT 1`);
    if (!rows.length) throw new NotFoundException('Không tìm thấy CLB');
    return rows[0];
  }

  async deleteSportClub(id: string) {
    const cleanId = id.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`DELETE FROM public.vione_sport_clubs WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'`);
    return { ok: true, message: 'Đã xóa CLB thành công' };
  }

  // ── RACES (RUN) CRUD (RESTFUL) ──
  async createRace(data: any) {
    const code = data.code || 'RACE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const name = (data.name || 'Giải chạy mới').replace(/'/g, "''");
    const raceDate = data.race_date || data.raceDate || new Date().toISOString().split('T')[0];
    const location = (data.location || 'Hà Nội').replace(/'/g, "''");
    const province = (data.province || 'Hà Nội').replace(/'/g, "''");
    const elevation = Number(data.elevation_gain_m || data.elevationGainM) || 120;
    const isHeritageRun = Boolean(data.is_heritage_run ?? data.isHeritageRun);
    const status = (data.status || 'upcoming').replace(/'/g, "''");
    const bannerUrl = (data.banner_url || data.bannerUrl || '').replace(/'/g, "''");
    const description = (data.description || '').replace(/'/g, "''");

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.vione_races 
      (code, name, race_date, location, province, elevation_gain_m, is_heritage_run, status, banner_url, description, is_platform_managed, created_at, updated_at)
      VALUES 
      ('${code}', '${name}', '${raceDate}'::date, '${location}', '${province}', ${elevation}, ${isHeritageRun}, '${status}', '${bannerUrl}', '${description}', true, NOW(), NOW())
      RETURNING *
    `);
    return rows[0];
  }

  async updateRace(id: string, data: any) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = ['updated_at = NOW()'];
    if (data.name) sets.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.race_date || data.raceDate) sets.push(`race_date = '${data.race_date || data.raceDate}'::date`);
    if (data.location) sets.push(`location = '${data.location.replace(/'/g, "''")}'`);
    if (data.province) sets.push(`province = '${data.province.replace(/'/g, "''")}'`);
    if (data.elevation_gain_m !== undefined || data.elevationGainM !== undefined) sets.push(`elevation_gain_m = ${Number(data.elevation_gain_m ?? data.elevationGainM) || 0}`);
    if (data.is_heritage_run !== undefined || data.isHeritageRun !== undefined) sets.push(`is_heritage_run = ${Boolean(data.is_heritage_run ?? data.isHeritageRun)}`);
    if (data.status) sets.push(`status = '${data.status.replace(/'/g, "''")}'`);
    if (data.banner_url !== undefined || data.bannerUrl !== undefined) sets.push(`banner_url = '${(data.banner_url || data.bannerUrl || '').replace(/'/g, "''")}'`);
    if (data.description !== undefined) sets.push(`description = '${(data.description || '').replace(/'/g, "''")}'`);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      UPDATE public.vione_races
      SET ${sets.join(', ')}
      WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'
      RETURNING *
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy giải chạy');
    return rows[0];
  }

  async deleteRace(id: string) {
    const cleanId = id.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`DELETE FROM public.vione_races WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'`);
    return { ok: true, message: 'Đã xóa giải chạy thành công' };
  }

  // ── HERITAGE SITES CRUD (RESTFUL) ──
  async createHeritageSite(data: any) {
    const code = data.code || 'HERITAGE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const name = (data.name || 'Di sản mới').replace(/'/g, "''");
    const category = (data.category || 'tangible').replace(/'/g, "''");
    const unescoStatus = (data.unesco_status || data.unescoStatus || 'National Relic').replace(/'/g, "''");
    const lat = Number(data.latitude) || 21.0285;
    const lng = Number(data.longitude) || 105.8542;
    const address = (data.address || '').replace(/'/g, "''");
    const province = (data.province || 'Hà Nội').replace(/'/g, "''");
    const description = (data.description || '').replace(/'/g, "''");
    const vr360Url = (data.vr360_url || data.vr360Url || '').replace(/'/g, "''");
    const thumbnailUrl = (data.thumbnail_url || data.thumbnailUrl || '').replace(/'/g, "''");

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.vione_heritage_sites
      (code, name, category, unesco_status, latitude, longitude, address, province, description, vr360_url, thumbnail_url, stamps_count, is_platform_managed, created_at, updated_at)
      VALUES
      ('${code}', '${name}', '${category}', '${unescoStatus}', ${lat}, ${lng}, '${address}', '${province}', '${description}', '${vr360Url}', '${thumbnailUrl}', 0, true, NOW(), NOW())
      RETURNING *
    `);
    return rows[0];
  }

  async updateHeritageSite(id: string, data: any) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = ['updated_at = NOW()'];
    if (data.name) sets.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.category) sets.push(`category = '${data.category.replace(/'/g, "''")}'`);
    if (data.unesco_status || data.unescoStatus) sets.push(`unesco_status = '${(data.unesco_status || data.unescoStatus).replace(/'/g, "''")}'`);
    if (data.latitude !== undefined) sets.push(`latitude = ${Number(data.latitude) || 0}`);
    if (data.longitude !== undefined) sets.push(`longitude = ${Number(data.longitude) || 0}`);
    if (data.address !== undefined) sets.push(`address = '${data.address.replace(/'/g, "''")}'`);
    if (data.province) sets.push(`province = '${data.province.replace(/'/g, "''")}'`);
    if (data.description !== undefined) sets.push(`description = '${(data.description || '').replace(/'/g, "''")}'`);
    if (data.vr360_url !== undefined || data.vr360Url !== undefined) sets.push(`vr360_url = '${(data.vr360_url || data.vr360Url || '').replace(/'/g, "''")}'`);
    if (data.thumbnail_url !== undefined || data.thumbnailUrl !== undefined) sets.push(`thumbnail_url = '${(data.thumbnail_url || data.thumbnailUrl || '').replace(/'/g, "''")}'`);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      UPDATE public.vione_heritage_sites
      SET ${sets.join(', ')}
      WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'
      RETURNING *
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy di sản');
    return rows[0];
  }

  async deleteHeritageSite(id: string) {
    const cleanId = id.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`DELETE FROM public.vione_heritage_sites WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'`);
    return { ok: true, message: 'Đã xóa di sản thành công' };
  }

  // ── MUSEUMS CRUD (RESTFUL) ──
  async createMuseum(data: any) {
    const code = data.code || 'MUSEUM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const name = (data.name || 'Bảo tàng mới').replace(/'/g, "''");
    const address = (data.address || '').replace(/'/g, "''");
    const province = (data.province || 'Hà Nội').replace(/'/g, "''");
    const ticketPrice = Number(data.ticket_price || data.ticketPrice) || 0;
    const openingHours = (data.opening_hours || data.openingHours || '08:00 - 17:00').replace(/'/g, "''");
    const virtualTourUrl = (data.virtual_tour_url || data.virtualTourUrl || '').replace(/'/g, "''");
    const description = (data.description || '').replace(/'/g, "''");
    const thumbnailUrl = (data.thumbnail_url || data.thumbnailUrl || '').replace(/'/g, "''");
    const heritageSiteId = data.heritage_site_id || data.heritageSiteId ? `'${data.heritage_site_id || data.heritageSiteId}'::uuid` : 'NULL';

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.vione_museums
      (code, name, address, province, ticket_price, opening_hours, virtual_tour_url, description, thumbnail_url, heritage_site_id, is_platform_managed, created_at, updated_at)
      VALUES
      ('${code}', '${name}', '${address}', '${province}', ${ticketPrice}, '${openingHours}', '${virtualTourUrl}', '${description}', '${thumbnailUrl}', ${heritageSiteId}, true, NOW(), NOW())
      RETURNING *
    `);
    return rows[0];
  }

  async updateMuseum(id: string, data: any) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = ['updated_at = NOW()'];
    if (data.name) sets.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.address !== undefined) sets.push(`address = '${data.address.replace(/'/g, "''")}'`);
    if (data.province) sets.push(`province = '${data.province.replace(/'/g, "''")}'`);
    if (data.ticket_price !== undefined || data.ticketPrice !== undefined) sets.push(`ticket_price = ${Number(data.ticket_price ?? data.ticketPrice) || 0}`);
    if (data.opening_hours !== undefined || data.openingHours !== undefined) sets.push(`opening_hours = '${(data.opening_hours || data.openingHours || '').replace(/'/g, "''")}'`);
    if (data.virtual_tour_url !== undefined || data.virtualTourUrl !== undefined) sets.push(`virtual_tour_url = '${(data.virtual_tour_url || data.virtualTourUrl || '').replace(/'/g, "''")}'`);
    if (data.description !== undefined) sets.push(`description = '${(data.description || '').replace(/'/g, "''")}'`);
    if (data.thumbnail_url !== undefined || data.thumbnailUrl !== undefined) sets.push(`thumbnail_url = '${(data.thumbnail_url || data.thumbnailUrl || '').replace(/'/g, "''")}'`);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      UPDATE public.vione_museums
      SET ${sets.join(', ')}
      WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'
      RETURNING *
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy bảo tàng');
    return rows[0];
  }

  async deleteMuseum(id: string) {
    const cleanId = id.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`DELETE FROM public.vione_museums WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'`);
    return { ok: true, message: 'Đã xóa bảo tàng thành công' };
  }

  // ── ARTIFACTS CRUD (RESTFUL) ──
  async getArtifacts(query?: { museumId?: string; search?: string }) {
    const conditions: string[] = [];
    if (query?.museumId) conditions.push(`museum_id = '${query.museumId.replace(/'/g, "''")}'::uuid`);
    if (query?.search) {
      const s = query.search.replace(/'/g, "''");
      conditions.push(`(name ILIKE '%${s}%' OR dynasty ILIKE '%${s}%' OR code ILIKE '%${s}%')`);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    return this.prisma.$queryRawUnsafe<any[]>(`SELECT * FROM public.vione_artifacts ${where} ORDER BY created_at DESC`);
  }

  async createArtifact(data: any) {
    const code = data.code || 'ART-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const museumId = data.museum_id || data.museumId ? `'${data.museum_id || data.museumId}'::uuid` : 'NULL';
    const name = (data.name || 'Hiện vật mới').replace(/'/g, "''");
    const category = (data.category || 'ceramic').replace(/'/g, "''");
    const dynasty = (data.dynasty || 'Triều Nguyễn').replace(/'/g, "''");
    const dating = (data.dating || 'Thế kỷ 19').replace(/'/g, "''");
    const nationalTreasure = Boolean(data.national_treasure ?? data.nationalTreasure);
    const description = (data.description || '').replace(/'/g, "''");
    const model3dUrl = (data.model_3d_url || data.model3dUrl || '').replace(/'/g, "''");
    const imageUrl = (data.image_url || data.imageUrl || '').replace(/'/g, "''");
    const nfcUid = (data.nfc_uid || data.nfcUid || '').replace(/'/g, "''");

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.vione_artifacts
      (code, museum_id, name, category, dynasty, dating, national_treasure, description, model_3d_url, image_url, nfc_uid, status, created_at, updated_at)
      VALUES
      ('${code}', ${museumId}, '${name}', '${category}', '${dynasty}', '${dating}', ${nationalTreasure}, '${description}', '${model3dUrl}', '${imageUrl}', '${nfcUid}', 'exhibiting', NOW(), NOW())
      RETURNING *
    `);
    return rows[0];
  }

  async updateArtifact(id: string, data: any) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = ['updated_at = NOW()'];
    if (data.name) sets.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.category) sets.push(`category = '${data.category.replace(/'/g, "''")}'`);
    if (data.dynasty) sets.push(`dynasty = '${data.dynasty.replace(/'/g, "''")}'`);
    if (data.dating) sets.push(`dating = '${data.dating.replace(/'/g, "''")}'`);
    if (data.national_treasure !== undefined || data.nationalTreasure !== undefined) sets.push(`national_treasure = ${Boolean(data.national_treasure ?? data.nationalTreasure)}`);
    if (data.description !== undefined) sets.push(`description = '${(data.description || '').replace(/'/g, "''")}'`);
    if (data.model_3d_url !== undefined || data.model3dUrl !== undefined) sets.push(`model_3d_url = '${(data.model_3d_url || data.model3dUrl || '').replace(/'/g, "''")}'`);
    if (data.image_url !== undefined || data.imageUrl !== undefined) sets.push(`image_url = '${(data.image_url || data.imageUrl || '').replace(/'/g, "''")}'`);
    if (data.nfc_uid !== undefined || data.nfcUid !== undefined) sets.push(`nfc_uid = '${(data.nfc_uid || data.nfcUid || '').replace(/'/g, "''")}'`);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      UPDATE public.vione_artifacts
      SET ${sets.join(', ')}
      WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'
      RETURNING *
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy hiện vật');
    return rows[0];
  }

  async deleteArtifact(id: string) {
    const cleanId = id.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`DELETE FROM public.vione_artifacts WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'`);
    return { ok: true, message: 'Đã xóa hiện vật thành công' };
  }

  // ── ARCHIVES CRUD (RESTFUL) ──
  async getArchiveDetail(id: string) {
    const cleanId = id.replace(/'/g, "''");
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_archives WHERE id = '${cleanId}'::uuid OR code = '${cleanId}' LIMIT 1
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy tư liệu số');
    return rows[0];
  }

  async createArchive(data: any) {
    const code = data.code || 'ARCHIVE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const title = (data.title || 'Tư liệu mới').replace(/'/g, "''");
    const category = (data.category || 'moc_ban').replace(/'/g, "''");
    const dynasty = (data.dynasty || 'Triều Nguyễn').replace(/'/g, "''");
    const year = (data.year || '1802').replace(/'/g, "''");
    const summary = (data.summary || '').replace(/'/g, "''");
    const digitalFileUrl = (data.digital_file_url || data.digitalFileUrl || '').replace(/'/g, "''");
    const storageLocation = (data.storage_location || data.storageLocation || 'Kho lưu trữ Trung ương').replace(/'/g, "''");

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.vione_archives
      (code, title, category, dynasty, year, summary, digital_file_url, storage_location, created_at)
      VALUES
      ('${code}', '${title}', '${category}', '${dynasty}', '${year}', '${summary}', '${digitalFileUrl}', '${storageLocation}', NOW())
      RETURNING *
    `);
    return rows[0];
  }

  async updateArchive(id: string, data: any) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = [];
    if (data.title) sets.push(`title = '${data.title.replace(/'/g, "''")}'`);
    if (data.category) sets.push(`category = '${data.category.replace(/'/g, "''")}'`);
    if (data.dynasty) sets.push(`dynasty = '${data.dynasty.replace(/'/g, "''")}'`);
    if (data.year) sets.push(`year = '${data.year.replace(/'/g, "''")}'`);
    if (data.summary !== undefined) sets.push(`summary = '${(data.summary || '').replace(/'/g, "''")}'`);
    if (data.digital_file_url !== undefined || data.digitalFileUrl !== undefined) sets.push(`digital_file_url = '${(data.digital_file_url || data.digitalFileUrl || '').replace(/'/g, "''")}'`);
    if (data.storage_location !== undefined || data.storageLocation !== undefined) sets.push(`storage_location = '${(data.storage_location || data.storageLocation || '').replace(/'/g, "''")}'`);

    if (sets.length) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.vione_archives SET ${sets.join(', ')} WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'
      `);
    }
    return this.getArchiveDetail(id);
  }

  async deleteArchive(id: string) {
    const cleanId = id.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`DELETE FROM public.vione_archives WHERE id = '${cleanId}'::uuid OR code = '${cleanId}'`);
    return { ok: true, message: 'Đã xóa tư liệu thành công' };
  }

  // ── TICKETS CRUD (RESTFUL) ──
  async getAllTickets(query?: { search?: string; status?: string }) {
    const conditions: string[] = [];
    if (query?.status) conditions.push(`checkin_status = '${query.status.replace(/'/g, "''")}'`);
    if (query?.search) {
      const s = query.search.replace(/'/g, "''");
      conditions.push(`(ticket_code ILIKE '%${s}%' OR user_name ILIKE '%${s}%' OR item_name ILIKE '%${s}%')`);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    return this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_platform_tickets ${where} ORDER BY created_at DESC LIMIT 100
    `);
  }

  async createTicket(data: any) {
    const ticketCode = data.ticket_code || data.ticketCode || 'TICK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const userName = (data.user_name || data.userName || 'Khách hàng ViConnect').replace(/'/g, "''");
    const userPhone = (data.user_phone || data.userPhone || '0900000000').replace(/'/g, "''");
    const ticketType = (data.ticket_type || data.ticketType || 'museum').replace(/'/g, "''");
    const itemName = (data.item_name || data.itemName || 'Vé tham quan').replace(/'/g, "''");
    const quantity = Number(data.quantity) || 1;
    const totalAmount = Number(data.total_amount || data.totalAmount) || 50000;
    const paymentStatus = (data.payment_status || data.paymentStatus || 'paid').replace(/'/g, "''");
    const validDate = data.valid_date || data.validDate || new Date().toISOString().split('T')[0];

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.vione_platform_tickets
      (ticket_code, user_name, user_phone, ticket_type, item_name, quantity, total_amount, payment_status, checkin_status, valid_date, created_at)
      VALUES
      ('${ticketCode}', '${userName}', '${userPhone}', '${ticketType}', '${itemName}', ${quantity}, ${totalAmount}, '${paymentStatus}', 'valid', '${validDate}'::date, NOW())
      RETURNING *
    `);
    return rows[0];
  }

  async updateTicket(id: string, data: any) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = [];
    if (data.checkin_status || data.checkinStatus) sets.push(`checkin_status = '${(data.checkin_status || data.checkinStatus).replace(/'/g, "''")}'`);
    if (data.payment_status || data.paymentStatus) sets.push(`payment_status = '${(data.payment_status || data.paymentStatus).replace(/'/g, "''")}'`);
    if (data.redeemed_by || data.redeemedBy) sets.push(`redeemed_by = '${(data.redeemed_by || data.redeemedBy).replace(/'/g, "''")}'`);

    if (sets.length) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.vione_platform_tickets SET ${sets.join(', ')} WHERE id = '${cleanId}'::uuid OR ticket_code = '${cleanId}'
      `);
    }
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`SELECT * FROM public.vione_platform_tickets WHERE id = '${cleanId}'::uuid OR ticket_code = '${cleanId}' LIMIT 1`);
    if (!rows.length) throw new NotFoundException('Không tìm thấy vé');
    return rows[0];
  }

  async deleteTicket(id: string) {
    const cleanId = id.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`DELETE FROM public.vione_platform_tickets WHERE id = '${cleanId}'::uuid OR ticket_code = '${cleanId}'`);
    return { ok: true, message: 'Đã xóa vé thành công' };
  }

  // ── NFC REVIEW STORES CRUD (RESTFUL) ──
  async getReviewStoreDetail(id: string) {
    const cleanId = id.replace(/'/g, "''");
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM public.vione_nfc_reviews WHERE id = '${cleanId}'::uuid LIMIT 1
    `);
    if (!rows.length) throw new NotFoundException('Không tìm thấy cửa hàng NFC');
    return rows[0];
  }

  async createReviewStore(data: any) {
    const storeName = (data.store_name || data.storeName || 'Cửa hàng mới').replace(/'/g, "''");
    const storeCategory = (data.store_category || data.storeCategory || 'restaurant').replace(/'/g, "''");
    const storeAddress = (data.store_address || data.storeAddress || '').replace(/'/g, "''");
    const nfcUid = (data.nfc_uid || data.nfcUid || '04:' + Math.random().toString(16).substring(2, 8).toUpperCase()).replace(/'/g, "''");
    const googleMapsUrl = (data.google_maps_url || data.googleMapsUrl || 'https://maps.google.com').replace(/'/g, "''");
    const rewardVoucher = (data.reward_voucher || data.rewardVoucher || 'VIONE-10K').replace(/'/g, "''");

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.vione_nfc_reviews
      (store_name, store_category, store_address, nfc_uid, google_maps_url, rating, total_reviews, reward_voucher, created_at)
      VALUES
      ('${storeName}', '${storeCategory}', '${storeAddress}', '${nfcUid}', '${googleMapsUrl}', 5.0, 0, '${rewardVoucher}', NOW())
      RETURNING *
    `);
    return rows[0];
  }

  async updateReviewStore(id: string, data: any) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = [];
    if (data.store_name || data.storeName) sets.push(`store_name = '${(data.store_name || data.storeName).replace(/'/g, "''")}'`);
    if (data.store_category || data.storeCategory) sets.push(`store_category = '${(data.store_category || data.storeCategory).replace(/'/g, "''")}'`);
    if (data.store_address || data.storeAddress) sets.push(`store_address = '${(data.store_address || data.storeAddress).replace(/'/g, "''")}'`);
    if (data.nfc_uid || data.nfcUid) sets.push(`nfc_uid = '${(data.nfc_uid || data.nfcUid).replace(/'/g, "''")}'`);
    if (data.google_maps_url || data.googleMapsUrl) sets.push(`google_maps_url = '${(data.google_maps_url || data.googleMapsUrl).replace(/'/g, "''")}'`);
    if (data.reward_voucher || data.rewardVoucher) sets.push(`reward_voucher = '${(data.reward_voucher || data.rewardVoucher).replace(/'/g, "''")}'`);

    if (sets.length) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.vione_nfc_reviews SET ${sets.join(', ')} WHERE id = '${cleanId}'::uuid
      `);
    }
    return this.getReviewStoreDetail(id);
  }

  async deleteReviewStore(id: string) {
    const cleanId = id.replace(/'/g, "''");
    await this.prisma.$executeRawUnsafe(`DELETE FROM public.vione_nfc_reviews WHERE id = '${cleanId}'::uuid`);
    return { ok: true, message: 'Đã xóa trạm NFC thành công' };
  }
}
