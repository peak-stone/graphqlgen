import { DocumentNode } from 'graphql';
import { GraphQLGenDefinition, Language } from 'graphqlgen-json-schema';
declare type Definition = {
    typeName: string;
    rawDefinition: string;
    filePath?: string;
    modelName?: string;
};
export declare type ValidatedDefinition = {
    definition: Definition;
    validSyntax: boolean;
    fileExists: boolean;
    interfaceExists: boolean;
};
export declare function validateConfig(config: GraphQLGenDefinition, schema: DocumentNode): boolean;
export declare function validateDefinition(typeName: string, definition: string, language: Language): ValidatedDefinition;
export {};
