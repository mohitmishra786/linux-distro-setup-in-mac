// performance_test.c - Demonstrate section attributes for performance optimization
#include <stdio.h>

// Regular function - will be placed in .text section
void regular_function(void) {
    printf("This is a regular function\n");
}

// Performance-critical function - will be placed in .text.hot section
// The linker script will collect all .text.hot* sections into .text.critical
__attribute__((section(".text.hot")))
void performance_critical_function(void) {
    printf("This is a performance-critical function\n");
}

// Another hot function
__attribute__((section(".text.hot")))
void another_hot_function(void) {
    printf("Another hot function\n");
}

int main(void) {
    printf("=== Performance Layout Test ===\n\n");
    
    regular_function();
    performance_critical_function();
    another_hot_function();
    
    printf("\nCheck section placement with: readelf --sections performance_test\n");
    printf("Look for .text.critical section containing the hot functions\n");
    
    return 0;
}

