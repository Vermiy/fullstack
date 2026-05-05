import { useRouter } from "next/router";
import { useEffect } from "react";
import { IUserRole } from "../types/UserRoles";
import { IUser } from "../types/UserType";

export function useAdminGuard(user: IUser | null, loading: boolean) {
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push("/login");
            return;
        }

        const isAdmin = user.roles?.includes(IUserRole.ADMIN);

        if (!isAdmin) {
            router.push("/forbidden");
        }
    }, [user, loading, router]);
}
