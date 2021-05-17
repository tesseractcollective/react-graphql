import mockData from "./mockData";

export function useUrqlQueryMock(instanceId) {
  return (queryCfg, objectVariables) => {
    if (instanceId) {
      const results = mockData[instanceId];
      if (!results) {
        console.log("Add query definition to useQueryResults.js to get data");
      } else {
        return results;
      }
      return [{}, () => null];
    }
    return [{}, () => null];
  };
}
