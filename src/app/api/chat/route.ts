import { NextRequest, NextResponse } from "next/server"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import fs from "fs"
import path from "path"

// Đọc dữ liệu VIB từ file markdown làm context
let vibContext = ""
try {
  vibContext = fs.readFileSync(
    path.join(process.cwd(), "data", "vib_info.md"),
    "utf-8"
  )
} catch (e) {
  console.warn("Không tìm thấy file data/vib_info.md, sử dụng context rỗng.")
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1].content

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey || apiKey === "your_gemini_api_key") {
      return NextResponse.json(
        { error: "Vui lòng cấu hình GOOGLE_GENERATIVE_AI_API_KEY trong file .env.local" },
        { status: 500 }
      )
    }

    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-2.0-flash",
      apiKey,
      streaming: true,
      temperature: 0.2,
    })

    // Xây dựng Prompt
    const prompt = PromptTemplate.fromTemplate(`
      Bạn là Trợ lý AI chuyên nghiệp của Ngân hàng VIB (Vietnam International Bank).
      Nhiệm vụ của bạn là hỗ trợ khách hàng trả lời các câu hỏi về mã cổ phiếu VIB, lãi suất, thẻ tín dụng và các sản phẩm dịch vụ dựa trên ngữ cảnh được cung cấp.

      QUY TẮC:
      1. Chỉ sử dụng thông tin từ PHẦN NGỮ CẢNH dưới đây. 
      2. Nếu không thấy thông tin trong ngữ cảnh, hãy lịch sự trả lời rằng bạn không có dữ liệu chính xác về vấn đề này và khuyên khách hàng liên hệ tổng đài VIB 1800 8180.
      3. Giữ phong thái chuyên nghiệp, tin cậy và thân thiện.
      4. Định dạng câu trả lời bằng Markdown (in đậm, danh sách) để dễ đọc.

      PHẦN NGỮ CẢNH:
      {context}

      LỊCH SỬ TRÒ CHUYỆN:
      {history}

      CÂU HỎI CỦA NGƯỜI DÙNG:
      {question}

      TRẢ LỜI:
    `)

    // Chuẩn bị lịch sử
    const history = messages
      .slice(0, -1)
      .map((m: any) => `${m.role === 'user' ? 'Người dùng' : 'AI'}: ${m.content}`)
      .join("\n")

    // Stream kết quả
    const chain = RunnableSequence.from([
      prompt,
      model,
      new StringOutputParser(),
    ])

    const langchainStream = await chain.stream({
      context: vibContext,
      question: lastMessage,
      history: history || "Không có",
    })

    // Chuyển đổi LangChain stream sang Web ReadableStream
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of langchainStream) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })

  } catch (error: any) {
    console.error("Lỗi API Chat:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
