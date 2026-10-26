import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // ── FOLDERS (Phải đặt trước các route có param :id) ───────────────────
  @Get('folders')
  async listFolders(@Request() req: any, @Query('parentId') parentId?: string) {
    const userId = req.user.id || req.user.sub;
    return this.documentsService.listFolders(userId, parentId);
  }

  @Post('folders')
  async createFolder(@Request() req: any, @Body() data: any) {
    const userId = req.user.id || req.user.sub;
    if (!data.name) {
      throw new BadRequestException('Vui lòng nhập tên thư mục');
    }
    return this.documentsService.createFolder(userId, data);
  }

  @Put('folders/:id')
  async updateFolder(@Param('id') id: string, @Body() data: any) {
    return this.documentsService.updateFolder(id, data);
  }

  @Delete('folders/:id')
  async deleteFolder(@Param('id') id: string) {
    return this.documentsService.deleteFolder(id);
  }

  // ── CATEGORIES ────────────────────────────────────────────────────────
  @Get('categories')
  async listCategories(@Request() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.documentsService.listCategories(userId);
  }

  @Post('categories')
  async createCategory(@Request() req: any, @Body() data: any) {
    const userId = req.user.id || req.user.sub;
    if (!data.name) {
      throw new BadRequestException('Vui lòng nhập tên danh mục');
    }
    return this.documentsService.createCategory(userId, data);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.documentsService.deleteCategory(id);
  }

  // ── DOCUMENTS ─────────────────────────────────────────────────────────
  @Get()
  async list(
    @Request() req: any,
    @Query('folderId') folderId?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    const userId = req.user.id || req.user.sub;
    return this.documentsService.list(userId, { folderId, category, search });
  }

  @Post()
  async create(@Request() req: any, @Body() data: any) {
    const userId = req.user.id || req.user.sub;
    if (!data.name || !data.category || !data.type) {
      throw new BadRequestException('Missing required fields: name, category, or type');
    }
    return this.documentsService.create(userId, data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.documentsService.update(id, data);
  }

  @Post(':id/star')
  async toggleStar(@Param('id') id: string) {
    return this.documentsService.toggleStar(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.documentsService.delete(id);
  }

  @Get(':id/url')
  async getUrl(@Param('id') id: string) {
    const url = await this.documentsService.getUrl(id);
    return { url };
  }
}
