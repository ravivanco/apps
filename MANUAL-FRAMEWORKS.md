# Manual de frameworks: crear un proyecto paso a paso

Requisitos previos: tener instalado lo del **Manual de herramientas**, como mínimo **Git**, **Node.js** y **VS Code**. Si un framework necesita algo más (Python, PHP, Java, Rust, Flutter), se indica al principio de su apartado.

> En todos los ejemplos el proyecto se llama `mi-app`. Cámbialo por el nombre que quieras: en minúsculas, sin espacios ni tildes.

---

## 1. ¿Cuál elijo?

| Quiero hacer… | Framework recomendado | Alternativas |
|---|---|---|
| Una web o SPA sencilla | React + Vite | Vue, Svelte |
| Una web completa (SEO, rutas, backend) | Next.js | Nuxt, SvelteKit, Astro |
| Una web de contenido o blog muy rápida | Astro | Next.js |
| Una app empresarial grande | Angular | Next.js |
| Una app móvil (iOS y Android) | Expo (React Native) | Flutter |
| Una API en JavaScript | Express | NestJS |
| Una API en Python | FastAPI | Django |
| Una web completa con panel de administración | Django o Laravel | Next.js + Prisma |
| Un backend en Java | Spring Boot | — |
| Una app de escritorio | Tauri | Electron |
| Estilos y componentes | Tailwind CSS + shadcn/ui | — |
| Una base de datos | PostgreSQL + Prisma | Supabase |
| Publicar en internet | Vercel | Netlify |

---

## 2. Frontend web

### 2.1 React + Vite

React es la librería de interfaces más usada. Vite crea el proyecto y lo arranca en un segundo.

1. Crea el proyecto:
   ```powershell
   npm create vite@latest mi-app -- --template react-ts
   ```
   (`react-ts` = React con TypeScript; usa `react` si prefieres JavaScript)
2. Entra en la carpeta e instala las dependencias:
   ```powershell
   cd mi-app
   npm install
   ```
3. Arráncalo:
   ```powershell
   npm run dev
   ```
4. Abre **http://localhost:5173** en el navegador.
5. Edita `src/App.tsx`: la página se actualiza sola al guardar.
6. Para generar la versión final: `npm run build` (se crea la carpeta `dist/`).

### 2.2 Next.js

Next.js es React con rutas, renderizado en el servidor y API incluidos. Es el más usado para webs profesionales.

1. Crea el proyecto:
   ```powershell
   npx create-next-app@latest mi-app
   ```
2. Responde las preguntas (las recomendadas):
   - TypeScript → **Yes**
   - ESLint → **Yes**
   - Tailwind CSS → **Yes**
   - `src/` directory → **Yes**
   - App Router → **Yes**
   - Turbopack → **Yes**
   - Import alias → **No** (deja `@/*`)
3. Arráncalo:
   ```powershell
   cd mi-app
   npm run dev
   ```
4. Abre **http://localhost:3000**.
5. Las páginas están en `src/app/`. Por ejemplo, crea `src/app/contacto/page.tsx` y tendrás la ruta `/contacto`.
6. Versión final: `npm run build` y luego `npm start`.

### 2.3 Vue

1. Crea el proyecto:
   ```powershell
   npm create vue@latest
   ```
2. Escribe el nombre (`mi-app`) y elige **Yes** en TypeScript, Vue Router y Pinia. En el resto pon **No** si no los conoces.
3. Instala y arranca:
   ```powershell
   cd mi-app
   npm install
   npm run dev
   ```
4. Abre **http://localhost:5173**. El código está en `src/App.vue`.

### 2.4 Nuxt (Vue con servidor, el "Next.js de Vue")

1. Crea el proyecto:
   ```powershell
   npm create nuxt@latest mi-app
   ```
2. Elige **npm** como gestor de paquetes y responde **Yes** a inicializar Git.
3. Arranca:
   ```powershell
   cd mi-app
   npm run dev
   ```
