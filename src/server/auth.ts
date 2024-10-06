import GoogleProvider from "@auth/core/providers/google";
import { SolidAuth, getSession as innerGetSession } from "@auth/solid-start";

const config = {
  basePath: "/api/auth",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const auth = SolidAuth(config);

export const getSession = (request: Request) => {
  return innerGetSession(request, config);
};
