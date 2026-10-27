import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlatformHubService } from './platform-hub.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('platform-hub')
export class PlatformHubController {
  constructor(private readonly service: PlatformHubService) {}

  private getEffectiveUserId(req: any): string {
    return req.user?.id || 'fa018915-f803-4c9c-9e20-5676dea055ea';
  }

  // 1. TỔNG QUAN
  @Get('overview')
  async getOverview() {
    return this.service.getOverview();
  }

  // 2. DI SẢN VĂN HÓA (HERITAGE)
  @Get('heritage')
  async getHeritageSites(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('province') province?: string,
  ) {
    return this.service.getHeritageSites({ search, category, province });
  }

  @Get('heritage/:id')
  async getHeritageDetail(@Param('id') id: string) {
    return this.service.getHeritageDetail(id);
  }

  @Post('heritage/:id/stamp')
  @UseGuards(OptionalJwtAuthGuard)
  async stampHeritage(
    @Param('id') id: string,
    @Body('note') note: string,
    @Req() req: any,
  ) {
    const userId = this.getEffectiveUserId(req);
    return this.service.stampHeritage(userId, id, note);
  }

  @Get('user/stamps')
  @UseGuards(OptionalJwtAuthGuard)
  async getUserHeritageStamps(@Req() req: any) {
    const userId = this.getEffectiveUserId(req);
    return this.service.getUserHeritageStamps(userId);
  }

  // 3. BẢO TÀNG SỐ (MUSEUM)
  @Get('museums')
  async getMuseums(
    @Query('province') province?: string,
    @Query('search') search?: string,
  ) {
    return this.service.getMuseums({ province, search });
  }

  @Get('museums/:id')
  async getMuseumDetail(@Param('id') id: string) {
    return this.service.getMuseumDetail(id);
  }

  @Get('artifacts/nfc/:nfcUid')
  async getArtifactByNfc(@Param('nfcUid') nfcUid: string) {
    return this.service.getArtifactByNfc(nfcUid);
  }

  @Get('artifacts/:code')
  async getArtifactByCode(@Param('code') code: string) {
    return this.service.getArtifactByCode(code);
  }

  // 4. GIẢI ĐẤU THỂ THAO (SPORT)
  @Get('sport/tournaments')
  async getSportTournaments(
    @Query('sportType') sportType?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getSportTournaments({ sportType, status });
  }

  @Get('sport/tournaments/:id')
  async getTournamentDetail(@Param('id') id: string) {
    return this.service.getTournamentDetail(id);
  }

  @Post('sport/matches/:id/score')
  async updateMatchScore(
    @Param('id') id: string,
    @Body() body: { scoreA: number; scoreB: number; setsDetail?: string; status?: string; winner?: string },
  ) {
    return this.service.updateMatchScore(id, body);
  }

  @Get('sport/clubs')
  async getSportClubs(@Query('sportType') sportType?: string) {
    return this.service.getSportClubs({ sportType });
  }

  // 5. GIẢI CHẠY & TIMING RFID (RUN)
  @Get('run/races')
  async getRaces(
    @Query('isHeritageRun') isHeritageRun?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getRaces({
      isHeritageRun: isHeritageRun !== undefined ? isHeritageRun === 'true' : undefined,
      status,
    });
  }

  @Get('run/races/:id')
  async getRaceDetail(@Param('id') id: string) {
    return this.service.getRaceDetail(id);
  }

  @Post('run/races/:id/register-bib')
  @UseGuards(OptionalJwtAuthGuard)
  async registerRaceBib(
    @Param('id') id: string,
    @Body() body: { distanceKm: number; runnerName: string; runnerGender?: string; runnerAge?: number },
    @Req() req: any,
  ) {
    const userId = this.getEffectiveUserId(req);
    return this.service.registerRaceBib(userId, id, body);
  }

  @Post('run/timing/simulate-split')
  async recordRfidSplit(
    @Body() body: { raceId: string; bibNumber: string; checkpoint: 'start' | 'split_5k' | 'split_10k' | 'split_21k' | 'finish' },
  ) {
    return this.service.recordRfidSplit(body.raceId, body.bibNumber, body.checkpoint);
  }

  @Get('run/races/:id/leaderboard')
  async getLeaderboard(
    @Param('id') id: string,
    @Query('distanceKm') distanceKm?: string,
  ) {
    return this.service.getLeaderboard(id, distanceKm ? parseFloat(distanceKm) : undefined);
  }

  @Get('run/bibs/:bib/certificate')
  async getFinisherCertificate(@Param('bib') bib: string) {
    return this.service.getFinisherCertificate(bib);
  }

  // 6. VÉ ĐIỆN TỬ (TICKET)
  @Get('tickets/my-tickets')
  @UseGuards(OptionalJwtAuthGuard)
  async getUserTickets(@Req() req: any) {
    const userId = this.getEffectiveUserId(req);
    return this.service.getUserTickets(userId);
  }

  @Post('tickets/purchase')
  @UseGuards(OptionalJwtAuthGuard)
  async purchaseTicket(
    @Body() body: { ticketType: string; itemName: string; totalAmount: number; validDate?: string; quantity?: number },
    @Req() req: any,
  ) {
    const userId = this.getEffectiveUserId(req);
    return this.service.purchaseTicket(userId, body);
  }

  // 7. KHO TƯ LIỆU SỐ (ARCHIVE)
  @Get('archives')
  async getArchives(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.service.getArchives({ category, search });
  }

  // 8. SOÁT VÉ ĐIỆN TỬ (TICKET VALIDATION)
  @Post('tickets/validate')
  async validateTicket(
    @Body('ticketCode') ticketCode: string,
    @Body('staffName') staffName?: string,
  ) {
    return this.service.validateTicket(ticketCode, staffName);
  }

  // 9. VIONE REVIEW (CHẠM NFC TĂNG ĐÁNH GIÁ CỬA HÀNG)
  @Get('reviews/stores')
  async getReviewStores() {
    return this.service.getReviewStores();
  }

  @Post('reviews/submit')
  async submitNfcReview(
    @Body('storeId') storeId: string,
    @Body() body: { rating: number; comment?: string; customerName?: string; customerPhone?: string },
  ) {
    return this.service.submitNfcReview(storeId, body);
  }
}
