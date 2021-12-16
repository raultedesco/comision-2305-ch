/*-----------------------------------------------------------*/
import express from 'express'
const { Router } = express
const routerRandom = new Router()
routerRandom.use(express.json())
routerRandom.use(express.urlencoded({ extended: true }))

import { fork } from 'child_process'

routerRandom.get('/', (req, res, next) => {
        const cant = req.query.cant
        const cantidad = cant || 100000000
        const forked = fork('./utils/computo.js')

        forked.on('message', msg => {
            if (msg == 'listo') { 
                forked.send(cantidad) 
            } else {
                return res.json(msg) 
            }
        })
})

export {routerRandom}