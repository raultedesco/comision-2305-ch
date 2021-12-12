import { promises as fs } from 'fs'

class ContenedorArchivo {

    constructor(path) {
        this.path = path;
    }

    async getById(id) {
        const elementos = await this.getAll()
        const buscado = elementos.find(e => e.id == id)
        return buscado
    }

    async getAll() {
        try {
            const elementos = await fs.readFile(this.path, 'utf-8')
            return JSON.parse(elementos)
        } catch (error) {
            return []
        }
    }

    async save(elemento) {
        const elementos = await this.getAll()

        let newId
        if (elementos.length == 0) {
            newId = 1
        } else {
            newId = elementos[elementos.length - 1].id + 1
        }

        const newElem = { ...elemento, id: newId }
        elementos.push(newElem)

        try {
            await fs.writeFile(this.path, JSON.stringify(elementos, null, 2))
            return newId
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }

    async update(elemento) {
        const elementos = await this.getAll()
        const index = elementos.findIndex(e => e.id == elem.id)
        if (index == -1) {
            throw new Error(`Error: Id no encontrado ${elem.id}`)
        } else {
            elementos[index] = elem
            try {
                await fs.writeFile(this.path, JSON.stringify(elementos, null, 2))
            } catch (error) {
                throw new Error(`Error al borrar: ${error}`)
            }
        }
    }

    async deleteByID(id) {
        const elementos = await this.getAll()
        const index = elementos.findIndex(e => e.id == id)
        if (index == -1) {
            throw new Error(`Error: Id no encontrado ${id}`)
        }

        elementos.splice(index, 1)
        try {
            await fs.writeFile(this.path, JSON.stringify(elementos, null, 2))
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }

    async deleteAll() {
        try {
            await fs.writeFile(this.path, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }
}

export default ContenedorArchivo