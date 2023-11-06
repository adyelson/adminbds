//const { exec } = require('child_process');
const path = require('path');
var fs = require("fs");
function compactar(nomeDoArquivo, res) {
  return new Promise((resolve, reject) => {
    const nomeSemExtensao = nomeDoArquivo.replace('.json', '');
    let caminhoOrigem = `/workspace/adminbds/arquivos/txtsalvo/${nomeSemExtensao}`   
    resolve(caminhoOrigem);
    res.setHeader('Content-disposition', `attachment; filename=${path.basename(caminhoOrigem)}`);
    res.setHeader('Content-type', 'text/plain');
    const fileStream = fs.createReadStream(caminhoOrigem);
    fileStream.pipe(res);
    res.json({ caminho: caminhoOrigem, nomeArquivo: `${nomeSemExtensao}` });   
  });
}
module.exports = {
  compactar
};