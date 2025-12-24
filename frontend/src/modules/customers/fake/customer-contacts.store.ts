export type CustomerContactEntity = {
  id: string;
  customerId: string;
  name: string;
  phone?: string;
  email?: string;
  position?: string;
  createdAt: string;
};

const KEY = "fake_customer_contacts_v1";

function uid(prefix = "cc") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function readAll(): CustomerContactEntity[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CustomerContactEntity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(data: CustomerContactEntity[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function listContacts(customerId: string) {
  return readAll()
    .filter((x) => x.customerId === customerId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function upsertContact(
  input: Omit<CustomerContactEntity, "id" | "createdAt"> & { id?: string }
) {
  const all = readAll();
  const now = new Date().toISOString();

  if (input.id) {
    const idx = all.findIndex((x) => x.id === input.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...input };
      writeAll(all);
      return all[idx];
    }
  }

  const created: CustomerContactEntity = {
    id: uid(),
    createdAt: now,
    ...input,
  };
  all.unshift(created);
  writeAll(all);
  return created;
}

export function deleteContact(id: string) {
  const all = readAll().filter((x) => x.id !== id);
  writeAll(all);
  return true;
}
