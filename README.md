# NIBEDULA TECH — Sitio Web Corporativo

Sitio web estático de NIBEDULA TECH E.I.R.L. Desarrollado en HTML, CSS y JavaScript vanilla, sin frameworks ni pasos de compilación.

---

## Requisitos

Ninguno especial. Solo un servidor HTTP local para desarrollo.

- Sin build step
- Sin node_modules
- Sin framework

---

## Ejecutar localmente

**Opción A — VS Code Live Server (recomendado)**
Instalar la extensión Live Server y hacer clic en "Go Live" desde cualquier archivo HTML.

**Opción B — Python**
```bash
python -m http.server 8000
```

**Opción C — npx**
```bash
npx serve .
```

Abrir en: http://localhost:8000

---

## Estructura del proyecto

```
nibedula-tech-web/
├── index.html                        # Página de inicio
├── nosotros.html                     # Página institucional
├── contacto.html                     # Formulario y datos de contacto
├── servicios/
│   ├── software-a-medida.html
│   ├── automatizaciones.html
│   ├── integraciones.html
│   ├── bi-reportes.html
│   └── importaciones.html
├── assets/
│   ├── css/
│   │   └── styles.css                # Estilos globales
│   ├── js/
│   │   ├── main.js                   # Lógica general (nav, scroll, etc.)
│   │   └── contact.js                # Lógica del formulario y WhatsApp
│   ├── img/
│   │   ├── logo/
│   │   │   └── logo_nibedula_circulo.png
│   │   └── clientes/                 # Logos de clientes (SVG/PNG)
│   └── icons/                        # Favicons e iconos de la marca
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── vercel.json
```

---

## Cómo actualizar el número de WhatsApp

1. Abrir `assets/js/contact.js`.
2. Cambiar la constante `WA_NUMBER` al inicio del archivo.
3. Los links en los HTML también usan `51999999999`. Buscar y reemplazar globalmente si se desea centralizar todo en HTML también.

---

## Cómo reemplazar imágenes placeholder

- Los SVG en `assets/img/` y `assets/icons/` son temporales.
- Reemplazar por archivos con el mismo nombre y ruta.
- Para clientes: reemplazar `assets/img/clientes/nombre.svg` con el PNG o SVG real del cliente.

---

## Cómo desplegar en Vercel

1. Hacer push del proyecto a un repositorio GitHub.
2. Importar el repositorio en [vercel.com](https://vercel.com).
3. Configurar:
   - **Framework preset:** Other (ninguno)
   - **Output directory:** `.` (raíz)
4. El archivo `vercel.json` ya está configurado con headers de caché y seguridad.

---

## Cómo desplegar en Netlify

**Opción A — Drag & drop**
Arrastrar la carpeta del proyecto a [netlify.com/drop](https://app.netlify.com/drop).

**Opción B — Repositorio GitHub**
1. Conectar el repositorio en [netlify.com](https://netlify.com).
2. Configurar:
   - **Build command:** (dejar vacío)
   - **Publish directory:** `.` (raíz)

---

## Actualizar el RUC en el footer

- Buscar `[completar]` en todos los archivos HTML.
- Reemplazar con el RUC real de la empresa.

---

## Soporte de navegadores

Chrome, Edge, Firefox y Safari — versiones modernas (últimos 2 años).

Sin polyfills requeridos. Requisitos mínimos del navegador:
- CSS Custom Properties
- IntersectionObserver API
