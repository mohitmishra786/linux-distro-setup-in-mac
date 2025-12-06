// relocations.c 
extern int global_var;         // Will need absolute relocation 
extern void far_func(void);    // Will need PLT relocation 
extern int array[];            // Will need PC-relative relocation 

int use_relocations(void) { 
    int result = global_var;           // R_X86_64_32S 
    far_func();                        // R_X86_64_PLT32 
    return result + array[global_var]; // R_X86_64_PC32 
}

