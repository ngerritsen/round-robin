const PREFIX = "_rr_";

export const get = (name: string) => {
  const data = localStorage.getItem(PREFIX + name);
  return data ? JSON.parse(data) : undefined;
};

export const set = (name: string, value: any) => {
  localStorage.setItem(PREFIX + name, JSON.stringify(value));
};
