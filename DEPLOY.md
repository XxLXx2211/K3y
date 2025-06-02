# 🚀 Deploy en Netlify

Este proyecto está configurado para hacer deploy automático en Netlify. Aquí tienes las instrucciones paso a paso:

## 📋 Configuración Completada

✅ **Archivo `netlify.toml`** - Configuración principal de Netlify
✅ **Script de build corregido** - `npm run build` funciona correctamente  
✅ **Archivo `_redirects`** - Para manejar el routing de React SPA
✅ **Directorio `public`** - Para archivos estáticos
✅ **Build verificado** - El proyecto se construye sin errores

## 🌐 Opciones de Deploy

### Opción 1: Deploy desde Git (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for Netlify"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repositorio.git
   git push -u origin main
   ```

2. **Conecta con Netlify:**
   - Ve a [netlify.com](https://netlify.com) y crea una cuenta
   - Haz clic en "New site from Git"
   - Conecta tu repositorio de GitHub
   - Netlify detectará automáticamente la configuración desde `netlify.toml`

3. **Deploy automático:**
   - Cada push a la rama `main` activará un nuevo deploy
   - Los builds fallarán si hay errores de TypeScript

### Opción 2: Deploy Manual (Drag & Drop)

1. **Construye el proyecto:**
   ```bash
   npm run build
   ```

2. **Deploy manual:**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta `dist` al área de deploy
   - Tu sitio estará disponible inmediatamente

## ⚙️ Configuración Incluida

### `netlify.toml`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node.js version:** 18
- **SPA redirects:** Configurados para React Router
- **Headers de seguridad:** X-Frame-Options, XSS Protection, etc.
- **Cache optimizado:** Para assets estáticos (JS, CSS)

### Variables de Entorno (si las necesitas)
Si tu app usa variables de entorno, configúralas en Netlify:
1. Ve a Site settings > Environment variables
2. Agrega las variables que necesites (ej: `VITE_API_URL`)

## 🔧 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🚨 Notas Importantes

1. **Better SQLite3:** Tu proyecto usa `better-sqlite3` que es una dependencia nativa. Esto **NO funcionará** en Netlify ya que es un entorno serverless. Considera:
   - Usar una base de datos en la nube (Supabase, PlanetScale, etc.)
   - Implementar un backend separado
   - Usar localStorage para datos temporales

2. **Archivos grandes:** El bundle JS es de ~786KB. Considera code-splitting para mejorar el rendimiento.

3. **Scripts externos:** Tu `index.html` incluye scripts de HeroUI desde CDN, asegúrate de que estén disponibles.

## 🎯 Próximos Pasos

1. Sube el código a GitHub
2. Conecta con Netlify
3. Configura un dominio personalizado (opcional)
4. Configura variables de entorno si las necesitas
5. Considera migrar la base de datos a una solución cloud

¡Tu proyecto está listo para deploy! 🎉
