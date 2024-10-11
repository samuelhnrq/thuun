import GoogleProvider from "@auth/core/providers/google";
import {
  SolidAuth,
  type SolidAuthConfig,
  getSession as innerGetSession,
} from "@auth/solid-start";

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

export const getSession = (request: Request) => {
  return innerGetSession(request, config);
};
