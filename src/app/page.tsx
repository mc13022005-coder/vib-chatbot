import { Sidebar } from "@/components/sidebar"
import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-white overflow-hidden">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 h-full relative">
        <ChatInterface />
      </div>
    </main>
  )
}
