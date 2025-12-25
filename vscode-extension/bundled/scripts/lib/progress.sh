#!/bin/bash

# Progress Indicator Library for distrolab
# Provides beautiful, reusable progress tracking and display functions
# Works across all shell environments (bash, sh)

# Detect if colors should be used
USE_COLORS=true
if [ "$TERM" = "dumb" ] || [ ! -t 1 ]; then
    USE_COLORS=false
fi

# Color codes (disabled if TERM=dumb or not a TTY)
if [ "$USE_COLORS" = true ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    BLUE='\033[0;34m'
    YELLOW='\033[1;33m'
    MAGENTA='\033[0;35m'
    CYAN='\033[0;36m'
    LIGHT_GRAY='\033[0;37m'
    DARK_GRAY='\033[1;30m'
    NC='\033[0m' # No Color
else
    RED=''
    GREEN=''
    BLUE=''
    YELLOW=''
    MAGENTA=''
    CYAN=''
    LIGHT_GRAY=''
    DARK_GRAY=''
    NC=''
fi

# Progress bar characters
BLOCK_FULL='#'
BLOCK_HALF='='
BLOCK_EMPTY='-'
CHECKMARK='[OK]'
CROSS='[FAIL]'
ARROW='->'
DOT='*'

# Initialize progress tracking
PROGRESS_CURRENT=0
PROGRESS_TOTAL=0
PROGRESS_START_TIME=0

#############################################################################
# Progress Counter Display
# Usage: progress_step "1" "4" "Checking container status"
#############################################################################
progress_step() {
    local current=$1
    local total=$2
    local message=$3
    
    # Calculate percentage
    local percent=$((current * 100 / total))
    
    # Create colored output
    if [ "$current" -eq "$total" ]; then
        # Final step - green
        printf "${GREEN}[%d/%d]${NC} %s\n" "$current" "$total" "$message"
    else
        # In progress - cyan
        printf "${CYAN}[%d/%d]${NC} %s\n" "$current" "$total" "$message"
    fi
}

#############################################################################
# Progress Bar Display
# Usage: progress_bar "1" "4" "Checking container" "50"
#############################################################################
progress_bar() {
    local current=$1
    local total=$2
    local message=$3
    local percent=${4:-0}
    
    local bar_length=30
    local filled=$((percent * bar_length / 100))
    local empty=$((bar_length - filled))
    
    # Build bar
    local bar=""
    for ((i=0; i<filled; i++)); do
        bar="${bar}${BLOCK_FULL}"
    done
    for ((i=0; i<empty; i++)); do
        bar="${bar}${BLOCK_EMPTY}"
    done
    
    printf "\r${CYAN}[%d/%d]${NC} %s ${bar} %3d%%" "$current" "$total" "$message" "$percent"
}

#############################################################################
# Status Messages
#############################################################################
status_success() {
    local message=$1
    printf "${GREEN}${CHECKMARK}${NC} %s\n" "$message"
}

status_error() {
    local message=$1
    printf "${RED}${CROSS}${NC} %s\n" "$message"
}

status_warning() {
    local message=$1
    printf "${YELLOW}[WARN]${NC} %s\n" "$message"
}

status_info() {
    local message=$1
    printf "${BLUE}[INFO]${NC} %s\n" "$message"
}

status_doing() {
    local message=$1
    printf "${MAGENTA}${ARROW}${NC} %s" "$message"
}

status_done() {
    printf " ${GREEN}done${NC}\n"
}

#############################################################################
# Section Headers
#############################################################################
section_header() {
    local title=$1
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}${title}${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

section_summary() {
    local title=$1
    echo ""
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${MAGENTA}${title}${NC}"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

#############################################################################
# Multi-item Progress Tracking
#############################################################################
progress_init() {
    local total=$1
    PROGRESS_TOTAL=$total
    PROGRESS_CURRENT=0
    PROGRESS_START_TIME=$(date +%s)
}

progress_increment() {
    PROGRESS_CURRENT=$((PROGRESS_CURRENT + 1))
}

progress_get_elapsed() {
    local end_time=$(date +%s)
    local elapsed=$((end_time - PROGRESS_START_TIME))
    echo $elapsed
}

progress_format_time() {
    local seconds=$1
    local hours=$((seconds / 3600))
    local minutes=$(((seconds % 3600) / 60))
    local secs=$((seconds % 60))
    
    if [ $hours -gt 0 ]; then
        printf "%dh %dm %ds" $hours $minutes $secs
    elif [ $minutes -gt 0 ]; then
        printf "%dm %ds" $minutes $secs
    else
        printf "%ds" $secs
    fi
}

progress_estimate_remaining() {
    local elapsed=$(progress_get_elapsed)
    if [ $PROGRESS_CURRENT -eq 0 ]; then
        echo "calculating..."
        return
    fi
    
    local avg_time=$((elapsed / PROGRESS_CURRENT))
    local remaining_items=$((PROGRESS_TOTAL - PROGRESS_CURRENT))
    local est_remaining=$((avg_time * remaining_items))
    
    progress_format_time $est_remaining
}

#############################################################################
# Spinner for long operations
#############################################################################
spinner_chars=( "|" "/" "-" "\\" )

spinner_show() {
    local message=$1
    local pid=$2
    local spinner_idx=0
    
    while kill -0 $pid 2>/dev/null; do
        printf "\r${CYAN}${spinner_chars[$spinner_idx]}${NC} %s" "$message"
        spinner_idx=$(((spinner_idx + 1) % ${#spinner_chars[@]}))
        sleep 0.1
    done
    
    # Clear the line
    printf "\r                                                          \r"
}

#############################################################################
# Summary Statistics
#############################################################################
print_success_list() {
    local label=$1
    shift
    local items=("$@")
    
    if [ ${#items[@]} -gt 0 ]; then
        echo -e "${GREEN}${label}:${NC}"
        for item in "${items[@]}"; do
            echo -e "  ${GREEN}${CHECKMARK}${NC} ${item}"
        done
    fi
}

print_error_list() {
    local label=$1
    shift
    local items=("$@")
    
    if [ ${#items[@]} -gt 0 ]; then
        echo -e "${RED}${label}:${NC}"
        for item in "${items[@]}"; do
            echo -e "  ${RED}${CROSS}${NC} ${item}"
        done
    fi
}

print_summary_stats() {
    local successful=$1
    local failed=$2
    local total=$3
    local elapsed_sec=$4
    
    echo ""
    section_summary "Execution Summary"
    
    printf "Total items:     ${CYAN}%d${NC}\n" "$total"
    printf "Successful:      ${GREEN}%d${NC}\n" "$successful"
    
    if [ "$failed" -gt 0 ]; then
        printf "Failed:          ${RED}%d${NC}\n" "$failed"
    else
        printf "Failed:          ${GREEN}0${NC}\n"
    fi
    
    local elapsed_time=$(progress_format_time "$elapsed_sec")
    printf "Total time:      ${MAGENTA}%s${NC}\n" "$elapsed_time"
    
    # Calculate success rate
    local percent=$((successful * 100 / total))
    printf "Success rate:    ${CYAN}%d%%${NC}\n" "$percent"
    
    echo ""
}

#############################################################################
# Export all functions for use in sourced scripts
#############################################################################
export -f progress_step
export -f progress_bar
export -f status_success
export -f status_error
export -f status_warning
export -f status_info
export -f status_doing
export -f status_done
export -f section_header
export -f section_summary
export -f progress_init
export -f progress_increment
export -f progress_get_elapsed
export -f progress_format_time
export -f progress_estimate_remaining
export -f spinner_show
export -f print_success_list
export -f print_error_list
export -f print_summary_stats

