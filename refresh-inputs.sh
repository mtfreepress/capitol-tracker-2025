#!/bin/sh
# Updates dynamic inputs

# inputs/lawmakers/ (roster, district info etc.) should be static

# Check MTFP website CMS for stories associated with particular bills/lawmakers
node inputs/coverage/fetch.mjs

# Check Open Montana's Legislative Council Data Project instance for bill hearing transcripts
# node inputs/hearing-transcripts/fetch.js

# Check laws-interface repo for bill/vote info pulled from official legislative system
node inputs/bills/fetch.mjs

# Grab bill legal and fiscal notes
node inputs/bills/fetch-bill-notes.js

# Grab committee data 
# node inputs/committees/fetch-committees.js

# Run data process
node  process/main.js