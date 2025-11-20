import http from 'node:http' // Módulo nativo para criar servidor HTTP
import { json } from './middlewares/json.js'  // Middleware para tratar JSON do body
import { rotes } from './rotes.js' // Suas rotas definidas
import { extractQueryParams } from './utils/extract-query-params.js' // Lê query string

//Query paramenters: URL stateful => Filtro, paginação, não obrigatórios
//Route Paramenters: Identificação de recurso
//Request Body: Envio de informações de um formulário (HTTPs)

//Http://localhost:3333/users?userid=17name=Kevin

//GET http:localhost:3333/users/1
//DELETE http:localhost:3333/users/1

//POST http:localhost:3333/users


const server = http.createServer(async (req, res) => {
  const { method, url } = req // Método HTTP e URL que acessa

  await json(req, res) // Converte o body da requisição para JSON

  const rota = rotes.find(rota => {  // Procura uma rota que combine
    return rota.method === method && rota.path.test(url)
  })

  if (rota) {   // Se encontrar, executa o handler da rota
    const routeParams = req.url.match(rota.path) // Extrai parâmetros da URL (regex)

    //console.log(extractQueryParams(routeParams.groups.query))
    const { query, ...params } = routeParams.groups //Separa o query e os params da rota
    req.params = params
    req.query = query ? extractQueryParams(query) : {} // Converte query em objeto

    return rota.handler(req, res) //Executa
  }

  return res.writeHead(404).end('Rota não encontrada') //Caso não ache, retorna rota inválida
})
server.listen(3333, () =>
  console.log('Servidor rodando em http://localhost:3333')
)
