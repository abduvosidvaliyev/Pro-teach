import { db, ref, get, set, update, remove, onValue, push } from "./firebase";

const cache = {};

// 🔹 Bir marta o‘qish (get)
export async function readData(path) {
  if (cache[path]) return cache[path];
  const snapshot = await get(ref(db, path));
  const data = snapshot.exists() ? snapshot.val() : null;
  cache[path] = data;
  return data;
}

// 🔹 Real-time kuzatish (onValue)
export function onValueData(path, callback) {
  const r = ref(db, path);
  const unsubscribe = onValue(r, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    cache[path] = data;
    callback(data);
  });
  return unsubscribe; // kerak bo‘lsa to‘xtatish uchun
}

// 🔹 Yozish (set)
export function setData(path, data) {
  cache[path] = data;
  return set(ref(db, path), data);
}

// 🔹 Yangilash (update)
export function updateData(path, data) {
  if (cache[path]) cache[path] = { ...cache[path], ...data };
  return update(ref(db, path), data);
}

// 🔹 O‘chirish (remove)
export function deleteData(path) {
  delete cache[path];
  return remove(ref(db, path));
}

// 🔹 Yangi ma'lumot qo'shish (push)
export function pushData(path, data) {
  return push(ref(db, path), data);
}
