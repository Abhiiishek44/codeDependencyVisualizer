"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIpcId = generateIpcId;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isDefined = isDefined;
exports.normalizePathSeparators = normalizePathSeparators;
exports.getFileExtension = getFileExtension;
exports.getFileName = getFileName;
exports.getRelativePath = getRelativePath;
exports.sleep = sleep;
exports.withTimeout = withTimeout;
exports.debounce = debounce;
exports.unique = unique;
exports.chunk = chunk;
exports.groupBy = groupBy;
exports.truncate = truncate;
exports.capitalize = capitalize;
exports.camelToKebab = camelToKebab;
exports.toErrorMessage = toErrorMessage;
exports.createError = createError;
// ─── IPC ID Generator ────────────────────────────────────────────────────────
let _counter = 0;
function generateIpcId() {
    return `ipc-${Date.now()}-${++_counter}`;
}
// ─── Type Guards ─────────────────────────────────────────────────────────────
function isString(value) {
    return typeof value === 'string';
}
function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isDefined(value) {
    return value !== null && value !== undefined;
}
// ─── Path Utilities ──────────────────────────────────────────────────────────
function normalizePathSeparators(filePath) {
    return filePath.replace(/\\/g, '/');
}
function getFileExtension(filePath) {
    const parts = filePath.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
}
function getFileName(filePath, withExtension = true) {
    const normalized = normalizePathSeparators(filePath);
    const base = normalized.split('/').pop() ?? '';
    if (withExtension)
        return base;
    const dotIndex = base.lastIndexOf('.');
    return dotIndex > 0 ? base.slice(0, dotIndex) : base;
}
function getRelativePath(from, to) {
    const fromParts = normalizePathSeparators(from).split('/');
    const toParts = normalizePathSeparators(to).split('/');
    while (fromParts.length > 0 && toParts.length > 0 && fromParts[0] === toParts[0]) {
        fromParts.shift();
        toParts.shift();
    }
    const ups = fromParts.length > 0 ? fromParts.map(() => '..') : ['.'];
    return [...ups, ...toParts].join('/');
}
// ─── Promise Utilities ────────────────────────────────────────────────────────
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms));
    return Promise.race([promise, timeout]);
}
function debounce(fn, delay) {
    let timer;
    return ((...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    });
}
// ─── Array Utilities ──────────────────────────────────────────────────────────
function unique(arr) {
    return [...new Set(arr)];
}
function chunk(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
function groupBy(arr, keyFn) {
    return arr.reduce((acc, item) => {
        const key = keyFn(item);
        if (!acc[key])
            acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
}
// ─── String Utilities ─────────────────────────────────────────────────────────
function truncate(str, maxLength, ellipsis = '…') {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
// ─── Error Utilities ──────────────────────────────────────────────────────────
function toErrorMessage(err) {
    if (err instanceof Error)
        return err.message;
    if (isString(err))
        return err;
    return 'An unknown error occurred';
}
function createError(message, code) {
    const error = new Error(message);
    if (code)
        error.code = code;
    return error;
}
//# sourceMappingURL=index.js.map