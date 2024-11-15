import dayjs from "dayjs";
import { createEffect, createResource } from "solid-js";
import { findSession } from "~/server/auth";

export function useSession() {
  const [data, { refetch }] = createResource(() => findSession(), {
    name: "user-session",
  });
  createEffect((oldId?: ReturnType<typeof setTimeout>) => {
    if (oldId) {
      clearTimeout(oldId);
    }
    const expires = data()?.expires;
    if (expires) {
      const time = dayjs(expires).diff(dayjs(), "milliseconds");
      const maxTime = Math.min(time, 60 * 60 * 1000);
      const newId = setTimeout(() => {
        refetch();
      }, maxTime);
      return newId;
    }
  });
  return data;
}
