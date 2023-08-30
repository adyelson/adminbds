const express = require('express');
const app = express();
const http = require('http').createServer(app);// rever
const serverSocket = require('socket.io')(http);
const { exec } = require('child_process');

var multer = require("multer");
var fs = require("fs");

const porta = 3000;
app.use(express.static('public'));

http.listen(porta, () => {
    console.log("servidor iniciado.")
})

app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/');
})

app.use(multer({ dest: "temp" }).single("foto"));

app.post("/uploadEXP", (request, response) => {
    var file = "arquivos/recebidos/" + request.file.originalname;
    fs.readFile(request.file.path, (err, data) => {
        fs.writeFile(file, data, (err) => {
            if (err) {
                console.log("Erro: " + err);
            } else {
                responseJSON = {
                    nome: request.body.nome,
                    idade: request.body.idade,
                    mensagem: "Upload concluído",
                    arquivo: request.file.originalname
                }
                executarFuncoesEmSequencia(request);
            }
            response.end(JSON.stringify(responseJSON));
        });
    })
});

async function executarFuncoesEmSequencia  (request)  {
    try {
      await descompactarEXP(request.file.originalname);
      await lerArquivoEnviado(request.file.originalname);
      console.log('Ambas as funções foram concluídas.');
    } catch (error) {
      console.error('Ocorreu um erro:', error);
    }
  };

  function descompactarEXP(nomeDoArquivo) {
    return new Promise((resolve, reject) => {
      const comandoDescompactar = `7z x ${__dirname}/arquivos/recebidos/${nomeDoArquivo} -o${__dirname}/arquivos/descompactados`;
      exec(comandoDescompactar, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro ao executar o comando: ${error}`);
          reject(error);
          return;
        }
        console.log(`Descompactação concluída: ${nomeDoArquivo}`);
        resolve();
      });
    });
  }
  
  function lerArquivoEnviado(nomeDoArquivo) {
    return new Promise((resolve, reject) => {
      const nomeSemExtensao = nomeDoArquivo.replace('.EXP', '');
      const arquivo = `${__dirname}/arquivos/descompactados/${nomeSemExtensao}`; 
  
      fs.readFile(arquivo, 'utf8', (err, content) => {
        if (err) {
          console.error(`Erro ao ler o arquivo: ${err}`);
          reject(err);
          return;
        }
      
        const linhas = content.split('\n');
        let linhaAtual = 0;
      
        const dados = [];
        let chaves = [];
      
        if(nomeSemExtensao === nomeSemExtensao.toUpperCase()){       
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
        }else{
            for (let linhaAtual = 13; linhaAtual < linhas.length; linhaAtual++) {
                const linha = linhas[linhaAtual].trim();
        
                if (linha !== '') {
                if (chaves.length == 0) { // Na primeira linha de dados, gera as chaves
                    let tamanho = linha.split(';');
                    tamanho.forEach((value,index) => {
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
        const jsonFilePath = `${__dirname}/arquivos/json/${nomeSemExtensao}.json`;

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




