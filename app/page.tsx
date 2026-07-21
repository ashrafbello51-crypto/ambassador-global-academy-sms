import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">School Management System</h1>
        <p className="text-gray-600 mb-4">
          Welcome, {session?.user?.name || session?.user?.email || "User"}
        </p>
        <p className="text-sm text-gray-400">
          Role: {session?.user?.role || "Unknown"} | Dashboard coming soon
        </p>
      </div>
    </div>
  );
}
