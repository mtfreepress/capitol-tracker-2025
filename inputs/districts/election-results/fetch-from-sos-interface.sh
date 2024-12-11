# Fetches election counts we've pulled out of the Montana Secretary of State system seperately
# over at https://github.com/mtfreepress/sos-election-data-interface
# Run from repo root

# Legislative primary elex results
curl -o \
    ./inputs/districts/election-results/2024-primary-legislative-vote-counts.csv \
    https://raw.githubusercontent.com/mtfreepress/sos-election-data-interface/refs/heads/main/outputs/2024/primary/2024-primary-legislative-vote-counts.csv

# Legisltive general elex results
curl -o \
    ./inputs/districts/election-results/2024-general-legislative-vote-counts.csv \
    https://raw.githubusercontent.com/mtfreepress/sos-election-data-interface/refs/heads/main/outputs/2024/general/2024-general-legislative-vote-counts.csv

# Statewide general election results
# Fetches all of them, even though we're only interested in a couple for the Capitol Tracker project
curl -o \
    ./inputs/districts/election-results/2024-general-statewide-vote-counts.csv \
    https://raw.githubusercontent.com/mtfreepress/sos-election-data-interface/refs/heads/main/outputs/2024/general/2024-general-statewide-vote-counts.csv