#include <stdio.h> 
#include <time.h> 
 
// What if the user wants to provide their own timestamp function? 
void get_timestamp(char *buffer, size_t size) { 
    time_t now = time(NULL); 
    strftime(buffer, size, "%Y-%m-%d %H:%M:%S", localtime(&now)); 
} 
 
void log_message(const char *level, const char *message) { 
    char timestamp[32]; 
    get_timestamp(timestamp, sizeof(timestamp)); 
    printf("[%s] %s: %s\n", timestamp, level, message); 
} 
