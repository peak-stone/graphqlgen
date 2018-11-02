import { Language } from 'graphqlgen-json-schema';
export declare function upperFirst(s: string): string;
/**
 * Support for different path notation
 *
 * './path/to/index.ts' => './path/to/index.ts'
 * './path/to' => './path/to/index.ts'
 * './path/to/' => './path/to/index.ts'
 */
export declare function normalizeFilePath(filePath: string, language: Language): string;
