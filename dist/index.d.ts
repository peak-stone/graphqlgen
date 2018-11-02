#!/usr/bin/env node
import * as prettier from 'prettier';
import { DocumentNode } from 'graphql';
import { GraphQLGenDefinition, Language } from 'graphqlgen-json-schema';
import { CodeFileLike, ModelMap } from './types';
export declare type GenerateCodeArgs = {
    schema: DocumentNode;
    config: GraphQLGenDefinition;
    modelMap: ModelMap;
    prettify?: boolean;
    prettifyOptions?: prettier.Options;
    language: Language;
};
export declare function generateCode(generateCodeArgs: GenerateCodeArgs): {
    generatedTypes: string;
    generatedResolvers: CodeFileLike[];
};
