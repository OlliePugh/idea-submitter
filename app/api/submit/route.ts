import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp({
    //@ts-ignore
    credential: admin.credential.cert(
      JSON.parse(process.env.SERVICE_ACCOUNT_KEY!)
    ),
    databaseURL:
      "https://real-world-games-default-rtdb.europe-west1.firebasedatabase.app",
  });
}

import { isValidPayload } from "@/utils/validate";
import { NextResponse } from "next/server";
import config from "@/config";
import { randomUUID } from "crypto";

export async function GET(_: Request) {
  return NextResponse.json({ error: "Page not found" }, { status: 404 });
}

const getUser = async (
  correlationId: string,
  token: string | null
): Promise<string | null> => {
  if (token == null) {
    console.log(`${correlationId} | no user token specified`);
    return null;
  }

  try {
    console.log(`${correlationId} | verifying user id token`);
    const decodedIdToken = await admin.auth().verifyIdToken(token);
    return decodedIdToken.uid;
  } catch (e) {
    console.error(
      `${correlationId} something went wrong trying to verify id token`
    );
    return null;
  }
};

export async function POST(request: Request) {
  const correlationId = randomUUID();
  console.log(`${correlationId} | request recieved`);
  const payload = await request.json();

  const user = await getUser(
    correlationId,
    request.headers.get("Authorization")
  );

  console.log(`${correlationId} | user id has been extracted: ${user}`);

  if (config.features.forcedAuth && user == null) {
    console.log(
      `${correlationId} | user not authorised when forced auth is active`
    );
    return NextResponse.json(
      { message: "Authentication Required" },
      { status: 401 }
    );
  }

  if (!isValidPayload(payload)) {
    console.log(`${correlationId} | payload invalid`);
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }
  console.log(`${correlationId} | setting in database`);

  const ref = admin.database().ref(`idea-submitter/data`).push();

  ref.set({
    user,
    value: payload.idea,
    timestamp: Date.now(),
  });

  console.log(`${correlationId} | successfully set value in database`);

  return NextResponse.json({ message: "Submitted" }, { status: 200 });
}

export const dyanmic = "force-dynamic";
