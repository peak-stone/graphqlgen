import * as prettier from 'prettier';
import { GenerateArgs } from '../types';
import { GraphQLTypeField } from '../source-helper';
export declare function format(code: string, options?: prettier.Options): string;
export declare function printFieldLikeType(field: GraphQLTypeField, lookupType?: boolean): string;
export declare function generate(args: GenerateArgs): string;
