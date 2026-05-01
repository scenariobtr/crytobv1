const fs = require('fs');
const path = 'src/app/page.tsx';
const buf = fs.readFileSync(path);

// The error is at index 42925 (0xE0 followed by space)
// We want to replace the part from the error until the next known valid tag.
const searchIndex = 42925;
if (buf[searchIndex] === 0xE0) {
    console.log('Found corrupted byte at', searchIndex);
    
    // Find the next div start
    const divSearch = Buffer.from('<div className="space-y-8 col-span-2">', 'utf8');
    const nextDiv = buf.indexOf(divSearch, searchIndex);
    
    if (nextDiv !== -1) {
        console.log('Found next div at', nextDiv);
        
        const part1 = buf.slice(0, searchIndex);
        const part2 = buf.slice(nextDiv);
        
        // Reconstruct the missing Thai characters and closing tags
        const middle = Buffer.from('กรณ์</p>\n                </div>\n\n                ', 'utf8');
        
        const finalBuf = Buffer.concat([part1, middle, part2]);
        fs.writeFileSync(path, finalBuf);
        console.log('File fixed successfully.');
    } else {
        console.log('Could not find next div.');
    }
} else {
    console.log('Corrupted byte not found at expected index.', buf[searchIndex]);
}
