#!/usr/bin/env python3
"""Refresh local asset URLs after changing site scripts or styles (no build needed)."""
import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def version(path):
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()[:12]

# The CAD viewer also loads its model and PCB photograph lazily.
viewer = ROOT / 'site/demos/basys-board-3d.js'
if viewer.exists():
    text = viewer.read_text()
    text = re.sub(r"(new URL\(')(\.\./\.\./models/[^'?]+)(?:\?v=[a-f0-9]+)?(')",
                  lambda m: m[1] + m[2] + '?v=' + version(str((viewer.parent / m[2]).resolve().relative_to(ROOT))) + m[3], text)
    viewer.write_text(text)

# Theme.render() replaces the initial stylesheet link, so version that URL too.
for path in (ROOT / 'site/themes').glob('*.js'):
    text = path.read_text()
    text = re.sub(r'(css:\s*")([^"?]+\.css)(?:\?v=[a-f0-9]+)?(")',
                  lambda m: m[1] + m[2] + '?v=' + version(m[2]) + m[3], text)
    path.write_text(text)

path = ROOT / 'index.html'
text = path.read_text()
text = re.sub(r'((?:src|href)=")([^":?]+\.(?:js|css))(?:\?v=[a-f0-9]+)?(")',
              lambda m: m[1] + m[2] + '?v=' + version(m[2]) + m[3], text)
path.write_text(text)
