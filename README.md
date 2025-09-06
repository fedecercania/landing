# Cercan.ia Landing Page

Una landing page moderna y elegante para Cercan.ia con un diseño futurista en negro y verde.

## 🚀 Características

- **Diseño moderno**: Esquema de colores negro y verde vibrante
- **Animaciones fluidas**: Efectos de parallax, rotación y hover
- **Responsive**: Adaptado para móviles, tablets y desktop  
- **Interactivo**: Modal de suscripción, efectos de cursor y easter eggs
- **Optimizado**: Carga rápida y rendimiento óptimo

## 📁 Estructura del proyecto

```
├── index.html          # Página principal
├── styles.css          # Estilos y animaciones
├── script.js           # Interactividad y efectos
└── README.md           # Este archivo
```

## 🛠️ Instalación y despliegue

### Opción 1: GitHub Pages (Recomendado)

1. Sube los archivos a tu repositorio de GitHub
2. Ve a Settings > Pages en tu repositorio
3. Selecciona "Deploy from a branch" 
4. Elige "main" branch y "/ (root)"
5. Tu sitio estará disponible en: `https://fedecercania.github.io/landing`

### Opción 2: Local

Simplemente abre `index.html` en tu navegador.

## 📤 Cómo subir al repositorio

### Paso 1: Instalar herramientas de desarrollo

```bash
# Instalar Xcode Command Line Tools
xcode-select --install
```

### Paso 2: Inicializar y subir

```bash
# Navegar al directorio del proyecto
cd /Users/federicogonzalez/github/landing

# Inicializar Git
git init

# Añadir archivos
git add .

# Hacer commit
git commit -m "feat: add cercan.ia landing page with modern design"

# Conectar con el repositorio remoto
git remote add origin https://github.com/fedecercania/landing.git

# Subir archivos
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. Ve a https://github.com/fedecercania/landing
2. Click en "Settings"
3. Scroll hasta "Pages" en el sidebar
4. En "Source", selecciona "Deploy from a branch"
5. Selecciona "main" branch y "/ (root)"
6. Click "Save"

Tu sitio estará disponible en: `https://fedecercania.github.io/landing`

## 🎨 Personalización

### Colores

Los colores principales están definidos en `:root` en `styles.css`:

```css
:root {
    --primary-green: #00ff88;
    --dark-green: #00cc6a;
    --black: #000000;
    --dark-gray: #111111;
}
```

### Contenido

Edita el contenido en `index.html`:
- Título y descripción en la sección `.hero`
- Características en `.features-grid`
- Progreso en `.progress-bar`

### Efectos

Personaliza animaciones en `script.js`:
- Velocidad de animaciones
- Efectos de partículas
- Interacciones del modal

## 🎭 Easter Eggs

- **Código Konami**: ↑↑↓↓←→←→BA para activar modo desarrollador
- **Partículas de cursor**: Siguen el movimiento del mouse
- **Animaciones de hover**: En tarjetas y botones

## 📱 Compatibilidad

- ✅ Chrome/Safari/Firefox/Edge modernos
- ✅ iOS Safari 12+
- ✅ Chrome Mobile
- ✅ Responsive design (320px - 4K)

## 📄 Licencia

Este proyecto es de uso libre para Cercan.ia.

---

Creado con ❤️ para Cercan.ia
