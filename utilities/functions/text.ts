export function capitalizeFirstWord(str: string) {
  return str.replace(/^\w/, (match) => match.toUpperCase());
}