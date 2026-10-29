# claude-setup

Mis skills y plugins de Claude Code, listos para llevarlos a otro equipo.

| Archivo | Qué es |
|---|---|
| `SKILLS.md` | Lista de todas las skills (sueltas, de plugins e integradas) con para qué sirve cada una |
| `skills/` | Copia de las 60 skills sueltas de `~/.claude/skills` |
| `plugins.json` | Los 5 plugins y de dónde salen (se reinstalan desde su repo oficial) |
| `install.ps1` / `install.sh` | Instalan todo de forma **global** en el equipo donde los ejecutes |
| `scripts/export.py` | Vuelve a copiar las skills de este PC al repo y regenera `SKILLS.md` |
| `skill-lock.json` | Registro de `npx skills` (de qué repo salió cada skill) |
| `MANUAL-HERRAMIENTAS.md` | Manual paso a paso para instalar Git, Node, Python, VS Code, Claude Code, etc. |
| `MANUAL-FRAMEWORKS.md` | Crear proyectos paso a paso: React, Next.js, Vue, Angular, Expo, Flutter, FastAPI, Django, Laravel, Spring Boot, Tauri… |
| `Manual-Desarrollo.docx` | Los dos manuales juntos en Word (con portada e índice) |
| `scripts/md2docx.js` | Regenera el Word desde los `.md` (`npm i docx` y luego `node scripts/md2docx.js Manual-Desarrollo.docx MANUAL-HERRAMIENTAS.md MANUAL-FRAMEWORKS.md`) |

---

## A. En este PC: subir a GitHub (una sola vez)

1. Crea un repo **privado** vacío en https://github.com/new (`apps`, ya creado).
2. En esta carpeta:
   ```powershell
   git remote add origin https://github.com/ravivanco/apps.git
   git push -u origin main
   ```

### Cuando instales skills nuevas aquí
```powershell
python scripts/export.py .
git add -A
git commit -m "Actualizar skills"
git push
```

## B. En el otro equipo: bajar e instalar global

1. Instala **Git** y **Claude Code** (ver `MANUAL-HERRAMIENTAS.md`) e inicia sesión en Claude (`claude`, luego `/login`).
2. Clona el repo:
   ```powershell
   git clone https://github.com/ravivanco/apps.git
   cd apps
   ```
3. Instala:
   - **Windows:** `powershell -ExecutionPolicy Bypass -File .\install.ps1`
   - **macOS / Linux:** `bash install.sh`
4. Cierra y vuelve a abrir Claude Code. Comprueba con `/plugin` y escribiendo `/` (salen las skills).

### Para actualizar más adelante
```powershell
git pull
.\install.ps1
```

## Notas

- **Global** = queda en `~/.claude/skills` y `~/.claude/plugins` del usuario y sirve en cualquier carpeta/proyecto.
- El plugin **ECC** trae hooks (GateGuard) que piden "facts" antes de escribir archivos. Si te molesta, en el otro equipo puedes desactivarlo con la variable de entorno `ECC_GATEGUARD=off`.
- Las skills `anthropic-skills:*` y las integradas (`code-review`, `simplify`, `loop`...) no se copian: vienen con tu cuenta y con Claude Code.
