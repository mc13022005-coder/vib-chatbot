"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Tạm thời bypass login khi chưa có Supabase
    // Redirect thẳng về trang chính
    router.push("/")
    router.refresh()
  }

  const handleSignUp = async () => {
    setError("Chức năng đăng ký cần cấu hình Supabase. Vui lòng thêm SUPABASE_URL và ANON_KEY vào .env.local")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#004b8d] p-3 rounded-2xl">
              <Bot className="size-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">VIB Smart Support</CardTitle>
          <CardDescription>
            Đăng nhập để bắt đầu trò chuyện với trợ lý AI
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 text-red-500 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-slate-200"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full bg-[#004b8d] hover:bg-[#003a6d] text-white rounded-xl h-11 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-slate-200 text-slate-600 rounded-xl h-11 font-medium"
              onClick={handleSignUp}
              disabled={isLoading}
            >
              Đăng ký tài khoản mới
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
