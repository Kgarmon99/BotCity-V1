import re

with open("src/game/GameScene.tsx", "r") as f:
    content = f.read()

# Replace lazy imports with standard imports
# const NPCBots = lazy(() => import("./NPCBots"));
# -> import NPCBots from "./NPCBots";

def replacer(match):
    name = match.group(1)
    path = match.group(2)
    return f'import {name} from "{path}";'

content = re.sub(r'const\s+([A-Za-z0-9_]+)\s*=\s*lazy\(\(\)\s*=>\s*import\("([^"]+)"\)\);', replacer, content)

# Remove Suspense wrapper
content = content.replace("<Suspense fallback={null}>", "")
content = content.replace("</Suspense>", "")
content = content.replace('import { useRef, useState, useCallback, Suspense, lazy } from "react";', 'import { useRef, useState, useCallback } from "react";')

with open("src/game/GameScene.tsx", "w") as f:
    f.write(content)
