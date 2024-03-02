import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  request:Request
) {
  const body = await request.json()

  const {
    name,
    email,
    password
  } = body

  //パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash(password, 12)

  //新しいユーザを作成し、データベースへ登録
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword
    }
  })

  //作成したユーザの情報をJSONにしてクライアント側へ返している
  return NextResponse.json(user)
}