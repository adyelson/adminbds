const { converterJsonPtexto } = require('./converterjsonptexto');
const { compactar } = require('./compactar');
async function sequenciaRequisitando  (request, response)  {
  return new Promise(async (resolve, reject) => {
    try {
      await converterJsonPtexto(request.file.originalname);
      //await compactar(request.file.originalname, response);
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      reject(error)
    }
  });
};
module.exports = {
  sequenciaRequisitando
};