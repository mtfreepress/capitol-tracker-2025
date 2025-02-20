#!/bin/bash
measure_time() {
    local start_time=$(date +%s)
    echo "Running: $@"
    "$@"
    local end_time=$(date +%s)
    local elapsed_time=$((end_time - start_time))
    echo "Time taken: ${elapsed_time} seconds"
}

# --------------------------------------------
# Prep work:

# Print start time
echo "Starting nightly PDF refresh at $(date)"

# Make sure we are in project root directory
cd "$(dirname "$0")"

# --------------------------------------------
# Data pipeline: 

# Check MTFP website CMS for stories associated with particular bills/lawmakers
measure_time node inputs/coverage/fetch.js

# Check laws-interface repo for bill/vote info pulled from official legislative system
echo "Fetching all data, this may take awhile..."
measure_time node inputs/bills/fetch.js

# Run the bill notes fetcher
echo "Fetching all bill notes..."
measure_time node inputs/nightly-full-refresh/fetch-all-bill-notes.js

# TODO: Fetch all bill text PDFs goes here:

# --------------------------------------------
# Build & Deploy:

echo "Building next app"
# Build
measure_time npx next build
echo "Deploying to AWS S3"
# Deploy
measure_time aws s3 sync build s3://projects.montanafreepress.org/capitol-tracker-2025 --delete
measure_time aws cloudfront create-invalidation --distribution-id E1G7ISX2SZFY34 --paths "/capitol-tracker-2025/*"

# --------------------------------------------
# Closing time:

# Print completion time
echo "Completed nightly PDF refresh at $(date)"