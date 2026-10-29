#!/usr/bin/env bash
# Instala las skills y plugins de este repo de forma GLOBAL (macOS / Linux / Git Bash).
# Uso (desde la carpeta del repo):  bash install.sh
set -u
repo="$(cd "$(dirname "$0")" && pwd)"
target="$HOME/.claude/skills"

command -v claude >/dev/null || { echo "Claude Code no está instalado. Mira MANUAL-HERRAMIENTAS.md"; exit 1; }

# 1. Skills sueltas -> ~/.claude/skills
mkdir -p "$target"
n=0
for s in "$repo"/skills/*/; do
  name="$(basename "$s")"
  rm -rf "${target:?}/$name"
  cp -R "$s" "$target/$name"
  n=$((n+1))
done
echo "OK  $n skills copiadas en $target"

# 2. Plugins (marketplace -> plugin). plugins.json: [{"plugin": "...", "source": "..."}]
grep -o '"plugin": *"[^"]*"\|"source": *"[^"]*"' "$repo/plugins.json" | sed 's/.*: *"\(.*\)"/\1/' |
while read -r plugin && read -r source; do
  echo "--> $plugin"
  claude plugin marketplace add "$source" || echo "    (marketplace ya existía)"
  claude plugin install "$plugin" || echo "    ERROR instalando $plugin"
done

echo
echo "Listo. Cierra y vuelve a abrir Claude Code para que cargue todo."
