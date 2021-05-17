import { buildClientSchema } from 'graphql';

import IntrospectionQuery, {
  GroupFieldsFragmentDoc,
  PostFieldsFragmentDoc,
  UserGroupFieldsFragmentDoc,
  UserPostReactionFieldsFragmentDoc,
  PostCommentFieldsFragmentDoc,
} from './generated/graphql';
import { HasuraConfigType } from '../src/types/hasuraConfig'

const schema = buildClientSchema(IntrospectionQuery)

const HasuraConfig: HasuraConfigType = {
  groups: {
    typename: 'group',
    primaryKey: ['id'],
    fieldFragment: GroupFieldsFragmentDoc,
    schema,
  },
  userGroups: {
    typename: 'userGroup',
    primaryKey: ['userId', 'groupId'],
    fieldFragment: UserGroupFieldsFragmentDoc,
    schema,
    primaryKeyRequiredOnCreate: true,
  },
  posts: {
    typename: 'post',
    primaryKey: ['id'],
    fieldFragment: PostFieldsFragmentDoc,
    schema,
  },
  userPostReactions: {
    typename: 'userPostReaction',
    primaryKey: ['userId', 'postId'],
    fieldFragment: UserPostReactionFieldsFragmentDoc,
    schema,
    primaryKeyRequiredOnCreate: true,
  },
  postComments: {
    typename: 'postComment',
    primaryKey: ['id'],
    fieldFragment: PostCommentFieldsFragmentDoc,
    schema,
  },
};

export default HasuraConfig;
