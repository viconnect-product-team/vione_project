import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Check, Users, User, CheckSquare, Square } from "lucide-react";
import { fetchNestApi } from "@/lib/api-client";

export interface SelectUserOption {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  roleTitle?: string | null;
  department?: string | null;
  avatarUrl?: string | null;
}

interface UserMultiSelectProps {
  companyId?: string;
  value: string[]; // List of selected IDs
  onChange: (selectedIds: string[], selectedUsers: SelectUserOption[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

export function UserMultiSelect({
  companyId,
  value = [],
  onChange,
  placeholder = "Tìm và chọn nhân sự...",
  isMulti = true,
  disabled = false,
  label,
  required = false,
}: UserMultiSelectProps) {
  const [users, setUsers] = useState<SelectUserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      setLoading(true);
      try {
        let endpoint = companyId ? `/companies/${companyId}/employees` : `/members`;
        const res = await fetchNestApi<any[]>(endpoint).catch(() => []);
        if (isMounted && Array.isArray(res)) {
          const mapped: SelectUserOption[] = res.map((u: any) => ({
            id: u.id || u.userId || u.user_id,
            fullName: u.fullName || u.name || "Nhân sự",
            email: u.email || null,
            phone: u.phone || null,
            roleTitle: u.roleTitle || u.executive_role || u.role || "Thành viên",
            department: u.department || "Khối Vận Hành",
            avatarUrl: u.avatarUrl || u.avatar || null,
          }));
          setUsers(mapped);
        }
      } catch (err) {
        console.error("[UserMultiSelect] Error loading users:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.roleTitle && u.roleTitle.toLowerCase().includes(q)),
    );
  }, [users, search]);

  const selectedUsers = useMemo(() => {
    return users.filter((u) => value.includes(u.id));
  }, [users, value]);

  const toggleUser = (userId: string) => {
    if (disabled) return;
    if (isMulti) {
      const nextIds = value.includes(userId)
        ? value.filter((id) => id !== userId)
        : [...value, userId];
      const nextUsers = users.filter((u) => nextIds.includes(u.id));
      onChange(nextIds, nextUsers);
    } else {
      const nextIds = value.includes(userId) ? [] : [userId];
      const nextUsers = users.filter((u) => nextIds.includes(u.id));
      onChange(nextIds, nextUsers);
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const allFilteredIds = filteredUsers.map((u) => u.id);
    const combinedIds = Array.from(new Set([...value, ...allFilteredIds]));
    const nextUsers = users.filter((u) => combinedIds.includes(u.id));
    onChange(combinedIds, nextUsers);
  };

  const handleDeselectAll = () => {
    if (disabled) return;
    onChange([], []);
  };

  const removeUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const nextIds = value.filter((id) => id !== userId);
    const nextUsers = users.filter((u) => nextIds.includes(u.id));
    onChange(nextIds, nextUsers);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || "U").toUpperCase();
  };

  return (
    <div className="relative w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      {/* Selected chips bar */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`min-h-[42px] w-full rounded-xl border border-border/80 bg-background/80 px-3 py-2 text-sm backdrop-blur transition cursor-pointer flex flex-wrap items-center gap-1.5 ${
          disabled ? "opacity-60 cursor-not-allowed" : "hover:border-primary/50 focus-within:border-primary"
        }`}
      >
        {selectedUsers.length === 0 ? (
          <span className="text-muted-foreground text-xs select-none">
            {loading ? "Đang tải danh sách nhân sự..." : placeholder}
          </span>
        ) : (
          selectedUsers.map((u) => (
            <span
              key={u.id}
              className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 border border-primary/20 px-2 py-0.5 text-xs font-medium text-foreground shadow-sm"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                {getInitials(u.fullName)}
              </span>
              <span>{u.fullName}</span>
              <button
                type="button"
                onClick={(e) => removeUser(u.id, e)}
                className="text-muted-foreground hover:text-destructive transition ml-0.5 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-hidden rounded-xl border border-border bg-card shadow-2xl backdrop-blur-md">
            {/* Search and bulk actions */}
            <div className="border-b border-border/60 p-2.5 space-y-2 bg-muted/20">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm theo tên, phòng ban, chức vụ..."
                  className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>

              {isMulti && (
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span>
                    Đã chọn <strong className="text-primary font-semibold">{value.length}</strong> / {users.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="hover:text-primary transition underline cursor-pointer"
                    >
                      Chọn tất cả ({filteredUsers.length})
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="hover:text-destructive transition underline cursor-pointer"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* List */}
            <div className="max-h-52 overflow-y-auto p-1 divide-y divide-border/20">
              {loading ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  Đang tải danh sách nhân sự...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  Không tìm thấy nhân sự phù hợp
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = value.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => toggleUser(u.id)}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      {isMulti ? (
                        isSelected ? (
                          <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                        )
                      ) : isSelected ? (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      ) : null}

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-[11px] font-bold">
                        {getInitials(u.fullName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{u.fullName}</div>
                        <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1.5">
                          <span>{u.roleTitle}</span>
                          <span>•</span>
                          <span>{u.department}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
