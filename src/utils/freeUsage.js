const LIMIT = 3;

export function canUseFreeAI() {
  const count = Number(localStorage.getItem("cf_free_count") || 0);
  return count < LIMIT;
}

export function useFreeAI() {
  const count = Number(localStorage.getItem("cf_free_count") || 0);
  localStorage.setItem("cf_free_count", count + 1);
}