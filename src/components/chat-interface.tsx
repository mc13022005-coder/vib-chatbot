"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Chào mừng bạn đến với **VIB Smart Support**. Tôi có thể giúp gì cho bạn về mã cổ phiếu VIB và các sản phẩm của ngân hàng?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }]
    
    setInput("")
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) throw new Error("Failed to fetch response")

      const reader = response.body?.getReader()
      if (!reader) return

      let assistantResponse = ""
      setMessages(prev => [...prev, { role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        assistantResponse += chunk
        
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1].content = assistantResponse
          return updated
        })
      }
    } catch (error) {
      console.error("Error chatting:", error)
      setMessages(prev => [...prev, { role: "assistant", content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#004b8d] p-2 rounded-xl">
            <Bot className="size-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 tracking-tight">VIB Smart Support</h1>
            <div className="flex items-center gap-1.5">
              <span className="size-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Hệ thống RAG AI</span>
            </div>
          </div>
        </div>
      </header>

      <ScrollArea ref={scrollRef} className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className={`size-9 border-2 ${message.role === "user" ? "bg-slate-100 border-slate-200" : "bg-[#004b8d] border-[#004b8d]"}`}>
                  {message.role === "user" ? <User className="size-5 text-slate-600" /> : <Bot className="size-5 text-white" />}
                </Avatar>
                <div className={`flex flex-col gap-1 max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <Card className={`p-4 shadow-sm ${
                    message.role === "user" 
                      ? "bg-[#004b8d] text-white border-none rounded-2xl rounded-tr-none" 
                      : "bg-slate-50 border-slate-200 rounded-2xl rounded-tl-none"
                  }`}>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && !messages[messages.length - 1].content && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <Avatar className="size-9 bg-[#004b8d] border-[#004b8d]">
                <Bot className="size-5 text-white" />
              </Avatar>
              <Card className="p-4 bg-slate-50 border-slate-200 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="size-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent sticky bottom-0">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#004b8d] to-[#f37021] rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition-opacity duration-500" />
          <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden focus-within:border-[#004b8d]/50 transition-colors">
            <Textarea
              placeholder="Hỏi về mã cổ phiếu VIB hoặc lãi suất tiết kiệm..."
              className="min-h-[60px] max-h-[200px] border-none focus-visible:ring-0 resize-none p-4 pr-14 text-sm scrollbar-hide"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <div className="absolute right-3 bottom-3 flex gap-2">
               <Button 
                size="icon" 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className="size-9 bg-[#f37021] hover:bg-[#d65d1a] text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-400 mt-3 font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="size-3 text-[#f37021]" />
            AI có thể nhầm lẫn. Vui lòng kiểm tra lại thông tin quan trọng.
          </p>
        </div>
      </div>
    </div>
  )
}
