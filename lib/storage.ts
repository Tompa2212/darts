const getValue = <T>(key: string) => {
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
};

const setValue = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

const removeValue = (key: string) => {
  localStorage.removeItem(key);
};

export const storage = {
  getValue,
  setValue,
  removeValue
};
