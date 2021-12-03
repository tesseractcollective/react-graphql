import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { HasuraDataConfig } from '../types/hasuraConfig';
import { useReactGraphql } from './useReactGraphql';

export function useCascadingSelect(args: { config: HasuraDataConfig; columns: string[], pageSize?: number }) {
  const [val, setVal] = useState<{ options: any[] }[]>(() => {
    const defaultResponse = [{ options: [] }];
    _.times(args.columns.length - 1, () => defaultResponse.push({ options: [] }));
    return defaultResponse;
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [where, setWhere] = useState<any>({});

  const api = useReactGraphql(args.config);
  const queryState = api.useInfiniteQueryMany({ where, pageSize: args.pageSize ?? 500, distinctOn: args.columns[selected.length] });

  useEffect(() => {}, []);

  useEffect(() => {
    const newVal = [...val];
    args.columns.forEach((col, idx) => {
      if (idx === 0 || selected.length >= idx) {
        newVal[idx].options = queryState.items.map((itm: any) => itm[col]);
      }
    });
    setVal(newVal);
  }, [queryState.items.length, selected]);

  const select = (columnIndex:number, selectedValue:string) => {
    let newSelected:string[] = [];
    if (columnIndex <= selected.length) {
      newSelected = selected.slice(0, columnIndex);
      newSelected.push(selectedValue);
    } else {
      console.log(
        'Err: useCascadingSelect.  Invalid scenario: Selected the value for an index that skipped ahead.  CurrentSelectCount: ' +
          selected.length,
        { columnIndex, selectedValue, selected, columns: args.columns },
      );
    }

    const newWhere = newSelected.reduce((where: any, selected:string, idx:number) => {
      where[args.columns[idx]] = { _eq: selected };
      return where;
    }, {});

    setWhere(newWhere);
    setSelected(newSelected);
  };

  return {
    options: val,
    selected,
    select,
  };
}
