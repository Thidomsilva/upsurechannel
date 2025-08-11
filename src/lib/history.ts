// Simples utilitário para salvar e recuperar histórico de operações no localStorage
export type Operation = {
  date: string; // ISO string
  roi: string; // Ex: "2.75%"
};

const STORAGE_KEY = 'upsure_history';

export function saveOperation(op: Operation) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  history.unshift(op); // adiciona no topo
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory(): Operation[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Operation[];
  } catch {
    return [];
  }
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
