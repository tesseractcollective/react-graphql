import { filter } from "lodash";
import { JsonArray } from "type-fest";
import { log } from "../../support/log";

export function findDefaultPks(
  items: JsonArray,
  newDetectedPks: Map<string, string[]> | undefined,
  detectedPks: Map<string, string[]>,
  key: string
) {
  log.debug("findDefaultPks -> key", key);
  log.debug("findDefaultPks -> detectedPks", detectedPks);
  log.debug("findDefaultPks -> newDetectedPks", newDetectedPks);
  log.debug("findDefaultPks -> items", items);
  const item: any = items[0];
  const validPks = ["id"];
  const pks = filter(
    item.filter((_: any, key: string) => validPks.indexOf(key) >= 0)
  );
  if (pks.length === 1) {
    newDetectedPks = new Map(detectedPks);
    newDetectedPks.set(key, pks);
  }
  return newDetectedPks;
}
