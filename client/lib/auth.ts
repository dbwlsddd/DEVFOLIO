export const setToken = (token: string) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');
export const setUser = (user: any) => localStorage.setItem('user', JSON.stringify(user));
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
export const logout = () => {
  removeToken();
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// API 요청 시 헤더에 토큰 자동 추가
export const authHeader = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};