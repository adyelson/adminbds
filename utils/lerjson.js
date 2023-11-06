var fs = require("fs");

function lerJson(nomeDoArquivo) {
  return new Promise((resolve, reject) => {
    const nomeSemExtensao = nomeDoArquivo; // Mantive a extensão original
    const caminhoArquivoJSON = `./arquivos/json/${nomeSemExtensao}.json`;

    fs.readFile(caminhoArquivoJSON, 'utf8', (err, content) => {
      if (err) {
        console.error('Erro ao ler o arquivo JSON:', err);
        reject(err); // Rejeita a Promise em caso de erro na leitura do arquivo
        return;
      }

      try {
        const dadosJSON = JSON.parse(content);

        if (dadosJSON) {
          console.log('Dados lidos do arquivo JSON:', dadosJSON);
          resolve(dadosJSON);
        } else {
          console.error('Arquivo JSON vazio ou não contém dados válidos.');
          reject(new Error('Arquivo JSON vazio ou não contém dados válidos.'));
        }
      } catch (error) {
        console.error('Erro ao fazer parsing do JSON:', error);
        reject(error); // Rejeita a Promise em caso de erro no parsing do JSON
      }
    });
  });
}

module.exports = {
  lerJson
};
