const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

const basePath = '/capitol-tracker-2025';
const buildPath = path.join(__dirname, 'build');

// Log requests
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

// Serve _next assets
// Serve _next assets both at the deployment basePath and root (local testing)
app.use(`${basePath}/_next`, express.static(path.join(buildPath, '_next')));
app.use('/_next', express.static(path.join(buildPath, '_next')));

// Serve static files (JS, CSS, etc.) at both the root and the deployment basePath
app.use(basePath, express.static(buildPath));
app.use('/', express.static(buildPath));

// Fallback route
app.get(`${basePath}/*`, (req, res) => {
    // Remove basePath from URL
    const relativePath = req.path.replace(basePath, '') || '/';
    const filePath = path.join(buildPath, relativePath);

    // Try to serve a file directly
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            // If it's an HTML file, rewrite any absolute production URLs to local basePath
            if (filePath.endsWith('.html')) {
                fs.readFile(filePath, 'utf8', (readErr, data) => {
                    if (readErr) return res.sendFile(filePath);
                    const replaced = data.replace(/https:\/\/projects\.montanafreepress\.org\/capitol-tracker-2025/g, basePath);
                    res.type('html').send(replaced);
                });
            } else {
                res.sendFile(filePath);
            }
        } else {
            // Fallback to index.html for client-side routing; rewrite asset URLs for local testing
            const indexPath = path.join(buildPath, 'index.html');
            fs.readFile(indexPath, 'utf8', (readErr, data) => {
                if (readErr) return res.sendFile(indexPath);
                const replaced = data.replace(/https:\/\/projects\.montanafreepress\.org\/capitol-tracker-2025/g, basePath);
                res.type('html').send(replaced);
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