4. Abre **http://localhost:3000**.

### 2.5 Angular

1. Instala la CLI de Angular (una sola vez):
   ```powershell
   npm install -g @angular/cli
   ng version
   ```
2. Crea el proyecto:
   ```powershell
   ng new mi-app
   ```
   Elige **CSS** (o SCSS) y responde **No** a SSR si es tu primera app.
3. Arranca:
   ```powershell
   cd mi-app
   ng serve
   ```
4. Abre **http://localhost:4200**.
5. Para crear un componente: `ng generate component inicio`.

### 2.6 Svelte / SvelteKit

1. Crea el proyecto:
   ```powershell
   npx sv create mi-app
   ```
2. Elige la plantilla **SvelteKit minimal**, **TypeScript** y los complementos que quieras (por ejemplo, Tailwind).
3. Arranca:
   ```powershell
   cd mi-app
   npm install
   npm run dev
   ```
4. Abre **http://localhost:5173**.

### 2.7 Astro (webs de contenido, blogs y landings)

1. Crea el proyecto:
   ```powershell
   npm create astro@latest mi-app
   ```
2. Elige la plantilla **"A basic, helpful starter project"**, responde **Yes** a instalar dependencias y **Yes** a Git.
3. Arranca:
   ```powershell
   cd mi-app
   npm run dev
   ```
4. Abre **http://localhost:4321**. Las páginas están en `src/pages/`.

---

## 3. Estilos y componentes

### 3.1 Tailwind CSS (en un proyecto Vite)

Next.js y SvelteKit ya pueden traerlo instalado desde el asistente. Para React + Vite o Vue:

1. Instálalo:
   ```powershell
   npm install tailwindcss @tailwindcss/vite
   ```
2. Abre `vite.config.ts` y añade el plugin:
   ```ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   })
   ```
3. Reemplaza el contenido de `src/index.css` por:
   ```css
   @import "tailwindcss";
   ```
4. Pruébalo: `<h1 className="text-3xl font-bold text-blue-600">Hola</h1>` y `npm run dev`.

### 3.2 shadcn/ui (componentes listos: botones, formularios, modales…)

Funciona sobre React + Tailwind (Next.js o Vite).

1. Dentro del proyecto:
   ```powershell
   npx shadcn@latest init
   ```
   Elige un color base (por ejemplo, *Neutral*).
2. Añade los componentes que necesites:
   ```powershell
   npx shadcn@latest add button card input dialog
   ```
3. Úsalos:
   ```tsx
   import { Button } from "@/components/ui/button"
   <Button>Guardar</Button>
   ```

---

## 4. Móvil

### 4.1 Expo (React Native): iOS y Android con JavaScript

1. En el móvil, instala la app **Expo Go** (App Store o Google Play).
2. En el PC, crea el proyecto:
   ```powershell
   npx create-expo-app@latest mi-app
   cd mi-app
   ```
3. Arranca:
   ```powershell
   npx expo start
   ```
4. Escanea el **código QR** que sale en la terminal:
   - **Android:** con la app Expo Go.
   - **iPhone:** con la cámara.

   El móvil y el PC deben estar en la **misma red WiFi**.
5. Edita `app/(tabs)/index.tsx` y verás los cambios al instante en el móvil.
6. Si tienes el emulador de Android Studio abierto, pulsa `a` en la terminal para abrir la app en él.
7. Para publicar en las tiendas: `npm install -g eas-cli`, luego `eas login` y `eas build`.

### 4.2 Flutter (Dart)

**Requisitos:** Git y Android Studio (para el emulador y el SDK de Android).

1. Instala el SDK de Flutter. La forma más fácil:
   - Instala VS Code y la extensión **Flutter** (`code --install-extension Dart-Code.flutter`).
   - En VS Code pulsa `Ctrl+Shift+P`, escribe **Flutter: New Project** y elige **Download SDK**.
   - Elige una carpeta sin espacios, por ejemplo `C:\src\flutter`, y acepta **Add SDK to PATH**.

   *Manual:* descarga el ZIP de https://docs.flutter.dev/get-started/install/windows, descomprímelo en `C:\src\flutter` y añade `C:\src\flutter\bin` al PATH (Configuración → Sistema → Información → Configuración avanzada → Variables de entorno → `Path` → Nuevo).
