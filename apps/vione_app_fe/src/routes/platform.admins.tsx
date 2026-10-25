import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PlatformShell } from "@/components/platform/PlatformShell";
import { Card } from "@/components/dashboard/PageKit";
import { useRole } from "@/hooks/use-role";
import { useT } from "@/lib/i18n";
import { PlatformStaffManagement } from "@/components/platform/PlatformStaffManagement";

export const Route = createFileRoute("/platform/admins")({
  component: PlatformAdminsPage,
});

function PlatformAdminsPage() {
  const t = useT();
  const { isAdmin, isQuanTri, isSuperAdmin, loading: roleLoading } = useRole();

  if (!roleLoading && !isAdmin && !isQuanTri && !isSuperAdmin) {
    return (
      <PlatformShell>
        <Card className="p-10 text-center text-sm text-muted-foreground">
          <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          {t("platform.forbidden") || "Tính năng chỉ dành riêng cho Ban Quản Trị ViOne"}
        </Card>
      </PlatformShell>
    );
  }

  return (
    <PlatformShell>
      <PlatformStaffManagement />
    </PlatformShell>
  );
}
