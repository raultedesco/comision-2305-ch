# Segunda Entrega Proyecto Final
## Punto de ejecucion

El punto de ejecucion seteado en package .json es server.js para el comando npm start

## Options ##
*En el Path ./src/options/options_persistencia.js*

se estableces los parametros para las conexiones contra la DB Mongo y Fire Store

*Ejecucion con Diferentes Options*

Ejemplo de ejecucion con persitencia sobre DB Mongo local

$env:PERS='mongodb'; npm start

parms disponibles:

json, firebase y mongodb
por default persiste en Memoria



## Rutas

sobre ./src/router se definen las rutas para el carrito y para los productos

## Manejo de Errores
sobre ./src/error se encuentra el manejo de errores personalizado

