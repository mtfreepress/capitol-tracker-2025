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
app.use(`${basePath}/_next`, express.static(path.join(buildPath, '_next')));

// Serve static files (JS, CSS, etc.)
app.use(basePath, express.static(buildPath));

// Fallback route
app.get(`${basePath}/*`, (req, res) => {
    // Remove basePath from URL
    const relativePath = req.path.replace(basePath, '') || '/';
    const filePath = path.join(buildPath, relativePath);

    // Try to serve a file directly
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            res.sendFile(filePath);
        } else {
            // Fallback to index.html for client-side routing
            res.sendFile(path.join(buildPath, 'index.html'));
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
