export const camelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const snakeToCamel = (str: string) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const toSnakeCase = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined && val !== null) {
      result[camelToSnake(key)] = val;
    }
  }
  return result;
};

export const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj !== null && obj !== undefined && typeof obj === 'object' && !(obj instanceof Date)) {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      result[snakeToCamel(key)] = toCamelCase(obj[key]);
    }
    return result;
  }
  return obj;
};
