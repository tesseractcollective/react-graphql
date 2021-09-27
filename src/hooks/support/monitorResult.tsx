import { print } from "graphql";
import { useEffect } from "react";
import { JsonArray } from "type-fest";

export function useMonitorResult(
  resultType: "mutation" | "query",
  result: any
) {
  useEffect(() => {
    if (result.error) {
      console.log(
        `❗ ERR: ${resultType} RESULT`,
        "\r\n",
        "------------------------",
        "\r\n",
        print(result.operation?.query),
        "\r\n",
        "------------------------",
        "\r\n",
        JSON.stringify(
          {
            error: result.error.message,
            errors: result.error.graphQLErrors,
          },
          null,
          2
        ),
        "\r\n",
        "------------------------",
        "\r\n",
        JSON.stringify(
          {
            variables: result.operation?.variables,
          },
          null,
          2
        )
      );
    } else if (!result.fetching && result.data) {
      const keys = Object.keys(result.data);
      if (keys.length === 1) {
        const key = keys[0];
        //only single response category so use single layer items
        const queryItems: JsonArray = result.data[key];
        if (Array.isArray(queryItems) && queryItems.length === 0) {
          console.log(
            `❗ WARN: ${resultType} EMPTY RESULTS`,
            "\r\n",
            "------------------------",
            "\r\n",
            print(result.operation?.query),
            "\r\n",
            "------------------------",
            "\r\n",
            JSON.stringify(
              {
                data: result.data,
              },
              null,
              2
            ),
            "\r\n",
            "------------------------",
            "\r\n",
            JSON.stringify(
              {
                variables: result.operation?.variables,
              },
              null,
              2
            )
          );
        }
      }
    }
  }, [resultType, result]);
}
