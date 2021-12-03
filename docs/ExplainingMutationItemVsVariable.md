Using variables and item for an update.
* mutationState.item is given to $item and is used to specify what columns to update with what values
* mutationState.variables is spread into the gql variables to be used in primary keys or any other part of the query that are not the item to update
* Note: To set a primary for an update you would add it to the variables
```
const gql = `query updateUserData($userId: uuid!, $groupId: uuid!, $groupName: String!, $item: userData_update_input) {
  updateUserData_by_pk($userId: uuid!, $groupId: uuid!, set: $item) {
    firstName
    lastName
    group(where: { name: {_ilike: $groupName } } )
  }
}`;

const mutationState= {
  variables: {
    userId: 'absebase-absebas-saefase-asbas3',
    groupId: 'absebase-absebas-saefase-asbas2',
    groupName: 'Badasses'
  },
  item: {
    firstName: 'Doug',
    lastName: 'Susan'
  },
};
```

Using variables and item for an insert.
* mutationState.item is given to $item and is used to specify the item to insert into the database
* mutationState.variables is spread into the gql variables to be used in primary keys or any other part of the query that are not the item to update
* Note: Do not give a primary to variables for a insert, because it's an insert
```
const gql = `query updateUserData($groupName: String!, $item: userData_insert_input) {
  insertUserData_one(object: $item) {
    firstName
    lastName
    group(where: { name: {_ilike: $groupName } } )
  }
}`;

const mutationState= {
  variables: {
    groupName: 'Badasses'
  },
  item: {
    firstName: 'Doug',
    lastName: 'Susan'
  },
};
```