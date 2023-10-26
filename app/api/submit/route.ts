import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp({
    //@ts-ignore
    credential: admin.credential.cert(
      JSON.parse(process.env.SERVICE_ACCOUNT_KEY!)
    ),
  });
}

import { isValidPayload } from "@/utils/validate";
import { NextResponse } from "next/server";
import config from "@/config";

export async function GET(_: Request) {
  return NextResponse.json({ error: "Page not found" }, { status: 404 });
}

const getUser = async (token: string | null): Promise<string | null> => {
  if (token == null) return null;

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(token);
    return decodedIdToken.uid;
  } catch (e) {
    console.error("Something went wrong trying to extra UID");
    return null;
  }
};

export async function POST(request: Request) {
  const payload = await request.json();
  const user = await getUser(request.headers.get("Authorization"));

  if (config.features.forcedAuth && user == null) {
    return NextResponse.json(
      { message: "Authentication Required" },
      { status: 401 }
    );
  }

  console.log(user);

  if (!isValidPayload(payload)) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }
  console.log(payload);
  return NextResponse.json({ message: "Submitted" }, { status: 200 });
}
