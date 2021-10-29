export default {
  mongodb: {
    // For Atlas
    // cnxStr: 'mongodb+srv://<user>:<password>@<cluster>/<DB>',
    cnxStr: "mongodb://localhost/ecommerce",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      serverSelectionTimeoutMS: 5000
    }
  },
  firebase: {
    //Clave Privada
  }
};
