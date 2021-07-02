import { reactNativeWebUIProviderDecorator } from "./reactNativeWebUIProviderDecorator";
import { urqlProviderDecorator } from "./urqlProviderDecorator";

export default [
  reactNativeWebUIProviderDecorator(),
  urqlProviderDecorator(),
]