 export async function json(req, res) {
  const buffers = [] // Armazena pedaços (chunks) recebidos da requisição

  for await (const chunk of req) { //LÊ os dados
    buffers.push(chunk) //Guarda cada chunk
  }

  const data = Buffer.concat(buffers).toString() // Junta cada chunk e transforma em string

  if (data.length > 0) { //Se o body não estiver vazio
    try {
      req.body = JSON.parse(data) //converte para JSON
    } catch (err) {
      console.log("Erro ao fazer parse do JSON:", err)
      req.body = {} // Caso dê erro, deixa o body vazio
    }
  } else {
    req.body = {}  // Se não foi enviado body, define vazio
  }

  res.setHeader('Content-Type', 'application/json') //Padrão de resposta do JSON
}
