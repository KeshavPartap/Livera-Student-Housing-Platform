const fs = require('fs');
const path = require('path');

const workspace = "c:\\Users\\Asus\\OneDrive\\Desktop\\professional-main-main";
const filesToConvert = [
    "style.css", "property-detail.css",
    "index.html", "explore.html", "dashboard.html", "property-detail.html", "login.html"
];

const LIGHT_BGS = ['#ffffff', '#fff', 'white', '#fafafb', '#f3f4f6', '#f8fafc', '#eff3f8', '#f6f8fb', '#f5f3ef', '#ede9e0', '#fafafa', '#f9fafb', '#f8faff', '#f0f4ff', '#f0f3f8', '#fafbfc', '#eff6ff', '#fef3c7'];
const DARK_TEXTS = ['#111827', '#1f2937', '#000000', '#000', '#333333', '#333', '#374151'];
const MUTED_TEXTS = ['#6b7280', '#4b5563', '#9ca3af'];
const BORDERS = ['#e5e7eb', '#d1d5db'];

function getRegexStr(words) {
    return words.map(w => w.startsWith('#') ? w + "(?!\\w)" : "\\b" + w + "\\b").join('|');
}

function processTheme(filepath) {
    if (!fs.existsSync(filepath)) {
        console.log(`File not found: ${filepath}`);
        return;
    }
    console.log(`Processing ${filepath}`);
    let content = fs.readFileSync(filepath, 'utf-8');

    // Replace CSS Properties
    content = content.replace(/([\w-]+)\s*:([^;>}]+)/g, (match, propRaw, valRaw) => {
        let prop = propRaw.trim().toLowerCase();
        let val = valRaw;

        if (prop.includes('color') && !prop.includes('background') && !prop.includes('border')) {
            val = val.replace(new RegExp("#ffffff(?!\\\\w)|#fff(?!\\\\w)|\\\\bwhite\\\\b", "gi"), 'var(--color-white)');
            val = val.replace(new RegExp(`(${getRegexStr(DARK_TEXTS)})`, "gi"), 'var(--color-text)');
            val = val.replace(new RegExp(`(${getRegexStr(MUTED_TEXTS)})`, "gi"), 'var(--color-text-muted)');
        } else if (prop.includes('background')) {
            val = val.replace(new RegExp(`(${getRegexStr(LIGHT_BGS)})`, "gi"), 'var(--color-surface)');
            val = val.replace(/rgba\\(\\s*255\\s*,\\s*255\\s*,\\s*255\\s*,\\s*([0-9.]+)\\s*\\)/gi, 'rgba(16, 16, 25, $1)');
        } else if (prop.includes('border') || prop.includes('box-shadow')) {
            val = val.replace(new RegExp(`(${getRegexStr(BORDERS.concat(LIGHT_BGS))})`, "gi"), 'var(--color-border)');
        }

        return `${propRaw}:${val}`;
    });

    // Replace SVG fill/stroke
    content = content.replace(/(fill|stroke)=(['"])([^'"]+)(['"])/g, (match, attrName, quote1, valRaw, quote2) => {
        let val = valRaw;
        val = val.replace(new RegExp(`(${getRegexStr(DARK_TEXTS)})`, "gi"), 'var(--color-text)');
        val = val.replace(new RegExp(`(#ffffff(?!\\\\w)|#fff(?!\\\\w)|\\\\bwhite\\\\b)`, "gi"), 'var(--color-surface)');
        return `${attrName}=${quote1}${val}${quote2}`;
    });

    fs.writeFileSync(filepath, content, 'utf-8');
}

filesToConvert.forEach(file => {
    processTheme(path.join(workspace, file));
});

console.log("Themes updated successfully");
