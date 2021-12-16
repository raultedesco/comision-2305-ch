import dotenv from 'dotenv'
dotenv.config()
export const options_mariadb = {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: process.env.USER_MYSQL,
      password: process.env.PASSWORD_MYSQL,
      database: process.env.DB_MYSQL
    }
  }