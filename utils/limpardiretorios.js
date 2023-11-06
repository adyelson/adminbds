const fs = require("fs");

async function limparDiretorios() {
  const pastas = [
    './arquivos/recebidos',
    './arquivos/json',
    './arquivos/txtsalvo',
    './temp'
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

