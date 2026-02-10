const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');
const indexHtmlPath = path.join(__dirname, 'index.html');

// 1. Read and update package.json
try {
    const packageJson = require(packageJsonPath);
    const currentVersion = packageJson.version;
    const versionParts = currentVersion.split('.');
    
    // Increment patch version
    versionParts[2] = parseInt(versionParts[2], 10) + 1;
    const newVersion = versionParts.join('.');
    
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`Updated package.json: ${currentVersion} -> ${newVersion}`);

    // 2. Read and update index.html
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Update version-tag
    const versionTagRegex = /<div class="version-tag">v.*?<\/div>/;
    if (versionTagRegex.test(indexHtml)) {
        indexHtml = indexHtml.replace(versionTagRegex, `<div class="version-tag">v${newVersion}</div>`);
        console.log(`Updated index.html version-tag to v${newVersion}`);
    } else {
        console.error('Could not find <div class="version-tag"> in index.html');
    }

    // Update title
    // Look for text like "Tracker Donaciones Pocket Ants v1.3" or similar and replace the version part
    const titleRegex = /<title>(.*?)v.*?<\/title>/;
    if (titleRegex.test(indexHtml)) {
        indexHtml = indexHtml.replace(titleRegex, (match, p1) => `<title>${p1}v${newVersion}</title>`);
        console.log(`Updated index.html title to include v${newVersion}`);
    } else {
        console.warn('Could not find <title> with version pattern in index.html');
    }

    fs.writeFileSync(indexHtmlPath, indexHtml);
    console.log('Successfully updated version files.');

} catch (error) {
    console.error('Error updating version:', error);
    process.exit(1);
}
