const { exec } = require('child_process');
function limparDiretorios() {
  const comandos = [
  'sudo rm /workspace/adminbds/arquivos/descompactados/*', 
  'sudo rm /workspace/adminbds/arquivos/json/*', 
  'sudo rm /workspace/adminbds/arquivos/recebidos/*',
  'sudo rm /workspace/adminbds/arquivos/preparacaojson/*',
  'sudo rm /workspace/adminbds/arquivos/txtsalvo/*',
  'sudo rm /workspace/adminbds/arquivos/arquivosEXP/*',
];
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
