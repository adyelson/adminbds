var fs = require("fs");
function lerArquivoEnviado(nomeDoArquivo) {
    return new Promise((resolve, reject) => {
        const nomeSemExtensao = nomeDoArquivo.replace('.EXP', '');
        const arquivo = `/workspace/adminbds/arquivos/descompactados/${nomeSemExtensao}`;
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
                for (let linhaAtual = 13; linhaAtual < linhas.length; linhaAtual++) {
                    const linha = linhas[linhaAtual].trim();
                    if (linha !== '') {
                        if (chaves.length == 0) { // Na primeira linha de dados, gera as chaves
                            let tamanho = linha.split(';');
                            tamanho.forEach((value, index) => {
                                chaves.push(index);
                                console.log(chaves)
                            });
                        } else {
                            const campos = linha.split(';');
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
            }
            const jsonDados = JSON.stringify(dados, null, 2); // Convertendo para formato JSON
            const jsonFilePath = `/workspace/adminbds/arquivos/json/${nomeSemExtensao}.json`;
            fs.writeFile(jsonFilePath, jsonDados, 'utf8', err => {
                if (err) {
                    console.error('Erro ao salvar arquivo JSON:', err);
                    reject(err);
                    return;
                }
                console.log('Arquivo JSON salvo:', jsonFilePath);
                resolve(jsonFilePath);
            });
        });
    });
}
module.exports = {
    lerArquivoEnviado
  };

