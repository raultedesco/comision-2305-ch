const { promises: fs } = require('fs')

class SaveToFile {

    constructor(path) {
        this.path = path;
    }

    async getById(id) {
        const objcts = await this.getAll()
        const founded = objcts.find(o => o.id == id)
        return founded
    }

    async getProductByIdCarrito(id){
        const objcts = await this.getAll()
        const founded = objcts.find(o => o.id == id)
        return founded.productos
    }
    async getAll() {
        try {
            const objcts = await fs.readFile(this.path, 'utf-8')
            return JSON.parse(objcts)
        } catch (error) {
            return []
        }
    }

    async save(obj) {
        const objcts = await this.getAll()

        let newId
        if (objcts.length == 0) {
            newId = 1
        } else {
            newId = objcts[objcts.length - 1].id + 1
        }

        const newObj = { ...obj, id: newId }
        objcts.push(newObj)

        try {
            await fs.writeFile(this.path, JSON.stringify(objcts, null, 2))
            return newId
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async update(elem, id) {
        const objcts = await this.getAll()
        const index = objcts.findIndex(o => o.id == id)
        if (index == -1) {
            throw new Error(`Error:  id inexistente ${id}`)
        } else {
            objcts[index] = elem
            try {
                await fs.writeFile(this.path, JSON.stringify(objcts, null, 2))
            } catch (error) {
                throw new Error(`Error: ${error}`)
            }
        }
    }
    
    async addProduct(id_carrito, product) {
        const objcts = await this.getAll()
        const index = objcts.findIndex(o => o.id == id_carrito)
        if (index == -1) {
            throw new Error(`Error:  id inexistente ${id}`)
        } else {
            objcts[index].productos.push(product)
            try {
                await fs.writeFile(this.path, JSON.stringify(objcts, null, 2))
            } catch (error) {
                throw new Error(`Error: ${error}`)
            }
        }
    }

    async delete(id) {
        const objcts = await this.getAll()
        const index = objcts.findIndex(o => o.id == id)
        if (index == -1) {
            throw new Error(`Error: id inexistente ${id}`)
        }

        objcts.splice(index, 1)
        try {
            await fs.writeFile(this.path, JSON.stringify(objcts, null, 2))
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }
    async deleteProductoInCarritoByProductoId(id_carrito,id_product) {
        const objcts = await this.getAll()
        const index = objcts.findIndex(o => o.id == id_carrito)
        if (index == -1) {
            throw new Error(`Error: id inexistente ${id}`)
        }
        const index_p = objcts[index].productos.findIndex(p => p.id == id_product)
        objcts[index].productos.splice(index_p, 1)
        try {
            await fs.writeFile(this.path, JSON.stringify(objcts, null, 2))
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

module.exports = SaveToFile