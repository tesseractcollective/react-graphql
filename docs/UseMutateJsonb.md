## Setup API

```
  const claimApi = useReactGraphql(config.claim)
```

# JSONB ARRAYS

If the root of your jsonb column is an array, you will interact with it like this:

## ADD to start of jsonb array

```
  const jsonbState = claimApi.useInsertJsonb({
    columnName: 'journal',
    operationEventType: 'insert-first',
    initialVariables: { /* PRIMARY KEY for parent table /*}
  })

  ...

  jsonbState.executeMutation(newItemToPrepend);

```

## ADD to end of jsonb array

```
  const jsonbState = claimApi.useInsertJsonb({
    columnName: 'journal',
    operationEventType: 'insert-last',
    initialVariables: { /* PRIMARY KEY for parent table /*}
  });

  ...

  jsonbState.executeMutation(newItemToPrepend);
  
```

## DELETE row from jsonb array

```
  const jsonbState = claimApi.useRemoveItemFromJsonbArray({
    columnName: 'journal',
    initialVariables: { /* PRIMARY KEY for parent table /*}
  })

  ...
  jsonbState.setItem(2); //Pass in the index of the item to delete here.
  jsonbState.executeMutation();

  OR

  jsonbState.executeMutation(1); //Pass in the index of the item to delete here.
  
```


## EDIT row from jsonb array

You can't actually edit one row, you need to replace all of them

```
  const jsonbState = claimApi.useUpdateJsonb({
    columnName: 'journal',    
    initialVariables: { /* PRIMARY KEY for parent table /*}
  });

  const currentParentRow = claimApi.useQueryOne({    
    initialVariables: { /* PRIMARY KEY for parent table /*}
  })

  ...

  jsonbState.executeMutation([ ...currentParentRow.journal,  ...RowChanges]);

```


# JSONB OBJECTS

If the root of your jsonb column is an object, you will interact with it like this:


## DELETE key from jsonb object

```
  const jsonbState = claimApi.useRemoveKeyFromJsonbObject({
    columnName: 'journal', 
    key: "KEY",
  })

  ...
  jsonbState.setKey("firstName"); //Pass in the key to delete from the object
  jsonbState.executeMutation();

  OR

  jsonbState.executeMutation("firstName"); //Pass in the index of the item to delete here.
  
```


## CREATE or UPDATE One or more key on jsonb object

No, this is not a typo. If we're working an object then insert uses `_append` underneath which will over-write the existing object key.

```
  const jsonbState = claimApi.useInsertJsonb({
    columnName: 'journal',    
    initialVariables: { /* PRIMARY KEY for parent table /*}
  });

  ...

  jsonbState.executeMutation({ "keyToUpdate": "new value" });
  
```

## 6. Replace the entire object

```
  const jsonbState = claimApi.useUpdateJsonb({
    columnName: 'journal',    
    initialVariables: { /* PRIMARY KEY for parent table /*}
  });

  const currentParentRow = claimApi.useQueryOne({    
    initialVariables: { /* PRIMARY KEY for parent table /*}
  })

  ...

  jsonbState.executeMutation({ ...currentParentRow.journal,  ...AnyChanges});
  
```