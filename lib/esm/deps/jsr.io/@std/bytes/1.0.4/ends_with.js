// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Returns `true` if the suffix array appears at the end of the source array,
 * `false` otherwise.
 *
 * The complexity of this function is `O(suffix.length)`.
 *
 * @param source Source array to check.
 * @param suffix Suffix array to check for.
 * @returns `true` if the suffix array appears at the end of the source array,
 * `false` otherwise.
 *
 * @example Basic usage
 * ```ts
 * import { endsWith } from "@std/bytes/ends-with";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const suffix = new Uint8Array([1, 2, 3]);
 *
 * assertEquals(endsWith(source, suffix), true);
 * ```
 */
export function endsWith(source, suffix) {
    const diff = source.length - suffix.length;
    if (diff < 0) {
        return false;
    }
    for (let i = suffix.length - 1; i >= 0; i--) {
        if (source[diff + i] !== suffix[i]) {
            return false;
        }
    }
    return true;
}
