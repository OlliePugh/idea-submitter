import { isValidPayload } from "@/utils/validate";
import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(_: Request) {
  // Do whatever you want
  return NextResponse.json({ error: "Page not found" }, { status: 404 });
}

// To handle a POST request to /api
export async function POST(request: Request) {
  const payload = await request.json();
  if (!isValidPayload(payload)) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }
  console.log(payload);
  return NextResponse.json({ message: "Submitted" }, { status: 200 });
}
