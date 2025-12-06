// symbol_explorer.c - Examine symbol types
#include <stdio.h>
#include <stdlib.h>

// Different symbol types
int strong_global = 42;
__attribute__((weak)) int weak_global = 10;
static int static_global = 100;

void strong_function(void) {
    printf("Strong function\n");
}

__attribute__((weak)) void weak_function(void) {
    printf("Weak function (default)\n");
}

static void static_function(void) {
    printf("Static function\n");
}

// Weak with no definition (like a declaration)
__attribute__((weak)) void optional_function(void);

int main(void) {
    printf("=== Symbol Type Demonstration ===\n");
    
    printf("Strong global: %d\n", strong_global);
    printf("Weak global: %d\n", weak_global);
    printf("Static global: %d\n", static_global);
    
    strong_function();
    weak_function();
    static_function();
    
    // Check if optional function exists
    if (optional_function) {
        printf("Optional function is available\n");
        optional_function();
    } else {
        printf("Optional function is not available\n");
    }
    
    return 0;
}

