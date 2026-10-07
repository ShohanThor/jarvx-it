import { PasswordForm } from "@/components/admin/AdminUI";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <PasswordForm />
    </div>
  );
}
