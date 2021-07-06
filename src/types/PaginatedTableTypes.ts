import type { ReactElement } from 'react';

export interface PaginatedTableExpanderConfig {
  action: 'expand';
  expandableRowsComponent?: React.ReactNode;
  hideIcon?: boolean;
  expandableRowExpanded?: (row: any) => boolean;
}

export interface PaginatedTableNavConfig {
  action: 'nav';
  to: string;
}

export interface PaginatedTableModalConfig {
  action: 'modal';
  modalComponent?: ReactElement;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export interface PaginatedTableInvokeConfig {
  action: 'invoke';
  function: () => void;
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
  DescNullsLast = 'desc_nulls_last'
}