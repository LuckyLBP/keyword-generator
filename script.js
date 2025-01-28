function openTab(evt, tabName) {
    const tabcontent = document.querySelectorAll('.tabcontent');
    const tablinks = document.querySelectorAll('.tablink');
    
    tabcontent.forEach(tab => tab.classList.remove('active'));
    tablinks.forEach(link => link.classList.remove('active'));
    
    evt.currentTarget.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function generateCombinations() {
    const areas = getCleanList('areas');
    const keywords = getCleanList('keywords');
    let results = [];
    const activeTab = document.querySelector('.tabcontent.active').id;

    if (activeTab === 'basic') {
        results = generateBasicCombinations(areas, keywords);
    } else if (activeTab === 'custom') {
        results = generateCustomCombinations(areas, keywords);
    } else if (activeTab === 'permutations') {
        results = generatePermutations(areas, keywords);
    }

    results = processResults(results);
    displayResults(results);
}

function getCleanList(elementId) {
    return document.getElementById(elementId).value
        .split('\n')
        .map(item => item.trim())
        .filter(item => item);
}

function generateBasicCombinations(areas, keywords) {
    return keywords.flatMap(k => areas.map(a => `${k} i ${a}`));
}

function generateCustomCombinations(areas, keywords) {
    const template = document.getElementById('template').value;
    return keywords.flatMap(k => 
        areas.map(a => 
            template.replaceAll('{keyword}', k).replaceAll('{area}', a)
        )
    );
}

function generatePermutations(areas, keywords) {
    const permLength = parseInt(document.getElementById('permLength').value) || 1;
    if (keywords.length < permLength) {
        alert(`Need at least ${permLength} keywords for permutations`);
        return [];
    }
    
    const keywordPerms = getPermutations(keywords, permLength);
    return areas.flatMap(a => 
        keywordPerms.map(perm => `${perm.join(' ')} i ${a}`)
    );
}

function getPermutations(arr, k) {
    const permutations = [];
    const used = Array(arr.length).fill(false);

    function backtrack(current) {
        if (current.length === k) {
            permutations.push([...current]);
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            if (!used[i]) {
                used[i] = true;
                current.push(arr[i]);
                backtrack(current);
                current.pop();
                used[i] = false;
            }
        }
    }

    backtrack([]);
    return permutations;
}

function processResults(results) {
    if (document.getElementById('removeDuplicates').checked) {
        results = [...new Set(results)];
    }
    if (document.getElementById('shuffle').checked) {
        results = results.sort(() => Math.random() - 0.5);
    }
    return results;
}

function displayResults(results) {
    const output = document.getElementById('output');
    output.textContent = results.join('\n');
    output.style.display = results.length ? 'block' : 'none';
}

function copyToClipboard() {
    const output = document.getElementById('output').textContent;
    if (!output) {
        alert('No results to copy!');
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        alert('Copied to clipboard!');
    });
}

function clearAll() {
    document.getElementById('areas').value = '';
    document.getElementById('keywords').value = '';
    document.getElementById('output').textContent = '';
}

// Save/Load functionality
function saveToFile() {
    const data = {
        areas: document.getElementById('areas').value,
        keywords: document.getElementById('keywords').value
    };
    const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-combiner-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function loadFromFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function() {
            try {
                const data = JSON.parse(reader.result);
                document.getElementById('areas').value = data.areas;
                document.getElementById('keywords').value = data.keywords;
            } catch {
                alert('Error loading file');
            }
        };
        reader.readAsText(file);
    };
}

function saveToBrowser() {
    localStorage.setItem('keywordCombinerData', JSON.stringify({
        areas: document.getElementById('areas').value,
        keywords: document.getElementById('keywords').value
    }));
    alert('Data saved to browser storage!');
}

function loadFromBrowser() {
    const data = localStorage.getItem('keywordCombinerData');
    if (data) {
        try {
            const {areas, keywords} = JSON.parse(data);
            document.getElementById('areas').value = areas;
            document.getElementById('keywords').value = keywords;
        } catch {
            alert('Error loading from storage');
        }
    } else {
        alert('No saved data found');
    }
}

// Initialize with first tab open
document.querySelector('.tablink').click();