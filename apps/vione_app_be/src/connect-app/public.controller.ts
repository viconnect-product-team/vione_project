import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Res } from '@nestjs/common';
import { ConnectAppService } from './connect-app.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller(['public', 'connect-app/public'])
export class PublicController {
  constructor(private readonly connectAppService: ConnectAppService) {}

  @Get('association/:slug')
  async getPublicAssociation(@Param('slug') slug: string) {
    return this.connectAppService.getPublicAssociationBySlug(slug);
  }

  @Get('association/resolve-host')
  async resolveAssociationByHost(@Query('host') host: string) {
    return this.connectAppService.resolveAssociationByHost(host);
  }

  @Get(['identity/:identifier', 'profile/:identifier', 'p/:identifier', ':identifier'])
  async getPublicProfile(@Param('identifier') identifier: string) {
    return this.connectAppService.getPublicProfile(identifier);
  }

  @Get(['card/:identifier/vcf', 'vcf/:identifier', 'identity/:identifier/vcf', 'p/:identifier/vcf'])
  async getPublicVcf(@Param('identifier') identifier: string, @Res() res: any) {
    const cleanId = (identifier || '').replace(/\.vcf$/i, '');
    const profile = await this.connectAppService.getPublicProfile(cleanId);
    if (!profile || profile.state !== 'public' || !profile.card) {
      return res.status(404).send('Contact not found');
    }
    const card = profile.card;
    const name = card.displayName || 'Doanh Nhân ViOne';
    const cleanPhone = (card.primaryPhone || '').replace(/[^\d+]/g, '');

    const lines: string[] = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN;CHARSET=UTF-8:${name}`,
      `N;CHARSET=UTF-8:${name};;;;`,
    ];
    if (card.companyName) lines.push(`ORG;CHARSET=UTF-8:${card.companyName}`);
    if (card.jobTitle) lines.push(`TITLE;CHARSET=UTF-8:${card.jobTitle}`);
    if (cleanPhone) lines.push(`TEL;TYPE=CELL,VOICE:${cleanPhone}`);
    if (card.primaryEmail) lines.push(`EMAIL;TYPE=PREF,INTERNET:${card.primaryEmail}`);
    if (card.website) lines.push(`URL:${card.website}`);
    if (card.address) lines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${card.address};;;;VN`);
    if (card.headline || card.bio) {
      lines.push(`NOTE;CHARSET=UTF-8:${(card.headline || card.bio || '').replace(/[\r\n]+/g, ' ')}`);
    }
    lines.push('END:VCARD');

    const vcf = lines.join('\r\n');
    const safeFilename = `${name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '') || 'danh-ba'}.vcf`;
    res.setHeader('Content-Type', 'text/x-vcard; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
    return res.status(200).send(vcf);
  }

  /** Anonymous guest shares their contact back to the card owner. No auth required. */
  @Post('card/:slug/contact')
  async shareGuestContact(@Param('slug') slug: string, @Body() body: any) {
    return this.connectAppService.shareGuestContact(slug, body);
  }

  /** Public club registration endpoint from landing pages. No auth required. */
  @Post('club-registration')
  async submitClubRegistration(@Body() body: any) {
    return this.connectAppService.submitClubRegistration(body);
  }

  @Post('leads/club-registration')
  async submitClubRegistrationAlias(@Body() body: any) {
    return this.connectAppService.submitClubRegistration(body);
  }

  @Get('club-registration/status')
  async getClubRegistrationStatus(@Query('phone') phone?: string, @Query('email') email?: string) {
    return this.connectAppService.checkClubRegistrationStatus({ phone, email });
  }

  @Post('club-registration/status')
  async checkClubRegistrationStatusPost(@Body() body: { phone?: string; email?: string }) {
    return this.connectAppService.checkClubRegistrationStatus(body);
  }

  /** Admin renewal audit scope — requires JWT. */
  @Get('admin/renewal-scope')
  @UseGuards(JwtAuthGuard)
  async getAdminRenewalScope(@Request() req) {
    return this.connectAppService.getAdminRenewalScope(req.user.id);
  }

  /** Admin renewal audit search — requires JWT. */
  @Post('admin/renewal-audit')
  @UseGuards(JwtAuthGuard)
  async searchRenewalAuditLog(@Request() req, @Body() body: any) {
    return this.connectAppService.searchRenewalAuditLog(req.user.id, body);
  }

  /** Public landing visit tracker. No auth required. */
  @Post('track-visit')
  async trackVisit(@Body() body: any) {
    return this.connectAppService.recordLandingVisit(body);
  }
}

