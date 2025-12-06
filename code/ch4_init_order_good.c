// init_order_good.c - Safe way to handle initialization order
#include <stdio.h>

// Solution 1: Use compile-time constants when possible
// Good: compile-time evaluation, no runtime dependency
const int CONSTANT_A = 42;
const int CONSTANT_B = CONSTANT_A + 1;  // Always safe - compile-time

// Solution 2: Use a function for initialization that depends on other globals
// This avoids the initialization order problem entirely
static int computed_value = 0;
static int initialized = 0;

int get_computed_value(void) {
    if (!initialized) {
        extern int a;  // Reference to a (initialized before first call)
        computed_value = a + 10;  // Safe: a is initialized before main()
        initialized = 1;
    }
    return computed_value;
}

// Solution 3: Initialize in a constructor with explicit ordering
int a = 42;
int b = 0;  // Initialize to 0, set properly in constructor

__attribute__((constructor))
void init_b() {
    b = a + 1;  // Safe: a is already initialized before constructor runs
}

int main(void) {
    printf("CONSTANT_A = %d, CONSTANT_B = %d\n", CONSTANT_A, CONSTANT_B);
    printf("a = %d, b = %d\n", a, b);
    printf("computed_value = %d\n", get_computed_value());
    return 0;
}

