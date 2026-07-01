import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopNav } from "@/components/dashboard/TopNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col">
        <TopNav />
        <main className="flex-1 w-full max-w-[1800px] mx-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
