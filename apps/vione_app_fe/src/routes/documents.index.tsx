import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  File,
  FileSpreadsheet,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  FolderPlus,
  Home,
  LayoutGrid,
  List as ListIcon,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { getNestApiUrl } from "@/lib/api-client";

import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader, StatCard } from "@/components/dashboard/PageKit";
import { EmptyState, ListSkeleton, NoSearchResult } from "@/components/dashboard/StateKit";
import { useRole } from "@/hooks/use-role";
import {
  createCategoryFn,
  createDocumentFn,
  createFolderFn,
  deleteCategoryFn,
  deleteDocumentFn,
  deleteFolderFn,
  getDocumentUrlFn,
  listCategoriesFn,
  listDocumentsFn,
  listFoldersFn,
  toggleStarDocumentFn,
  updateDocumentFn,
  updateFolderFn,
  type Document,
  type DocumentCategory,
  type DocumentFolder,
} from "@/lib/documents.functions";
import { useFmt, useT } from "@/lib/i18n";

export const Route = createFileRoute("/documents/")({
  ssr: false,
  loader: async () => {
    const [docs, folders, categories] = await Promise.all([
      listDocumentsFn({}),
      listFoldersFn({}),
      listCategoriesFn(),
    ]);
    return { docs, folders, categories };
  },
  component: DocsPage,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-6 text-sm text-destructive">
      {error.message}
    </div>
  ),
});

const TYPE_CONFIG: Record<
  Document["type"],
  { label: string; color: string; bg: string; icon: typeof FileText }
> = {
  pdf: { label: "PDF", color: "#EF4444", bg: "rgba(239, 68, 68, 0.15)", icon: FileText },
  docx: { label: "Word", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.15)", icon: FileText },
  xlsx: { label: "Excel", color: "#10B981", bg: "rgba(16, 185, 129, 0.15)", icon: FileSpreadsheet },
  pptx: { label: "PowerPoint", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.15)", icon: File },
};

const FOLDER_COLORS = [
  { label: "Vàng Champagne", value: "#D8B282" },
  { label: "Xanh Sapphire", value: "#3B82F6" },
  { label: "Ngọc Lục Bảo", value: "#10B981" },
  { label: "Hổ Phách", value: "#F59E0B" },
  { label: "Tím Thạch Anh", value: "#8B5CF6" },
  { label: "Đỏ Ruby", value: "#EF4444" },
];

type SortMode = "newest" | "oldest" | "nameAsc" | "nameDesc";

