# React GraphQL

This library provides hooks and components to easily interact with opinionated graphql APIs. It includes patters do create paginated lists, admin interface data grids, and edit views.

Supported GraphQL APIs:
- Hasura

Other APIs on roadmap:
- TODO

### Installation

Add these dependencies: `react-router-dom graphql graphql-tag jotai lodash react react-dom react-native-web react-scripts urql type-fest @tesseractcollective\react-graphql`

### deploy locally to test:

setup the correct dependencies for platform:
```
pnpm nativemode # for native
pnpm webmode    # for web
```

then go to the corresponding build file (build.native.local.js for native and build.web.local.js for web) and update the outfile to where you want it to write to

```
pnpm build:native:local:ts # for native
pnpm build:web:local:ts    # for web
```



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