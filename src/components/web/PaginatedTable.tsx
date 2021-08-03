import React, { ReactElement, useCallback, useEffect, useState } from 'react';
//@ts-ignore
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import Case from 'case';
//@ts-ignore
import type {
  PaginatedTableActions,
  PaginatedTableModalConfig,
  PaginatedTableNavConfig,
} from '../../types/PaginatedTableTypes';
import _ from 'lodash';
import useModal from '../../hooks/useModal';
import { HasuraDataConfig } from '../../types';
import { useReactGraphql, useOperationStateHelper } from '../../hooks';
import { bs, buildStyles, IFieldOutputType } from '../../support';
//@ts-ignore
import ReactLoading from 'react-loading';
import { colorsMap } from '../../support/styling/colorsMap';
import useWatchScroll from '../support/useWatchScroll';
import queryString from 'query-string';

export interface IPaginatedTableProps<TBoolExp extends any, TRecord> {
  graphqlConfig: HasuraDataConfig;
  searchConfig?: {
    keywordSearchColumns?: Array<keyof TRecord>;
    where?: TBoolExp;
    renderSearchComponent?: ReactElement;
    searchPlaceholder?: string;
    onSuccess?: (keywords?: string) => void;
  };
  pageSize?: number;
  headerConfig?: {
    noHeader?: boolean;
    fixedHeader?: boolean;
  };
  dataOverride?: any[];
  renderEmpty?: () => ReactElement;
  columnConfig?: { [selector: string]: Partial<IDataTableColumn> };
  actionConfig?: PaginatedTableActions;
}

const PAGE_SIZE = 50;

const paginatedTableStyles = `.rdt_TableBody {
            flex: 1;
            overflow-y:auto;
          }

          .tc-datatable, .tc-datatable>div, rdt {
            display:flex;
            flex:1
          }`;

export function PaginatedTable<
  TBoolExp extends { [key: string]: any },
  TOrderBy extends any,
  TRecord extends Record<string, any>,
