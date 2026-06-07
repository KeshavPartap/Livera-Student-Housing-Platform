import os
import re

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False
    
    orig_content = content

    # Replace specific CSS colors
    replacements = {
        # Teals and Blues in style.css
        '#0EA5A4': 'var(--color-accent-light)',
        '#0ea5a4': 'var(--color-accent-light)',
        '#1F3A8A': 'var(--color-accent)',
        '#1f3a8a': 'var(--color-accent)',
        'rgba(59, 130, 246,': 'rgba(201, 168, 76,',
        'rgba(31, 58, 138,': 'rgba(168, 136, 46,',
        'rgba(14, 165, 164,': 'rgba(224, 197, 110,',
        '#162d6e': 'var(--color-bg-alt)',
        '#1e3a8a': 'var(--color-accent-dark)',

        # SVG House Colors in index.html
        '#D4A574': '#c9a84c', # Light Brown -> Golden
        '#C07848': '#a8882e', # Brown -> Dark Golden
        '#2E7D32': '#16161f', # Green -> Surface
        '#87CEEB': '#e0c56e', # Sky Blue -> Light Golden
        '#9B7ED8': '#0a0a0f', # Purple -> Dark Bg
        '#E8B84B': '#c9a84c'  # Yellow -> Golden
    }

    for k, v in replacements.items():
        content = content.replace(k, v)

    if content != orig_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
        return True
    return False

if __name__ == "__main__":
    workspace = "c:/Users/Asus/OneDrive/Desktop/professional-main-main"
    for root, dirs, files in os.walk(workspace):
        for file in files:
            if file.endswith('.css') or file.endswith('.html'):
                replace_in_file(os.path.join(root, file))
