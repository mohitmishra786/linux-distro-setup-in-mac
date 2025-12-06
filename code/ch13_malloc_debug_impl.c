// malloc_debug_impl.c - Debug implementation
// NOTE: Don't include the header here - we want STRONG symbols, not weak ones
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct allocation {
    void *ptr;
    size_t size;
    struct allocation *next;
} allocation_t;

static allocation_t *allocations = NULL;
static size_t total_allocated = 0;
static size_t total_freed = 0;
static size_t peak_usage = 0;
static size_t current_usage = 0;

void malloc_debug_init(void) {
    printf("=== Memory Debugging Enabled ===\n");
    allocations = NULL;
    total_allocated = 0;
    total_freed = 0;
    peak_usage = 0;
    current_usage = 0;
}

void malloc_debug_alloc(void *ptr, size_t size) {
    if (!ptr) return;
    
    allocation_t *alloc = malloc(sizeof(allocation_t));
    alloc->ptr = ptr;
    alloc->size = size;
    alloc->next = allocations;
    allocations = alloc;
    
    total_allocated += size;
    current_usage += size;
    if (current_usage > peak_usage) {
        peak_usage = current_usage;
    }
    
    printf("ALLOC: %p [%zu bytes] (current: %zu)\n", ptr, size, current_usage);
}

void malloc_debug_free(void *ptr) {
    if (!ptr) return;
    
    allocation_t **current = &allocations;
    while (*current) {
        if ((*current)->ptr == ptr) {
            allocation_t *to_free = *current;
            size_t size = to_free->size;
            
            *current = to_free->next;
            free(to_free);
            
            total_freed += size;
            current_usage -= size;
            
            printf("FREE: %p [%zu bytes] (current: %zu)\n", ptr, size, current_usage);
            return;
        }
        current = &(*current)->next;
    }
    
    printf("FREE: %p [UNKNOWN - not tracked!]\n", ptr);
}

void malloc_debug_report(void) {
    printf("\n=== Memory Report ===\n");
    printf("Total allocated: %zu bytes\n", total_allocated);
    printf("Total freed: %zu bytes\n", total_freed);
    printf("Peak usage: %zu bytes\n", peak_usage);
    printf("Current usage: %zu bytes\n", current_usage);
    printf("Leaked: %zu bytes\n", current_usage);
    
    if (allocations) {
        printf("\nLeaked allocations:\n");
        allocation_t *current = allocations;
        while (current) {
            printf("  %p: %zu bytes\n", current->ptr, current->size);
            current = current->next;
        }
    }
}

