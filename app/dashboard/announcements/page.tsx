import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";

export default async function AnnouncementsPage() {
  await requireAuth("announcements");

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const priorityStyle: Record<string, string> = {
    URGENT: "badge-danger",
    HIGH:   "badge-warning",
    NORMAL: "badge-info",
    LOW:    "badge-neutral",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-0.5">Send notifications to staff, teachers, and parents</p>
        </div>
        <Link href="/dashboard/announcements/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Megaphone className="empty-state-icon" />
            <p className="empty-state-text">No announcements yet</p>
            <p className="empty-state-sub">Create your first announcement to notify staff and parents</p>
            <Link href="/dashboard/announcements/new" className="btn-primary mt-4">+ New Announcement</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-navy-900 text-[14px]">{a.title}</h3>
                  <span className={`badge ${priorityStyle[a.priority] ?? "badge-neutral"}`}>{a.priority}</span>
                </div>
                <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{a.createdAt.toLocaleDateString()}</span>
              </div>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{a.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider">Audience: {a.audience}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
