#include <stdio.h> 
extern void log_message(const char *level, const char *message); 
 
int main(void) { 
    log_message("INFO", "Application started"); 
    log_message("DEBUG", "Processing data"); 
    return 0; 
}