export function load() {
  const now = new Date();
  const seed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
  return {
    seed
  };
}
