# React GraphQL

This library provides hooks and components to easily interact with opinionated graphql APIs. It includes patterns to create paginated lists, admin interface data grids, and edit views.

Supported GraphQL APIs:
- Hasura

Other APIs on roadmap:
- TODO

### Installation

Add these dependencies: `react-router-dom graphql graphql-tag jotai lodash react react-dom react-native-web react-scripts urql type-fest @tesseractcollective\react-graphql`

### Adding new files (components, hooks, support, other)

Update `src/index.web.ts` and/or `src/index.native.ts` to import and export the file and any types created for the new file.

##### EDIT SUGGESTION:  index file inbetween the start of the src folder and your containing component folder 
If there is an index file inbetween src and your component you need to update that as well. This isn't necessary but improves local typescript support.

### Adding component

If the component can be built and maintained using only react-native-web components, put it in `src/components/shared` and do that!

##### EDIT SUGGESTION: I am assuming the path implied is "src/components/web".  If so, might as well say that or the correct full path for clarity.
Otherwise, put the component in component in `src/components/native OR web` and only update the matching index file in src.


### deploy locally to test (web):

setup the correct dependencies for platform:
```
pnpm webmode
```

Then run a pack command based on platform:
```
pnpm pack:web
```

* Find .tgz : Resolve any errors and look for the correct .tgz file in the root of the project.
* Copy path : Right click and select "copy path"
* Install via file: In the target project run `pnpm add PASTE_PATH_TO_TGZ`

This will override the existing version of react-graphql in that project with the one you built on disk.

Repeat as needed.

NOTE: You do not need to bump the version!

### deploy locally to test (native):

setup the correct dependencies:
```
pnpm nativemode
```

Then run a build command:
```
pnpm build:native:ts
```

Update package.json with the path to the native project you want to test in:
```
"test:copy": "cp -rf ./dist PATH/node_modules/@tesseractcollective/react-graphql/dist"
```


This will override the existing version of react-graphl in that project with the one you built on disk.

Repeat as needed.

NOTE: You do not need to bump the version!

## Storybook

To run story book:

* Make sure you have installed dependencies via `pnpm i`
* add `.env.js` file in the root of the project
* Place this content inside:

```
module.exports = {
  STORYBOOK_HASURA_URL: 'https://DOMAIN.APP/v1/graphql',
  STORYBOOK_HAUSRA_AUTH_KEYNAME: 'x-hasura-admin-secret OR x-collaborator-token OR other key',
  STORYBOOK_HASURA_AUTH_VALUE: 'TOKEN_OR SECRET',
};
```

Then run:

`pnpm storybook`
