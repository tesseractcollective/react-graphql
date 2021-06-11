import type { ReactElement } from 'react';

interface PaginatedListExpanderConfig {
  action: 'expand';
  expandableRowsComponent?: React.ReactNode;
  hideIcon?: boolean;
}

interface PaginatedListNavConfig {
  action: 'nav';
  to: string;
}

interface PaginatedListModalConfig {
  action: 'modal';
  modalComponent?: ReactElement;
  onCancel?: () => void;
  onSuccess?: () => void;
}

interface PaginatedListInvokeConfig {
  action: 'invoke';
  function: () => void;
}

interface PaginatedListSelectConfig {
  action: 'select';
  onSelectedRowsChange?: (rows: any[]) => void;
  hideSelectAllCheckbox?: boolean;
  //If not via selector then turn on highlight, else highlight is off
}

interface PaginatedListActions {
  clickConfig?:
    | PaginatedListExpanderConfig
    | PaginatedListNavConfig
    | PaginatedListModalConfig
    | PaginatedListInvokeConfig
    | PaginatedListSelectConfig;
  doubleClickConfig?:
    | PaginatedListExpanderConfig
    | PaginatedListNavConfig
    | PaginatedListModalConfig
    | PaginatedListInvokeConfig
    | PaginatedListSelectConfig;
  selectorBoxConfig?: PaginatedListSelectConfig;
  expanderBoxConfig?: PaginatedListExpanderConfig;
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