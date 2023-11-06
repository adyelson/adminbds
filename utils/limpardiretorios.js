const fs = require("fs");

async function limparDiretorios() {
  const pastas = [
    '/workspace/adminbds/arquivos/recebidos',
    '/workspace/adminbds/arquivos/json',
    '/workspace/adminbds/arquivos/txtsalvo',
    '/workspace/adminbds/temp'
  ];

  for (const pasta of pastas) {
    const files = await fs.promises.readdir(pasta);

    for (const file of files) {
      const caminhoArquivo = `${pasta}/${file}`;
      try {
        await fs.promises.unlink(caminhoArquivo);
        console.log(`Arquivo ${caminhoArquivo} excluído com sucesso.`);
      } catch (err) {
        console.error(`Erro ao excluir o arquivo ${caminhoArquivo}:`, err);
      }
    }
  }
}

module.exports = {
  limparDiretorios
};

