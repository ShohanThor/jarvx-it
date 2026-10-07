import "server-only";
import { cookies } from "next/headers";
import { dictionaries, type Lang } from "./dictionaries";

export function getLang(): Lang {
  const v = cookies().get("lang")?.value;
  return v === "bn" ? "bn" : "en";
}

export function getDict() {
  return dictionaries[getLang()];
}
