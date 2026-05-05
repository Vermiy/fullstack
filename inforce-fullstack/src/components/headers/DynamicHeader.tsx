"use client";

import AdminHeader from "./AdminHeader";
import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";
import { useUser } from "../../store/UserContext";
import { IUserRole } from "../../types/UserRoles";

export default function DynamicHeader() {
  const { user, loading } = useUser();

  if (loading) return null;

  if (!user) return <GuestHeader />;

  const roles = user.roles || [];

  if (roles.includes(IUserRole.ADMIN)) return <AdminHeader />;
  if (roles.includes(IUserRole.USER)) return <UserHeader />;

  return <GuestHeader />;
}
