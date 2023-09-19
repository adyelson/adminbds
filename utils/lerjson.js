function lerJson(nomeDoArquivo) {
  return new Promise((resolve, reject) => {
    const nomeSemExtensao = nomeDoArquivo.replace('.EXP', '');
    const caminhoArquivoJSON = `${__dirname}/arquivos/json/${nomeSemExtensao}.json`;
    fs.readFile(caminhoArquivoJSON, 'utf8', (err, content) => {
      if (err) {
        console.error('Erro ao ler o arquivo JSON:', err);
        return;
      }
      try {
        const dadosJSON = JSON.parse(content);
        console.log('Dados lidos do arquivo JSON:', dadosJSON);
        resolve(dadosJSON);
      } catch (error) {
        console.error('Erro ao fazer parsing do JSON:', error);
      }
    });
  });
}
module.exports = {
  lerJson
};