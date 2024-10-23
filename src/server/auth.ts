import GoogleProvider from "@auth/core/providers/google";
import {
  SolidAuth,
  type SolidAuthConfig,
  getSession as innerGetSession,
} from "@auth/solid-start";
import { getRequestEvent } from "solid-js/web";

const config: SolidAuthConfig = {
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const auth = SolidAuth(config);

export async function getSession() {
  "use server";
  const session = await findSession();
  if (!session) {
    throw new Error("No session");
  }
  return session;
}

export async function findSession() {
  "use server";
  const event = getRequestEvent();
  if (!event?.request) {
    throw new Error("No request");
  }
  return await innerGetSession(event.request, config);
}
