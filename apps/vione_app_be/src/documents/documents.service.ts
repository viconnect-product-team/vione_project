import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getActiveAssociationId(userId: string): Promise<string | null> {
    try {
      const rows = await this.prisma.$queryRaw<any[]>`
        SELECT association_id
        FROM public.memberships
        WHERE user_id = ${userId}::uuid AND is_default = true
        LIMIT 1
      `;
      return rows[0]?.association_id || null;
    } catch (err) {
      console.error('Failed to get active association ID:', err);
      return null;
    }
  }

  // ── DOCUMENTS LIST & CRUD ─────────────────────────────────────────────
  async list(userId: string, query?: { folderId?: string; category?: string; search?: string }) {
    let whereClause = '';
    const conditions: string[] = [];

    if (query?.folderId) {
      if (query.folderId === 'root') {
        conditions.push(`d.folder_id IS NULL`);
      } else {
        conditions.push(`d.folder_id = '${query.folderId.replace(/'/g, "''")}'::uuid`);
      }
    }

    if (query?.category && query.category !== 'all') {
      conditions.push(`d.category = '${query.category.replace(/'/g, "''")}'`);
    }

    if (query?.search) {
      const s = query.search.replace(/'/g, "''");
      conditions.push(`(d.name ILIKE '%${s}%' OR d.code ILIKE '%${s}%' OR d.uploaded_by ILIKE '%${s}%')`);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        d.id, 
        d.code, 
        d.name, 
        d.category, 
        d.size, 
        d.uploaded_at, 
        d.uploaded_by, 
        d.type, 
        d.file_path, 
        d.folder_id, 
        d.company_id, 
        d.is_starred,
        f.name as folder_name
      FROM public.documents d
      LEFT JOIN public.document_folders f ON d.folder_id = f.id
      ${whereClause}
      ORDER BY d.is_starred DESC, d.uploaded_at DESC
    `).catch((err) => {
      console.error('Error fetching documents list:', err);
      return [];
    });

    return rows.map(r => ({
      id: r.code || r.id,
      docId: r.id,
      name: r.name,
      category: r.category,
      size: r.size || '',
      uploadedAt: r.uploaded_at ? new Date(r.uploaded_at).toISOString() : new Date().toISOString(),
      uploadedBy: r.uploaded_by || '',
      type: r.type,
      filePath: r.file_path || '',
      folderId: r.folder_id || null,
      folderName: r.folder_name || null,
      isStarred: Boolean(r.is_starred),
    }));
  }

  async getById(id: string) {
    const clean = id.replace(/'/g, "''");
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        d.id, 
        d.code, 
        d.name, 
        d.category, 
        d.size, 
        d.uploaded_at, 
        d.uploaded_by, 
        d.type, 
        d.file_path, 
        d.folder_id, 
        d.company_id, 
        d.is_starred,
        f.name as folder_name
      FROM public.documents d
      LEFT JOIN public.document_folders f ON d.folder_id = f.id
      WHERE d.code = '${clean}' OR d.id::text = '${clean}'
      LIMIT 1
    `);
    const r = rows[0];
    if (!r) throw new Error('Không tìm thấy tài liệu');
    return {
      id: r.code || r.id,
      docId: r.id,
      name: r.name,
      category: r.category,
      size: r.size || '',
      uploadedAt: r.uploaded_at ? new Date(r.uploaded_at).toISOString() : new Date().toISOString(),
      uploadedBy: r.uploaded_by || '',
      type: r.type,
      filePath: r.file_path || '',
      folderId: r.folder_id || null,
      folderName: r.folder_name || null,
      isStarred: Boolean(r.is_starred),
    };
  }

  async create(userId: string, data: any) {
    const activeId = await this.getActiveAssociationId(userId);
    const code = 'DOC-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    const uploadedBy = data.uploadedBy || 'Người dùng';
    const size = data.size || '1.0 MB';
    const filePath = data.filePath || null;
    const folderId = data.folderId ? `'${data.folderId}'::uuid` : 'NULL';
    const assocId = activeId ? `'${activeId}'::uuid` : 'NULL';
    const companyId = data.companyId ? `'${data.companyId}'::uuid` : 'NULL';
    const uid = userId ? `'${userId}'::uuid` : 'NULL';

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.documents (code, name, category, size, uploaded_by, type, file_path, folder_id, association_id, company_id, user_id, is_starred, uploaded_at)
      VALUES (
        '${code}', 
        '${data.name.replace(/'/g, "''")}', 
        '${data.category.replace(/'/g, "''")}', 
        '${size}', 
        '${uploadedBy.replace(/'/g, "''")}', 
        '${data.type}', 
        ${filePath ? `'${filePath.replace(/'/g, "''")}'` : 'NULL'}, 
        ${folderId}, 
        ${assocId}, 
        ${companyId},
        ${uid},
        ${data.isStarred ? 'true' : 'false'},
        NOW()
      )
    `);

    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT code, name, category, size, uploaded_at, uploaded_by, type, file_path, folder_id, is_starred
      FROM public.documents
      WHERE code = ${code}
      LIMIT 1
    `.catch(() => []);

    const r = rows[0];
    if (!r) throw new Error('Failed to retrieve created document');

    return {
      id: r.code,
      name: r.name,
      category: r.category,
      size: r.size || '',
      uploadedAt: r.uploaded_at ? new Date(r.uploaded_at).toISOString() : new Date().toISOString(),
      uploadedBy: r.uploaded_by || '',
      type: r.type,
      filePath: r.file_path || '',
      folderId: r.folder_id || null,
      isStarred: Boolean(r.is_starred),
    };
  }

  async update(id: string, data: any) {
    const sets: string[] = [];
    if (data.name) sets.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.category) sets.push(`category = '${data.category.replace(/'/g, "''")}'`);
    if (data.size) sets.push(`size = '${data.size}'`);
    if (data.type) sets.push(`type = '${data.type}'`);
    if (data.filePath) sets.push(`file_path = '${data.filePath.replace(/'/g, "''")}'`);
    if (data.folderId !== undefined) {
      sets.push(`folder_id = ${data.folderId ? `'${data.folderId}'::uuid` : 'NULL'}`);
    }
    if (data.isStarred !== undefined) {
      sets.push(`is_starred = ${data.isStarred ? 'true' : 'false'}`);
    }

    if (sets.length > 0) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.documents
        SET ${sets.join(', ')}
        WHERE code = '${id.replace(/'/g, "''")}' OR id::text = '${id.replace(/'/g, "''")}'
      `);
    }

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT code, name, category, size, uploaded_at, uploaded_by, type, file_path, folder_id, is_starred
      FROM public.documents
      WHERE code = '${id.replace(/'/g, "''")}' OR id::text = '${id.replace(/'/g, "''")}'
      LIMIT 1
    `).catch(() => []);

    const r = rows[0];
    if (!r) throw new Error('Failed to retrieve updated document');

    return {
      id: r.code,
      name: r.name,
      category: r.category,
      size: r.size || '',
      uploadedAt: r.uploaded_at ? new Date(r.uploaded_at).toISOString() : new Date().toISOString(),
      uploadedBy: r.uploaded_by || '',
      type: r.type,
      filePath: r.file_path || '',
      folderId: r.folder_id || null,
      isStarred: Boolean(r.is_starred),
    };
  }

  async toggleStar(id: string) {
    await this.prisma.$executeRawUnsafe(`
      UPDATE public.documents
      SET is_starred = NOT COALESCE(is_starred, false)
      WHERE code = '${id.replace(/'/g, "''")}' OR id::text = '${id.replace(/'/g, "''")}'
    `);
    return { ok: true };
  }

  async delete(id: string) {
    await this.prisma.$executeRawUnsafe(`
      DELETE FROM public.documents 
      WHERE code = '${id.replace(/'/g, "''")}' OR id::text = '${id.replace(/'/g, "''")}'
    `);
    return { ok: true };
  }

  async getUrl(id: string) {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT file_path FROM public.documents 
      WHERE code = '${id.replace(/'/g, "''")}' OR id::text = '${id.replace(/'/g, "''")}' 
      LIMIT 1
    `).catch(() => []);

    const filePath = rows[0]?.file_path || null;
    if (!filePath) return null;

    if (filePath.startsWith('/upload/') || filePath.startsWith('http')) {
      return filePath;
    }

    return `/upload/file/${filePath}`;
  }

  // ── GOOGLE DRIVE-STYLE FOLDERS ─────────────────────────────────────────
  async listFolders(userId: string, parentId?: string) {
    let whereClause = '';
    if (parentId) {
      if (parentId === 'root') {
        whereClause = 'WHERE f.parent_id IS NULL';
      } else {
        whereClause = `WHERE f.parent_id = '${parentId.replace(/'/g, "''")}'::uuid`;
      }
    }

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        f.id,
        f.name,
        f.parent_id,
        f.category,
        f.color,
        f.created_by,
        f.created_at,
        COALESCE((SELECT COUNT(*)::int FROM public.documents d WHERE d.folder_id = f.id), 0) as doc_count,
        COALESCE((SELECT COUNT(*)::int FROM public.document_folders sub WHERE sub.parent_id = f.id), 0) as subfolder_count
      FROM public.document_folders f
      ${whereClause}
      ORDER BY f.created_at ASC
    `).catch((err) => {
      console.error('Error listing folders:', err);
      return [];
    });

    return rows.map(r => ({
      id: r.id,
      name: r.name,
      parentId: r.parent_id,
      category: r.category || 'Chung',
      color: r.color || '#D8B282',
      createdBy: r.created_by || 'Hệ thống',
      docCount: r.doc_count || 0,
      subfolderCount: r.subfolder_count || 0,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
  }

  async createFolder(userId: string, data: { name: string; parentId?: string; category?: string; color?: string; createdBy?: string }) {
    const parentIdVal = data.parentId ? `'${data.parentId.replace(/'/g, "''")}'::uuid` : 'NULL';
    const category = data.category || 'Tài Liệu Doanh Nghiệp';
    const color = data.color || '#D8B282';
    const createdBy = data.createdBy || 'Lãnh đạo';

    const insertRes = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.document_folders (name, parent_id, category, color, created_by)
      VALUES ('${data.name.replace(/'/g, "''")}', ${parentIdVal}, '${category.replace(/'/g, "''")}', '${color}', '${createdBy.replace(/'/g, "''")}')
      RETURNING id, name, parent_id, category, color, created_by, created_at
    `);

    const r = insertRes[0];
    return {
      id: r.id,
      name: r.name,
      parentId: r.parent_id,
      category: r.category,
      color: r.color,
      createdBy: r.created_by,
      docCount: 0,
      subfolderCount: 0,
      createdAt: new Date(r.created_at).toISOString(),
    };
  }

  async updateFolder(id: string, data: { name?: string; color?: string; category?: string }) {
    const sets: string[] = ['updated_at = NOW()'];
    if (data.name) sets.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.color) sets.push(`color = '${data.color}'`);
    if (data.category) sets.push(`category = '${data.category.replace(/'/g, "''")}'`);

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.document_folders
      SET ${sets.join(', ')}
      WHERE id = '${id.replace(/'/g, "''")}'::uuid
    `);

    return { ok: true };
  }

  async deleteFolder(id: string) {
    // Delete documents inside folder or decouple them
    await this.prisma.$executeRawUnsafe(`
      UPDATE public.documents SET folder_id = NULL WHERE folder_id = '${id.replace(/'/g, "''")}'::uuid
    `);
    await this.prisma.$executeRawUnsafe(`
      DELETE FROM public.document_folders WHERE id = '${id.replace(/'/g, "''")}'::uuid
    `);
    return { ok: true };
  }

  // ── DOCUMENT CATEGORIES ────────────────────────────────────────────────
  async listCategories(userId: string) {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        c.id,
        c.name,
        c.code,
        c.description,
        c.color,
        c.created_at,
        COALESCE((SELECT COUNT(*)::int FROM public.documents d WHERE d.category = c.name), 0) as doc_count
      FROM public.document_categories c
      ORDER BY c.name ASC
    `).catch(() => []);

    return rows.map(r => ({
      id: r.id,
      name: r.name,
      code: r.code || '',
      description: r.description || '',
      color: r.color || '#D8B282',
      docCount: r.doc_count || 0,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
  }

  async createCategory(userId: string, data: { name: string; code?: string; description?: string; color?: string }) {
    const code = data.code || data.name.toUpperCase().replace(/\s+/g, '_');
    const color = data.color || '#D8B282';
    const description = data.description || '';

    const res = await this.prisma.$queryRawUnsafe<any[]>(`
      INSERT INTO public.document_categories (name, code, description, color)
      VALUES ('${data.name.replace(/'/g, "''")}', '${code.replace(/'/g, "''")}', '${description.replace(/'/g, "''")}', '${color}')
      RETURNING id, name, code, description, color, created_at
    `);

    const r = res[0];
    return {
      id: r.id,
      name: r.name,
      code: r.code,
      description: r.description,
      color: r.color,
      docCount: 0,
      createdAt: new Date(r.created_at).toISOString(),
    };
  }

  async updateCategory(id: string, data: { name?: string; code?: string; description?: string; color?: string }) {
    const cleanId = id.replace(/'/g, "''");
    const sets: string[] = [];
    if (data.name) sets.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.code) sets.push(`code = '${data.code.replace(/'/g, "''")}'`);
    if (data.description !== undefined) sets.push(`description = '${(data.description || '').replace(/'/g, "''")}'`);
    if (data.color) sets.push(`color = '${data.color}'`);

    if (sets.length > 0) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.document_categories
        SET ${sets.join(', ')}
        WHERE id = '${cleanId}'::uuid
      `);
    }
    return { ok: true };
  }

  async deleteCategory(id: string) {
    await this.prisma.$executeRawUnsafe(`
      DELETE FROM public.document_categories WHERE id = '${id.replace(/'/g, "''")}'::uuid
    `);
    return { ok: true };
  }
}
