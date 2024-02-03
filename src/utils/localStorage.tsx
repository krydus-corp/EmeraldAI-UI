export const setLocal = (key: string, object: any) => {
  localStorage.setItem(key, JSON.stringify(object));
};
export const getLocal = (key: string) => {
  return JSON.parse(localStorage.getItem(key) || '{}');
};
export const clearLocal = (key: string) => {
  localStorage.removeItem(key);
};

export const clearLocalItems = () => {
  localStorage.clear();
};

export const setToken = (key: string, value: string) =>
  localStorage.setItem(key, value);

export const getLocalItem = (key: string) => localStorage.getItem(key);
