var fs = require("fs");
const { salvarEmJson } = require('./salvaremjson');
function lerArquivoEnviado(nomeDoArquivo) {
    return new Promise((resolve, reject) => {
        const nomeSemExtensao = nomeDoArquivo//.replace('.EXP', '');
        const arquivo = `./arquivos/recebidos/${nomeSemExtensao}`;
        fs.readFile(arquivo, 'utf8', (err, content) => {
            if (err) {
                console.error(`Erro ao ler o arquivo: ${err}`);
                reject(err);
                return;
            }
            const linhas = content.split('\n');
            const dados = [];
            let chaves = [];
            if (nomeSemExtensao === nomeSemExtensao.toUpperCase()) {
                for (let linhaAtual = 8; linhaAtual < linhas.length; linhaAtual++) {
                    const linha = linhas[linhaAtual].trim();
                    if (linha !== '') {
                        if (chaves.length == 0) { // Na primeira linha de dados, gera as chaves
                            chaves = linha.split('\t').map(campo => campo.replace('# ', '').toLowerCase());
                            const linhaCount = linhas[linhaAtual+1].trim();
                            const camposCount = linhaCount.split('\t');
                            if(camposCount.length > chaves.length){
                                let diferencaCount = camposCount.length - chaves.length;
                                for( let contador= 1; contador<=diferencaCount; contador++){
                                    chaves.push(`campo${contador}`);                                    
                                }
                            }

                        } else {
                            const campos = linha.split('\t');
                            const registro = {};
                            campos.forEach((valor, index) => {
                                const chave = chaves[index];
                                if (chave) {
                                    registro[chave] = valor;
                                }
                            });
                            dados.push(registro);
                        }
                    }
                }
            } else {
                for (let linhaAtual = 12; linhaAtual < linhas.length; linhaAtual++) {
                    const linha = linhas[linhaAtual].trim();
                    if (linha !== '') {
                        if (chaves.length == 0) { // Na primeira linha de dados, gera as chaves
                            
                            let tamanho = linha.split(';');
                            tamanho.pop();
                            tamanho.forEach((value, index) => {
                                chaves.push(`campo${index}`);
                                console.log(chaves)
                            });
                        } 
                            const campos = linha.split(';');
                            campos.pop();
                            const registro = {};
                            campos.forEach((valor, index) => {
                                const chave = chaves[index];
                                if (chave) {
                                    registro[chave] = valor;
                                }
                            });
                            dados.push(registro);
                        
                    }
                }
            }
            resolve(salvarEmJson(dados, nomeSemExtensao));
        });
    });
}
module.exports = {
    lerArquivoEnviado
  };

