import mongoose from 'mongoose'
import options from '../options/options_persistencia.js'


await mongoose.connect(options.mongodb.cnxStr, options.mongodb.options)

const parse_obj = obj => JSON.parse(JSON.stringify(obj))

class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async listar(id) {
        try {
            const docs = await this.coleccion.find({ '_id': id }, { __v: 0 })
            if (docs.length == 0) {
                throw new Error('Error al listar por id: no encontrado')
            } else {    
                const result  = parse_obj(docs[0])            
                return result
            }
        } catch (error) {
            throw new Error(`Error al listar por id: ${error}`)
        }
    }

    async listarAll() {
        try {
            let docs = await this.coleccion.find({}, { __v: 0 }).lean()
            docs = docs.map(parse_obj)
            return docs
        } catch (error) {
            throw new Error(`Error al listar todo: ${error}`)
        }
    }

    async guardar(nuevoElem) {
        try {
            let doc = await this.coleccion.create(nuevoElem);
            doc = parse_obj(doc)
            return doc
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async actualizar(nuevoElem) {
        console.log(nuevoElem)
        console.log(nuevoElem._id)
        try {
            return await this.coleccion.replaceOne({ '_id': nuevoElem._id }, nuevoElem)

        } catch (error) {
            throw new Error(`Error al actualizar: ${error}`)
        }
    }

    async borrar(id) {
        try {
            return await this.coleccion.deleteOne({ '_id': id })
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async borrarAll() {
        try {
            await this.coleccion.deleteMany({})
        } catch (error) {
            throw new Error(`Error al borrarAll: ${error}`)
        }
    }
}

export default ContenedorMongoDb