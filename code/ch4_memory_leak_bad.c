// memory_leak_bad.c - Demonstrates memory leak problem
// This is the DANGEROUS example - don't do this!
#include <stdlib.h>

char *global_buf = NULL;

__attribute__((constructor))
void init_buf() {
    global_buf = malloc(1024);
    // No corresponding destructor to free this memory
    // Memory leak if program terminates abnormally!
}

int main(void) {
    // Memory is never freed - leak!
    return 0;
}

