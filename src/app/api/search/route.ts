import { NextResponse } from "next/server";
import { getProvider } from "@/lib/api/henrik-provider";
import { ApiError } from "@/lib/api/http-client";

export async function POST(request: Request) {
  try {
    const { name, tag } = await request.json();

    if (!name || !tag) {
      return NextResponse.json(
        { error: "Name and tag are required", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const provider = getProvider();
    const account = await provider.getAccountByRiotId(name, tag);

    return NextResponse.json({ data: account });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.userFriendlyMessage, code: `HENRIK_${error.henrikCode}` },
        { status: error.status }
      );
    }
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message, code: "UNKNOWN" }, { status: 500 });
  }
}
