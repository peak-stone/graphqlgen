import * as ts from 'typescript';
import { File } from 'graphqlgen-json-schema';
interface InterfaceNamesToFile {
    [interfaceName: string]: File;
}
export declare function getChildrenNodes(source: ts.Node | ts.SourceFile): ts.Node[];
export declare function findTypescriptInterfaceByName(filePath: string, interfaceName: string): ts.Node | undefined;
/**
 * Create a map of interface names to the path of the file in which they're defined
 * The first evaluated interfaces are always the chosen ones
 */
export declare function getTypeToFileMapping(files: File[]): InterfaceNamesToFile;
export {};
