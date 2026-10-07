/** Meeting slots are defined in Dhaka time (UTC+6, no DST). */
export const DHAKA_OFFSET_MIN = 6 * 60;
export const SLOT_HOURS = [10, 11, 12, 14, 15, 16, 17]; // local Dhaka hours
export const WORK_DAYS = [0, 1, 2, 3, 4]; // Sunday–Thursday

/** UTC Date for a Dhaka-local calendar day + hour */
export function dhakaSlot(year: number, month: number, day: number, hour: number) {
  return new Date(Date.UTC(year, month, day, hour) - DHAKA_OFFSET_MIN * 60_000);
}

export function isValidSlot(d: Date) {
  const local = new Date(d.getTime() + DHAKA_OFFSET_MIN * 60_000);
  return (
    d.getTime() > Date.now() + 2 * 3600_000 &&
    local.getUTCMinutes() === 0 &&
    SLOT_HOURS.includes(local.getUTCHours()) &&
    WORK_DAYS.includes(local.getUTCDay())
  );
}