function DocsPage() {
  const t = useT();
  const fmt = useFmt();
  const router = useRouter();
  const { isAdmin, isModerator, isPlatformAdmin } = useRole();
  const canWrite = isAdmin || isModerator || isPlatformAdmin;

  const initialData = Route.useLoaderData() as {
    docs: Document[];
    folders: DocumentFolder[];
    categories: DocumentCategory[];
  };

  const [documents, setDocuments] = useState<Document[]>(initialData?.docs || []);
  const [folders, setFolders] = useState<DocumentFolder[]>(initialData?.folders || []);
  const [categories, setCategories] = useState<DocumentCategory[]>(initialData?.categories || []);

  // Current folder navigation state (Google Drive hierarchy)
  const [currentFolder, setCurrentFolder] = useState<DocumentFolder | null>(null);
  const [folderHistory, setFolderHistory] = useState<DocumentFolder[]>([]);

  // Filters & View Mode
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [starredOnly, setStarredOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Server functions
  const fetchDocsFn = useServerFn(listDocumentsFn);
  const fetchFoldersFn = useServerFn(listFoldersFn);
  const fetchCategoriesFn = useServerFn(listCategoriesFn);

  const createDocFn = useServerFn(createDocumentFn);
  const updateDocFn = useServerFn(updateDocumentFn);
  const deleteDocFn = useServerFn(deleteDocumentFn);
  const toggleStarFn = useServerFn(toggleStarDocumentFn);
  const getUrlFn = useServerFn(getDocumentUrlFn);

  const createFolderServerFn = useServerFn(createFolderFn);
  const updateFolderServerFn = useServerFn(updateFolderFn);
  const deleteFolderServerFn = useServerFn(deleteFolderFn);

  const createCategoryServerFn = useServerFn(createCategoryFn);
  const deleteCategoryServerFn = useServerFn(deleteCategoryFn);

  // Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [folderColorInput, setFolderColorInput] = useState("#D8B282");
  const [folderCategoryInput, setFolderCategoryInput] = useState("");
  const [editingFolder, setEditingFolder] = useState<DocumentFolder | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [categoryDescInput, setCategoryDescInput] = useState("");
  const [categoryColorInput, setCategoryColorInput] = useState("#D8B282");

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docNameInput, setDocNameInput] = useState("");
  const [docCategoryInput, setDocCategoryInput] = useState("");
  const [docTypeInput, setDocTypeInput] = useState<Document["type"]>("pdf");
  const [docSizeInput, setDocSizeInput] = useState("1.0 MB");
  const [docUploaderInput, setDocUploaderInput] = useState("Ban Giám Đốc");
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reload data helper
  const reloadData = useCallback(async () => {
    try {
      const [docsRes, foldersRes, catsRes] = await Promise.all([
        fetchDocsFn({}),
        fetchFoldersFn({}),
        fetchCategoriesFn(),
      ]);
      setDocuments(docsRes || []);
      setFolders(foldersRes || []);
      setCategories(catsRes || []);
    } catch (e) {
      console.error("Failed to reload documents data:", e);
    }
  }, [fetchDocsFn, fetchFoldersFn, fetchCategoriesFn]);

  // Navigate into folder
  const openFolder = (folder: DocumentFolder) => {
    setFolderHistory((prev) => [...prev, folder]);
    setCurrentFolder(folder);
  };

  // Navigate to root
  const navigateToRoot = () => {
    setCurrentFolder(null);
    setFolderHistory([]);
  };

  // Navigate to a specific level in breadcrumb
  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      navigateToRoot();
      return;
    }
    const targetFolder = folderHistory[index];
    setFolderHistory((prev) => prev.slice(0, index + 1));
    setCurrentFolder(targetFolder);
  };

  // Step back one folder
  const stepBackFolder = () => {
    if (folderHistory.length <= 1) {
      navigateToRoot();
    } else {
      const newHistory = folderHistory.slice(0, -1);
      setFolderHistory(newHistory);
      setCurrentFolder(newHistory[newHistory.length - 1]);
    }
  };

  // Filter folders in current view
  const currentFolders = useMemo(() => {
    let list = folders.filter((f) => {
      if (currentFolder) {
        return f.parentId === currentFolder.id;
      }
      return !f.parentId;
    });

    if (selectedCategory !== "all") {
      list = list.filter((f) => f.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }

    return list;
  }, [folders, currentFolder, selectedCategory, searchQuery]);

  // Filter documents in current view
  const currentDocuments = useMemo(() => {
    let list = documents.filter((d) => {
      if (currentFolder) {
        return d.folderId === currentFolder.id;
      }
      return !d.folderId;
    });

    if (selectedCategory !== "all") {
      list = list.filter((d) => d.category === selectedCategory);
    }

    if (selectedType !== "all") {
      list = list.filter((d) => d.type === selectedType);
    }

    if (starredOnly) {
      list = list.filter((d) => d.isStarred);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.category?.toLowerCase().includes(q) ||
          d.uploadedBy?.toLowerCase().includes(q),
      );
    }

    return list.sort((a, b) => {
      switch (sortMode) {
        case "oldest":
          return a.uploadedAt.localeCompare(b.uploadedAt);
        case "nameAsc":
          return a.name.localeCompare(b.name, "vi");
        case "nameDesc":
          return b.name.localeCompare(a.name, "vi");
        case "newest":
        default:
          return b.uploadedAt.localeCompare(a.uploadedAt);
      }
    });
  }, [documents, currentFolder, selectedCategory, selectedType, starredOnly, searchQuery, sortMode]);

  // Handle Folder Submit (Create / Edit)
  const handleFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderNameInput.trim()) {
      toast.error("Vui lòng nhập tên thư mục");
      return;
    }

    try {
      if (editingFolder) {
        await updateFolderServerFn({
          data: {
            id: editingFolder.id,
            name: folderNameInput.trim(),
            color: folderColorInput,
            category: folderCategoryInput || "Tài Liệu Doanh Nghiệp",
          },
        });
        toast.success("Cập nhật thư mục thành công");
      } else {
        await createFolderServerFn({
          data: {
            name: folderNameInput.trim(),
            parentId: currentFolder?.id || null,
            color: folderColorInput,
            category:
              folderCategoryInput ||
              (selectedCategory !== "all" ? selectedCategory : "Tài Liệu Doanh Nghiệp"),
            createdBy: "Ban Giám Đốc",
          },
        });
        toast.success("Tạo thư mục mới thành công");
      }
      setIsFolderModalOpen(false);
      setFolderNameInput("");
      setEditingFolder(null);
      await reloadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi thao tác thư mục");
    }
  };

  // Handle Folder Delete
  const handleDeleteFolder = async (folder: DocumentFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc muốn xóa thư mục "${folder.name}" và các mục bên trong?`)) {
      return;
    }
    try {
      await deleteFolderServerFn({ data: { id: folder.id } });
      toast.success("Đã xóa thư mục thành công");
      await reloadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa thư mục");
    }
  };

  // Handle Category Submit (Create)
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      await createCategoryServerFn({
        data: {
          name: categoryNameInput.trim(),
          description: categoryDescInput.trim(),
          color: categoryColorInput,
        },
      });
      toast.success("Tạo danh mục mới thành công");
      setIsCategoryModalOpen(false);
      setCategoryNameInput("");
      setCategoryDescInput("");
      await reloadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi tạo danh mục");
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (cat: DocumentCategory) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) return;
    try {
      await deleteCategoryServerFn({ data: { id: cat.id } });
      toast.success("Đã xóa danh mục");
      if (selectedCategory === cat.name) {
        setSelectedCategory("all");
      }
      await reloadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa danh mục");
    }
  };

  // Handle File Upload directly into current folder
  const handleUploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("vibe_token") : null;
      const headers = new Headers();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await fetch(getNestApiUrl("/upload/file"), {
        method: "POST",
        body: formData,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Tải tệp thất bại: ${response.statusText}`);
      }

      const resData = await response.json();
      const path = resData.url;

      const ext = (file.name.split(".").pop() ?? "").toLowerCase();
      const type = (
        ["pdf", "docx", "xlsx", "pptx"].includes(ext) ? ext : "pdf"
      ) as Document["type"];
      const size =
        file.size >= 1048576
          ? `${(file.size / 1048576).toFixed(1)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      await createDocFn({
        data: {
          name: file.name,
          category:
            selectedCategory !== "all"
              ? selectedCategory
              : categories[0]?.name || "Tài Liệu Doanh Nghiệp",
          size,
          uploadedBy: "Ban Giám Đốc",
          type,
          filePath: path,
          folderId: currentFolder?.id || null,
          isStarred: false,
        } as any,
      });

      toast.success(`Đã tải lên tệp: ${file.name}`);
      await reloadData();
    } catch (e: any) {
      toast.error(e.message || "Không thể tải lên tệp");
    } finally {
      setUploading(false);
    }
  };

  // Handle Document Modal Submit (Create / Edit)
  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNameInput.trim()) {
      toast.error("Vui lòng nhập tên tài liệu");
      return;
    }

    try {
      if (editingDoc) {
        await updateDocFn({
          data: {
            id: editingDoc.id,
            name: docNameInput.trim(),
            category: docCategoryInput || "Tài Liệu Doanh Nghiệp",
          } as any,
        });
        toast.success("Cập nhật tài liệu thành công");
      } else {
        await createDocFn({
          data: {
            name: docNameInput.trim(),
            category: docCategoryInput || "Tài Liệu Doanh Nghiệp",
            size: docSizeInput || "1.0 MB",
            uploadedBy: docUploaderInput || "Ban Giám Đốc",
            type: docTypeInput,
            folderId: currentFolder?.id || null,
            isStarred: false,
          } as any,
        });
        toast.success("Tạo tài liệu mới thành công");
      }
      setIsDocModalOpen(false);
      setDocNameInput("");
      setEditingDoc(null);
      await reloadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi thao tác tài liệu");
    }
  };

  // Handle Star Toggle
  const handleToggleStar = async (d: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleStarFn({ data: { id: d.id } });
      setDocuments((prev) =>
        prev.map((item) => (item.id === d.id ? { ...item, isStarred: !item.isStarred } : item)),
      );
      toast.success(d.isStarred ? "Đã bỏ gắn sao" : "Đã gắn sao tài liệu");
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi gắn sao");
    }
  };

  // Handle Document Download
  const handleDownload = async (d: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = await getUrlFn({ data: { id: d.id } });
      if (url) {
        window.open(url, "_blank", "noopener");
      } else if (d.filePath) {
        window.open(d.filePath, "_blank", "noopener");
      } else {
        toast.error("Không tìm thấy đường dẫn tệp tải về");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi tải tài liệu");
    }
  };

  // Handle Document Delete
  const handleDeleteDoc = async (d: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc muốn xóa tài liệu "${d.name}"?`)) return;
    try {
      await deleteDocFn({ data: { id: d.id } });
      toast.success("Đã xóa tài liệu");
      await reloadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa tài liệu");
    }
  };

  // Quick stats
  const totalFiles = documents.length;
  const totalFolders = folders.length;
  const totalCategories = categories.length;
  const totalStarred = documents.filter((d) => d.isStarred).length;

  return (
    <AppShell>
      {/* ── Page Header with Google Drive Style Action Bar ── */}
      <PageHeader
        title="Kho Tài Liệu Doanh Nghiệp"
        subtitle="Hệ thống lưu trữ đám mây chuẩn ViConnect Drive — Tạo thư mục phân cấp, phân loại danh mục nghiệp vụ và bảo mật hồ sơ doanh nghiệp."
        actions={
          <div className="flex items-center gap-3">
            {/* View Switcher: Grid vs List */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Chế độ Lưới"
                title="Chế độ Lưới"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-zinc-950 font-bold shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Chế độ Danh Sách"
                title="Chế độ Danh Sách"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-zinc-950 font-bold shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Hidden File Picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUploadFile(f);
                e.target.value = "";
              }}
            />

            {/* Dropdown Menu "+ Mới" (Google Drive Style) */}
            {canWrite && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  disabled={uploading}
                  className="inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold text-zinc-950 shadow-[0_4px_20px_rgba(216,178,130,0.35)] transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #8C653B 100%)",
                  }}
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>{uploading ? "Đang tải lên..." : "Tạo Mới"}</span>
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-13 z-40 w-56 rounded-2xl border border-slate-200 dark:border-[#D8B282]/40 bg-white dark:bg-slate-900 p-2 shadow-2xl backdrop-blur-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setEditingFolder(null);
                          setFolderNameInput("");
                          setFolderColorInput("#D8B282");
                          setFolderCategoryInput(
                            selectedCategory !== "all" ? selectedCategory : "Tài Liệu Doanh Nghiệp",
                          );
                          setIsFolderModalOpen(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-[#8C653B] dark:hover:text-[#F6E1C3]"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D8B282]/15 text-[#B38048] dark:text-[#D8B282]">
                          <FolderPlus className="h-4 w-4" />
                        </div>
                        <span>Tạo Thư Mục Mới</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setCategoryNameInput("");
                          setCategoryDescInput("");
                          setCategoryColorInput("#D8B282");
                          setIsCategoryModalOpen(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-[#8C653B] dark:hover:text-[#F6E1C3]"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                          <Tag className="h-4 w-4" />
                        </div>
                        <span>Tạo Danh Mục Mới</span>
                      </button>

                      <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          fileInputRef.current?.click();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-[#8C653B] dark:hover:text-[#F6E1C3]"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          <Upload className="h-4 w-4" />
                        </div>
                        <span>Tải Tệp Tin Lên</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setEditingDoc(null);
                          setDocNameInput("");
                          setDocCategoryInput(
                            selectedCategory !== "all"
                              ? selectedCategory
                              : categories[0]?.name || "Tài Liệu Doanh Nghiệp",
                          );
                          setDocTypeInput("pdf");
                          setDocSizeInput("1.0 MB");
                          setDocUploaderInput("Ban Giám Đốc");
                          setIsDocModalOpen(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-[#8C653B] dark:hover:text-[#F6E1C3]"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span>Thêm Tài Liệu Số Hóa</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        }
      />

      {/* ── KPI Stat Cards ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Tổng Số Tệp Tin"
          value={totalFiles}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          label="Thư Mục Đám Mây"
          value={totalFolders}
          tone="info"
          icon={<Folder className="h-4 w-4" />}
        />
        <StatCard
          label="Danh Mục Nghiệp Vụ"
          value={totalCategories}
          tone="primary"
          icon={<Tag className="h-4 w-4" />}
        />
        <StatCard
          label="Đã Gắn Dấu Sao"
          value={totalStarred}
          tone="warning"
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      {/* ── Category Chips Bar (Danh Mục Tài Liệu) ── */}
      <div className="mb-4 flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-zinc-950 shadow-md font-bold"
                : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#D8B282]/50 hover:text-slate-900 dark:hover:text-white shadow-sm"
            }`}
          >
            <span>Tất cả</span>
            <span className="text-[10px] opacity-80">({documents.length})</span>
          </button>

          {categories.map((c) => {
            const isSelected = selectedCategory === c.name;
            const count = documents.filter((d) => d.category === c.name).length;
            return (
              <div
                key={c.id}
                className="group relative inline-flex items-center"
              >
                <button
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? "all" : c.name)}
                  className={`inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "border border-[#D8B282] bg-amber-500/10 dark:bg-[#D8B282]/20 text-amber-800 dark:text-[#F6E1C3] shadow-sm font-bold"
                      : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: c.color || "#D8B282" }}
                  />
                  <span>{c.name}</span>
                  <span className="text-[10px] text-slate-400">({count})</span>
                </button>
              </div>
            );
          })}
        </div>

        {canWrite && (
          <button
            type="button"
            onClick={() => {
              setCategoryNameInput("");
              setCategoryDescInput("");
              setCategoryColorInput("#D8B282");
              setIsCategoryModalOpen(true);
            }}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-slate-300 dark:border-[#D8B282]/40 bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-700 dark:text-[#D8B282] hover:bg-slate-50 dark:hover:bg-[#D8B282]/10"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm Danh Mục</span>
          </button>
        )}
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="mb-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-3 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài liệu, hợp đồng, danh mục hoặc người tải..."
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-8 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#D8B282] focus:outline-none focus:ring-2 focus:ring-[#D8B282]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by File Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-[#D8B282] focus:outline-none"
            >
              <option value="all">Tất cả định dạng</option>
              <option value="pdf">Tệp PDF (.pdf)</option>
              <option value="docx">Văn bản Word (.docx)</option>
              <option value="xlsx">Bảng tính Excel (.xlsx)</option>
              <option value="pptx">Thuyết trình PPT (.pptx)</option>
            </select>

            {/* Filter by Starred */}
            <button
              type="button"
              onClick={() => setStarredOnly(!starredOnly)}
              className={`inline-flex h-11 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-all ${
                starredOnly
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Star
                className={`h-4 w-4 ${starredOnly ? "fill-amber-400 text-amber-500" : ""}`}
              />
              <span>Gắn sao</span>
            </button>

            {/* Sort Mode */}
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-[#D8B282] focus:outline-none"
            >
              <option value="newest">Mới nhất tải lên</option>
              <option value="oldest">Cũ nhất tải lên</option>
              <option value="nameAsc">Tên tài liệu (A → Z)</option>
              <option value="nameDesc">Tên tài liệu (Z → A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Google Drive Breadcrumbs Bar ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-[#D8B282]/20 bg-slate-50/80 dark:bg-slate-900/60 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {/* Back button if inside folder */}
          {currentFolder && (
            <button
              type="button"
              onClick={stepBackFolder}
              className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-sm"
              title="Quay lại thư mục trước"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          {/* Root Link */}
          <button
            type="button"
            onClick={navigateToRoot}
            className={`flex items-center gap-1.5 transition-colors ${
              !currentFolder
                ? "text-amber-700 dark:text-[#F6E1C3] font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-[#F6E1C3]"
            }`}
          >
            <Home className="h-4 w-4 text-[#B38048] dark:text-[#D8B282]" />
            <span>Kho Lưu Trữ</span>
          </button>

          {/* Hierarchy Path */}
          {folderHistory.map((f, idx) => {
            const isLast = idx === folderHistory.length - 1;
            return (
              <div key={f.id} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                <button
                  type="button"
                  onClick={() => navigateToBreadcrumb(idx)}
                  className={`transition-colors ${
                    isLast
                      ? "text-amber-700 dark:text-[#F6E1C3] font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-[#F6E1C3]"
                  }`}
                >
                  {f.name}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{currentFolders.length}</span> thư mục ·{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{currentDocuments.length}</span> tệp tin
        </div>
      </div>

      {/* ── FOLDERS SECTION (Google Drive Grid) ── */}
      {currentFolders.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
              <Folder className="h-4 w-4 text-[#B38048] dark:text-[#D8B282]" />
              <span>Thư Mục</span>
              <span className="text-xs font-normal text-slate-500">
                ({currentFolders.length})
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentFolders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => openFolder(folder)}
                className="group relative flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D8B282]/60 hover:bg-amber-50/20 dark:hover:bg-slate-800/90 hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${folder.color || "#D8B282"}30, ${folder.color || "#D8B282"}10)`,
                      color: folder.color || "#D8B282",
                    }}
                  >
                    <Folder className="h-5 w-5 fill-current" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-[#F6E1C3]">
                      {folder.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {folder.docCount || 0} tệp tin · {folder.category || "Chung"}
                    </p>
                  </div>
                </div>

                {canWrite && (
                  <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFolder(folder);
                        setFolderNameInput(folder.name);
                        setFolderColorInput(folder.color || "#D8B282");
                        setFolderCategoryInput(folder.category || "");
                        setIsFolderModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Đổi tên thư mục"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteFolder(folder, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                      title="Xóa thư mục"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FILES SECTION ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
            <FileText className="h-4 w-4 text-[#B38048] dark:text-[#D8B282]" />
            <span>Tệp Tin & Hồ Sơ</span>
            <span className="text-xs font-normal text-slate-500">
              ({currentDocuments.length})
            </span>
          </h3>
        </div>

        {/* Empty state when folder has neither folders nor files */}
        {currentFolders.length === 0 && currentDocuments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-[#D8B282]">
              <FolderOpen className="h-7 w-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Thư mục này hiện đang trống</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Hãy tải tệp tin lên hoặc tạo thư mục con mới để tổ chức hồ sơ doanh nghiệp.
            </p>
            {canWrite && (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:brightness-110"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Tải tệp tin lên ngay</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingFolder(null);
                    setFolderNameInput("");
                    setFolderColorInput("#D8B282");
                    setFolderCategoryInput(
                      selectedCategory !== "all" ? selectedCategory : "Tài Liệu Doanh Nghiệp",
                    );
                    setIsFolderModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                >
                  <FolderPlus className="h-3.5 w-3.5 text-[#B38048] dark:text-[#D8B282]" />
                  <span>Tạo thư mục con</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && currentDocuments.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentDocuments.map((doc) => {
              const typeCfg = TYPE_CONFIG[doc.type] || TYPE_CONFIG.pdf;
              const TypeIcon = typeCfg.icon;

              return (
                <div
                  key={doc.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D8B282]/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/80 hover:shadow-md"
                >
                  <div>
                    {/* Top Row: Icon + Star */}
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl font-bold uppercase shadow-sm"
                        style={{ background: typeCfg.bg, color: typeCfg.color }}
                      >
                        <TypeIcon className="h-5 w-5" />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleToggleStar(doc, e)}
                          className={`rounded-lg p-1.5 transition-colors ${
                            doc.isStarred
                              ? "text-amber-500 hover:bg-amber-400/10"
                              : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500"
                          }`}
                          title={doc.isStarred ? "Bỏ gắn sao" : "Gắn sao"}
                        >
                          <Star
                            className={`h-4 w-4 ${doc.isStarred ? "fill-amber-400 text-amber-500" : ""}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* File Title */}
                    <div className="mt-3">
                      <p
                        className="line-clamp-2 text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-[#F6E1C3]"
                        title={doc.name}
                      >
                        {doc.name.replace(/^https?:\/\/[^/]+\/[^/]+\/[^/]+\/[^/]+_/, "")}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="rounded bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 font-medium text-slate-700 dark:text-slate-300">
                          {doc.category || "Tài liệu"}
                        </span>
                        <span>·</span>
                        <span>{doc.size || "1.0 MB"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bottom Meta & Actions */}
                  <div className="mt-4 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    <div className="mb-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate">{doc.uploadedBy || "Ban Giám Đốc"}</span>
                      <span className="shrink-0">{fmt.date(doc.uploadedAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleDownload(doc, e)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-300 dark:border-[#D8B282]/30 bg-amber-500/10 py-1.5 text-xs font-semibold text-amber-800 dark:text-[#F6E1C3] transition-all hover:bg-amber-500/20"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Tải về</span>
                      </button>

                      {canWrite && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDoc(doc);
                              setDocNameInput(doc.name);
                              setDocCategoryInput(doc.category);
                              setDocTypeInput(doc.type);
                              setIsDocModalOpen(true);
                            }}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteDoc(doc, e)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Xóa"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View (Table) */}
        {viewMode === "list" && currentDocuments.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    <th className="w-10 px-3 py-3 text-center">Sao</th>
                    <th className="w-12 px-3 py-3 text-center">STT</th>
                    <th className="px-4 py-3">Tên Tài Liệu</th>
                    <th className="px-4 py-3">Danh Mục</th>
                    <th className="px-4 py-3">Định Dạng</th>
                    <th className="px-4 py-3">Kích Thước</th>
                    <th className="px-4 py-3">Người Tải Lên</th>
                    <th className="px-4 py-3">Ngày Tải Lên</th>
                    <th className="px-4 py-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {currentDocuments.map((doc, idx) => {
                    const typeCfg = TYPE_CONFIG[doc.type] || TYPE_CONFIG.pdf;
                    const TypeIcon = typeCfg.icon;

                    return (
                      <tr
                        key={doc.id}
                        className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => handleToggleStar(doc, e)}
                            className={`p-1 ${
                              doc.isStarred
                                ? "text-amber-500"
                                : "text-slate-400 hover:text-amber-500"
                            }`}
                          >
                            <Star
                              className={`h-4 w-4 ${doc.isStarred ? "fill-amber-400" : ""}`}
                            />
                          </button>
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-xs text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold uppercase text-[10px]"
                              style={{ background: typeCfg.bg, color: typeCfg.color }}
                            >
                              <TypeIcon className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-[#F6E1C3]">
                              {doc.name.replace(/^https?:\/\/[^/]+\/[^/]+\/[^/]+\/[^/]+_/, "")}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          <span className="rounded-md bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300">
                            {doc.category || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs uppercase text-slate-500 dark:text-slate-400">
                          {doc.type}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{doc.size}</td>
                        <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">
                          {doc.uploadedBy || "Ban Giám Đốc"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                          {fmt.date(doc.uploadedAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleDownload(doc, e)}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 dark:border-[#D8B282]/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-[#F6E1C3] hover:bg-amber-500/20"
                            >
                              <Download className="h-3 w-3" />
                              <span>Tải</span>
                            </button>
                            {canWrite && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingDoc(doc);
                                    setDocNameInput(doc.name);
                                    setDocCategoryInput(doc.category);
                                    setDocTypeInput(doc.type);
                                    setIsDocModalOpen(true);
                                  }}
                                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                  title="Chỉnh sửa"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteDoc(doc, e)}
                                  className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                  title="Xóa"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── MODAL: TẠO / SỬA THƯ MỤC MỚI ── */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#D8B282]/40 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-amber-700 dark:text-[#F6E1C3]">
                <FolderPlus className="h-5 w-5 text-[#B38048] dark:text-[#D8B282]" />
                <span>{editingFolder ? "Đổi Tên Thư Mục" : "Tạo Thư Mục Mới"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsFolderModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFolderSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tên Thư Mục <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={folderNameInput}
                  onChange={(e) => setFolderNameInput(e.target.value)}
                  placeholder="Ví dụ: Hợp Đồng Kinh Doanh Q4, Hồ Sơ Pháp Lý..."
                  className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#D8B282] focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Thuộc Danh Mục
                </label>
                <select
                  value={folderCategoryInput}
                  onChange={(e) => setFolderCategoryInput(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-slate-200 focus:border-[#D8B282] focus:outline-none"
                >
                  <option value="Tài Liệu Doanh Nghiệp">Tài Liệu Doanh Nghiệp (Mặc định)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Màu Sắc Thư Mục
                </label>
                <div className="flex items-center gap-2">
                  {FOLDER_COLORS.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => setFolderColorInput(col.value)}
                      title={col.label}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        folderColorInput === col.value
                          ? "border-slate-900 dark:border-white scale-110 shadow-lg"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ background: col.value }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-5 py-2 text-xs font-bold text-zinc-950 shadow-md hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #8C653B 100%)",
                  }}
                >
                  {editingFolder ? "Lưu Thay Đổi" : "Tạo Thư Mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: TẠO DANH MỤC MỚI ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#D8B282]/40 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-amber-700 dark:text-[#F6E1C3]">
                <Tag className="h-5 w-5 text-[#B38048] dark:text-[#D8B282]" />
                <span>Tạo Danh Mục Tài Liệu Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tên Danh Mục <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  placeholder="Ví dụ: Pháp Lý, Hợp Đồng, Nhân Sự..."
                  className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#D8B282] focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mô Tả Danh Mục
                </label>
                <textarea
                  rows={3}
                  value={categoryDescInput}
                  onChange={(e) => setCategoryDescInput(e.target.value)}
                  placeholder="Mô tả phạm vi tài liệu thuộc danh mục này..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#D8B282] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Màu Nhãn Danh Mục
                </label>
                <div className="flex items-center gap-2">
                  {FOLDER_COLORS.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => setCategoryColorInput(col.value)}
                      title={col.label}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        categoryColorInput === col.value
                          ? "border-slate-900 dark:border-white scale-110 shadow-lg"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ background: col.value }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-5 py-2 text-xs font-bold text-zinc-950 shadow-md hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #8C653B 100%)",
                  }}
                >
                  Tạo Danh Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: TẠO / SỬA TÀI LIỆU ── */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#D8B282]/40 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-amber-700 dark:text-[#F6E1C3]">
                <FileText className="h-5 w-5 text-[#B38048] dark:text-[#D8B282]" />
                <span>{editingDoc ? "Chỉnh Sửa Tài Liệu" : "Thêm Tài Liệu Số Hóa"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDocSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tên Tài Liệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={docNameInput}
                  onChange={(e) => setDocNameInput(e.target.value)}
                  placeholder="Nhập tên tài liệu hồ sơ..."
                  className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#D8B282] focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Danh Mục Tài Liệu
                </label>
                <select
                  value={docCategoryInput}
                  onChange={(e) => setDocCategoryInput(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-slate-200 focus:border-[#D8B282] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {!editingDoc && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Định Dạng Tệp
                    </label>
                    <select
                      value={docTypeInput}
                      onChange={(e) => setDocTypeInput(e.target.value as any)}
                      className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-slate-200 focus:border-[#D8B282] focus:outline-none"
                    >
                      <option value="pdf">PDF (.pdf)</option>
                      <option value="docx">Word (.docx)</option>
                      <option value="xlsx">Excel (.xlsx)</option>
                      <option value="pptx">PowerPoint (.pptx)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Kích Thước
                    </label>
                    <input
                      type="text"
                      value={docSizeInput}
                      onChange={(e) => setDocSizeInput(e.target.value)}
                      placeholder="Ví dụ: 2.5 MB"
                      className="h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-slate-200 focus:border-[#D8B282] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-5 py-2 text-xs font-bold text-zinc-950 shadow-md hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #8C653B 100%)",
                  }}
                >
                  {editingDoc ? "Lưu Thay Đổi" : "Tạo Tài Liệu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
