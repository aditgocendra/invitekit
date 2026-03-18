import { auth } from "@/lib/auth";
import { listPrefixFiles } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const list = await listPrefixFiles({
    bucket: process.env.S3_BUCKET_NAME!,
    prefix: "audio",
  });
  return NextResponse.json({ data: list }, { status: 200 });
}
