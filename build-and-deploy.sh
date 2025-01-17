# Build
npm run build

# Deploy
aws s3 sync build s3://projects.montanafreepress.org/capitol-tracker-2025 --delete
aws cloudfront create-invalidation --distribution-id E3LVPS3XLJHLL5 --paths "/capitol-tracker-2025/*"
