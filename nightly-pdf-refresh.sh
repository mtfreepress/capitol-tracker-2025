#!/bin/bash
# Nightly rebuild — fetches latest data from legislative-interface and redeploys.
# PDFs are now deployed directly from legislative-interface, not here.

measure_time() {
    local start_time=$(date +%s)
    echo "Running: $@"
    "$@"
    local end_time=$(date +%s)
    local elapsed_time=$((end_time - start_time))
    echo "Time taken: ${elapsed_time} seconds"
}

echo "Starting nightly rebuild at $(date)"

cd "$(dirname "$0")"

# Fetch latest pre-built data from legislative-interface
measure_time ./refresh-inputs.sh

# Build and deploy
measure_time ./build-and-deploy.sh

echo "Completed nightly rebuild at $(date)"