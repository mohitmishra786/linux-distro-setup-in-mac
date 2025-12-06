// init_order_bad.c - Demonstrates initialization order problem
// This is the DANGEROUS example - don't do this!

// file1.c
int a = 42;
int b = a + 1;  // May not work as expected across translation units

// The problem: if this is split across files, initialization order is undefined

