"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, LogOut, Bell, ChevronDown } from "lucide-react";
import { school } from "@/lib/school";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleDisplay = session?.user?.role
    ? session.user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title area — shown on desktop */}
        <div className="hidden sm:block">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">
            {school.name}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {/* Red dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full border-2 border-white" />
        </button>

        {/* User chip */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {/* Avatar circle */}
            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold text-navy-900 leading-tight">
                {session?.user?.name?.split(" ")[0] || "User"}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">{roleDisplay}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-card-lg z-20 py-1.5 overflow-hidden"
                style={{ border: "1px solid rgba(0,0,0,0.08)" }}>

                {/* User info */}
                <div className="px-4 py-3 flex items-center gap-3"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-navy-900 truncate">{session?.user?.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{session?.user?.email}</p>
                  </div>
                </div>

                {/* School */}
                <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">School</p>
                  <p className="text-[13px] text-navy-900 font-medium mt-0.5">{school.name}</p>
                </div>

                {/* Sign out */}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-gray-400" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
