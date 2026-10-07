import { Download } from "lucide-react";
import { ConfirmSubmit } from "@/components/admin/AdminUI";
import { deleteSubscriber } from "@/lib/admin/actions";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function SubscribersPage() {
  const subs = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Newsletter subscribers</h1>
        <a href="/api/admin/export?type=subscribers" className="inline-flex h-10 items-center gap-2 rounded-full border border-line/15 px-4 text-sm font-semibold hover:border-purple/50">
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>
      <ul className="glass divide-y divide-line/10 rounded-4xl">
        {subs.map((s) => (
          <li key={s.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <span className="font-medium">{s.email}</span>
            <span className="flex items-center gap-3 text-muted">
              {formatDate(s.createdAt)}
              <form action={deleteSubscriber.bind(null, s.id)}>
                <ConfirmSubmit label="" message={`Remove ${s.email}?`} />
              </form>
            </span>
          </li>
        ))}
        {!subs.length && <li className="p-10 text-center text-muted">No subscribers yet.</li>}
      </ul>
    </div>
  );
}
