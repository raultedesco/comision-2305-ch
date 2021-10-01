class Productos {

    constructor() {
      this.id = 0;
      this.products = []
      
    }

    save(product){
        const product_saved = {...product,id:++this.id,timestamp:Date.now()}
        this.products.push(product_saved) 
        return product_saved      
        
    }

    getById(id){
        const product_by_id = this.products.find((x) => x.id === parseInt(id) );
        return product_by_id ? product_by_id : { error : 'producto no encontrado' };
    }

    getAll(){
        return this.products
    }

    modifyById(id,product){
        const idx_founded = this.products.findIndex(x=>x.id === parseInt(id)  )
        if (idx_founded != -1) {
            const product_updated = {...product,id:parseInt(id)}
            this.products[idx_founded] = product_updated
            return product_updated 
        }
        else{
            return  { error : 'producto no encontrado' }
        }

    }

    deleteById(id){
        const idx_founded = this.products.findIndex(x=>x.id === parseInt(id)  )
        if (idx_founded != -1) {
            this.products.splice(idx_founded, 1)
            return { message : `product id:${id} was deleted!` }
        }
        else{
            return  { error : 'producto no encontrado' }
        }
    }

    deleteAll(){
        return this.products = [];
    }

}

module.exports = Productos;

