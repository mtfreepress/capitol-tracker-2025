# Build
npm run build

# Deploy
aws s3 sync build s3://projects.montanafreepress.org/capitol-tracker-2025 --delete --exact-timestamps
aws cloudfront create-invalidation --distribution-id E1G7ISX2SZFY34 --paths "/capitol-tracker-2025/*"