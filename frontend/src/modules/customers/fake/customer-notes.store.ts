export type CustomerNoteEntity = {
  id: string;
  customerId: string;
  note: string;
  createdByName?: string; // fake
  createdAt: string;
};

const KEY = "fake_customer_notes_v1";

function uid(prefix = "cn") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function readAll(): CustomerNoteEntity[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CustomerNoteEntity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(data: CustomerNoteEntity[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function listNotes(customerId: string) {
  return readAll()
    .filter((x) => x.customerId === customerId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addNote(input: Omit<CustomerNoteEntity, "id" | "createdAt">) {
  const all = readAll();
  const now = new Date().toISOString();
  const created: CustomerNoteEntity = { id: uid(), createdAt: now, ...input };
  all.unshift(created);
  writeAll(all);
  return created;
}

export function deleteNote(id: string) {
  const all = readAll().filter((x) => x.id !== id);
  writeAll(all);
  return true;
}
