/**
 * Title-case each whitespace-separated word (first letter upper, rest lower per word).
 */
export function capitalizeWords(value) {
  if (value == null || value === '') return ''
  return String(value)
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}
