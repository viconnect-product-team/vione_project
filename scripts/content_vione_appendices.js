// scripts/content_vione_appendices.js
// Phụ Lục I (Đặc tả kỹ thuật CSDL, API, Socket.IO, Cấu hình) và Phụ Lục IV (Mã nguồn phần mềm)

const APPENDIX_I = {
  dbTables: [
    { stt: 1, table: 'users', pk: 'id (UUID)', desc: 'Tài khoản định danh người dùng hệ thống, email, băm mật khẩu Argon2, trạng thái hoạt động, MFA secret' },
    { stt: 2, table: 'member_profiles', pk: 'id (UUID)', desc: 'Hồ sơ doanh nhân 360, họ tên, chức danh, CCCD, ngày sinh, số điện thoại, tiểu sử, điểm tín nhiệm' },
    { stt: 3, table: 'vcards', pk: 'id (UUID)', desc: 'Danh thiếp số thông minh, slug cá nhân, mẫu giao diện Obsidian/Gold, mã QR động, chip NFC UID' },
    { stt: 4, table: 'companies', pk: 'id (UUID)', desc: 'Pháp nhân doanh nghiệp, mã số thuế, địa chỉ trụ sở, ngành nghề kinh doanh, logo, hồ sơ năng lực' },
    { stt: 5, table: 'events', pk: 'id (UUID)', desc: 'Sự kiện doanh nhân, tiêu đề, thời gian, địa điểm, diễn giả, banner, chính sách bán vé' },
    { stt: 6, table: 'event_ticket_tiers', pk: 'id (UUID)', desc: 'Hạng vé sự kiện (VIP, Standard), đơn giá niêm yết (VNĐ), số lượng phát hành, quyền lợi đi kèm' },
    { stt: 7, table: 'tickets_issued', pk: 'id (UUID)', desc: 'Vé điện tử đã phát hành, mã token AES-256 động, trạng thái thanh toán VNPay, trạng thái check-in' },
    { stt: 8, table: 'deals_pipeline', pk: 'id (UUID)', desc: 'Cơ hội giao thương B2B, giá trị hợp đồng (VNĐ), giai đoạn phễu bán hàng (Kanban), đối tác tham gia' },
    { stt: 9, table: 'marketplace_products', pk: 'id (UUID)', desc: 'Sản phẩm/dịch vụ B2B niêm yết trên sàn giao thương, bảng giá công khai, tỷ lệ chiết khấu doanh nhân' },
    { stt: 10, table: 'sports_tournaments', pk: 'id (UUID)', desc: 'Giải đấu thể thao ViOne Sport (Bóng đá, Golf, Tennis, Pickleball), thể thức thi đấu, sơ đồ bốc thăm' },
    { stt: 11, table: 'sports_matches', pk: 'id (UUID)', desc: 'Trận đấu thể thao, hai đội đối đầu, sân bãi, thời gian, tỷ số realtime, biên bản sự kiện bàn thắng' },
    { stt: 12, table: 'run_races', pk: 'id (UUID)', desc: 'Giải chạy marathon ViOne Run, cự ly thi đấu (5k, 10k, 21k, 42k), tệp tọa độ bản đồ GPX, trạm checkpoint' },
    { stt: 13, table: 'run_athletes', pk: 'id (UUID)', desc: 'Vận động viên giải chạy, mã số BIB, mã chip RFID UHF, thời gian Gun Time, Chip Time, Pace, Rank' },
    { stt: 14, table: 'museum_artifacts', pk: 'id (UUID)', desc: 'Hiện vật bảo tàng số 3D, tệp mô hình GLTF xoay 360°, tệp thuyết minh audio guide song ngữ, mã thẻ NFC' },
    { stt: 15, table: 'heritage_sites', pk: 'id (UUID)', desc: 'Di tích lịch sử văn hóa ViOne Heritage, tọa độ GPS Geofence bán kính 20m, tư liệu sắc phong Hán Nôm' },
    { stt: 16, table: 'documents_archive', pk: 'id (UUID)', desc: 'Kho tài liệu phân cấp (/documents), cấu trúc cây thư mục đa tầng, phiên bản tệp, quyền xem/tải' },
    { stt: 17, table: 'financial_invoices', pk: 'id (UUID)', desc: 'Giao dịch tài chính, mã đơn hàng VNPay (vnp_TxnRef), số tiền, trạng thái đối soát, phiếu thu điện tử' },
    { stt: 18, table: 'audit_logs', pk: 'id (BIGSERIAL)', desc: 'Nhật ký kiểm toán truy vết bất biến, user_id, action, endpoint, ip_address, user_agent, timestamp' }
  ],
  apiEndpoints: [
    { stt: 1, method: 'POST', endpoint: '/api/v1/auth/login', desc: 'Đăng nhập người dùng, kiểm tra mật khẩu Bcrypt/Argon2, sinh cặp Access/Refresh Token', role: 'Công khai', actor: 'A01, A02, A07' },
    { stt: 2, method: 'POST', endpoint: '/api/v1/auth/mfa/verify', desc: 'Xác thực mã 2FA TOTP 6 chữ số theo chuẩn RFC 6238', role: 'Xác thực', actor: 'A07, A08' },
    { stt: 3, method: 'GET', endpoint: '/api/v1/dashboard/metrics', desc: 'Lấy các chỉ số KPI dòng tiền, doanh nhân, sự kiện theo thời gian thực', role: 'Admin, Finance', actor: 'A06, A07' },
    { stt: 4, method: 'GET', endpoint: '/api/v1/members', desc: 'Tra cứu danh sách doanh nhân, lọc theo ngành nghề, cấp bậc thẻ VIP', role: 'Member, Admin', actor: 'A02, A07' },
    { stt: 5, method: 'POST', endpoint: '/api/v1/vcard/generate-qr', desc: 'Sinh mã QR động cá nhân hóa chứa token định danh số vCard', role: 'Member', actor: 'A02, A10' },
    { stt: 6, method: 'POST', endpoint: '/api/v1/events/create', desc: 'Khởi tạo sự kiện mới, cấu hình hạng vé, diễn giả và thời gian', role: 'Operator, Admin', actor: 'A03, A07' },
    { stt: 7, method: 'POST', endpoint: '/api/v1/payments/vnpay/create-url', desc: 'Tạo URL thanh toán trực tuyến qua cổng VNPay có mã hóa chữ ký SHA-512', role: 'Member, Guest', actor: 'A01, A02, A09' },
    { stt: 8, method: 'GET', endpoint: '/api/v1/payments/vnpay/ipn', desc: 'Webhook tiếp nhận kết quả thanh toán từ VNPay, phát hành vé điện tử', role: 'VNPay Webhook', actor: 'A09, A10' },
    { stt: 9, method: 'POST', endpoint: '/api/v1/tickets/checkin', desc: 'Xác thực mã vé QR đại biểu tại cửa hội trường trong <100ms', role: 'Operator', actor: 'A03, A10' },
    { stt: 10, method: 'POST', endpoint: '/api/v1/sport/tournaments/bracket', desc: 'Thuật toán tự động bốc thăm sơ đồ cây Tournament Bracket giải đấu', role: 'Referee', actor: 'A04, A10' },
    { stt: 11, method: 'POST', endpoint: '/api/v1/run/timing/ping', desc: 'Tiếp nhận gói tin đọc chip RFID UHF từ thảm đo thời gian giải chạy', role: 'System Timing', actor: 'A04, A10' },
    { stt: 12, method: 'GET', endpoint: '/api/v1/museum/artifacts/:id', desc: 'Tải tệp mô hình 3D GLTF và dữ liệu audio guide thuyết minh hiện vật', role: 'Public, Member', actor: 'A01, A02, A05' },
    { stt: 13, method: 'GET', endpoint: '/api/v1/heritage/geofence/check', desc: 'Kiểm tra tọa độ GPS du khách với bán kính 20m di tích kích hoạt audio', role: 'Public, Member', actor: 'A01, A10' },
    { stt: 14, method: 'POST', endpoint: '/api/v1/ai/ocr/scan-card', desc: 'Bóc tách thông tin danh thiếp giấy tự động bằng mô hình AI OCR', role: 'Member', actor: 'A02, A10' },
    { stt: 15, method: 'POST', endpoint: '/api/v1/zalo/send-zns', desc: 'Gửi tin nhắn thông báo vé sự kiện hoặc xác nhận thanh toán qua Zalo OA', role: 'System Worker', actor: 'A09, A10' }
  ],
  socketEvents: [
    { stt: 1, event: 'chat:message:send', type: 'Client -> Server', desc: 'Gửi tin nhắn trực tiếp hoặc tin nhắn nhóm realtime' },
    { stt: 2, event: 'chat:message:receive', type: 'Server -> Client', desc: 'Phát sóng tin nhắn mới tới thiết bị người nhận trong <50ms' },
    { stt: 3, event: 'ticket:checked_in', type: 'Server -> Client', desc: 'Phát tín hiệu đại biểu VIP vừa check-in qua cửa lên màn hình LED' },
    { stt: 4, event: 'sport:score_updated', type: 'Server -> Client', desc: 'Cập nhật tỷ số trận đấu thể thao và bảng xếp hạng realtime' },
    { stt: 5, event: 'run:runner_checkpoint', type: 'Server -> Client', desc: 'Phát tín hiệu VĐV vừa qua trạm thảm RFID lên bảng Leaderboard' },
    { stt: 6, event: 'finance:transaction_paid', type: 'Server -> Client', desc: 'Thông báo giao dịch VNPay thành công, cộng doanh thu Dashboard' }
  ],
  hardwareSpecs: {
    server: {
      min: 'CPU 4 Cores, RAM 8GB, SSD 100GB, Băng thông mạng 100Mbps, OS Linux Ubuntu 22.04 LTS / Docker Compose',
      rec: 'CPU 8 Cores, RAM 32GB, SSD NVMe 500GB RAID 1, Băng thông 1Gbps, Docker Swarm / Kubernetes Cluster'
    },
    clientWeb: {
      min: 'Laptop / Desktop Intel Core i3 / AMD Ryzen 3, RAM 4GB, Màn hình độ phân giải 1366x768, Chrome 100+ / Firefox 100+ / Edge',
      rec: 'Laptop / Desktop Intel Core i5 / Apple M1+, RAM 8GB+, Màn hình Full HD 1920x1080 hoặc 2K/4K, Chrome / Safari phiên bản mới nhất'
    },
    mobile: {
      min: 'iPhone 8 trở lên (iOS 15.0+) hoặc smartphone Android 9.0+ có RAM 3GB, Camera 8MP, kết nối 4G/LTE/Wi-Fi',
      rec: 'iPhone 12 trở lên (iOS 17+) hoặc Android 13+ có RAM 6GB+, hỗ trợ phần cứng NFC, FaceID/Vân tay, Camera góc rộng hỗ trợ AR'
    }
  }
};

