// custom_logger.c - Override weak symbols
#include <stdio.h>
#include <sys/time.h>
#include <string.h>

// Strong symbol overrides weak one
void get_timestamp(char *buffer, size_t size) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    snprintf(buffer, size, "%ld.%06ld", tv.tv_sec, tv.tv_usec);
}

// Custom format with colors
void format_log_entry(char *output, size_t size,
                     const char *timestamp,
                     const char *level,
                     const char *message) {
    const char *color = "";
    if (strcmp(level, "ERROR") == 0) color = "\033[31m";  // Red
    else if (strcmp(level, "WARN") == 0) color = "\033[33m";  // Yellow
    else if (strcmp(level, "INFO") == 0) color = "\033[32m";  // Green
    
    snprintf(output, size, "%s[%s] %-5s: %s\033[0m", 
             color, timestamp, level, message);
}

