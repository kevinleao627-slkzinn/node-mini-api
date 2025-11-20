export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g // Captura parâmetros do tipo ":id", ":name"
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)') // Transforma ":id" em um grupo nomeado de regex

  const pathRegex = new RegExp(`^${pathWithParams}(?:\\?(?<query>.*))?$`) // Cria regex completa, aceitando query string opcional
  return pathRegex // Retorna a regex final da rota
}
