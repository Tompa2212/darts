const getValue = <T>(key: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
};

const setValue = (key: string, value: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(key, value);
};

const removeValue = (key: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(key);
};

export const storage = {
  getValue,
  setValue,
  removeValue
};
