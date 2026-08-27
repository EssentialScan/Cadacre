import { towns, type Town } from "./towns";

export type { Town, SourcedField } from "./towns";

export function getAllTowns(): Town[] {
  return towns;
}
