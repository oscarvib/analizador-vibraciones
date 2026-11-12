# Analizador de vibraciones

Herramienta HTML de un solo archivo (sin instalación, todo se procesa en tu navegador) para analizar vibraciones y par a partir de ficheros `.mat` (struct `recorded_data`) y convertir ficheros `.unv`/`.aunv`.

## Qué hace
- **Preparar archivo**: conversión UNV → `.mat`, cálculo de RPM a partir de la vibración, recorte y guardado.
- **Análisis**: colormap tiempo/frecuencia, order tracking, espectros por condición de velocidad, tabla de overall con límites ✓/✗.
- **Informe**: generación de un `.docx` con tablas y figuras, o copia directa a Word.
- **Trabajos** (`.vibjob`): guarda y reabre todo el proyecto en un fichero externo; no deja copia en el navegador.
- Tema claro/oscuro y navegación por teclado.

## Uso
Abre `index.html` en el navegador (o la página de GitHub Pages del repositorio). Para la lectura de `.mat` comprimidos usa la librería pako desde CDN, por lo que necesita conexión la primera vez.

## GitHub Pages
Settings → Pages → *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
