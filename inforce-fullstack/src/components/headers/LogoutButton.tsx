"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logout } from "@/src/services/auth.services";
import { useUser } from "@/src/store/UserContext";

export default function LogoutButton({ className }: { className: string }) {
  const router = useRouter();
  const { setUser } = useUser();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    if (isPending) return;

    setIsPending(true);

    try {
      await Logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setIsPending(false);
      router.push("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
