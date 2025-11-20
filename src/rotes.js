import { randomUUID } from 'node:crypto' // Gera IDs únicos
import { Database } from './dataBase.js' // Banco de daodos em JSON
import { buildRoutePath } from './utils/build-route-path.js' // Constrói regex da rota

const database = new Database() // Cria uma instância do banco

export const rotes = [
  {
    method: 'GET', 
    path: buildRoutePath('/users'),
    handler: (req, res) => { // Função executada quando a rota é chamada
      const { search } = req.query // Pega ?search= da URL
      const users = database.select('users',{
        name: search,
        email: search, //Filtra nome e email
      })

      

      return res.end(JSON.stringify(users)) //Retorna a lista com o filtro
    },
  },

  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { name, email } = req.body // Pega dados enviados no corpo

      const user = {
        id: randomUUID(),
        name,
        email,
      }

      database.insert('users', user) // Salva o novo usuário no banco de dados


      res.writeHead(201) // Status: criado com sucesso
      return res.end(JSON.stringify(user)) // Retorna o usuário criado
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler:(req, res) =>{
      const { id } = req.params //Pega o ID da url
      const { name, email} = req.body

      database.update('users', id, { //Atualiza o usuário
        name,
        email,
      })
      return res.writeHead(204).end() // Caso não tenha nada, retorna 204
    },
  },
  {
    method: 'DELETE', 
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('users', id) //remove do banco

      return res.writeHead(204).end()
    }
  }
]
