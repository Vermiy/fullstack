"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  getCurrentUser,
  Login as LoginService,
  normalizeUser,
  setAccessToken,
} from "@/src/services/auth.services";
import { useUser } from "@/src/store/UserContext";
import { isValidEmail } from "@/src/utils/validation";

export default function Auth() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { email: string; password: string }) => LoginService(data),
    onSuccess: async (response: {
      id: number;
      name: string;
      email: string;
      role?: string;
      roles?: string[];
      accessToken?: string;
    }) => {
      try {
        if (response.accessToken) {
          setAccessToken(response.accessToken);
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(normalizeUser(response));
        }
      } catch (err) {
        console.error(err);
        setUser(normalizeUser(response));
      }

      router.push("/books");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      alert("Email is required");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      alert("Password is required");
      return;
    }

    mutate({ email: trimmedEmail, password });
  };

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-6 py-12">
      <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_14px_30px_rgba(117,74,28,0.1)]">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Login</h1>
        <p className="mt-1 text-sm text-[#6e5438]">Welcome back to your reading account.</p>

        {isError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error instanceof Error ? error.message : "Login failed. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5d462f]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--foreground)] transition outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[#e6d0af]"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d462f]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--foreground)] transition outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[#e6d0af]"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-[var(--accent)] py-2.5 font-semibold text-[#fff9f0] transition hover:bg-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-[#6f5437]">
          New here?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[var(--accent)] hover:text-[var(--accent-soft)]"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
