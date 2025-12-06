// resolution_test.c - Symbol resolution demonstration
#include <stdio.h>

// Case 1: Weak symbol
__attribute__((weak)) int value1 = 10;

// Case 2: Multiple weak symbols
__attribute__((weak)) int value2 = 20;

// Case 3: Weak function
__attribute__((weak)) void function1(void) {
    printf("Weak function1\n");
}

// Case 4: Weak undefined symbol
__attribute__((weak)) extern void undefined_func(void);

