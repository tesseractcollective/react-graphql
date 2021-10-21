import mockData from "./mockData";
import { log } from "../src/support/log";

export function useUrqlQueryMock(instanceId) {
  return (queryCfg, objectVariables) => {
    if (instanceId) {
      const results = mockData[instanceId];
      if (!results) {
        log.info("Add query definition to useQueryResults.js to get data");
      } else {
        return results;
      }
      return [{}, () => null];
    }
    return [{}, () => null];
  };
}
