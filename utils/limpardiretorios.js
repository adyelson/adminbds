const { exec } = require('child_process');
function limparDiretorios() {
  const comandos = ['sudo rm arquivos/descompactados/*', 'sudo rm arquivos/json/*', 'sudo rm arquivos/recebidos/*'];
  comandos.forEach(comando => {
    exec(comando, (erro, stdout, stderr) => {
      if (erro) {
        console.error(`Erro ao executar o comando: ${erro}`);
        return;
      }
    });
  });
}
module.exports = {
  limparDiretorios
};
