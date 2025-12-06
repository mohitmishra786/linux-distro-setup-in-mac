// link_observer.c
#define _GNU_SOURCE  // Required for Dl_info and dladdr
#include <stdio.h>
#include <dlfcn.h>
#include "ch9_mathops.h"

void print_function_address(const char* name, void* addr) {
    Dl_info info;
    if (dladdr(addr, &info)) {
        printf("%-20s: %p (from %s)\n", name, addr, info.dli_fname);
    }
}

int main(void) {
    printf("=== Before first call ===\n");
    // Function pointers through PLT
    void* plt_add = (void*)&add;
    print_function_address("add@plt", plt_add);
    
    printf("\n=== First call ===\n");
    add(1.0, 2.0);  // Triggers symbol resolution
    
    printf("\n=== After first call ===\n");
    // Now the GOT is updated with the real address
    print_function_address("add (resolved)", plt_add);
    
    return 0;
}

