import * as prettier from 'prettier';
import { GraphQLTypeObject, GraphQLEnumObject, GraphQLUnionObject } from '../source-helper';
export declare type GenerateArgs = {
    types: GraphQLTypeObject[];
    enums: GraphQLEnumObject[];
    unions: GraphQLUnionObject[];
    contextPath?: string;
    modelMap: ModelMap;
};
export interface ModelMap {
    [schemaTypeName: string]: Model;
}
export interface Model {
    absoluteFilePath: string;
    importPathRelativeToOutput: string;
    modelTypeName: string;
}
export interface CodeFileLike {
    path: string;
    force: boolean;
    code: string;
}
export interface IGenerator {
    generate: (args: GenerateArgs) => string | CodeFileLike[];
    format: (code: string, options?: prettier.Options) => string;
}
