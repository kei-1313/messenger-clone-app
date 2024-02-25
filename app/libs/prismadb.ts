import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

// この条件文は、開発環境でのみPrismaClientインスタンスをグローバルに保存するようにしています。
// これは、開発中にホットリロードなどの機能を使用すると、アプリケーションが何度も再起動されるため、
// その都度新しいデータベース接続が作成されるのを防ぐためです。プロダクション環境では、
// このような再起動は頻繁には発生しないため、この処理は不要です。
const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export default client