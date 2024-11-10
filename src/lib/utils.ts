import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { logger } from "~/server/logger";

export function getCurrentDate(input?: string): Dayjs {
  let base = dayjs();
  if (input) {
    try {
      const parsed = dayjs(input);
      if (parsed.isValid()) {
        base = parsed;
      }
    } catch (err) {
      logger.error("failed to parse date", input, err);
    }
  }
  return base.utc().startOf("day");
}
