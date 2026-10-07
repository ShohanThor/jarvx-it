import { Sidebar } from "@/components/admin/AdminUI";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [leads, applications] = await Promise.all([db.lead.count({ where: { status: "new" } }), db.application.count({ where: { status: "new" } })]);
  return (
    <div className="min-h-screen">
      <Sidebar email={session.email} counts={{ leads, applications }} />
      <main className="px-4 pb-16 pt-20 lg:ml-[17.5rem] lg:px-8 lg:pt-8">{children}</main>
    </div>
  );
}
