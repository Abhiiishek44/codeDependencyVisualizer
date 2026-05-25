export declare function generateIpcId(): string;
export declare function isString(value: unknown): value is string;
export declare function isNumber(value: unknown): value is number;
export declare function isObject(value: unknown): value is Record<string, unknown>;
export declare function isDefined<T>(value: T | null | undefined): value is T;
export declare function normalizePathSeparators(filePath: string): string;
export declare function getFileExtension(filePath: string): string;
export declare function getFileName(filePath: string, withExtension?: boolean): string;
export declare function getRelativePath(from: string, to: string): string;
export declare function sleep(ms: number): Promise<void>;
export declare function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T>;
export declare function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T;
export declare function unique<T>(arr: T[]): T[];
export declare function chunk<T>(arr: T[], size: number): T[][];
export declare function groupBy<T, K extends string | number>(arr: T[], keyFn: (item: T) => K): Record<K, T[]>;
export declare function truncate(str: string, maxLength: number, ellipsis?: string): string;
export declare function capitalize(str: string): string;
export declare function camelToKebab(str: string): string;
export declare function toErrorMessage(err: unknown): string;
export declare function createError(message: string, code?: string): Error & {
    code?: string;
};
//# sourceMappingURL=index.d.ts.map