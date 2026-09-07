import { createMMKV } from 'react-native-mmkv'
export const storage = createMMKV()

/**
 * TOKEN
 */
export const setStorage = (key, value) => {
  if (typeof value === "object") {
    storage.set(key, JSON.stringify(value));
  } else {
    storage.set(key, value);
  }
};

export const getItem = (key) => {
  return storage.getString(key);
};

export const removeItem = (key) => {
    storage.remove(key);
};

/**
 * USER
 */
export const setUser = (user) => {
  storage.set("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = storage.getString("user");
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  storage.delete("user");
};

/**
 * REFRESH TOKEN
 */
export const setRefreshToken = (token) => {
  storage.set("refresh_token", token);
};

export const getRefreshToken = () => {
  return storage.getString("refresh_token");
};

export const removeRefreshToken = (key) => {
  storage.delete("refresh_token");
};

/**
 * FACILITY
 */
export const setFacility = (facility) => {
  storage.set("facility", JSON.stringify(facility));
};

export const getFacility = () => {
  const facility = storage.getString("facility");
  return facility ? JSON.parse(facility) : null;
};

export const removeFacility = () => {
  storage.delete("facility");
};

/**
 * PERMISSIONS
 */
export const setPermissions = (permissions) => {
  storage.set("permissions", JSON.stringify(permissions));
};

export const getPermissions = () => {
  const permissions = storage.getString("permissions");
  return permissions ? JSON.parse(permissions) : [];
};

export const removePermissions = () => {
  storage.delete("permissions");
};

/**
 * LOGIN STATUS
 */
export const isLoggedIn = () => {
  return !!storage.getString("token");
};

/**
 * LOGOUT
 */
export const logout = () => {
  storage.clearAll();
};