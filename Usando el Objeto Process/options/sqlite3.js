import dotenv from 'dotenv'
dotenv.config()
export const options_sqlite3 = {
    client: 'sqlite3',
    connection: {
      filename: process.env.PATH_SQLITE
    },
    useNullAsDefault: true
  }



