import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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

  // ── 1. TỔNG QUAN NỀN TẢNG (OVERVIEW) ──
  @Get('overview')
  async getOverview() {
    return this.service.getOverview();
  }

  // ── 2. DI SẢN VĂN HÓA (HERITAGE RESTFUL) ──
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

  @Post('heritage')
  async createHeritageSite(@Body() body: any) {
    return this.service.createHeritageSite(body);
  }

  @Put('heritage/:id')
  async updateHeritageSite(@Param('id') id: string, @Body() body: any) {
    return this.service.updateHeritageSite(id, body);
  }

  @Delete('heritage/:id')
  async deleteHeritageSite(@Param('id') id: string) {
    return this.service.deleteHeritageSite(id);
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

  // ── 3. BẢO TÀNG SỐ (MUSEUM RESTFUL) ──
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

  @Post('museums')
  async createMuseum(@Body() body: any) {
    return this.service.createMuseum(body);
  }

  @Put('museums/:id')
  async updateMuseum(@Param('id') id: string, @Body() body: any) {
    return this.service.updateMuseum(id, body);
  }

  @Delete('museums/:id')
  async deleteMuseum(@Param('id') id: string) {
    return this.service.deleteMuseum(id);
  }

  // ── 4. HIỆN VẬT BẢO TÀNG (ARTIFACTS RESTFUL) ──
  @Get('artifacts')
  async getArtifacts(
    @Query('museumId') museumId?: string,
    @Query('search') search?: string,
  ) {
    return this.service.getArtifacts({ museumId, search });
  }

  @Get('artifacts/nfc/:nfcUid')
  async getArtifactByNfc(@Param('nfcUid') nfcUid: string) {
    return this.service.getArtifactByNfc(nfcUid);
  }

  @Get('artifacts/:code')
  async getArtifactByCode(@Param('code') code: string) {
    return this.service.getArtifactByCode(code);
  }

  @Post('artifacts')
  async createArtifact(@Body() body: any) {
    return this.service.createArtifact(body);
  }

  @Put('artifacts/:id')
  async updateArtifact(@Param('id') id: string, @Body() body: any) {
    return this.service.updateArtifact(id, body);
  }

  @Delete('artifacts/:id')
  async deleteArtifact(@Param('id') id: string) {
    return this.service.deleteArtifact(id);
  }

  // ── 5. GIẢI ĐẤU THỂ THAO (SPORT RESTFUL) ──
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

  @Post('sport/tournaments')
  async createSportTournament(@Body() body: any) {
    return this.service.createSportTournament(body);
  }

  @Put('sport/tournaments/:id')
  async updateSportTournament(@Param('id') id: string, @Body() body: any) {
    return this.service.updateSportTournament(id, body);
  }

  @Delete('sport/tournaments/:id')
  async deleteSportTournament(@Param('id') id: string) {
    return this.service.deleteSportTournament(id);
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

  @Post('sport/clubs')
  async createSportClub(@Body() body: any) {
    return this.service.createSportClub(body);
  }

  @Put('sport/clubs/:id')
  async updateSportClub(@Param('id') id: string, @Body() body: any) {
    return this.service.updateSportClub(id, body);
  }

  @Delete('sport/clubs/:id')
  async deleteSportClub(@Param('id') id: string) {
    return this.service.deleteSportClub(id);
  }

  // ── 6. GIẢI CHẠY & TIMING RFID (RUN RESTFUL) ──
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

  @Post('run/races')
  async createRace(@Body() body: any) {
    return this.service.createRace(body);
  }

  @Put('run/races/:id')
  async updateRace(@Param('id') id: string, @Body() body: any) {
    return this.service.updateRace(id, body);
  }

  @Delete('run/races/:id')
  async deleteRace(@Param('id') id: string) {
    return this.service.deleteRace(id);
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

  // ── 7. KHO TƯ LIỆU SỐ (ARCHIVE RESTFUL) ──
  @Get('archives')
  async getArchives(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.service.getArchives({ category, search });
  }

  @Get('archives/:id')
  async getArchiveDetail(@Param('id') id: string) {
    return this.service.getArchiveDetail(id);
  }

  @Post('archives')
  async createArchive(@Body() body: any) {
    return this.service.createArchive(body);
  }

  @Put('archives/:id')
  async updateArchive(@Param('id') id: string, @Body() body: any) {
    return this.service.updateArchive(id, body);
  }

  @Delete('archives/:id')
  async deleteArchive(@Param('id') id: string) {
    return this.service.deleteArchive(id);
  }

  // ── 8. VÉ ĐIỆN TỬ & SOÁT VÉ (TICKETS RESTFUL) ──
  @Get('tickets')
  async getAllTickets(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getAllTickets({ search, status });
  }

  @Get('tickets/my-tickets')
  @UseGuards(OptionalJwtAuthGuard)
  async getUserTickets(@Req() req: any) {
    const userId = this.getEffectiveUserId(req);
    return this.service.getUserTickets(userId);
  }

  @Post('tickets')
  async createTicket(@Body() body: any) {
    return this.service.createTicket(body);
  }

  @Put('tickets/:id')
  async updateTicket(@Param('id') id: string, @Body() body: any) {
    return this.service.updateTicket(id, body);
  }

  @Delete('tickets/:id')
  async deleteTicket(@Param('id') id: string) {
    return this.service.deleteTicket(id);
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

  @Post('tickets/validate')
  async validateTicket(
    @Body('ticketCode') ticketCode: string,
    @Body('staffName') staffName?: string,
  ) {
    return this.service.validateTicket(ticketCode, staffName);
  }

  // ── 9. VIONE REVIEW (NFC STORES RESTFUL) ──
  @Get('reviews/stores')
  async getReviewStores() {
    return this.service.getReviewStores();
  }

  @Get('reviews/stores/:id')
  async getReviewStoreDetail(@Param('id') id: string) {
    return this.service.getReviewStoreDetail(id);
  }

  @Post('reviews/stores')
  async createReviewStore(@Body() body: any) {
    return this.service.createReviewStore(body);
  }

  @Put('reviews/stores/:id')
  async updateReviewStore(@Param('id') id: string, @Body() body: any) {
    return this.service.updateReviewStore(id, body);
  }

  @Delete('reviews/stores/:id')
  async deleteReviewStore(@Param('id') id: string) {
    return this.service.deleteReviewStore(id);
  }

  @Post('reviews/submit')
  async submitNfcReview(
    @Body('storeId') storeId: string,
    @Body() body: { rating: number; comment?: string; customerName?: string; customerPhone?: string },
  ) {
    return this.service.submitNfcReview(storeId, body);
  }
}
