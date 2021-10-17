###Desafio Semanal: MongoDB###

File: Desafio_resuelto.txt 
Contiene lo solicitado en el desafio.

Luego de descomprimir dump.zip

Dir: ./dump/ecommerce
Contiene el dump de la base usando los comandos mongodump y mongorestore

#sobre el directorio de Donde se quiere dejar el dump
mongodump --host localhost --port 27017 --db ecommerce

#sobre el dir que contenga la carpeta dump generada con mongodump
mongorestore --host localhost --port 27017  dump

