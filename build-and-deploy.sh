
# Possible improvement:
# Build
npm run build

# Deploy HTML/JS/CSS files (excludes PDFs)
aws s3 sync build s3://projects.montanafreepress.org/capitol-tracker-2025 \
  --delete \
  --exact-timestamps \
  --exclude "*.pdf"

# Deploy PDFs only if they don't exist or if they've changed
aws s3 sync build s3://projects.montanafreepress.org/capitol-tracker-2025 \
  --exact-timestamps \
  --size-only \
  --include "*.pdf"

aws cloudfront create-invalidation --distribution-id E1G7ISX2SZFY34 --paths "/capitol-tracker-2025/*"

# Selectively invalidate CloudFront
# aws cloudfront create-invalidation --distribution-id E1G7ISX2SZFY34 --paths "/capitol-tracker-2025/index.html" "/capitol-tracker-2025/_next/*"


# Previous version:


# # Build
# npm run build

# # Deploy
# aws s3 sync build s3://projects.montanafreepress.org/capitol-tracker-2025 --delete --exact-timestamps --size-only --include "*.pdf" --max-concurrent-requests 10
# aws cloudfront create-invalidation --distribution-id E1G7ISX2SZFY34 --paths "/capitol-tracker-2025/*"
