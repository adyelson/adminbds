const { exec } = require('child_process');
function descompactar(nomeDoArquivo) {
  return new Promise((resolve, reject) => {
    const comandoDescompactar = `7z x ${__dirname}/arquivos/recebidos/${nomeDoArquivo} -o${__dirname}/arquivos/descompactados`;
    exec(comandoDescompactar, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar o comando: ${error}`);
        reject(error);
        return;
      }
      console.log(`Descompactação concluída: ${nomeDoArquivo}`);
      resolve();
    });
  });
}
module.exports = {
  descompactar
};