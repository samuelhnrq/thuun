import { createContext, useContext } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import { createResource } from "solid-js";
import { getSession } from "../server/auth";
import type { Session } from "@auth/solid-start";
import type { ParentProps } from "solid-js";

const fetchSession = async () => {
  "use server";
  console.log("fetching slow session");
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const event = getRequestEvent();
  if (!event?.request) {
    return null;
  }
  try {
    const session = await getSession(event.request);
    console.log("session", session);
    return session;
  } catch {
    return null;
  }
};

export const SessionContext = createContext<Session | null>(null);

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider(props: ParentProps) {
  const [data] = createResource(() => fetchSession(), {
    name: "user-session",
    initialValue: null,
    ssrLoadFrom: "initial",
  });
  console.log("data", data());

  return (
    <SessionContext.Provider value={data()}>
      {props.children}
    </SessionContext.Provider>
  );
}
