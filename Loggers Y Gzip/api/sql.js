import knexLib from 'knex'

class ClienteSql {
  constructor(config,table) {
    this.knex = knexLib(config)
    this.table = table  
  }
  insertar(elemento) {
    return this.knex(this.table).insert(elemento)
  }

  getAll() {
    return this.knex(this.table).select('*')
  }

  borrarById(id) {
    return this.knex.from(this.table).where('id', id).del()
  }

  updateById(id) {
    return this.knex.from(this.table).where('id', id).update({ stock: stock })
  }

  close() {
    this.knex.destroy();
  }
}

export default ClienteSql