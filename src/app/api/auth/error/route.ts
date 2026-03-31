import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  return NextResponse.json(
    { error, error_description: errorDescription },
    { status: 400 },
  );
}