2. Cierra y abre la terminal y comprueba:
   ```powershell
   flutter doctor
   ```
3. Acepta las licencias de Android:
   ```powershell
   flutter doctor --android-licenses
   ```
   Responde `y` a todo. Repite `flutter doctor` hasta que no queden ❌ importantes.
4. Crea y arranca el proyecto (los nombres de Flutter usan guion bajo):
   ```powershell
   flutter create mi_app
   cd mi_app
   flutter run
   ```
   Con un emulador abierto o un móvil conectado por USB (con la *depuración USB* activada).
5. El código está en `lib/main.dart`. Pulsa `r` en la terminal para recargar en caliente.

---

## 5. Backend y APIs

### 5.1 Express (Node.js)

1. Crea la carpeta e inicia el proyecto:
   ```powershell
   mkdir mi-api
   cd mi-api
   npm init -y
   npm install express
   ```
2. En `package.json`, añade la línea `"type": "module",`.
3. Crea `index.js`:
   ```js
   import express from 'express'

   const app = express()
   app.use(express.json())

   app.get('/', (req, res) => res.json({ mensaje: 'Hola desde Express' }))

   app.listen(3000, () => console.log('API en http://localhost:3000'))
   ```
4. Arranca, con recarga automática al guardar:
   ```powershell
   node --watch index.js
   ```
5. Abre **http://localhost:3000**.

### 5.2 NestJS (API estructurada con TypeScript)

1. Instala la CLI (una vez):
   ```powershell
   npm install -g @nestjs/cli
   ```
2. Crea el proyecto y elige **npm**:
   ```powershell
   nest new mi-api
   ```
3. Arranca:
   ```powershell
   cd mi-api
   npm run start:dev
   ```
4. Abre **http://localhost:3000**.
5. Para generar un módulo completo (controlador, servicio y CRUD): `nest generate resource usuarios`.

### 5.3 FastAPI (Python)

**Requisito:** Python (Manual de herramientas, sección 4).

1. Crea la carpeta y un entorno virtual:
   ```powershell
   mkdir mi-api
   cd mi-api
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Instala FastAPI:
   ```powershell
   pip install "fastapi[standard]"
   ```
3. Crea `main.py`:
   ```python
   from fastapi import FastAPI

   app = FastAPI()

   @app.get("/")
   def inicio():
       return {"mensaje": "Hola desde FastAPI"}
   ```
4. Arranca:
   ```powershell
   fastapi dev main.py
   ```
5. Abre **http://localhost:8000** y la documentación automática en **http://localhost:8000/docs**.
6. Guarda las dependencias: `pip freeze > requirements.txt`.

### 5.4 Django (Python, web completa con panel de administración)

1. Crea la carpeta, el entorno virtual e instala Django:
   ```powershell
   mkdir mi-sitio
   cd mi-sitio
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install django
   ```
2. Crea el proyecto (fíjate en el punto final) y la base de datos:
   ```powershell
   django-admin startproject config .
   python manage.py migrate
   ```
3. Crea tu usuario administrador:
   ```powershell
   python manage.py createsuperuser
   ```
4. Arranca:
   ```powershell
   python manage.py runserver
   ```
5. Abre **http://localhost:8000** y el panel de administración en **http://localhost:8000/admin**.
6. Para crear una sección (app): `python manage.py startapp blog` y añádela a `INSTALLED_APPS` en `config/settings.py`.

### 5.5 Laravel (PHP)

1. Instala PHP, Composer y el instalador de Laravel. La forma más fácil en Windows y macOS es **Laravel Herd** (gratis): descárgalo de https://herd.laravel.com, instálalo y ábrelo una vez.

   *Alternativa por comandos (Windows, PowerShell como Administrador):*
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows'))
   ```
