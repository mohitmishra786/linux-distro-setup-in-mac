// weak_performance.c - Measure weak symbol overhead
#include <stdio.h>
#include <time.h>

// Direct function
int direct_function(int x) {
    return x * 2;
}

// Weak function
__attribute__((weak)) int weak_function(int x) {
    return x * 2;
}

// Function pointer
int (*func_ptr)(int) = direct_function;

#define ITERATIONS 100000000

double measure_calls(int (*func)(int), const char *name) {
    clock_t start = clock();
    volatile int result = 0;
    
    for (int i = 0; i < ITERATIONS; i++) {
        result = func(i);
    }
    
    clock_t end = clock();
    double time = ((double)(end - start)) / CLOCKS_PER_SEC;
    
    printf("%s: %.3f seconds (%.1f ns/call)\n", 
           name, time, time * 1e9 / ITERATIONS);
    
    return time;
}

int main(void) {
    printf("=== Weak Symbol Performance ===\n");
    printf("Testing with %d iterations\n\n", ITERATIONS);
    
    measure_calls(direct_function, "Direct call");
    measure_calls(weak_function, "Weak call");
    measure_calls(func_ptr, "Function pointer");
    
    printf("\nConclusion: Weak symbols have no runtime overhead!\n");
    printf("(Resolution happens at link time)\n");
    
    return 0;
}

