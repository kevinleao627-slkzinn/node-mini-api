import fs from 'node:fs/promises'

const dataBasePath = new URL('../db.json', import.meta.url) // Caminho para o arquivo onde os dados serão salvos

export class Database {
    #database = {} //Banco de dados na memória

    constructor() { //Carrega banco de dados
        fs.readFile(dataBasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data) //Se existir, coneverte para objeto
            })
            .catch(() => {
                this.#persist() //Se não, cria um arquivo vazio
            })
    }

    async #persist() {
        try {
            await fs.writeFile(dataBasePath, JSON.stringify(this.#database, null, 2)) //Salva o banco no disco
        } catch (err) {
            console.error("Erro ao salvar o banco de dados:", err)
        }
    }

    select(table, search) { // Retorna os registros de uma tabela, com filtro opcional
        let data = this.#database[table] ?? [] //retorna uma tabela ou um array vazio

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => { //Filtra os arquivos
                    return (
                        row[key] &&
                        typeof row[key] === "string" &&
                        row[key].includes(value) //Olha para vê se não tem texto
                    )
                })
            })
        }

        return data
    }

    insert(table, data) { // Insere um registro em uma tabela
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data] // Cria tabela caso não exista
        }

        this.#persist()
        return data
    }

    update(table, id, data) { // Atualiza um registro pelo ID
        const rowIndex = this.#database[table]?.findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {  // Mantém dados antigos e atualiza com os novos
                ...this.#database[table][rowIndex],
                ...data
            }

            this.#persist()
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table]?.findIndex(row => row.id === id) // Remove um registro pelo ID

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }
}
