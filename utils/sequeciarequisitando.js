const { converterJsonPtexto } = require('./converterjsonptexto');
const { compactar } = require('./compactar');
const { limparDiretorios } = require('./limpardiretorios');

async function sequenciaRequisitando  (request, response)  {
  return new Promise(async (resolve, reject) => {
    try {
      await converterJsonPtexto(request.file.originalname);
      await compactar(request.file.originalname, response);
      setTimeout(limparDiretorios, 10000);
     
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      reject(error)
    }
   
  });
};
module.exports = {
  sequenciaRequisitando
};