export function queryBuildAgregados(p: string, v: string, c: number, cc: string) {
  return `periodos/${p}/variaveis/${v}?localidades=N1[all]&classificacao=${c}[${cc}]`;
}
