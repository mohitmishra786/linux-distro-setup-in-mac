// logging_library_v2.c - Using weak symbols
#include <stdio.h>
#include <time.h>

// Weak default implementation
__attribute__((weak)) void get_timestamp(char *buffer, size_t size) {
    time_t now = time(NULL);
    strftime(buffer, size, "%Y-%m-%d %H:%M:%S", localtime(&now));
}

// Weak hook for custom formatting
__attribute__((weak)) void format_log_entry(char *output, size_t size,
                                           const char *timestamp,
                                           const char *level,
                                           const char *message) {
    snprintf(output, size, "[%s] %s: %s", timestamp, level, message);
}

void log_message(const char *level, const char *message) {
    char timestamp[64];
    char formatted[256];
    
    get_timestamp(timestamp, sizeof(timestamp));
    format_log_entry(formatted, sizeof(formatted), timestamp, level, message);
    
    printf("%s\n", formatted);
}

