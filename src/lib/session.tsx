import type { Session } from "@auth/solid-start";
import { createContext, createEffect, useContext } from "solid-js";
import { createResource } from "solid-js";
import type { ParentProps } from "solid-js";
import { findSession } from "~/server/auth";

const SessionContext = createContext<Session | null>(null);

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider(props: ParentProps) {
  const [data, { refetch }] = createResource(() => findSession(), {
    name: "user-session",
    initialValue: null,
    ssrLoadFrom: "server",
  });

  createEffect((oldId?: ReturnType<typeof setTimeout>) => {
    if (oldId) {
      clearTimeout(oldId);
    }
    const expires = data()?.expires;
    if (expires) {
      const time = new Date(expires).getTime();
      const newId = setTimeout(() => refetch(), Date.now() - time - 1000);
      return newId;
    }
  });

  return (
    <SessionContext.Provider value={data()}>
      {props.children}
    </SessionContext.Provider>
  );
}
