// loading_phases.c - Demonstrate different loading phases
#define _GNU_SOURCE  // Required for dl_iterate_phdr and struct dl_phdr_info
#include <stdio.h>
#include <stdlib.h>
#include <string.h>  // Required for strstr
#include <unistd.h>
#include <sys/mman.h>
#include <sys/auxv.h>
#include <elf.h>
#include <link.h>    // Must come after _GNU_SOURCE for struct dl_phdr_info

// Global variables to observe memory layout
int initialized_data = 42;
int uninitialized_data;
const char constant_data[] = "This is read-only";

// Function to print memory map
void print_memory_map(void) {
    FILE *maps = fopen("/proc/self/maps", "r");
    if (!maps) return;
    
    printf("\n=== Process Memory Map ===\n");
    char line[256];
    while (fgets(line, sizeof(line), maps)) {
        if (strstr(line, "loading_phases") ||    // Our executable
            strstr(line, "[stack]") ||   // Stack
            strstr(line, "[heap]") ||    // Heap
            strstr(line, "ld-") ||       // Dynamic linker
            strstr(line, "[vdso]")) {    // VDSO
            printf("%s", line);
        }
    }
    fclose(maps);
}

// Callback for dl_iterate_phdr
static int callback(struct dl_phdr_info *info, size_t size, void *data) {
    printf("Library: %s\n", info->dlpi_name[0] ? info->dlpi_name : "(main)");
    printf("  Base address: %p\n", (void *)info->dlpi_addr);
    printf("  %d segments loaded\n", info->dlpi_phnum);
    return 0;
}

int main(int argc, char *argv[], char *envp[]) {
    printf("=== Executable Loading Analysis ===\n");
    
    // 1. Print basic process info
    printf("\n1. Process Information:\n");
    printf("   PID: %d\n", getpid());
    printf("   Executable: %s\n", argv[0]);
    
    // 2. Examine auxiliary vector (passed by kernel)
    printf("\n2. Auxiliary Vector (Kernel → Program Communication):\n");
    printf("   Page size: %ld bytes\n", getauxval(AT_PAGESZ));
    printf("   Entry point: %p\n", (void *)getauxval(AT_ENTRY));
    printf("   Program headers: %p\n", (void *)getauxval(AT_PHDR));
    printf("   Number of headers: %ld\n", getauxval(AT_PHNUM));
    printf("   Interpreter base: %p\n", (void *)getauxval(AT_BASE));
    
    // 3. Show memory addresses
    printf("\n3. Memory Layout:\n");
    printf("   Code (main): %p\n", (void *)main);
    printf("   Initialized data: %p (value: %d)\n", 
           &initialized_data, initialized_data);
    printf("   Uninitialized data: %p\n", &uninitialized_data);
    printf("   Constant data: %p\n", constant_data);
    printf("   Stack (local var): %p\n", &argc);
    printf("   Heap (malloc): %p\n", malloc(1));
    
    // 4. Show loaded libraries
    printf("\n4. Loaded Libraries:\n");
    dl_iterate_phdr(callback, NULL);
    
    // 5. Display memory map
    print_memory_map();
    
    return 0;
}

