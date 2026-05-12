import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  modelName: "text-embedding-004",
})

async function ingestData() {
  try {
    const dataPath = path.join(process.cwd(), 'data/vib_info.md')
    const text = fs.readFileSync(dataPath, 'utf8')

    console.log("--- Bắt đầu xử lý dữ liệu ---")

    // 1. Chia nhỏ văn bản (Chunking)
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    })
    const docs = await splitter.createDocuments([text])
    console.log(`Đã chia thành ${docs.length} đoạn văn bản.`)

    // 2. Tạo Embeddings và lưu vào Supabase
    for (const doc of docs) {
      console.log(`Đang tạo embedding cho đoạn: ${doc.pageContent.substring(0, 50)}...`)
      
      const embedding = await embeddings.embedQuery(doc.pageContent)

      const { error } = await supabase.from('documents').insert({
        content: doc.pageContent,
        metadata: doc.metadata,
        embedding: embedding
      })

      if (error) {
        console.error("Lỗi khi chèn dữ liệu vào Supabase:", error)
      }
    }

    console.log("--- Hoàn tất Ingestion! ---")
  } catch (err) {
    console.error("Lỗi hệ thống:", err)
  }
}

ingestData()
