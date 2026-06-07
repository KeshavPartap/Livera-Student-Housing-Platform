import os
import re

workspace = r"c:\Users\Asus\OneDrive\Desktop\professional-main-main"
css_files = ["style.css", "property-detail.css"]
html_files = ["index.html", "explore.html", "dashboard.html", "property-detail.html", "login.html"]

def convert_themes(filepath):
    print(f"Processing {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def repl(m):
        prop = m.group(1).strip().lower()
        val = m.group(2)

        LIGHT_BGS = ['#ffffff', '#fff', 'white', '#fafafb', '#f3f4f6', '#f8fafc', '#eff3f8', '#f6f8fb', '#f5f3ef', '#ede9e0', '#fafafa', '#f9fafb', '#f8faff', '#f0f4ff', '#f0f3f8', '#fafbfc', '#eff6ff', '#fef3c7', '#f6f8fb', '#f8fafc', '#f5f3ef']
        DARK_TEXTS = ['#111827', '#1f2937', '#000000', '#000', '#333333', '#333', '#374151']
        MUTED_TEXTS = ['#6b7280', '#4b5563', '#9ca3af']
        BORDERS = ['#e5e7eb', '#d1d5db']

        def rx(words):
            return '|'.join(w + (r'(?!\w)' if w.startswith('#') else r'\b') for w in words)
            
        if 'color' in prop and 'background' not in prop and 'border' not in prop:
            val = re.sub(r'(?i)#ffffff(?!\w)|#fff(?!\w)|\bwhite\b', 'var(--color-white)', val)
            val = re.sub(r'(?i)' + rx(DARK_TEXTS), 'var(--color-text)', val)
            val = re.sub(r'(?i)' + rx(MUTED_TEXTS), 'var(--color-text-muted)', val)
        elif 'background' in prop:
            val = re.sub(r'(?i)' + rx(LIGHT_BGS), 'var(--color-surface)', val)
            val = re.sub(r'(?i)rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([0-9.]+)\s*\)', r'rgba(16, 16, 25, \1)', val)
        elif 'border' in prop or 'box-shadow' in prop:
            val = re.sub(r'(?i)' + rx(BORDERS + LIGHT_BGS), 'var(--color-border)', val)

        return f"{m.group(1)}:{val}"

    new_content = re.sub(r'([\w-]+)\s*:([^;>}]+)', repl, content)
    
    def svg_repl(m):
        attr = m.group(1)
        val = m.group(2)
        
        DARK_TEXTS = ['#111827', '#1f2937', '#000000', '#000', '#333333', '#333', '#374151']
        LIGHT_BGS = ['#ffffff', '#fff', 'white']
        def rx(words):
            return '|'.join(w + (r'(?!\w)' if w.startswith('#') else r'\b') for w in words)
        
        val = re.sub(r'(?i)' + rx(DARK_TEXTS), 'var(--color-text)', val)
        val = re.sub(r'(?i)' + rx(LIGHT_BGS), 'var(--color-surface)', val)
        return f"{attr}={val}"

    new_content = re.sub(r'(fill|stroke)=([\'"][^\'"]+[\'"])', svg_repl, new_content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

for f in css_files + html_files:
    path = os.path.join(workspace, f)
    if os.path.exists(path):
        convert_themes(path)
print("Themes updated")
