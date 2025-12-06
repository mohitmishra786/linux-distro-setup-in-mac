// memory_test.c
#include <stdio.h>

// Different types of data to observe placement
const char firmware_version[] = "v1.0.0";  // Read only data
int initialized_var = 42;                   // Initialized data
int uninitialized_var;                      // BSS section
char large_buffer[8192];                    // Large BSS allocation

void critical_function(void) {
    printf("This is a critical function\n");
}

int main(void) {
    printf("Firmware version: %s\n", firmware_version);
    printf("Variables at: %p, %p\n", 
           &initialized_var, &uninitialized_var);
    return 0;
}

