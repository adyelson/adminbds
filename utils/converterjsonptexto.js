var fs = require("fs");
function converterJsonPtexto(nomeDoArquivo) {
  return new Promise((resolve, reject) => {
    const caminhoArquivoJSON = `/workspace/adminbds/arquivos/txtsalvo/${nomeDoArquivo}`; // Adicione a extensão .json ao caminho 
    //const caminhoArquivoJSON = `/workspace/adminbds/arquivos/preparacaojson/${nomeDoArquivo}`; // Adicione a extensão .json ao caminho
    const nomeSemExtensao = nomeDoArquivo.replace('.json', '');
    const caminhoArquivoTexto = `/workspace/adminbds/arquivos/txtsalvo/${nomeSemExtensao}`; // Caminho para o arquivo de texto
    let arquivoTexto = '';
    fs.readFile(caminhoArquivoJSON, 'utf8', (err, content) => {
      if (err) {
        console.error('Erro ao ler o arquivo JSON:', err);
        reject(err);
        return;
      }
      if (nomeSemExtensao === nomeSemExtensao.toUpperCase()) {
        try {
          const dadosJSON = JSON.parse(content);
          for (let i = 1; i <= 8; i++) {
            arquivoTexto += '# \n';
          }
          const chaves = Object.keys(dadosJSON[0]).join('\t').toUpperCase();
          arquivoTexto += `# ${chaves}\n`;
          for (const jsonData of dadosJSON) {
            for (const chave in jsonData) {
              arquivoTexto += jsonData[chave] + '\t'; // Use o delimitador apropriado, como '\t' (tabulação)
            }
            arquivoTexto += '\n'; // Adicione uma quebra de linha após cada conjunto de dados
          }
          // Escreva o arquivo de texto no servidor
          fs.writeFile(caminhoArquivoTexto, arquivoTexto, 'utf8', (err) => {
            if (err) {
              console.error('Erro ao escrever o arquivo de texto:', err);
              reject(err);
            } else {
              console.log('Arquivo de texto salvo com sucesso:', caminhoArquivoTexto);
              resolve(caminhoArquivoTexto); // Resolve com o caminho do arquivo de texto salvo
            }
          });
        } catch (error) {
          console.error('Erro ao fazer parsing do JSON:', error);
          reject(error);
        }
      } else {
        try {
          const dadosJSON = JSON.parse(content);
          arquivoTexto += `****************************************************************\n`;
          for (let i = 2; i <= 10; i++) {
            arquivoTexto += '\n';
          }
          arquivoTexto += `****************************************************************\n`;
          arquivoTexto += `----\n`;
          for (const jsonData of dadosJSON) {
            for (const chave in jsonData) {
              arquivoTexto += jsonData[chave] + ';'; // Use o delimitador apropriado, como '\t' (tabulação)
            }
            arquivoTexto += '\n'; // Adicione uma quebra de linha após cada conjunto de dados
          }
          // Escreva o arquivo de texto no servidor
          fs.writeFile(caminhoArquivoTexto, arquivoTexto, 'utf8', (err) => {
            if (err) {
              console.error('Erro ao escrever o arquivo de texto:', err);
              reject(err);
            } else {
              console.log('Arquivo de texto salvo com sucesso:', caminhoArquivoTexto);
              resolve(caminhoArquivoTexto); // Resolve com o caminho do arquivo de texto salvo
            }
          });
        } catch (error) {
          console.error('Erro ao fazer parsing do JSON:', error);
          reject(error);
        }
      }
    });
  });
}
module.exports = {
  converterJsonPtexto
};