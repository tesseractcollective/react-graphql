## Searching

#### Basic single keyword search
```
<PaginatedList
        graphqlConfig={graphqlConfig.users}
        searchConfig={{
          onSubmitSearchBuildWhereClause: (keywords) => {
            return {
              devices: {
                _contains: keywords,
              },
            } as Users_Bool_Exp;
          },
        }}
      />
```

#### Override for multi-column search
```
<PaginatedList
        graphqlConfig={graphqlConfig.users}
        searchConfig={{
          renderSearchComponent: (onSubmit)=> {
              return <div>
                ..fancy components here
                <button onClick={()=> onSubmit({
                    devices: {
                        _contains: keywords,
                    },
                } as Users_Bool_Exp}>
                    Submit</button>
              </div>
          }
          
        }}
      />
```
