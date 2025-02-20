#!/bin/bash
measure_time() {
    local start_time=$(date +%s)
    echo "Running: $@"
    "$@"
    local end_time=$(date +%s)
    local elapsed_time=$((end_time - start_time))
    echo "Time taken: ${elapsed_time} seconds"
}

# Print start time
echo "Starting nightly PDF refresh at $(date)"

# Make sure we are in project root directory
cd "$(dirname "$0")"

# Run the bill notes fetcher
echo "Fetching all bill notes..."
measure_time node inputs/nightly-full-refresh/fetch-all-bill-notes.js

# TODO: Fetch all bill text PDFs goes here:

# Print completion time
echo "Completed nightly PDF refresh at $(date)"