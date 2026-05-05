"use client";

import { IUser } from "@/src/types/UserType";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GetUserById } from "@/src/services/user.services";

export default function User() {
  const params = useParams();
  const userId = params.id as string;

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => GetUserById(userId),
  });

  if (isLoading) {
    return <div className="px-6 py-10 text-[#6d5438]">Loading user...</div>;
  }

  if (error || !user) {
    return <div className="px-6 py-10 text-(--danger)">Failed to load user</div>;
  }
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="rounded-2xl border border-(--border) bg-(--surface) p-8 shadow-[0_14px_30px_rgba(117,74,28,0.1)]">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-3xl font-bold">{user.name}</h1>
          </div>

          <div className="space-y-4">
            <div className="border-b border-(--border) pb-4">
              <label className="block text-sm font-medium text-[#5d462f]">Email</label>
              <p className="text-foreground mt-1">{user.email}</p>
            </div>

            <div className="border-b border-(--border) pb-4">
              <label className="block text-sm font-medium text-[#5d462f]">User ID</label>
              <p className="text-foreground mt-1">{user.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5d462f]">Roles</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role, idx) => (
                    <span
                      key={idx}
                      className="inline-block rounded-full bg-(--accent) px-3 py-1 text-sm font-medium text-[#fff9f0]"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <p className="text-[#6d5438]">No roles assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
