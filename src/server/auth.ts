import GoogleProvider from "@auth/core/providers/google";
import {
  type Session,
  SolidAuth,
  type SolidAuthConfig,
  getSession as innerGetSession,
} from "@auth/solid-start";
import { getRequestEvent } from "solid-js/web";
import { UnauthorizedError } from "../lib/errors";

const config: SolidAuthConfig = {
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET,
  trustHost: !!process.env.AUTH_TRUST_HOST,
  jwt: { maxAge: 24 * 60 * 60 },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export interface ThuunSession extends Session {
  expires: string;
}

export const auth = SolidAuth(config);

export async function getSession() {
  "use server";
  const session = await findSession();
  if (!session) {
    throw new UnauthorizedError("No session");
  }
  return session;
}

export async function findSession() {
  "use server";
  const event = getRequestEvent();
  if (!event?.request) {
    throw new UnauthorizedError("No request");
  }
  return await innerGetSession(event.request, config);
}
