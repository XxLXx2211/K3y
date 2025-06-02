// Script para crear iconos PNG básicos usando Canvas
// Ejecutar en el navegador para generar los iconos

function createIcon(size, filename) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Fondo
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, size, size);
    
    // Icono de llave (simple)
    ctx.fillStyle = '#ffffff';
    ctx.font = `${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔑', size / 2, size / 2);
    
    // Descargar
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Crear iconos
createIcon(192, 'icon-192.png');
createIcon(512, 'icon-512.png');
