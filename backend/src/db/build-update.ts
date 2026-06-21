export function buildUpdate<T extends Record<string, any>>(
  table: string,
  id: number,
  dto: T,
  map?: Record<string, string>,
) {
  const entries = Object.entries(dto).filter(([_, v]) => v !== undefined);
  if (!entries.length) return null;

  const sets = entries.map(([k], i) => `${map?.[k] ?? k} = $${i + 1}`);
  const values = entries.map(([_, v]) => v);
  values.push(id);

  return {
    text: `UPDATE ${table} SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values,
  };
}
