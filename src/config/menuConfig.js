import {
  Home,
  Users,
  Wallet,
  Bell,
  User,
} from "lucide-react";

export const MENU_CONFIG = [
  {
    to: "/",
    label: "الرئيسية",
    icon: Home,
    roles: ["resident", "union_head", "guest"], // الكل يشوفها
  },
  {
    to: "/profile",
    label: "الملف الشخصي",
    icon: User,
    roles: ["resident", "union_head"],
  },

  {
    to: "/residents",
    label: "السكان",
    icon: Users,
    roles: ["union_head"],
  },
  {
    to: "/payments/wallet",
    label: "المحفظة",
    icon: Wallet,
    roles: ["resident", "union_head"],
  },
  {
    to: "/notifications",
    label: "الإشعارات",
    icon: Bell,
    roles: ["resident", "union_head"],
  },
];
