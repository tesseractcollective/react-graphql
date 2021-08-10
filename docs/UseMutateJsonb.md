## 1. Setup API

```
  const claimApi = useReactGraphql(config.claim)
```

## 2. Add to start of jsonb array

```
  const insertJsonbState = claimApi.useInsertJsonb({
    columnName: 'journal',
    operationEventType: 'insert-first',
    initialVariables: { /* PRIMARY KEY for parent table /*}
  })

  ...

  insertJsonbState.executeMutation(newItemToPrepend);

```

## 3. Add to end of jsonb array

```
  const insertJsonbState = claimApi.useInsertJsonb({
    columnName: 'journal',
    operationEventType: 'insert-last',
    initialVariables: { /* PRIMARY KEY for parent table /*}
  });

  ...

  insertJsonbState.executeMutation(newItemToPrepend);
  
```


## 3. Delete row from jsonb array

```
  const insertJsonbState = claimApi.useDeleteJsonb({
    columnName: 'journal',    
    initialVariables: { /* PRIMARY KEY for parent table /*}
  })

  ...

  insertJsonbState.executeMutation({index: /*index number to delete*/});
  
```


## 4. Update jsonb object, or edit or replace item in array

```
  const insertJsonbState = claimApi.useUpdateJsonb({
    columnName: 'journal',    
    initialVariables: { /* PRIMARY KEY for parent table /*}
  });

  const currentParentRow = claimApi.useQueryOne({    
    initialVariables: { /* PRIMARY KEY for parent table /*}
  })

  ...

  insertJsonbState.executeMutation({ ...currentParentRow.journal,  ...AnyChanges});
  insertJsonbState.executeMutation([ ...currentParentRow.journal,  ...RowChanges]);
  
```