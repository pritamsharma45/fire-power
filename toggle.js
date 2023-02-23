const fs = require('fs');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
tsconfig.compilerOptions.jsx = 'react-jsx';
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
