import { GenerateArgs, CodeFileLike, ModelMap } from '../types';
import { GraphQLTypeObject } from '../source-helper';
export { format } from './ts-generator';
export declare function renderResolvers(type: GraphQLTypeObject, modelMap: ModelMap): CodeFileLike;
export declare function renderParentResolvers(type: GraphQLTypeObject): CodeFileLike;
export declare function renderExports(types: GraphQLTypeObject[]): string;
export declare function generate(args: GenerateArgs): CodeFileLike[];
