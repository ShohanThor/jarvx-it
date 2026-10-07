import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/AdminUI";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden p-5">
      <div aria-hidden className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-purple/25 blur-[120px]" />
      <div className="relative w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
