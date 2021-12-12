import knexLib from "knex";
import { options_mariadb } from "./options/mariaDB.js";
import { options_sqlite3 } from "./options/sqlite3.js";

const table_mensajes = "mensajes";
const table_productos = "productos";
const sql_sqlite3 = knexLib(options_sqlite3);
const sql_mariaDb = knexLib(options_mariadb);

const crearTabla_sqlite3 = (sql_sqlite3, table) => {
  return sql_sqlite3.schema.dropTableIfExists(table).finally(() => {
    return sql_sqlite3.schema.createTable(table, (table) => {
      table.increments("id").primary();
      table.string("autor", 100).notNullable();
      table.string("texto", 200).notNullable();
      table.timestamp("fyh").defaultTo(sql_sqlite3.fn.now());
    });
  });
};

const crearTabla_mariaDb = (sql_mariaDb, table) => {
  return sql_mariaDb.schema.dropTableIfExists(table).finally(() => {
    return sql_mariaDb.schema.createTable(table, (table) => {
      table.increments("id").primary();
      table.string("title", 100).notNullable();
      table.string("price", 200).notNullable();
      table.string("thumbnail", 200).notNullable();
      table.timestamp("timestamp").defaultTo(sql_mariaDb.fn.now());
    });
  });
};

/* ----------------------------*/
/* Creacion de Table Mensajes  */
/* ----------------------------*/
crearTabla_sqlite3(sql_sqlite3, table_mensajes)
  .then(() => {
    console.log(`1-Tabla ${table_mensajes} creada`);
  })
  .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    sql_sqlite3.destroy();
  });

/* ----------------------------*/
/* Creacion de Table Productos */
/* ----------------------------*/
crearTabla_mariaDb(sql_mariaDb, table_productos)
  .then(() => {
    console.log(`2-Tabla ${table_productos} creada`);
  })
  .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    sql_mariaDb.destroy();
  });
