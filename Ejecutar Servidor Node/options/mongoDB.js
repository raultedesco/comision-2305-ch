import dotenv from 'dotenv'
dotenv.config()

export const options_mongoAtlas =  {
    client: "mongodb",
    cnxStr: process.env.MONGO_ATLAS_CNXSTR
  }

export const options_mongoLocal = {
    client: "mongodb",
    cnxStr: process.env.MONGO_LOCAL_CNXSTR
}

