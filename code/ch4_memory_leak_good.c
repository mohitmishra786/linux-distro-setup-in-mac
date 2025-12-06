// memory_leak_good.c - Proper cleanup with destructor
#include <stdio.h>
#include <stdlib.h>

char *global_buf = NULL;

__attribute__((constructor))
void init_buf() {
    global_buf = malloc(1024);
    if (global_buf) {
        printf("Constructor: Allocated 1024 bytes\n");
    }
}

__attribute__((destructor))
void cleanup_buf() {
    if (global_buf) {
        free(global_buf);
        global_buf = NULL;
        printf("Destructor: Freed memory\n");
    }
}

int main(void) {
    if (global_buf) {
        printf("Main: Using allocated buffer\n");
        // Use the buffer...
    }
    printf("Main: Exiting (destructor will clean up)\n");
    return 0;
}

