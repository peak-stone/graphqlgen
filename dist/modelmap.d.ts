import { ModelMap } from './types';
interface ModelsConfig {
    [typeName: string]: string;
}
export declare function buildModelMap(modelsConfig: ModelsConfig, outputDir: string): ModelMap;
export {};