const APPENDIX_IV_CODE = {
  file1: {
    name: 'server/src/modules/portal/portal.controller.ts',
    lines: 145,
    code: `import { Controller, Get, Post, Body, Param, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { PortalService } from './portal.service';
import { VnpayService } from '../payments/vnpay.service';
import { ZaloOaService } from '../integrations/zalo-oa.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Controller('api/v1/portal')
export class PortalController {
  constructor(
    private readonly portalService: PortalService,
    private readonly vnpayService: VnpayService,
    private readonly zaloOaService: ZaloOaService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  @Get('dashboard/metrics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PORTAL_ADMIN', 'FINANCE_ADMIN')
  async getDashboardMetrics(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return await this.portalService.calculateRealtimeMetrics(tenantId);
  }

  @Post('events/:id/tickets/vnpay-checkout')
  @UseGuards(JwtAuthGuard)
  async createVnpayPaymentUrl(
    @Param('id') eventId: string,
    @Body() body: { tierId: string; quantity: number },
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const paymentUrl = await this.vnpayService.createOrderUrl({
      eventId,
      tierId: body.tierId,
      quantity: body.quantity,
      userId,
      ipAddress,
    });
    return { statusCode: HttpStatus.OK, paymentUrl };
  }

  @Get('payments/vnpay-ipn')
  @HttpCode(HttpStatus.OK)
  async handleVnpayIpn(@Req() req: any) {
    const ipnData = req.query;
    const isValidSignature = this.vnpayService.verifyChecksum(ipnData);
    if (!isValidSignature) {
      return { RspCode: '97', Message: 'Invalid Checksum' };
    }
    const result = await this.portalService.processPaymentSuccess(ipnData);
    if (result.success) {
      // Bắn sự kiện realtime cập nhật vé và dòng tiền
      this.realtimeGateway.emitPaymentSuccess(result.orderId, result.amount);
      // Gửi vé điện tử QR qua Zalo OA ZNS
      await this.zaloOaService.sendTicketConfirmation(result.phone, result.ticketCode);
      return { RspCode: '00', Message: 'Confirm Success' };
    }
    return { RspCode: '02', Message: 'Order already confirmed or failed' };
  }

  @Post('tickets/checkin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PORTAL_ADMIN', 'EVENT_OPERATOR')
  async verifyTicketQr(@Body() body: { ticketToken: string }, @Req() req: any) {
    const operatorId = req.user.id;
    const checkinResult = await this.portalService.verifyAndCheckinTicket(body.ticketToken, operatorId);
    if (checkinResult.isValid) {
      this.realtimeGateway.emitCheckinWelcome(checkinResult.attendee);
    }
    return checkinResult;
  }
}`
  },
  file2: {
    name: 'server/src/modules/realtime/realtime.gateway.ts',
    lines: 92,
    code: `import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      client.join(\`user:\${payload.id}\`);
      client.join(\`tenant:\${payload.tenantId}\`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Thu dọn session khi ngắt kết nối
  }

  emitPaymentSuccess(orderId: string, amount: number) {
    this.server.emit('finance:transaction_paid', { orderId, amount, timestamp: new Date() });
  }

  emitCheckinWelcome(attendee: { name: string; title: string; company: string; isVip: boolean }) {
    this.server.emit('ticket:checked_in', { attendee, timestamp: new Date() });
  }

  emitSportScoreUpdate(matchId: string, homeScore: number, awayScore: number) {
    this.server.emit('sport:score_updated', { matchId, homeScore, awayScore });
  }
}`
  },
  file3: {
    name: 'apps/mobile_vione/src/screens/ExecutiveHomeScreen.tsx',
    lines: 110,
    code: `import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, QrCode, Nfc, Users, Calendar, Award, Bell } from 'lucide-react-native';

export const ExecutiveHomeScreen: React.FC = () => {
  const [stampCount] = useState(5);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050C15" />
      {/* Safe Area Header */}
      <View style={styles.safeHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarBorder}>
            <Text style={styles.avatarText}>HĐ</Text>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userName}>Nguyễn Hải Đăng</Text>
            <Text style={styles.userRole}>Chủ Tịch HĐQT · ViConnect Group</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.stampBadge}>
          <Award size={16} color="#050C15" />
          <Text style={styles.stampText}>{stampCount} Tem Số</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Obsidian Gold vCard */}
        <LinearGradient
          colors={['#1E293B', '#0F172A', '#050C15']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vcardFrame}
        >
          <LinearGradient
            colors={['rgba(246, 225, 195, 0.25)', 'transparent']}
            style={styles.cardSheen}
          />
          <View style={styles.cardHeader}>
            <Text style={styles.cardBrand}>VIONE PLATFORM · EXECUTIVE</Text>
            <ShieldCheck size={20} color="#D8B282" />
          </View>
          <Text style={styles.cardName}>NGUYỄN HẢI ĐĂNG</Text>
          <Text style={styles.cardTitle}>CHỦ TỊCH HĐQT</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardId}>BIB / ID: VNE-42-088</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.goldChip}>
                <Nfc size={14} color="#050C15" />
                <Text style={styles.chipText}>1-Tap NFC</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.goldChip}>
                <QrCode size={14} color="#050C15" />
                <Text style={styles.chipText}>QR vCard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050C15' },
  safeHeader: { paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(216, 178, 130, 0.15)' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarBorder: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#D8B282', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0F17' },
  avatarText: { color: '#F6E1C3', fontWeight: 'bold', fontSize: 16 },
  userMeta: { marginLeft: 10 },
  userName: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  userRole: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  stampBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D8B282', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  stampText: { color: '#050C15', fontWeight: 'bold', fontSize: 12, marginLeft: 4 },
  scrollBody: { padding: 16 },
  vcardFrame: { borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(216, 178, 130, 0.4)', position: 'relative', overflow: 'hidden' },
  cardSheen: { position: 'absolute', top: 0, left: 0, right: 0, height: 80 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  cardBrand: { color: '#D8B282', fontSize: 11, letterSpacing: 1.2, fontWeight: '700' },
  cardName: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  cardTitle: { color: '#D8B282', fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 28 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 12 },
  cardId: { color: '#64748B', fontSize: 12, fontFamily: 'monospace' },
  cardActions: { flexDirection: 'row' },
  goldChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D8B282', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  chipText: { color: '#050C15', fontSize: 11, fontWeight: '700', marginLeft: 4 },
});`
  },
  file4: {
    name: 'database/migrations/001_vione_platform_schema.sql',
    lines: 105,
    code: `-- PostgreSQL DDL Migration: 001_vione_platform_schema.sql
-- Nền tảng ViOne Platform: CSDL Chuẩn Doanh nghiệp Multi-Tenant

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Bảng tài khoản người dùng
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'MEMBER' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    mfa_secret VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Bảng hồ sơ danh thiếp số vCard
CREATE TABLE IF NOT EXISTS vcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    theme VARCHAR(50) DEFAULT 'obsidian_gold' NOT NULL,
    nfc_uid VARCHAR(64) UNIQUE,
    view_count INT DEFAULT 0 NOT NULL,
    contact_saved_count INT DEFAULT 0 NOT NULL,
    qr_data TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Bảng sự kiện và bán vé
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    banner_url VARCHAR(500),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    venue_name VARCHAR(255) NOT NULL,
    location_coordinates GEOMETRY(Point, 4326),
    status VARCHAR(30) DEFAULT 'PUBLISHED' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Bảng vé điện tử và đối soát VNPay
CREATE TABLE IF NOT EXISTS tickets_issued (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    tier_name VARCHAR(50) NOT NULL,
    price NUMERIC(15, 2) DEFAULT 0 NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'PENDING' NOT NULL,
    vnp_txn_ref VARCHAR(100) UNIQUE,
    is_checked_in BOOLEAN DEFAULT FALSE NOT NULL,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Bảng giải chạy ViOne Run & Chip Timing RFID
CREATE TABLE IF NOT EXISTS run_athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    bib_number VARCHAR(30) UNIQUE NOT NULL,
    rfid_chip_code VARCHAR(64) UNIQUE NOT NULL,
    distance_km NUMERIC(5, 2) NOT NULL,
    chip_time_ms BIGINT,
    gun_time_ms BIGINT,
    pace_seconds INT,
    overall_rank INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);`
  }
};

module.exports = {
  APPENDIX_I,
  APPENDIX_IV_CODE
};