>(props: IPaginatedTableProps<TBoolExp, TRecord>) {
  const {
    searchConfig,
    graphqlConfig,
    columnConfig,
    actionConfig,
    renderEmpty,
    dataOverride,
    headerConfig = {
      noHeader: true,
    },
  } = props;

  const { keywordSearchColumns, renderSearchComponent, onSuccess } = searchConfig || {};

  const [keyword, setKeyword] = useState<string>();
  const [orderBy, setorderBy] = useState<TOrderBy[]>();
  const [where, setWhere] = useState<TBoolExp | undefined>(searchConfig?.where);
  const [columnConfigInternal, setColumnConfigInternal] = useState<IDataTableColumn[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  //Column Config
  useEffect(() => {
    const columnsFromDocument: any[] = graphqlConfig.fields?.fieldSimpleMap
      ? Object.keys(graphqlConfig.fields.fieldSimpleMap)
      : [];

    const defaultColumns = columnsFromDocument.map((columnName: string) => {
      const column: IFieldOutputType | undefined = graphqlConfig.fields?.fieldSimpleMap[columnName];
      return {
        name: Case.sentence(columnName),
        selector: columnName,
        sortable: column && !column.isList && !column.isObject,
        style: paginatedTableColStyle,
        editable: true,
        grow: 1,
        wrap: true,
        format: (data: any) => {
          if (columnName === 'isApproved') {
            console.log('💰', columnName, data);
          }
          if (typeof data[columnName] === 'object') {
            return JSON.stringify(data[columnName], null, 2);
          }
          if ([true, 'true'].indexOf(data[columnName]) >= 0) {
            return 'yes';
          }
          if ([false, 'false', null, 'null'].indexOf(data[columnName]) >= 0) {
            return 'no';
          }
          return data[columnName];
        },
      };
    });
    let _columnConfig;
    if (columnConfig) {
      _columnConfig = defaultColumns.map((defaultColumn) => {
        const customConfig = columnConfig[defaultColumn.selector];
        if (customConfig) {
          const newCustomConfig = Object.assign({}, defaultColumn, customConfig);
          if (customConfig.selector && !defaultColumn.sortable) {
            newCustomConfig.sortable = true;
          }
          return newCustomConfig;
        }
        return defaultColumn;
      });
    }
    //TODO: map over the custom config and add any missing keys
    //Respect the order they are in the config
    setColumnConfigInternal((_columnConfig ?? defaultColumns) as any);
  }, [columnConfig]);

  useEffect(() => {
    setWhere(searchConfig?.where);
  }, [searchConfig?.where]);

  const modalComponent =
    (actionConfig?.clickConfig as PaginatedTableModalConfig)?.modalComponent ||
    (actionConfig?.doubleClickConfig as PaginatedTableModalConfig)?.modalComponent;

  const { Modal, hideModal, showModal, shown } = useModal({ modalComponent });
  let actionProps = {};

  if (actionConfig) {
    actionProps = _.reduce(
      actionConfig,
      (nextProps, cfg: any, cfgOn: string) => {
        return {
          ...nextProps,
          ...buildExpandProps(cfg, cfgOn),
          ...buildNavProps(cfg, cfgOn),
          ...buildModalProps(cfg, cfgOn, showModal),
          ...buildInvokeProps(cfg, cfgOn),
          ...buildSelectProps(cfg, cfgOn),
        };
      },
      {},
    );
  }

  //GET - Search and List
  const dataSource = useReactGraphql(graphqlConfig);
  const queryState = dataOverride
    ? {
        items: dataOverride,
        queryState: {
          fetching: false,
          stale: false,
          error: undefined,
        },
        loadNextPage: () => undefined,
        refresh: () => undefined,
      }
    : dataSource.useInfiniteQueryMany<TRecord>({
        orderBy,
        where,
        pageSize: props.pageSize || PAGE_SIZE,
      });

  useOperationStateHelper(queryState.queryState, {
    onSuccess: () => {
      console.log('🍇🚀 ~ file: PaginatedTable.tsx ~ line 152 ~ useOperationStateHelper ~ keyword', keyword);
      onSuccess?.(keyword);
      if (queryState.items.length === 0 && !queryState.queryState.error) {
        setIsCompleted(true);
      }
    },
  });

  // const cols = flattenColumns(userDataContext.items);

  const submitSearch = useCallback(
    (_keywords?: string) => {
      console.log('🚀 ~ file: PaginatedTable.tsx ~ line 161 ~ submitSearch');

      let _keyword = _keywords || keyword;
      if (_keyword) {
        let whereClause;
        if (keywordSearchColumns) {
          const whereObj = {} as any;

          keywordSearchColumns.forEach((column) => {
            whereObj[column] = {
              _like: `%${_keyword}%`,
            };
          });
          whereClause = whereObj;
          setWhere(whereClause);
        }
      } else if (!props.searchConfig?.where) {
        setWhere({} as TBoolExp);
      }
    },
    [keyword],
  );

  useEffect(() => {
    queryState.refresh();
    setIsCompleted(false);
  }, [where]);

  const {
    positionY: scrollPercentAsDecimal,
    prevPosY,
    reComputeHeight,
  } = useWatchScroll(queryState.items.length > 0 ? `.rdt_TableBody` : '');

  useEffect(() => {
    prevPosY;
    if (
      prevPosY !== scrollPercentAsDecimal &&
      scrollPercentAsDecimal > 0.9 &&
      !queryState.queryState.fetching &&
      !isCompleted
    ) {
      queryState.loadNextPage();
    }
  }, [scrollPercentAsDecimal, queryState.queryState.fetching, prevPosY, isCompleted]);

  useEffect(() => {
    //This one wierd useEffect gets the re-render to happen correctly
    if (queryState.items.length > 0) {
      reComputeHeight();
    }
  }, [queryState.items.length]);

  function onSort(column: IDataTableColumn<unknown>, sortDirection: 'desc' | 'asc') {
    const selectorOrNameStr: string = (column.selector?.valueOf() as any) || (column.name?.valueOf() as any);
    let newOrderBy;
    const directionStr = sortDirection === Order_By.Desc ? Order_By.Desc : Order_By.Asc;
    //Build order by from selector
    if (selectorOrNameStr.indexOf('.') >= 0) {
      const parts = selectorOrNameStr.split('.');
      newOrderBy = {};
      let nextPart: string;
      let currentTier: any = newOrderBy;
      //Loop over all the parts from our string: table.subtable.prop
      while (parts.length > 0) {
        nextPart = parts.shift() as string;
        //We're on the last part, the prop
        if (parts.length === 0) {
          currentTier[nextPart] = directionStr;
        } else {
          currentTier[nextPart] = {};
          currentTier = currentTier[nextPart];
        }
      }
      setorderBy([newOrderBy] as TOrderBy[]);
    } else {
      setorderBy([
        {
          //BUG: This will break if the consumer's graphql schema isn't camel case and they didn't provide a selector
          [Case.camel(selectorOrNameStr)]: directionStr,
        },
      ] as TOrderBy[]);
    }
  }

  const isSearchEnabled = !!keywordSearchColumns && !renderSearchComponent;

  useEffect(() => {
    //This one wierd useEffect gets the re-render to happen correctly
  }, [queryState.items]);

  const isLoadedSuccessfully = columnConfigInternal && (!queryState.queryState.fetching || !!queryState.items?.length);
  const isLoadedEmpty = columnConfigInternal && !queryState.queryState.fetching && !queryState.items?.length;

  return (
    <div
      className="tc-paginated-table"
      style={{
        ...bs(`${headerConfig.fixedHeader ? 'f f-1 f-rows' : ''}`).single,
        overflowY: headerConfig.fixedHeader ? 'hidden' : undefined,
      }}
    >
      <style>{paginatedTableStyles}</style>
      {renderSearchComponent ? renderSearchComponent : null}

      {isSearchEnabled && (
        <div>
          <input
            style={bs(`mr-m w-250 p-sxx`).single}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={searchConfig?.searchPlaceholder || 'Search'}
            onKeyUp={(e) => (e.key === 'Enter' ? submitSearch() : null)}
          />
          <button style={bs(`t bg-blue-500 white b-0 p-sxx px-mxx`).single} onClick={(e) => submitSearch()}>
            Search
          </button>
        </div>
      )}

      <DataTable
        className="tc-datatable"
        columns={columnConfigInternal}
        {...actionProps}
        data={queryState.items}
        sortServer
        noHeader={headerConfig.noHeader}
        onSort={onSort}
        pagination
        paginationServer
        paginationPerPage={PAGE_SIZE}
        progressPending={!isLoadedSuccessfully}
        persistTableHead={true}
        overflowY={true}
        customStyles={{}}
        noDataComponent={renderEmpty}
        //   onChangePage={(pageNumber, totalRows) => {
        //     if (pageNumber * PAGE_SIZE > usersQueryState.items.length) {
        //     }
        //   }}
        paginationComponent={
          () => null
          // <ScrollTrigger
          //   onEnter={(e: any) => {
          //     usersQueryState.loadNextPage();
          //   }}
          // />
        }
      />
      {Modal ? Modal : null}
      {queryState.queryState.fetching ? (
        <div style={bs(`fixed-0 f f-cc`).single}>
          <div style={bs(`bg-white p-xl sh-lg b-1 b-gray-200 z-99`).single}>
            <ReactLoading type="spin" color={colorsMap['blue-400']} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

const paginatedTableColStyle = buildStyles(`h-max-100 o-hidden`);

function buildExpandProps(cfg: any, cfgOn: string) {
  if (cfg?.action !== 'expand') return {};

  const { hideIcon, ...rest } = cfg;

  let nextProps = {
    expandableRows: true,
    ...rest,
  } as any;

  if (cfgOn === 'clickConfig') {
    nextProps.expandOnRowClicked = true;
    nextProps.expandableRowsHideExpander = hideIcon ? true : false;
  } else if (cfgOn === 'doubleClickConfig') {
    nextProps.expandOnRowDoubleClicked = true;
    nextProps.expandableRowsHideExpander = hideIcon ? true : false;
  }

  return nextProps;
}

function buildNavProps(cfg: PaginatedTableNavConfig, cfgOn: string) {
  if (cfg?.action !== 'nav') return {};
  let nextProps = {} as any;
  const history = cfg.history;

  const actionName = cfgOn === 'clickConfig' ? 'onRowClicked' : 'onRowDoubleClicked';
  if (!!cfg.to) {
    nextProps[actionName] = (row: any) => {
      if (typeof cfg.to === 'string') {
        history.push(cfg.to);
      } else if (!!cfg.to) {
        history.push(cfg.to(row));
      }
    };
  }
  if (!!cfg.shallowParams) {
    nextProps[actionName] = (row: any) => {
      if (!!cfg.shallowParams) {
        const currentParams = queryString.parse(window.location.search);
        let nextParams: { [key: string]: any } = {};
        if (cfg.shallowParams.mode === 'merge') {
          nextParams = { ...currentParams, ...cfg.shallowParams.buildParams(row) };
        } else if (cfg.shallowParams.mode === 'remove') {
          nextParams = { ...currentParams };
          for (let key in cfg.shallowParams.buildParams(row)) {
            delete nextParams[key];
          }
        } else if (cfg.shallowParams.mode === 'replace') {
          nextParams = cfg.shallowParams.buildParams(row);
        }
        const queryStr = queryString.stringify(nextParams);
        history.push(window.location.pathname + '?' + queryStr);
      }
    };
  }
  if (cfg.toRowId) {
    nextProps[actionName] = (row: any) => {
      const currentParams = queryString.parse(window.location.search);
      let nextParams: { [key: string]: any } = {};
      if (typeof cfg.toRowId === 'string') {
        nextParams = { ...currentParams, id: row[cfg.toRowId] };
      } else {
        nextParams = { ...currentParams, id: row.id };
      }
      const queryStr = queryString.stringify(nextParams);
      history.push(window.location.pathname + '?' + queryStr);
    };
  }

  return nextProps;
}

function buildModalProps(cfg: any, cfgOn: string, showModal?: (row: any) => void) {
  if (cfg?.action !== 'modal' || !showModal) return {};
  let nextProps = { ...cfg } as any;

  const actionName = cfgOn === 'clickConfig' ? 'onRowClicked' : 'onRowDoubleClicked';
  nextProps[actionName] = (row: any) => showModal(row);

  return nextProps;
}

function buildInvokeProps(cfg: any, cfgOn: string) {
  if (cfg?.action !== 'invoke') return {};
  let nextProps = {} as any;

  const actionName = cfgOn === 'clickConfig' ? 'onRowClicked' : 'onRowDoubleClicked';
  nextProps[actionName] = cfg.function;

  return nextProps;
}

function buildSelectProps(cfg: any, cfgOn: string) {
  if (cfg?.action !== 'select') return {};
  let nextProps = {} as any;

  if (cfg.onSelectedRowsChange) {
    nextProps.onSelectedRowsChange = cfg.onSelectedRowsChange;
  }

  if (cfg.hideSelectAllCheckbox) {
    nextProps.selectableRowsNoSelectAll = true;
  }

  const actionName = cfgOn === 'clickConfig' ? 'onRowClicked' : 'onRowDoubleClicked';

  if (cfgOn === 'clickConfig' || cfgOn === 'doubleClickConfig') {
    nextProps.selectableRows = false;
    nextProps[actionName] = (row: any) => (row.selected = !row.selected);
  } else {
    nextProps.selectableRows = true;
  }
  return nextProps;
}

export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}
