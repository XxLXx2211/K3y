export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export const defaultPasswordOptions: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
};

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Caracteres ambiguos
const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;.<>';

export function generatePassword(options: PasswordOptions = defaultPasswordOptions): string {
  let charset = '';
  let requiredChars = '';

  // Construir el conjunto de caracteres
  if (options.includeUppercase) {
    let chars = UPPERCASE;
    if (options.excludeSimilar) {
      chars = chars.replace(/[IL]/g, '');
    }
    charset += chars;
    requiredChars += getRandomChar(chars);
  }

  if (options.includeLowercase) {
    let chars = LOWERCASE;
    if (options.excludeSimilar) {
      chars = chars.replace(/[il]/g, '');
    }
    charset += chars;
    requiredChars += getRandomChar(chars);
  }

  if (options.includeNumbers) {
    let chars = NUMBERS;
    if (options.excludeSimilar) {
      chars = chars.replace(/[10]/g, '');
    }
    charset += chars;
    requiredChars += getRandomChar(chars);
  }

  if (options.includeSymbols) {
    let chars = SYMBOLS;
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(char => !AMBIGUOUS_CHARS.includes(char)).join('');
    }
    charset += chars;
    requiredChars += getRandomChar(chars);
  }

  if (charset === '') {
    throw new Error('Al menos un tipo de carácter debe estar seleccionado');
  }

  if (options.length < requiredChars.length) {
    throw new Error(`La longitud mínima debe ser ${requiredChars.length} para incluir todos los tipos de caracteres`);
  }

  // Generar el resto de la contraseña
  let password = requiredChars;
  for (let i = requiredChars.length; i < options.length; i++) {
    password += getRandomChar(charset);
  }

  // Mezclar la contraseña para que los caracteres requeridos no estén al principio
  return shuffleString(password);
}

function getRandomChar(charset: string): string {
  const randomIndex = Math.floor(Math.random() * charset.length);
  return charset[randomIndex];
}

function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  // Longitud
  if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
  } else {
    feedback.push('Usa al menos 8 caracteres');
  }

  // Mayúsculas
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Incluye letras mayúsculas');
  }

  // Minúsculas
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Incluye letras minúsculas');
  }

  // Números
  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Incluye números');
  }

  // Símbolos
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Incluye símbolos especiales');
  }

  // Variedad de caracteres
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) {
    score += 15;
  } else {
    feedback.push('Evita repetir caracteres');
  }

  // Determinar etiqueta y color
  let label: string;
  let color: string;

  if (score >= 85) {
    label = 'Muy Fuerte';
    color = 'success';
  } else if (score >= 70) {
    label = 'Fuerte';
    color = 'primary';
  } else if (score >= 50) {
    label = 'Moderada';
    color = 'warning';
  } else if (score >= 30) {
    label = 'Débil';
    color = 'danger';
  } else {
    label = 'Muy Débil';
    color = 'danger';
  }

  return { score, label, color, feedback };
}
