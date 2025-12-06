// malloc_wrapper.c - Allocation wrapper
#include "ch13_malloc_debug.h"
#include <stdlib.h>
#include <stdio.h>

// Weak empty implementations
__attribute__((weak)) void malloc_debug_init(void) {}
__attribute__((weak)) void malloc_debug_alloc(void *ptr, size_t size) {}
__attribute__((weak)) void malloc_debug_free(void *ptr) {}
__attribute__((weak)) void malloc_debug_report(void) {}

void *debug_malloc(size_t size) {
    void *ptr = malloc(size);
    malloc_debug_alloc(ptr, size);
    return ptr;
}

void debug_free(void *ptr) {
    malloc_debug_free(ptr);
    free(ptr);
}

