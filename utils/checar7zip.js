const { exec } = require('child_process');
function checar7zip(programa) {
  return new Promise((resolve, reject) => {
    const comandoVerificar = `sudo dpkg -l | grep ${programa}`;
    exec(comandoVerificar, (erro, stdout, stderr) => {
      console.log(`${programa} não está instalado. Tentando instalar...`);
      const comandoInstalar = `sudo apt-get install ${programa} -y`;
      exec(comandoInstalar, (erroInstalar, stdoutInstalar, stderrInstalar) => {
        if (erroInstalar) {
          console.error(`Erro ao instalar o ${programa}: ${erroInstalar}`);
          reject(erroInstalar);
          return;
        }
        console.log(`${programa} foi instalado com sucesso.`);
        resolve();
      });
    });
  });
}
module.exports = {
  checar7zip
};