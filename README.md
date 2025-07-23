# Montana Free Press Capitol Tracker

This project is a Next.js-based static site by [Jacob Olness](https://github.com/jolness1) and [Eric Dietrich](https://github.com/eidietrich) that transforms legislative data from Montana's Legislature into an accessible public-facing web application for [Montana Free Press](https://montanafreepress.org/). It processes bills, lawmakers, committees, votes, and documents to help journalists and citizens track Montana's biannual legislative sessions in near real-time.

Montana Free Press is a 501(c)(3) nonprofit newsroom that aims to provide Montanans with in-depth, nonpartisan news coverage.

A live version of the 2025 tracker can be found at [https://projects.montanafreepress.org/capitol-tracker-2025/](https://projects.montanafreepress.org/capitol-tracker-2025/)

---

## Quick Start

### 1. Fork the Upstream Data Repository

**Important:** You must first fork the [legislative-interface](https://github.com/mtfreepress/legislative-interface/) repository and update all data-fetching scripts to point to your fork.

### 2. Fork this repository and cleanup all old data in 
[`inputs/`](inputs/)  
[`public/`](public/)  
[`data/`](data/)  

### 3. Clone and Setup

```bash
git clone {forked-repo-url}
cd {forked-repo-name}
npm install
```

### 4. Run the Data Pipeline

```bash
# Fetch all upstream data and process it
# make refresh inputs executable
chmod +x ./refresh-inputs

# run the script
./refresh-inputs

# Or run steps manually:
node inputs/coverage/fetch.js           # MTFP article coverage
node inputs/bills/fetch.js              # Bill and action data
node inputs/bills/fetch-bill-notes.js   # PDFs and documents
node process/main.js                    # Transform data for frontend
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000/capitol-tracker-{year}](http://localhost:3000/capitol-tracker-{year}) to view the tracker.

---

## How the Data Pipeline Works

The pipeline consists of three main phases that transform raw legislative data into a public-facing website:

### Phase 1: Data Collection

| Script | Purpose |
|--------|---------|
| [`inputs/coverage/fetch.js`](inputs/coverage/fetch.js) | Downloads MTFP article data from CMS to link stories to bills/lawmakers |
| [`inputs/bills/fetch.js`](inputs/bills/fetch.js) | Downloads bill data and actions from the [legislative-interface](https://github.com/mtfreepress/legislative-interface/) repository |
| [`inputs/bills/fetch-bill-notes.js`](inputs/bills/fetch-bill-notes.js) | Downloads PDFs (fiscal notes, legal notes, amendments, veto letters, bill text) |

### Phase 2: Data Processing

| Script | Purpose |
|--------|---------|
| [`process/main.js`](process/main.js) | Main processing script that transforms raw data into frontend-ready JSON |
| [`process/models/Bill.js`](process/models/Bill.js) | Processes bill data, determines status, handles Montana-specific legislative quirks |
| [`process/models/Lawmaker.js`](process/models/Lawmaker.js) | Processes lawmaker data, calculates voting records and sponsored bills |

### Phase 3: Frontend Generation

| Component | Purpose |
|-----------|---------|
| [`src/pages/`](src/pages/) | Next.js pages for all public endpoints (`/bills/[key]`, `/lawmakers/[key]`, etc.) |
| [`src/components/`](src/components/) | React components for tables, charts, and UI elements |
| [`src/data/`](src/data/) | Generated JSON files consumed by frontend components |

---

## Key Features

- **Bill Tracking**: Progress through committees, floor votes, and governor's desk
- **Lawmaker Profiles**: Voting records, sponsored bills, committee assignments
- **Document Viewer**: Integrated PDF viewer for fiscal notes, legal notes, amendments
- **Vote Analysis**: Detailed breakdowns of legislative votes with party-line analysis
- **Calendar Integration**: Upcoming hearings and floor votes
- **Mobile Responsive**: Works on properly all devices from the iPhone SE to a 5K monitor

---

## Directory Structure

```
capitol-tracker-25/
├── src/
│   ├── pages/              # Next.js pages (routes)
│   ├── components/         # React components
│   ├── data/               # Generated JSON data files
│   └── config/             # Frontend configuration
├── process/
│   ├── main.js             # Main data processing script
│   ├── models/             # Data transformation classes
│   └── config/             # Processing configuration
├── inputs/
│   ├── bills/              # Bill data fetching scripts
│   ├── coverage/           # MTFP article fetching
│   └── annotations/        # Manual data annotations
├── public/
│   ├── fiscal-notes/       # Downloaded fiscal note PDFs
│   ├── legal-notes/        # Downloaded legal note PDFs
│   ├── amendments/         # Downloaded amendment PDFs
│   ├── veto-letters/       # Downloaded veto letter PDFs
│   └── bill-texts/         # Downloaded bill text PDFs
└── scripts/                # Utility scripts
```

---

## Session Configuration

For new legislative sessions, update these key files:

### Session Timing
- **Session End Date**: [`process/config/session.js`](process/config/session.js) - Set this **well after** expected session end to avoid marking bills as failed prematurely

### Data Sources
- **Upstream URLs**: Update all fetch scripts in [`inputs/`](inputs/) to point to your forked legislative-interface repository
- **API Endpoints**: Check that Montana's legislative API endpoints are still functional in `legislative-interface` repo

### Display Configuration
- **Legislature Number**: Update references to "69th Legislature" throughout the codebase
- **Session Year**: Update "2025" references in titles and metadata

---

## Montana Legislative Quirks

The Montana Legislature has unique procedures that require special handling:

### House Blast Motions
- Require 55 votes (constitutional majority) instead of simple majority (as of 2025 — note this threshold sometimes changes session to session)
- Handled in [`process/main.js`](process/main.js) with vote count overrides

### Bill Status Complexity
- Bills can be "blasted" from committee to floor
- Reconciliation process for different House/Senate versions
- Governor can suggest amendments or line-item veto appropriations

### Data Inconsistencies
- Committee names change between sessions
- Action descriptions vary for similar parliamentary moves
- Bill types can be inconsistent (`"house bill"` vs `"budget bill"`)

---

## Deployment

Deployment is handled via GitHub Actions in [`.github/workflows/actions.yaml`](.github/workflows/actions.yaml):

1. **Nightly Updates**: Runs data pipeline automatically during session
2. **Static Site Generation**: Builds Next.js app with `next export`
3. **AWS Deployment**: Syncs to S3 bucket with CloudFront invalidation

### Manual Deploy
```bash
# make build and deploy script executable
chmod +x ./build-and-deploy.sh

# run the script
./build-and-deploy.sh
```

---

## License

"New" BSD License (aka "3-clause"). See [LICENSE](LICENSE) for details.

---

## Development Notes

### Adding New Features
- **New Pages**: Add to [`src/pages/`](src/pages/) following Next.js conventions
- **New Data Types**: Add processing logic to [`process/models/`](process/models/)
- **New Documents**: Update [`fetch-bill-notes.js`](inputs/bills/fetch-bill-notes.js) for new PDF types

### Debugging
- **Bill Status Issues**: Check [`process/models/Bill.js`](process/models/Bill.js) for status determination logic
- **Missing Data**: Verify upstream data exists in legislative-interface repository
- **Frontend Errors**: Ensure data pipeline completed successfully before starting dev server

### Performance
- **Large Data Sets**: Individual bill actions are split into separate files to avoid memory issues
- **PDF Optimization**: PDFs are compressed and cached to minimize bandwidth
- **Static Generation**: Entire site is pre-generated for fast loading

---

## Troubleshooting

### Common Issues

1. **Bills not showing up**: Check bill type filtering in [`process/models/Bill.js`](process/models/Bill.js)
2. **Data pipeline fails**: Verify legislative-interface repository is accessible and has latest data
3. **PDFs not loading**: Check that PDF files exist in [`public/`](public/) directories
4. **Vote counts wrong**: Review House blast motion logic in [`process/main.js`](process/main.js)

### Dependencies
- **Node.js 18+**
- **Python 3.13+** (for make-lawmaker-roster.py)

#### Create Python Virtual Environment & Install Dependencies:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## Contributing

When adding new features:

1. **Follow conventions**: Use existing patterns for data processing and component structure
2. **Update documentation**: Add new scripts to this README
3. **Test thoroughly**: Montana's legislative data is messy and requires extensive edge case handling
4. **Consider performance**: Large datasets require careful memory management - avoiding loading the entire bills.json file if possible or more PDFs than absolutely needed. By the end of the session just the bills.json file can be 300MB or more and there are 1GB+ of PDFs

---

**For the next legislative session (2027)**:
1. Fork and update the [legislative-interface](https://github.com/mtfreepress/legislative-interface/) repository
2. Update session configuration files
3. Test all data fetching scripts for API changes
4. Update legislature numbers and session references throughout codebase
5. Verify committee names and structures
