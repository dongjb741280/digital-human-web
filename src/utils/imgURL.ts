export function svgUrl(svgUrl: string) {
  return new URL(`../assets/svgs/${svgUrl}.svg`, import.meta.url).href
}
export function fontUrl(imageUrl: string) {
  return new URL(`../assets/fonts/image/${imageUrl}.png`, import.meta.url).href
}
