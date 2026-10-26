import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireNestAuth } from "@/integrations/supabase/nest-auth-middleware";
import { fetchNestApiFromServer } from "./api-client";

export type Document = {
  id: string;
  docId?: string;
  name: string;
  category: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  type: "pdf" | "docx" | "xlsx" | "pptx";
  filePath?: string;
  folderId?: string | null;
  folderName?: string | null;
  isStarred?: boolean;
};

export type DocumentFolder = {
  id: string;
  name: string;
  parentId: string | null;
  category: string;
  color: string;
  createdBy: string;
  docCount: number;
  subfolderCount: number;
  createdAt: string;
};

export type DocumentCategory = {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  docCount: number;
  createdAt: string;
};

export const listDocumentsFn = createServerFn({ method: "GET" })
  .middleware([requireNestAuth])
  .inputValidator((d?: { folderId?: string; category?: string; search?: string }) => d)
  .handler(async ({ data, context }): Promise<Document[]> => {
    const { token } = context as any;
    const params = new URLSearchParams();
    if (data?.folderId) params.set("folderId", data.folderId);
    if (data?.category) params.set("category", data.category);
    if (data?.search) params.set("search", data.search);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await fetchNestApiFromServer(`/documents${qs}`, token);
    return res ?? [];
  });

const docInput = z.object({
  name: z.string().min(1).max(300),
  category: z.string().min(1).max(100),
  size: z.string().max(40).default(""),
  uploadedBy: z.string().max(120).default(""),
  type: z.enum(["pdf", "docx", "xlsx", "pptx"]),
  filePath: z.string().max(500).default(""),
  folderId: z.string().nullish(),
  isStarred: z.boolean().default(false),
});

export const createDocumentFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) => docInput.parse(d))
  .handler(async ({ data, context }): Promise<Document> => {
    const { token } = context as any;
    return fetchNestApiFromServer("/documents", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

export const updateDocumentFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) => docInput.partial().extend({ id: z.string().min(1).max(128) }).parse(d))
  .handler(async ({ data, context }): Promise<Document> => {
    const { token } = context as any;
    const { id, ...body } = data;
    return fetchNestApiFromServer(`/documents/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  });

export const toggleStarDocumentFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    const { token } = context as any;
    return fetchNestApiFromServer(`/documents/${data.id}/star`, token, {
      method: "POST",
    });
  });

/** Issues a short-lived URL for the document's attached file. */
export const getDocumentUrlFn = createServerFn({ method: "GET" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().min(1).max(128) }).parse(d))
  .handler(async ({ data, context }): Promise<string | null> => {
    const { token } = context as any;
    const res = await fetchNestApiFromServer(`/documents/${data.id}/url`, token);
    if (!res || !res.url) return null;
    
    const apiHost = process.env.VITE_API_URL || "http://localhost:3000";
    return res.url.startsWith("http") ? res.url : `${apiHost}${res.url}`;
  });

export const deleteDocumentFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().min(1).max(128) }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    const { token } = context as any;
    return fetchNestApiFromServer(`/documents/${data.id}`, token, {
      method: "DELETE",
    });
  });

// ── FOLDERS (GOOGLE DRIVE) ──────────────────────────────────────────────
export const listFoldersFn = createServerFn({ method: "GET" })
  .middleware([requireNestAuth])
  .inputValidator((d?: { parentId?: string }) => d)
  .handler(async ({ data, context }): Promise<DocumentFolder[]> => {
    const { token } = context as any;
    const qs = data?.parentId ? `?parentId=${encodeURIComponent(data.parentId)}` : "";
    const res = await fetchNestApiFromServer(`/documents/folders${qs}`, token);
    return res ?? [];
  });

export const createFolderFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        name: z.string().min(1).max(255),
        parentId: z.string().nullish(),
        category: z.string().max(100).default("Tài Liệu Doanh Nghiệp"),
        color: z.string().max(50).default("#D8B282"),
        createdBy: z.string().max(120).default("Ban Giám Đốc"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<DocumentFolder> => {
    const { token } = context as any;
    return fetchNestApiFromServer("/documents/folders", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

export const updateFolderFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().min(1),
        name: z.string().min(1).max(255).optional(),
        color: z.string().max(50).optional(),
        category: z.string().max(100).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    const { token } = context as any;
    const { id, ...body } = data;
    return fetchNestApiFromServer(`/documents/folders/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  });

export const deleteFolderFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    const { token } = context as any;
    return fetchNestApiFromServer(`/documents/folders/${data.id}`, token, {
      method: "DELETE",
    });
  });

// ── CATEGORIES ──────────────────────────────────────────────────────────
export const listCategoriesFn = createServerFn({ method: "GET" })
  .middleware([requireNestAuth])
  .handler(async ({ context }): Promise<DocumentCategory[]> => {
    const { token } = context as any;
    const res = await fetchNestApiFromServer("/documents/categories", token);
    return res ?? [];
  });

export const createCategoryFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        name: z.string().min(1).max(255),
        code: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
        color: z.string().max(50).default("#D8B282"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<DocumentCategory> => {
    const { token } = context as any;
    return fetchNestApiFromServer("/documents/categories", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

export const deleteCategoryFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    const { token } = context as any;
    return fetchNestApiFromServer(`/documents/categories/${data.id}`, token, {
      method: "DELETE",
    });
  });
