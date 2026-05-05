import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-2xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[0_14px_30px_rgba(117,74,28,0.1)]">
        <h1 className="text-3xl font-bold text-[var(--danger)]">403 - Access Denied</h1>

        <p className="mt-3 text-[#6f5437]">You do not have permission to access this page.</p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 font-semibold text-[#fff9f0] transition hover:bg-[var(--accent-soft)]"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
}
