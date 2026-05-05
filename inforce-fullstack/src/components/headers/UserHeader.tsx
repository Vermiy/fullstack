import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function UserHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/95 px-6 py-4 shadow-[0_6px_24px_rgba(117,74,28,0.08)] backdrop-blur">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-bold tracking-wide text-[var(--foreground)]">User</h1>

        <nav className="flex items-center gap-4 text-sm font-medium text-[var(--accent)]">
          <Link href="/books" className="transition hover:text-[var(--accent-soft)]">
            Books
          </Link>
        </nav>
      </div>

      <LogoutButton className="rounded-lg border border-[#c8b69e] bg-[#f7efe1] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[#f2e3cd]" />
    </header>
  );
}
