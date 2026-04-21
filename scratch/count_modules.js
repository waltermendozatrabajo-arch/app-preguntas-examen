const fs = require('fs');
const data = JSON.parse(fs.readFileSync('preguntas.json', 'utf8'));
const counts = {};
data.forEach(item => {
    const mod = item['Módulo/Categoría'] || item['Módulo'] || 'Sin Módulo';
    counts[mod] = (counts[mod] || 0) + 1;
});
console.log(JSON.stringify(counts, null, 2));
console.log('Total items:', data.length);
