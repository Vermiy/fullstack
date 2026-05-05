import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-strong)]/95 px-6 py-4 shadow-[0_8px_26px_rgba(117,74,28,0.1)] backdrop-blur">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-bold tracking-wide text-[var(--foreground)]">Admin</h1>

        <nav className="flex items-center gap-4 text-sm font-semibold text-[var(--accent)]">
          <Link href="/books" className="transition hover:text-[var(--accent-soft)]">
            Books
          </Link>
          <Link href="/users" className="transition hover:text-[var(--accent-soft)]">
            Users
          </Link>
        </nav>
      </div>

      <LogoutButton className="rounded-lg border border-[#cfb089] bg-[#f0d8b5] px-4 py-2 text-sm font-semibold text-[#3d2b1c] transition hover:bg-[#e8c89a]" />
    </header>
  );
}
