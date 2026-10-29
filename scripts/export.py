import json, os, re, shutil, sys
from pathlib import Path

home = Path.home() / ".claude"
repo = Path(sys.argv[1])
src = home / "skills"
dst = repo / "skills"
SKIP = {"synced", "learned"}

def desc(skill_md: Path):
    try:
        t = skill_md.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""
    m = re.match(r"^---\s*\n(.*?)\n---", t, re.S)
    if not m:
        return ""
    fm = m.group(1)
    d = re.search(r"^description:\s*(.*?)(?=^\w[\w-]*:|\Z)", fm, re.S | re.M)
    if not d:
        return ""
    s = " ".join(d.group(1).replace(">-", "").replace("|", "").split()).strip("'\" ")
    return s if len(s) <= 220 else s[:217].rsplit(" ", 1)[0] + "..."

if dst.exists():
    shutil.rmtree(dst)
dst.mkdir(parents=True)
local = []
for d in sorted(src.iterdir()):
    if not d.is_dir() or d.name in SKIP:
        continue
    shutil.copytree(d, dst / d.name, ignore=shutil.ignore_patterns(".git", "node_modules", "__pycache__"))
    local.append((d.name, desc(d / "SKILL.md")))

lock = home.parent / ".agents" / ".skill-lock.json"
if lock.exists():
    shutil.copy(lock, repo / "skill-lock.json")

plugins = json.loads((home / "plugins" / "installed_plugins.json").read_text(encoding="utf-8"))["plugins"]
plug_rows = {}
for key, entries in plugins.items():
    p = Path(entries[0]["installPath"])
    rows = []
    for sm in sorted(p.rglob("SKILL.md")):
        if "node_modules" in sm.parts:
            continue
        rows.append((sm.parent.name, desc(sm)))
    seen = set(); uniq = []
    for r in rows:
        if r[0] not in seen:
            seen.add(r[0]); uniq.append(r)
    plug_rows[key] = (entries[0]["version"], uniq)

def esc(s): return s.replace("|", "\\|")
out = ["# Lista de skills instaladas", "",
       f"Total: **{len(local)} skills sueltas** (copiadas en `skills/`) + **{sum(len(v[1]) for v in plug_rows.values())} skills dentro de {len(plug_rows)} plugins** (se reinstalan con el script).", "",
       "## 1. Skills sueltas (`skills/`)", "", "| Skill | Para qué sirve |", "|---|---|"]
out += [f"| `{n}` | {esc(d)} |" for n, d in local]
out += ["", "## 2. Skills de plugins", "",
        "Estas no se copian: el script `install` añade el marketplace e instala el plugin, así siempre llega la versión oficial.", ""]
for key, (ver, rows) in plug_rows.items():
    out += [f"### `{key}` (v{ver}) — {len(rows)} skills", "", "| Skill | Para qué sirve |", "|---|---|"]
    out += [f"| `{key.split('@')[0]}:{n}` | {esc(d)} |" for n, d in rows]
    out.append("")
out += ["## 3. Skills integradas (no se instalan)", "",
        "Vienen con Claude Code / tu cuenta de claude.ai y aparecen solas en cualquier equipo donde inicies sesión:",
        "`anthropic-skills:*` (docx, pdf, pptx, xlsx, skill-creator, deep-research...), `code-review`, `simplify`, `loop`, `schedule`, `init`, `security-review`, `claude-api`, `run`, `artifact-*`, `dataviz`, `update-config`, `keybindings-help`, `fewer-permission-prompts`, `plugin-authoring`.", ""]
(repo / "SKILLS.md").write_text("\n".join(out), encoding="utf-8")
print(len(local), {k: len(v[1]) for k, v in plug_rows.items()})
