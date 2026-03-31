#!/bin/sh
# Updates dynamic inputs by fetching pre-built data from legislative-interface
# All data processing now happens in legislative-interface; this just downloads results.

GITHUB_RAW_BASE="https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main"

# Helper to download a file with optional GitHub auth
fetch_file() {
    local url="$1"
    local dest="$2"
    mkdir -p "$(dirname "$dest")"
    if [ -n "$GITHUB_TOKEN" ]; then
        curl -sS -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" -o "$dest" "$url"
    else
        curl -sS -o "$dest" "$url"
    fi
}

echo "=== Fetching pre-built data from legislative-interface ==="

# Fetch main data files into src/data/
DATA_FILES="bills.json lawmakers.json header.json articles.json calendar.json house.json senate.json governor.json bill-categories.json process-annotations.json contact.json"
for file in $DATA_FILES; do
    echo "Fetching $file..."
    fetch_file "$GITHUB_RAW_BASE/output/data/$file" "src/data/$file"
done

# Fetch per-bill action files
echo "Fetching bill actions list..."
BILL_LIST_URL="$GITHUB_RAW_BASE/interface/list-bills-2.json"
if [ -n "$GITHUB_TOKEN" ]; then
    BILLS_JSON=$(curl -sS -H "Authorization: token $GITHUB_TOKEN" "$BILL_LIST_URL")
else
    BILLS_JSON=$(curl -sS "$BILL_LIST_URL")
fi

# Parse bill identifiers and download action files
echo "$BILLS_JSON" | node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
data.forEach(b => console.log(b.billType + '-' + b.billNumber));
" | while read -r bill_id; do
    fetch_file "$GITHUB_RAW_BASE/output/data/bills/${bill_id}-actions.json" "src/data/bills/${bill_id}-actions.json"
done
echo "Bill actions fetched."

# Fetch document index and bills-with-amendments into public/
echo "Fetching document-index.json..."
fetch_file "$GITHUB_RAW_BASE/output/document-index.json" "public/document-index.json"

echo "Fetching bills-with-amendments.txt..."
fetch_file "$GITHUB_RAW_BASE/output/bills-with-amendments.txt" "public/bills-with-amendments.txt"

echo "=== Data refresh complete ==="