2. Cierra y abre la terminal y comprueba:
   ```powershell
   php -v
   composer -V
   laravel --version
   ```
3. Crea el proyecto:
   ```powershell
   laravel new mi-app
   ```
   Elige **No starter kit** (o React/Vue si quieres login ya hecho) y **SQLite** como base de datos.
4. Arranca:
   ```powershell
   cd mi-app
   composer run dev
   ```
5. Abre **http://localhost:8000**.

### 5.6 Spring Boot (Java)

**Requisito:** JDK 21 (Manual de herramientas, sección 8).

1. Entra en https://start.spring.io y elige:
   - Project: **Maven** · Language: **Java** · Spring Boot: la versión estable por defecto
   - Group: `com.ejemplo` · Artifact: `mi-api` · Java: **21**
   - Dependencies → **Add**: *Spring Web*, *Spring Boot DevTools*
2. Pulsa **Generate**, descomprime el ZIP y entra en la carpeta.
3. Crea `src/main/java/com/ejemplo/mi_api/HolaController.java`:
   ```java
   package com.ejemplo.mi_api;

   import org.springframework.web.bind.annotation.*;

   @RestController
   public class HolaController {
       @GetMapping("/")
       public String hola() { return "Hola desde Spring Boot"; }
   }
   ```
4. Arranca (la primera vez tarda porque descarga dependencias):
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   (macOS/Linux: `./mvnw spring-boot:run`)
5. Abre **http://localhost:8080**.

---

## 6. Escritorio

### 6.1 Electron (apps de escritorio con HTML/JS, como VS Code o Discord)

1. Crea el proyecto con Electron Forge:
   ```powershell
   npx create-electron-app@latest mi-app
   ```
2. Arranca:
   ```powershell
   cd mi-app
   npm start
   ```
3. Para generar el instalador (`.exe`): `npm run make` (queda en `out/`).

### 6.2 Tauri (apps de escritorio ligeras, con Rust)

1. Instala los requisitos (una vez):
   ```powershell
   winget install --id Microsoft.VisualStudio.2022.BuildTools -e
   ```
   En el instalador marca **"Desarrollo para el escritorio con C++"**. Después:
   ```powershell
   winget install --id Rustlang.Rustup -e
   ```
   WebView2 ya viene con Windows 11.
2. Cierra y abre la terminal y comprueba: `rustc --version`.
3. Crea el proyecto:
   ```powershell
   npm create tauri-app@latest
   ```
   Elige el nombre, **TypeScript / JavaScript**, **npm** y el framework de interfaz (por ejemplo React).
4. Arranca (la primera compilación tarda varios minutos):
   ```powershell
   cd mi-app
   npm install
   npm run tauri dev
   ```
5. Para generar el instalador: `npm run tauri build`.

---

## 7. Bases de datos

### 7.1 PostgreSQL

**Opción A: instalador**
1. Descarga el instalador de https://www.postgresql.org/download/windows (botón *Download the installer*).
2. Instálalo con las opciones por defecto. **Apunta la contraseña** que pongas para el usuario `postgres` y deja el puerto **5432**.
3. Ábrelo con **pgAdmin** (se instala junto con PostgreSQL).

**Opción B: con Docker (recomendado si ya tienes Docker)**
```powershell
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:17
```

La URL de conexión para tus proyectos queda así:
```
postgresql://postgres:postgres@localhost:5432/postgres
```

### 7.2 Prisma (ORM: usar la base de datos desde Node/TypeScript)

1. Dentro de tu proyecto (Next.js, Express, NestJS…):
   ```powershell
   npm install prisma --save-dev
   npm install @prisma/client
   npx prisma init
   ```
