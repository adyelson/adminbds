const { lerArquivoEnviado } = require('./lerarquivoenviado');
const { descompactar } = require('./descompactar');
const { lerJson } = require('./lerjson');
async function sequenciaEnviando  (request)  {
  return new Promise(async (resolve, reject) => {
    try {
      await descompactar(request.file.originalname);
      await lerArquivoEnviado(request.file.originalname);
      dados = await lerJson(request.file.originalname);      
      console.log('Ambas as funções foram concluídas.' + JSON.stringify(dados));      
      resolve(dados);
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      reject(error)
    }
  });
};
module.exports = {
  sequenciaEnviando
};






