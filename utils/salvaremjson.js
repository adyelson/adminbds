var fs = require("fs");
function salvarEmJson(dados, nomeSemExtensao) {
    const jsonDados = JSON.stringify(dados, null, 2); // Convertendo para formato JSON
    const jsonFilePath = `/workspace/adminbds/arquivos/json/${nomeSemExtensao}.json`;
    fs.writeFile(jsonFilePath, jsonDados, 'utf8', err => {
        if (err) {
            console.error('Erro ao salvar arquivo JSON:', err);
            reject(err);
            return;
        }
        console.log('Arquivo JSON salvo:', jsonFilePath);
        return(jsonFilePath);
    });
}
module.exports = {
    salvarEmJson
}