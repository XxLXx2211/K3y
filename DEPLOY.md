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

1. **✅ Base de Datos:** El proyecto ahora usa **Supabase** en lugar de SQLite, por lo que funcionará perfectamente en Netlify.

2. **Variables de Entorno:** Asegúrate de configurar las variables de entorno en Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Archivos grandes:** El bundle JS es de ~896KB. Considera code-splitting para mejorar el rendimiento.

4. **Scripts externos:** Tu `index.html` incluye scripts de HeroUI desde CDN, asegúrate de que estén disponibles.

## 🗄️ Configuración de Supabase

### 1. Crear la tabla en Supabase
1. Ve a tu proyecto en [Supabase](https://supabase.com/dashboard)
2. Ve a SQL Editor
3. Ejecuta el script `supabase-setup.sql` incluido en el proyecto
4. Esto creará la tabla `api_keys` con todos los índices y políticas necesarias

### 2. Configurar Variables de Entorno en Netlify
1. Ve a tu sitio en Netlify Dashboard
2. Site settings > Environment variables
3. Agrega:
   - `VITE_SUPABASE_URL`: `https://ycdwdcfkbsmmmuekstpx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🎯 Próximos Pasos

1. ✅ Sube el código a GitHub (Ya hecho)
2. Ejecuta el script SQL en Supabase
3. Conecta con Netlify
4. Configura las variables de entorno
5. ¡Deploy automático!

¡Tu proyecto está listo para deploy! 🎉
