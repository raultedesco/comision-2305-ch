const { promises: fs } = require('fs')

class Mensajes {

    constructor(path) {
        this.path = path;
    }

    async getAll() {
        try {
            const objs = await fs.readFile(this.path, 'utf-8')
            return JSON.parse(objs)
        } catch (error) {
            return []
        }
    }

    async save(obj) {
        const mensajes = await this.getAll()

        let new_id
        if (mensajes.length == 0) {
            new_id = 1
        } else {
            new_id = mensajes[mensajes.length - 1].id + 1
        }

        const newObj = { ...obj, id: new_id }
        mensajes.push(newObj)

        try {
            await fs.writeFile(this.path, JSON.stringify(mensajes, null, 2))
            return new_id
        } catch (error) {
            throw new Error(`Se produjo un error: ${error}`)
        }
    }

    
}

module.exports = Mensajes