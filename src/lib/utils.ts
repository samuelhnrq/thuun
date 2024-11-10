import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export function getCurrentDate(input?: string): Dayjs {
  let base = dayjs();
  if (input) {
    try {
      const parsed = dayjs(input);
      if (parsed.isValid()) {
        base = parsed;
      }
    } catch {}
  }
  return base.utc().startOf("day");
}
