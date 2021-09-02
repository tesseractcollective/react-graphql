import type { ReactElement } from 'react';
import * as H from 'history'

export interface PaginatedTableExpanderConfig {
  action: 'expand';
  expandableRowsComponent?: (row: any)=> React.ReactNode;
  expandableRowsComponentProps?: any;
  hideIcon?: boolean;
  expandableRowExpanded?: (row: any) => boolean;
}

export interface PaginatedTableNavConfig {
  action: 'nav';
  to?: string | ((row: any) => string);
  toRowId?: boolean | string;
  history: H.History<H.LocationState>;
  shallowParams?: {
    mode: 'merge' | 'replace' | 'remove';
    buildParams: (row: any) => { [key: string]: any };
  };
}

export interface PaginatedTableModalConfig {
  action: 'modal';
  modalComponent?: (row:any) => ReactElement;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export interface PaginatedTableInvokeConfig {
  action: 'invoke';
  function: (row:any) => void;
}

export interface PaginatedTableSelectConfig {
  action: 'select';
  onSelectedRowsChange?: (rows: any[]) => void;
  hideSelectAllCheckbox?: boolean;
  //If not via selector then turn on highlight, else highlight is off
}

export interface PaginatedTableActions {
  clickConfig?:
    | PaginatedTableExpanderConfig
    | PaginatedTableNavConfig
    | PaginatedTableModalConfig
    | PaginatedTableInvokeConfig
    | PaginatedTableSelectConfig;
  doubleClickConfig?:
    | PaginatedTableExpanderConfig
    | PaginatedTableNavConfig
    | PaginatedTableModalConfig
    | PaginatedTableInvokeConfig
    | PaginatedTableSelectConfig;
  selectorBoxConfig?: PaginatedTableSelectConfig;
  expanderBoxConfig?: PaginatedTableExpanderConfig;
}

/*
    
*/

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
