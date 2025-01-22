function generateCombinations() {
    const areas = document.getElementById('areas').value.split('\n').map(a => a.trim()).filter(a => a);
    const keywords = document.getElementById('keywords').value.split('\n').map(k => k.trim()).filter(k => k);

    let results = [];

    areas.forEach(area => {
        keywords.forEach(keyword => {
            results.push(`${keyword} i ${area}`);
        });
    });

    document.getElementById('output').innerText = results.join('\n');
}

function copyToClipboard() {
    const outputText = document.getElementById('output').innerText;
    
    if (!outputText) {
        alert('No generated text to copy!');
        return;
    }
    
    navigator.clipboard.writeText(outputText).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}