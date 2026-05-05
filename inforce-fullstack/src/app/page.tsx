import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-20 text-center">
      <p className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">
        Welcome
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/books"
          className="rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#fff9f0] transition hover:bg-[var(--accent-soft)]"
        >
          Books
        </Link>
      </div>
    </section>
  );
}
