// definitions.c 
#include <stdio.h>

int global_var = 42; 
int array[] = {1, 2, 3, 4, 5}; 

void far_func(void) { 
    printf("far_func called\n");
}

// Main function to create a complete executable
int main(void) {
    extern int use_relocations(void);
    
    printf("global_var = %d\n", global_var);
    printf("array[0] = %d\n", array[0]);
    
    int result = use_relocations();
    printf("use_relocations() returned: %d\n", result);
    
    return 0;
}

