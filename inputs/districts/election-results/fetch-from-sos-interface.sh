# Fetches election counts we've pulled out of the Montana Secretary of State system seperately
# over at https://github.com/mtfreepress/sos-election-data-interface
# Run from repo root

# 2024 Legislative primary elex results
curl -o \
    ./inputs/districts/election-results/2024-primary-legislative-vote-counts.csv \
    https://raw.githubusercontent.com/mtfreepress/sos-election-data-interface/refs/heads/main/outputs/2024/primary/2024-primary-legislative-vote-counts.csv

# 2024 Legislative general elex results
curl -o \
    ./inputs/districts/election-results/2024-general-legislative-vote-counts.csv \
    https://raw.githubusercontent.com/mtfreepress/sos-election-data-interface/refs/heads/main/outputs/2024/general/2024-general-legislative-vote-counts.csv

# 2022 Legislative primary elex results
# Necessary for holdover senators who were elected in 2022
curl -o \
    ./inputs/districts/election-results/2022-primary-legislative-vote-counts.csv \
    https://raw.githubusercontent.com/mtfreepress/sos-election-data-interface/refs/heads/main/outputs/2022/primary/2022-primary-legislative-vote-counts.csv

# 2022 Legislative general elex results
curl -o \
    ./inputs/districts/election-results/2022-general-legislative-vote-counts.csv \
    https://raw.githubusercontent.com/mtfreepress/sos-election-data-interface/refs/heads/main/outputs/2022/general/2022-general-legislative-vote-counts.csv

# 2024 Statewide general election results
# Precinct-by-precinct so we can tabulate statewide results in specific legislative districts
curl -o \
    ./inputs/districts/election-results/2024-general-statewide-precinct-vote-counts.csv \
    https://raw.githubusercontent.com/mtfreepress/sos-election-data-interface/refs/heads/main/cleaned/2024/general/precinct-results.csv