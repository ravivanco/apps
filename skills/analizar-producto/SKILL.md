---
name: analizar-producto
description: Analiza la imagen de un producto (etiqueta, envase, tabla nutricional, lista de ingredientes) y desglosa sus componentes en español - ingredientes, vitaminas, minerales, cafeína, azúcares, aditivos, alérgenos - explicando para qué sirve cada uno y si hay algo a vigilar. Úsala cuando el usuario pase una foto de un producto y pregunte qué contiene, qué tiene, sus componentes, ingredientes, vitaminas, o si es sano. Sirve para energizantes, bebidas, alimentos, suplementos, cosméticos y productos de limpieza.
---

# Analizar producto desde imagen

El usuario te pasa una o varias fotos de un producto. Tu trabajo es leer la etiqueta con cuidado y entregar un desglose claro y útil en español.

## 1. Leer la imagen

- Identifica **marca, nombre del producto, tipo** (energizante, snack, suplemento, cosmético, limpieza…) y **tamaño/porción** (ml, g, cápsulas).
- Transcribe la **lista de ingredientes** y la **tabla nutricional** tal como aparecen.
- Si un texto está borroso, cortado o no aparece en la foto, dilo explícitamente (`[ilegible]`) y pide otra foto de esa cara del envase. **Nunca inventes cantidades.**
- Si solo se ve el frente del envase, puedes indicar lo que normalmente contiene ese producto, pero márcalo como **"según información general, no visible en la foto"**.

## 2. Formato de respuesta

### 🏷️ Producto
Nombre, marca, tipo, contenido neto y porción.

### 📋 Ingredientes (en orden de la etiqueta)
Tabla: | Ingrediente | Qué es | Para qué está |
Recuerda que el orden indica cantidad (el primero es el más abundante).

### 📊 Información nutricional
Tabla con los valores por porción y por envase completo si difieren (calorías, azúcares, sodio, grasas, proteína…).

### 💊 Vitaminas, minerales y activos
Tabla: | Componente | Cantidad | % Valor Diario | Función en el cuerpo |
Ejemplos de activos: cafeína, taurina, guaraná, ginseng, L-carnitina, glucuronolactona, creatina, colágeno, etc.

### ⚠️ A tener en cuenta
- Cantidades altas (azúcar, sodio, cafeína) comparadas con el límite diario recomendado. Ej: cafeína adulto ~400 mg/día; azúcar añadido OMS <25–50 g/día.
- Edulcorantes, colorantes y conservantes relevantes (con su código E si aparece).
- **Alérgenos** (gluten, lactosa, soya, frutos secos…).
- Advertencias de la etiqueta (embarazadas, menores, personas con hipertensión, etc.).

### ✅ Resumen
2–3 frases en lenguaje sencillo: qué es realmente el producto, lo bueno, lo mejorable y para quién es o no es adecuado.

## 3. Reglas por tipo de producto

- **Energizantes / bebidas:** destaca siempre cafeína total por lata, azúcar en gramos y en cucharaditas (1 cdta ≈ 4 g), vitaminas del complejo B y si superan el 100% VD.
- **Suplementos:** dosis por porción vs. dosis habitual, forma química (ej. citrato vs. óxido de magnesio) y posibles interacciones conocidas.
- **Alimentos procesados:** sellos/octógonos de advertencia si aplican, calidad de grasas, fibra, ultraprocesados.
- **Cosméticos:** ingredientes INCI principales, fragancias y posibles irritantes.
- **Limpieza:** componentes activos y precauciones de uso/mezcla.

## 4. Tono y límites

- Claro, directo, sin alarmismo; explica términos técnicos.
- Es información orientativa, no consejo médico: si el usuario menciona una condición de salud, embarazo o medicamentos, sugiere consultarlo con un profesional.
- Si el usuario pide comparar dos productos, usa una tabla lado a lado con las mismas filas.
