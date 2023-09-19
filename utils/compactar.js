const { exec } = require('child_process');
function compactar(nomeDoArquivo, res) {
  return new Promise((resolve, reject) => {
    const nomeSemExtensao = nomeDoArquivo.replace('.json', '');
    let caminhoDestino = `../arquivos/arquivosEXP/${nomeSemExtensao}.EXP`;
    let caminhoOrigem = `../arquivos/txtsalvo/${nomeSemExtensao}`
    const comandoCompactar = `7z a ${caminhoDestino} ${caminhoOrigem}`;
    exec(comandoCompactar, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao compactar:', stderr);
        reject(error);
        return;
      }
      console.log('Arquivo compactado com sucesso:', caminhoDestino);
      resolve(caminhoDestino);
      res.setHeader('Content-disposition', `attachment; filename=${path.basename(caminhoDestino)}`);
      res.setHeader('Content-type', 'application/x-7z-compressed');
      const fileStream = fs.createReadStream(caminhoDestino);
      fileStream.pipe(res);
      res.json({ caminho: caminhoDestino });
    });
  });
}
module.exports = {
  compactar
};