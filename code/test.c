#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/fs.h>
#include <stdio.h>
#include <unistd.h>

int main() {
    int src = open("source.txt", O_RDONLY);
    if (src == -1) { perror("open src"); return 1; }
    int dest = open("dest.txt", O_WRONLY | O_CREAT, 0644);
    if (dest == -1) { perror("open dest"); close(src); return 1; }
    if (ioctl(dest, FICLONE, src) == -1) { perror("ioctl"); }
    close(src);
    close(dest);
    return 0;
}