const fs = require('fs');
const path = require('path');

function processFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    let origContent = content;

    const replacements = {
        '#0369A1': 'var(--color-accent-dark)',
        '#0F172A': 'var(--color-bg)',
        '#10B981': 'var(--color-accent)', // Emerald to Gold
        '#1E293B': 'var(--color-bg-alt)',
        '#1E3A8A': 'var(--color-accent-dark)',
        '#2563EB': 'var(--color-accent)',
        '#3B82F6': 'var(--color-accent)',
        '#8B5CF6': 'var(--color-accent)', // Purple to Gold
        '#B45309': 'var(--color-accent-dark)',
        '#BAE6FD': 'var(--color-text)', // Very light blue
        '#E0F2FE': 'var(--color-text)',
        '#F59E0B': 'var(--color-accent)', // Amber to Gold
        
        // Lowercase variants
        '#0369a1': 'var(--color-accent-dark)',
        '#0f172a': 'var(--color-bg)',
        '#10b981': 'var(--color-accent)',
        '#1e293b': 'var(--color-bg-alt)',
        '#1e3a8a': 'var(--color-accent-dark)',
        '#2563eb': 'var(--color-accent)',
        '#3b82f6': 'var(--color-accent)',
        '#8b5cf6': 'var(--color-accent)',
        '#b45309': 'var(--color-accent-dark)',
        '#bae6fd': 'var(--color-text)',
        '#e0f2fe': 'var(--color-text)',
        '#f59e0b': 'var(--color-accent)'
    };

    // Replace strict matches
    for (const [k, v] of Object.entries(replacements)) {
        content = content.split(k).join(v);
    }
    
    // Also handle rgba for 3B82F6 (59, 130, 246)
    content = content.replace(/rgba\(\s*59,\s*130,\s*246/g, 'rgba(201,168,76');
    content = content.replace(/rgba\(\s*16,\s*185,\s*129/g, 'rgba(201,168,76'); // 10B981 emerald
    content = content.replace(/rgba\(\s*245,\s*158,\s*11/g, 'rgba(201,168,76'); // F59E0B amber

    if (content !== origContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Patched ${filepath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                traverseDir(fullPath);
            }
        } else if (fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

const workspace = "c:/Users/Asus/OneDrive/Desktop/professional-main-main";
traverseDir(workspace);
