import { DocumentNode } from 'graphql';
declare type GraphQLTypeDefinition = {
    name: string;
    isScalar: boolean;
    isEnum: boolean;
    isUnion: boolean;
    isInput: boolean;
    isObject: boolean;
    isInterface: boolean;
};
export declare type GraphQLType = GraphQLTypeDefinition & {
    isArray: boolean;
    isRequired: boolean;
};
declare type GraphQLTypeArgument = {
    name: string;
    type: GraphQLType;
};
export declare type GraphQLTypeField = {
    name: string;
    type: GraphQLType;
    arguments: GraphQLTypeArgument[];
};
export declare type GraphQLTypeObject = {
    name: string;
    type: GraphQLTypeDefinition;
    fields: GraphQLTypeField[];
};
export declare type GraphQLEnumObject = {
    name: string;
    type: GraphQLTypeDefinition;
    values: string[];
};
export declare type GraphQLUnionObject = {
    name: string;
    type: GraphQLTypeDefinition;
    types: GraphQLTypeObject[];
};
export declare const GraphQLScalarTypeArray: string[];
export declare type GraphQLScalarType = 'Boolean' | 'Float' | 'Int' | 'String' | 'ID';
export declare function extractGraphQLTypes(schema: DocumentNode): GraphQLTypeObject[];
export declare function extractGraphQLEnums(schema: DocumentNode): GraphQLEnumObject[];
export declare function extractGraphQLUnions(schema: DocumentNode): GraphQLUnionObject[];
export declare function graphQLToTypecriptType(type: GraphQLType): string;
export declare function extractGraphQLTypesWithoutRootsAndInputs(schema: DocumentNode): GraphQLTypeObject[];
export {};
