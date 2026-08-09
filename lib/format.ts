/**
 * Price formatting.
 *
 * Albanian lek has no minor unit in practice, so prices render as whole
 * numbers with a thousands separator: 2.500 L. Using one helper everywhere
 * keeps the currency label consistent (it used to be "ALL" on cards and
 * "Lek" in the cart).
 */
export function formatPrice(value: number): string {
  // Grouped explicitly rather than via toLocaleString: the sq-AL locale
  // doesn't group 4-digit values and uses spaces above that, which reads
  // inconsistently across a price list.
  const grouped = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${grouped} L`;
}
