import express from 'express'
import compression from 'compression'
import parseArgs from 'minimist'

import logger from '../utils/logger.js'

const { Router } = express
const routerInfo = new Router()
routerInfo.use(express.json())
routerInfo.use(express.urlencoded({ extended: true }))
routerInfo.use(compression())

routerInfo.get('/', (req, res) => {
    const { url, method } = req
    logger.info(`${method} ${url}`)
    const data = {          
        "path" : process.execPath, 
        "plataforma" : process.platform, 
        "pid" : process.pid, 
        "version" : process.version, 
        "directorio" : process.cwd(), 
        "memoria" : process.memoryUsage().rss,
        
    }
        // console.log(data)
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