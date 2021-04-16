// @index('./**/*.{js,ts,tsx,jsx}', (f, _)=> `export { default as ${_.pascalCase(f.path.split('/')[2])} } from '${f.path.split('/')[0] + '/' + f.path.split('/')[1] + '/' + f.path.split('/')[2]}'`)
import { Platform } from 'react-native';
// @endindex
export { default as MutatorButton } from './shared/MutatorButton';
export { default as MutatorTextInput } from './shared/MutatorTextInput';



export { default as PaginatedList } from './PaginatedList';