2. En el archivo `.env`, pon tu URL:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
   ```
3. Define tus tablas en `prisma/schema.prisma`:
   ```prisma
   model Usuario {
     id     Int    @id @default(autoincrement())
     email  String @unique
     nombre String?
   }
   ```
4. Crea las tablas:
   ```powershell
   npx prisma migrate dev --name inicio
   ```
5. Para ver y editar los datos en el navegador: `npx prisma studio`.

### 7.3 Supabase (PostgreSQL en la nube + login + almacenamiento)

1. Crea una cuenta en https://supabase.com y pulsa **New project**. Elige una región cercana y guarda la contraseña.
2. En *Project Settings → API* copia la **Project URL** y la **anon key**.
3. En tu proyecto:
   ```powershell
   npm install @supabase/supabase-js
   ```
4. Crea el cliente:
   ```ts
   import { createClient } from '@supabase/supabase-js'
   export const supabase = createClient('TU_PROJECT_URL', 'TU_ANON_KEY')
   ```
5. *(Opcional)* Supabase en local (requiere Docker): `npx supabase init` y `npx supabase start`.

---

## 8. Publicar en internet

### 8.1 Vercel (ideal para Next.js, React, Vue, Astro, SvelteKit)

**Opción fácil (desde GitHub):**
1. Sube tu proyecto a GitHub.
2. Entra en https://vercel.com, inicia sesión con GitHub y pulsa **Add New → Project**.
3. Elige el repositorio y pulsa **Deploy**. Cada `git push` lo vuelve a publicar.

**Opción por comandos:**
```powershell
npm install -g vercel
vercel login
vercel          # versión de prueba
vercel --prod   # versión final
```

### 8.2 Netlify

```powershell
npm install -g netlify-cli
netlify login
netlify deploy          # prueba
netlify deploy --prod   # final
```

---

## 9. Chuleta: puertos y comandos

| Framework | Crear | Arrancar | Puerto |
|---|---|---|---|
| React + Vite | `npm create vite@latest` | `npm run dev` | 5173 |
| Next.js | `npx create-next-app@latest` | `npm run dev` | 3000 |
| Vue | `npm create vue@latest` | `npm run dev` | 5173 |
| Nuxt | `npm create nuxt@latest` | `npm run dev` | 3000 |
| Angular | `ng new` | `ng serve` | 4200 |
| SvelteKit | `npx sv create` | `npm run dev` | 5173 |
| Astro | `npm create astro@latest` | `npm run dev` | 4321 |
| Expo | `npx create-expo-app@latest` | `npx expo start` | QR |
| Flutter | `flutter create` | `flutter run` | — |
| Express | `npm init -y` | `node --watch index.js` | 3000 |
| NestJS | `nest new` | `npm run start:dev` | 3000 |
| FastAPI | `pip install "fastapi[standard]"` | `fastapi dev main.py` | 8000 |
| Django | `django-admin startproject` | `python manage.py runserver` | 8000 |
| Laravel | `laravel new` | `composer run dev` | 8000 |
| Spring Boot | start.spring.io | `.\mvnw.cmd spring-boot:run` | 8080 |
| Electron | `npx create-electron-app@latest` | `npm start` | — |
| Tauri | `npm create tauri-app@latest` | `npm run tauri dev` | — |

### Problemas típicos

| Síntoma | Solución |
|---|---|
| `Port 3000 is already in use` | Ya tienes otro proyecto abierto: ciérralo con `Ctrl+C` o usa otro puerto (`npm run dev -- --port 3001`). |
| `Cannot find module …` | Te falta instalar dependencias: ejecuta `npm install`. |
| Tras hacer `git clone` de un proyecto, nada funciona | Ejecuta `npm install` (o `pip install -r requirements.txt` / `composer install`). |
| `.\.venv\Scripts\Activate.ps1` da error de permisos | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Expo: el móvil no conecta | Misma WiFi en ambos, o usa `npx expo start --tunnel`. |
| `flutter` no se reconoce | Falta `C:\src\flutter\bin` en el PATH. Cierra y abre la terminal. |
