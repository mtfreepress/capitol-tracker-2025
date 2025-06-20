# Montana Free Press Capitol Tracker — README.md

## Overview

This repository powers the [Montana Free Press Capitol Tracker](https://projects.montanafreepress.org/capitol-tracker-2025/), a public-facing web app that tracks Montana’s biannual legislative session. It is rebuilt every two years for the new session, and is designed to help journalists and the public follow bills, lawmakers, committees, and legislative actions in near real-time.

**Key features:**
- Static site built with Next.js (see `/src/pages` for endpoints)
- Data pipeline for ingesting, cleaning, and transforming legislative data
- Custom logic to handle Montana’s unique legislative quirks and messy data
- Deploys to AWS S3/CloudFront via GitHub Actions

---

## Getting Started

### 1. **Clone the Repo**

```bash
git clone https://github.com/mtfreepress/capitol-tracker-25.git
cd capitol-tracker-25
```

### 2. **Set Up the Upstream Data Source**

**Important:**  
You must fork the [legislative-interface](https://github.com/mtfreepress/legislative-interface/) repository and point all data-fetching scripts to your fork.  
This is the source for all raw bill, action, and vote data.

### 3. **Install Dependencies**

```bash
npm install
```

### 4. **Run the Data Pipeline**

This step fetches, cleans, and processes all legislative data into the format the frontend expects.

```bash
# Fetch and process all data (see scripts in /inputs and /process)
npm run fetch-all
# Or run the steps manually:
node inputs/coverage/fetch.js
node inputs/bills/fetch.js
node inputs/bills/fetch-bill-notes.js
node process/main.js
```

### 5. **Start the Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Deployment

Deployment is handled via GitHub Actions (see `.github/workflows/actions.yaml`).  
On push to `main`, the workflow:

- Runs the data pipeline
- Builds the Next.js static site
- Syncs the output to AWS S3
- Invalidates the CloudFront cache

**Manual deploy:**  
You can also run:

```bash
npm run build
# Then sync the build/ directory to S3 as in build-and-deploy.sh
```

---

## Directory Structure

- `/src/pages/` — All public-facing endpoints (e.g., `/governor`, `/house`, `/senate`, `/lawmakers/[key]`, `/committees/[key]`)
- `/process/` — Data processing logic (models, main.js, config)
- `/inputs/` — Scripts for fetching and updating raw data from upstream
- `/public/` — Static assets (PDFs, images, etc.)
- `/data/` — Generated data files used by the frontend

---

## Quirks & Gotchas

- **Session End Date:**  
  The session end date is set manually in `/process/config/session.js`.  
  **Always set this to a date well after the expected session end (e.g., July),** since the session can end early. This ensures bills aren’t marked dead prematurely.

- **Messy Data:**  
  The Montana Legislature’s data is inconsistent and often requires manual overrides or cleaning.  
  Expect to see lots of edge-case logic in `/process/models/Bill.js` and related files.

- **Upstream Data:**  
  All data comes from the `legislative-interface` repo.  
  **Fork it first** and update fetch scripts to point to your fork.

- **Bill Types:**  
  Bill types can be inconsistent (`"house bill"`, `"senate bill"`, `"budget bill"`, etc.).  
  Always check for new or unexpected types when updating data.

- **Manual Overrides:**  
  Some bills or actions require manual status overrides (see `/process/config/overrides.js`).

---

## Adding/Updating Data

- To update data, run the scripts in `/inputs/` and then the main process:
  ```bash
  node inputs/bills/fetch.js
  node process/main.js
  ```
- To add new bill types or handle new quirks, update `/process/config/procedure.js` and related model logic.

---

## Troubleshooting

- **Bills not showing up?**  
  Check the bill type and status in the processed data.  
  Use debug logs in `/process/main.js` and `/process/models/Bill.js`.

- **Frontend not updating?**  
  Make sure to re-run the data pipeline and restart the dev server.

- **Deployment issues?**  
  Check the GitHub Actions logs and AWS S3/CloudFront settings.

---

## Summary

- **Fork and point to the upstream data repo:** [https://github.com/mtfreepress/legislative-interface/](https://github.com/mtfreepress/legislative-interface/)
- **Set session end date far enough out**
- **Run the data pipeline before starting the frontend**
- **Expect to handle Montana-specific data quirks**

---

**If you get stuck, check the README, code comments, and previous commit messages. When in doubt, ask the last dev or open an issue!**