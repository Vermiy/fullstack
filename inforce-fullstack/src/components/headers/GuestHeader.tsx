import Link from "next/link";

export default function GuestHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/95 px-6 py-4 shadow-[0_6px_24px_rgba(117,74,28,0.08)] backdrop-blur">
      <h1 className="text-xl font-semibold tracking-wide text-[var(--foreground)]">Guest</h1>
      <nav className="flex items-center gap-4 text-sm font-medium text-[var(--accent)]">
        <Link href="/books" className="transition hover:text-[var(--accent-soft)]">
          Books
        </Link>
      </nav>

      <Link
        href="/login"
        className="rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#fff9f0] transition hover:bg-[var(--accent-soft)]"
      >
        Login
      </Link>
    </header>
  );
}
