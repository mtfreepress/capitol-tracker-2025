
# Build
npm run build

# Deploy HTML/JS/CSS only — PDFs and assets are deployed by legislative-interface
aws s3 sync build s3://projects.montanafreepress.org/capitol-tracker-2025 \
  --delete \
  --exact-timestamps \
  --exclude "bill-texts/*" \
  --exclude "amendments/*" \
  --exclude "fiscal-notes/*" \
  --exclude "legal-notes/*" \
  --exclude "veto-letters/*"

# Invalidate CloudFront for site pages only
aws cloudfront create-invalidation --distribution-id E1G7ISX2SZFY34 --paths "/capitol-tracker-2025/*"
