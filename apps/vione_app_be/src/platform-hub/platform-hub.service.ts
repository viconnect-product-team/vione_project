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
}
