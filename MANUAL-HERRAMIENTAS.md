# Manual de instalación de herramientas de desarrollo

Paso a paso para dejar un equipo nuevo listo para programar. Está escrito para **Windows 10/11** (el caso principal), y al final de cada herramienta están los comandos para **macOS** y **Linux (Ubuntu/Debian)**.

**Orden recomendado:** 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7. Las herramientas de la sección 8 son opcionales.

> **Regla de oro:** después de instalar cualquier cosa, **cierra y vuelve a abrir la terminal**. Si no, el comando nuevo "no existe".

---

## Índice
0. [Preparación: terminal y winget](#0-preparación-terminal-y-winget)
1. [Git](#1-git)
2. [Cuenta de GitHub, llave SSH y GitHub CLI](#2-github-llave-ssh-y-github-cli)
3. [Node.js con nvm (incluye npm, npx, pnpm, yarn)](#3-nodejs-con-nvm)
4. [Python](#4-python)
5. [Visual Studio Code](#5-visual-studio-code)
6. [Claude Code](#6-claude-code)
7. [Instalar mis skills (este repo)](#7-instalar-mis-skills)
8. [Opcionales: Docker, Bun, Java, Android Studio, Postman](#8-opcionales)
9. [Comprobación final](#9-comprobación-final)
10. [Problemas comunes](#10-problemas-comunes)

---

## 0. Preparación: terminal y winget

**winget** es el "instalador por comandos" de Windows. Ya viene en Windows 11 y en Windows 10 actualizado.

1. Pulsa `Win`, escribe **Terminal** y ábrela. Si no la tienes, instálala desde Microsoft Store ("Windows Terminal").
2. Comprueba winget:
   ```powershell
   winget --version
   ```
   - Si da error: abre Microsoft Store, busca **"Instalador de aplicación" (App Installer)** y actualízalo.
3. Permite ejecutar scripts de PowerShell (necesario para npm, nvm y los scripts de este repo):
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   ```
   Responde `S` (o `Y`).

**macOS:** instala Homebrew:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
**Linux:** `sudo apt update && sudo apt upgrade -y && sudo apt install -y curl build-essential`

---

## 1. Git

Control de versiones: sirve para guardar el historial del código y para hacer `clone`, `pull` y `push`.

### Instalar (Windows)
```powershell
winget install --id Git.Git -e
```
También puedes descargarlo desde https://git-scm.com/download/win. En el asistente deja todo por defecto, **salvo** estas opciones:
- *Default editor* → **Visual Studio Code** (o Notepad).
- *Default branch name* → **Override… → `main`**.
- *PATH* → **"Git from the command line and also from 3rd-party software"**.

### Configurar (una vez, en cualquier sistema)
```powershell
git config --global user.name  "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
git config --global init.defaultBranch main
git config --global core.autocrlf true      # Windows  (en macOS/Linux: input)
```

### Verificar
```powershell
git --version
git config --global --list
```

**macOS:** `brew install git` · **Linux:** `sudo apt install -y git`

### Comandos básicos
| Comando | Qué hace |
|---|---|
| `git clone URL` | Descarga un repo |
| `git status` | Muestra qué cambió |
| `git add -A` | Prepara todos los cambios |
| `git commit -m "mensaje"` | Guarda un punto en el historial |
| `git push` | Sube a GitHub |
| `git pull` | Baja los cambios de GitHub |

---

## 2. GitHub, llave SSH y GitHub CLI

### 2.1 Cuenta
Crea la cuenta en https://github.com/signup.

### 2.2 GitHub CLI (`gh`): la forma más fácil de iniciar sesión
```powershell
winget install --id GitHub.cli -e
```
Cierra y abre la terminal, y luego:
```powershell
gh auth login
```
Elige: **GitHub.com → HTTPS → Yes (autenticar Git) → Login with a web browser**. Copia el código que aparece y pégalo en el navegador.

Verifica con `gh auth status`.

> Con esto `git push` y `git pull` ya funcionan sin contraseña. La llave SSH (2.3) es opcional.

### 2.3 (Opcional) Llave SSH
```powershell
ssh-keygen -t ed25519 -C "tu-correo@ejemplo.com"
```
Pulsa Enter en todas las preguntas. Luego:
```powershell
gh ssh-key add $HOME\.ssh\id_ed25519.pub --title "Mi PC"
ssh -T git@github.com
```
Debe responder: *"Hi TU_USUARIO! You've successfully authenticated"*.

**macOS:** `brew install gh` · **Linux:** `sudo apt install -y gh` (o mira https://cli.github.com)

---

## 3. Node.js con nvm

Node ejecuta JavaScript fuera del navegador. Lo necesitan React, Next.js, Vite, Expo y casi todas las skills de frontend. Trae **npm** y **npx**.

Usa **nvm** en vez del instalador directo: te deja tener varias versiones y cambiar entre ellas.

### Instalar (Windows): nvm-windows
1. **Si ya tienes Node instalado "normal", desinstálalo primero** (Configuración → Aplicaciones → Node.js → Desinstalar) y borra `C:\Program Files\nodejs` si queda.
2. Instala nvm:
   ```powershell
   winget install --id CoreyButler.NVMforWindows -e
   ```
   (o descarga `nvm-setup.exe` de https://github.com/coreybutler/nvm-windows/releases)
3. **Cierra y abre la terminal** (si falla en el paso 4, ábrela como Administrador).
4. Instala la versión LTS y actívala:
   ```powershell
   nvm install lts
   nvm use lts
   ```
5. Verifica:
   ```powershell
   node -v
   npm -v
   npx -v
   ```

### Instalar (macOS / Linux): nvm
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# cierra y abre la terminal
nvm install --lts
nvm alias default 'lts/*'
node -v
```

### Gestores de paquetes extra (opcional)
Corepack viene con Node y activa pnpm y yarn sin instalarlos aparte:
```powershell
corepack enable
pnpm -v
yarn -v
```
Si `corepack` no existe en tu versión de Node: `npm install -g pnpm yarn`.

### Comandos útiles
| Comando | Qué hace |
|---|---|
| `nvm list` | Versiones instaladas |
| `nvm install 22` | Instala Node 22 |
| `nvm use 22` | Cambia a Node 22 |
| `npm install` | Instala las dependencias de un proyecto |
| `npm run dev` | Arranca el proyecto en modo desarrollo |
| `npx create-vite@latest` | Crea un proyecto nuevo sin instalar nada global |

---

## 4. Python

Lo usan scripts, IA/datos y varias skills (por ejemplo `scripts/export.py` de este repo).

### Instalar (Windows)
```powershell
winget install --id Python.Python.3.12 -e
```
Si lo instalas con el instalador de https://python.org: en la primera pantalla **marca "Add python.exe to PATH"** y luego pulsa *Install Now*.

### Desactivar el "Python falso" de Microsoft Store
Configuración → Aplicaciones → Configuración avanzada de aplicaciones → **Alias de ejecución de aplicaciones** → desactiva `python.exe` y `python3.exe` (App Installer).

### Verificar
```powershell
python --version
pip --version
```

### Entornos virtuales (recomendado en cada proyecto)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1      # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
deactivate
```

### (Opcional) uv: un gestor de Python muy rápido
```powershell
winget install --id astral-sh.uv -e
```

**macOS:** `brew install python@3.12` · **Linux:** `sudo apt install -y python3 python3-pip python3-venv`

---

## 5. Visual Studio Code

### Instalar
```powershell
winget install --id Microsoft.VisualStudioCode -e
```
Durante la instalación marca **"Agregar 'Abrir con Code' al menú contextual"** y **"Agregar a PATH"**.

### Verificar
```powershell
code --version
code .          # abre la carpeta actual en VS Code
```

### Extensiones recomendadas
```powershell
code --install-extension anthropic.claude-code
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-python.python
code --install-extension eamodio.gitlens
code --install-extension bradlc.vscode-tailwindcss
```

**macOS:** `brew install --cask visual-studio-code` · **Linux:** `sudo snap install code --classic`

---

## 6. Claude Code

### Instalar (Windows, PowerShell)
```powershell
irm https://claude.ai/install.ps1 | iex
```
**macOS / Linux:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```
> Alternativa con Node (sección 3): `npm install -g @anthropic-ai/claude-code`

### Primer inicio
1. Cierra y abre la terminal.
2. Verifica: `claude --version`
3. Entra a cualquier carpeta de proyecto y escribe `claude`.
4. La primera vez te pide iniciar sesión: elige tu cuenta de **Claude.ai** y autoriza en el navegador.
5. Comandos útiles dentro de Claude Code:
   | Comando | Qué hace |
   |---|---|
   | `/help` | Ayuda |
   | `/login` / `/logout` | Cambiar de cuenta |
   | `/plugin` | Ver e instalar plugins |
   | `/` | Lista de comandos y skills |
   | `/init` | Crea un `CLAUDE.md` para el proyecto |
   | `/config` | Tema, modelo y ajustes |

### Verificar la instalación
```powershell
claude doctor
```

---

## 7. Instalar mis skills

Hace falta tener **Git (1)** y **Claude Code (6)**. Python no hace falta para instalar.

```powershell
git clone https://github.com/TU_USUARIO/claude-setup.git
cd claude-setup
powershell -ExecutionPolicy Bypass -File .\install.ps1      # macOS/Linux: bash install.sh
```
Cierra y vuelve a abrir Claude Code, y escribe `/` para ver las skills. Más detalles en `README.md`.

---

## 8. Opcionales

### Docker Desktop (contenedores, bases de datos locales)
1. Activa la virtualización: `wsl --install` (reinicia cuando lo pida).
2. `winget install --id Docker.DockerDesktop -e`
3. Abre Docker Desktop, acepta los términos y espera a que diga *Engine running*.
4. Verifica: `docker run hello-world`

### Bun (runtime de JS muy rápido)
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
bun --version
```

### Java (JDK 21) para Android, Spring o Kotlin
```powershell
winget install --id EclipseAdoptium.Temurin.21.JDK -e
java -version
```

### Android Studio (apps Android, emulador para Expo/React Native)
```powershell
winget install --id Google.AndroidStudio -e
```
Ábrelo, sigue el asistente (*Standard*) y crea un emulador en **Device Manager**.

### Postman / Bruno (probar APIs)
```powershell
winget install --id Postman.Postman -e
# o, alternativa libre:
winget install --id Bruno.Bruno -e
```

### WSL (Linux dentro de Windows)
```powershell
wsl --install -d Ubuntu
```

---

## 9. Comprobación final

Pega esto en PowerShell. Cada línea debe mostrar una versión:
```powershell
git --version; gh --version; node -v; npm -v; python --version; code --version; claude --version
```
macOS/Linux:
```bash
git --version; gh --version; node -v; npm -v; python3 --version; code --version; claude --version
```

---

## 10. Problemas comunes

| Síntoma | Solución |
|---|---|
| `"xxx" no se reconoce como un comando` | Cierra y abre la terminal. Si sigue igual, reinicia el PC (el PATH se actualiza). |
| `npm : no se puede cargar ... la ejecución de scripts está deshabilitada` | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `nvm use` falla con "exit status 1" / acceso denegado | Abre la terminal **como Administrador** y repite `nvm use lts`. |
| `python` abre Microsoft Store | Desactiva los alias de ejecución (sección 4). |
| `git push` pide usuario y contraseña | Ejecuta `gh auth login` (sección 2.2). GitHub ya no acepta contraseñas. |
| `Permission denied (publickey)` | Tu llave SSH no está en GitHub: `gh ssh-key add ~/.ssh/id_ed25519.pub` |
| Claude Code no muestra las skills | Reinicia Claude Code. Comprueba que existe `~/.claude/skills/<nombre>/SKILL.md`. |
| Un plugin no se instala | En Claude Code: `/plugin` → *Marketplaces* → actualizar, y luego vuelve a instalarlo. |
| Docker: "WSL 2 installation is incomplete" | `wsl --update` y reinicia. |
