import express from 'express'
import parseArgs from 'minimist'
const { Router } = express
const routerInfo = new Router()
routerInfo.use(express.json())
routerInfo.use(express.urlencoded({ extended: true }))

routerInfo.get('/', (req, res) => {

    const data = {          
        "path" : process.execPath, 
        "plataforma" : process.platform, 
        "pid" : process.pid, 
        "version" : process.version, 
        "directorio" : process.cwd(), 
        "memoria" : process.memoryUsage().rss,
        
    }
        const args = parseArgs(process.argv.slice(2));
        if (args._.length>0) {
            data.argumentos = args._.join(' ');
            
        }
        else{ data.argumentos= 'No se pasaron argumentos'}
        return res.render('info.ejs', { data: data })
    }

)
/*-----------------------------------------------------------*/

export {routerInfo}