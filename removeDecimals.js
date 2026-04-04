const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules')) filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.jsx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const jsxFiles = walkSync(path.join(__dirname, 'client/src'));
for (const file of jsxFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('.toFixed(2)')) {
    content = content.replace(/\.toFixed\(2\)/g, '.toFixed(0)');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
console.log('Done removing decimals.');
