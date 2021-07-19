import { buildClientSchema } from 'graphql';

import IntrospectionQuery, {
  GroupFieldsFragmentDoc,
  PostFieldsFragmentDoc,
  UserGroupFieldsFragmentDoc,
  UserPostReactionFieldsFragmentDoc,
  PostCommentFieldsFragmentDoc,
  MotorcycleReferenceFieldsFragmentDoc
} from './generated/graphql';
import { HasuraConfigType } from '../src/types/hasuraConfig';
import { buildHasuraConfig } from '../src/support/HasuraConfigUtils';
import schema from './generated/graphql.schema.json';

const HasuraConfig: HasuraConfigType = buildHasuraConfig(schema, {
  groups: {
    typename: 'group',
    primaryKey: ['id'],
    fieldFragment: GroupFieldsFragmentDoc,
  },
  userGroups: {
    typename: 'userGroup',
    primaryKey: ['userId', 'groupId'],
    fieldFragment: UserGroupFieldsFragmentDoc,
    primaryKeyRequiredOnCreate: true,
  },
  posts: {
    typename: 'post',
    primaryKey: ['id'],
    fieldFragment: PostFieldsFragmentDoc,
  },
  userPostReactions: {
    typename: 'userPostReaction',
    primaryKey: ['userId', 'postId'],
    fieldFragment: UserPostReactionFieldsFragmentDoc,
    primaryKeyRequiredOnCreate: true,
  },
  postComments: {
    typename: 'postComment',
    primaryKey: ['id'],
    fieldFragment: PostCommentFieldsFragmentDoc,
  },
  motorcycleReference: {
    typename: 'motorcycleReference',
    primaryKey: ['year', 'modelId', 'makeId'],
    fieldFragment: MotorcycleReferenceFieldsFragmentDoc
  }
});

console.log('🚀 ~ file: TestHasuraConfig.ts ~ line 51 ~ HasuraConfig', HasuraConfig)
export default HasuraConfig;
