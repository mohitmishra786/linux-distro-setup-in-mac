// mathops.c
#include "ch9_mathops.h"
#include <stdio.h>

// Add version information
const char* mathops_version(void) {
    return "MathOps Library v1.0.0";
}

double add(double a, double b) {
    printf("[MathOps] Adding %.2f + %.2f\n", a, b);
    return a + b;
}

double subtract(double a, double b) {
    printf("[MathOps] Subtracting %.2f - %.2f\n", a, b);
    return a - b;
}

double multiply(double a, double b) {
    printf("[MathOps] Multiplying %.2f × %.2f\n", a, b);
    return a * b;
}

double divide(double a, double b) {
    printf("[MathOps] Dividing %.2f ÷ %.2f\n", a, b);
    if (b == 0) {
        fprintf(stderr, "[MathOps] ERROR: Division by zero!\n");
        return 0;
    }
    return a / b;
}

