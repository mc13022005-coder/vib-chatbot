"use client"

import { Plus, MessageSquare, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter()
  
  // Mock history (tạm thời)
  const history = [
    { id: "1", title: "Phân tích mã VIB hôm nay" },
    { id: "2", title: "Lãi suất ngân hàng VIB" },
    { id: "3", title: "So sánh thẻ tín dụng" },
  ]

  const handleLogout = async () => {
    // Tạm thời chưa có Supabase auth
    router.push("/login")
  }

  return (
    <div className={cn("flex flex-col h-full bg-slate-50 border-r w-64", className)}>
      <div className="p-4">
        <Button className="w-full justify-start gap-2 bg-[#f37021] hover:bg-[#d65d1a] text-white font-semibold rounded-xl transition-all shadow-sm">
          <Plus className="size-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Recent History</p>
          {history.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors group"
            >
              <MessageSquare className="size-4 text-slate-400 group-hover:text-[#004b8d]" />
              <span className="truncate">{item.title}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-slate-100/50 space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-slate-200 h-9 px-3">
          <Settings className="size-4 text-slate-500" />
          <span className="text-sm">Settings</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 hover:bg-red-50 hover:text-red-600 h-9 px-3 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          <span className="text-sm">Đăng xuất</span>
        </Button>
      </div>
    </div>
  )
}
