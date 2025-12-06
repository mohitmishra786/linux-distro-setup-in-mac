#ifndef MALLOC_DEBUG_H
#define MALLOC_DEBUG_H

#include <stddef.h>

// Weak symbols for memory debugging
__attribute__((weak)) void malloc_debug_init(void);
__attribute__((weak)) void malloc_debug_alloc(void *ptr, size_t size);
__attribute__((weak)) void malloc_debug_free(void *ptr);
__attribute__((weak)) void malloc_debug_report(void);

#endif

