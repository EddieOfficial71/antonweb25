#!/usr/bin/env node

/**
 * Vercel Build Script
 * Prepares the project for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy all HTML, CSS, JS files to public directory
const filesToCopy = [
    'index.html', 'signup.html', 'login.html', 'dashboard.html',
    'admin.html', 'premium.html', 'chat-widget.html', 'popup-monitor.html',
    'test-api.html', 'firebase-init.js', 'script.js',
    'windows11-terminal.html',
    'auth.css', 'auth.js', 'style.css',
    'dashboard.css', 'dashboard.js',
    'admin.css', 'admin.js',
    'premium.css', 'premium.js',
    'chat.css', 'chat.js',
    'notifications.css', 'notifications.js',
    'favicon.svg'
];

filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(publicDir, file);
    
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied ${file}`);
    }
});

console.log('✅ Build complete - files ready for deployment');
