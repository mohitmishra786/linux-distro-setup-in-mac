// program2.c
#include <stdio.h>
#include <math.h>
#include <unistd.h>

int main(void) {
    printf("Cos(1.0) = %f\n", cos(1.0));
    sleep(10);  // Keep process alive for inspection
    return 0;
}

