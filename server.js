const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Base path used in your Next.js config
const basePath = '/capitol-tracker-2025';

// Log requests
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

// Serve static assets
app.use(`${basePath}/_next`, express.static(path.join(__dirname, 'build/_next')));
app.use(basePath, express.static(path.join(__dirname, 'build')));

// Handle all routes
app.get('*', (req, res) => {
    // Remove the basePath if present at the beginning of the URL
    const url = req.url.startsWith(basePath) 
        ? req.url.substring(basePath.length) 
        : req.url;

    // If it's just '/', serve the index.html
    if (url === '/' || url === '') {
        return res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }

    const filePath = path.join(__dirname, 'build', url);
    const htmlFilePath = path.join(__dirname, 'build', `${url}/index.html`);
    
    // Check if the file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
    }
    
    // Check if there's an index.html in that directory
    if (fs.existsSync(htmlFilePath)) {
        return res.sendFile(htmlFilePath);
    }
    
    // For calendar paths with invalid dates, generate a redirect to the same URL with query param
    const calendarMatch = url.match(/^\/calendar\/(\d{2}-\d{2}-\d{4})\/?$/);
    if (calendarMatch) {
        const dateKey = calendarMatch[1];
        // This approach maintains the URL while sending invalid=true flag
        return res.redirect(302, `${basePath}/calendar/${dateKey}?invalid=true`);
    }
    
    // If nothing matched, serve the 404.html page
    res.status(404).sendFile(path.join(__dirname, 'build', '404.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`View the site at http://localhost:${port}${basePath}`);
});