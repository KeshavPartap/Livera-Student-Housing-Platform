const fs = require('fs');
const path = require('path');

const workspace = "c:\\Users\\Asus\\OneDrive\\Desktop\\professional-main-main";

// Fix style.css section-amenities and any un-replaced gradients
let stylePath = path.join(workspace, 'style.css');
if (fs.existsSync(stylePath)) {
    let styleContent = fs.readFileSync(stylePath, 'utf8');
    styleContent = styleContent.replace(/#F8FAFC/gi, 'var(--color-bg)');
    styleContent = styleContent.replace(/#EFF3F8/gi, 'var(--color-bg-alt)');
    styleContent = styleContent.replace(/#F5F3EF/gi, 'var(--color-bg)');
    styleContent = styleContent.replace(/#EDE9E0/gi, 'var(--color-bg-alt)');
    styleContent = styleContent.replace(/#FAFBFC/gi, 'var(--color-bg)');
    styleContent = styleContent.replace(/#F0F3F8/gi, 'var(--color-bg-alt)');
    
    // Check SaaS float cards
    styleContent = styleContent.replace(/background:\s*#fff;/g, 'background: var(--color-surface);');
    styleContent = styleContent.replace(/color:\s*#111827;/g, 'color: var(--color-text);');
    
    fs.writeFileSync(stylePath, styleContent, 'utf8');
}

// Fix dashboard.html
let dashPath = path.join(workspace, 'dashboard.html');
if (fs.existsSync(dashPath)) {
    let dashContent = fs.readFileSync(dashPath, 'utf8');
    // Replace light root vars with dark mode variants
    dashContent = dashContent.replace(
        /--bg:#f8fafc;--surface:#ffffff;--surface-2:#f1f5f9;--surface-3:#e2e8f0;/,
        '--bg:#0a0a0f;--surface:#16161f;--surface-2:#1e1e2a;--surface-3:#2a2a35;'
    );
    dashContent = dashContent.replace(
        /--border:#e2e8f0;--border-2:#cbd5e1;/,
        '--border:rgba(255,255,255,0.06);--border-2:rgba(255,255,255,0.12);'
    );
    dashContent = dashContent.replace(
        /--glass:rgba\(255,255,255,\.85\);--gb:rgba\(0,0,0,\.06\);/,
        '--glass:rgba(16,16,25,.85);--gb:rgba(255,255,255,.06);'
    );
    dashContent = dashContent.replace(
        /--t1:#0f172a;--t2:#475569;--t3:#64748b;/,
        '--t1:#eaeaf0;--t2:#8b8ba0;--t3:#5a5a72;'
    );
    // There are some places in dashboard where white is explicit like modal overlay
    dashContent = dashContent.replace(/background:rgba\(255,255,255,\.4\)/g, 'background:rgba(0,0,0,.6)');
    
    fs.writeFileSync(dashPath, dashContent, 'utf8');
}

// Fix login.html missing hex codes
let loginPath = path.join(workspace, 'login.html');
if (fs.existsSync(loginPath)) {
    let loginContent = fs.readFileSync(loginPath, 'utf8');
    loginContent = loginContent.replace(/#0f172a/gi, 'var(--color-text)');
    loginContent = loginContent.replace(/#64748b/gi, 'var(--color-text-muted)');
    loginContent = loginContent.replace(/#e5e7eb/gi, 'var(--color-border)');
    loginContent = loginContent.replace(/#ffffff/gi, 'var(--color-surface)');
    
    // Replace role card background that might have been hardcoded
    loginContent = loginContent.replace(/background:\s*#ffffff;/g, 'background: var(--color-surface);');
    fs.writeFileSync(loginPath, loginContent, 'utf8');
}

console.log("Patched dash, login, and style gradients.");
