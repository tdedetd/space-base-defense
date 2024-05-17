export function getHtmlElement<T extends HTMLElement>(id: string): T {
  const element = document.querySelector<T>(`#${id}`);
  if (!element) {
    throw new Error(`element with id "${id}" not found`);
  }

  return element;
}
