export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/[\x00-\x1F\x7F]/g, '');
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = typeof obj[key] === 'string' 
        ? sanitizeInput(obj[key]) 
        : obj[key];
    }
  }
  return result;
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+?254|0)?[1-9]\d{8}$/.test(cleanPhone);
};