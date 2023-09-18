const express = require('express');

const app = express();
const http = require('http').createServer(app);// rever
const serverSocket = require('socket.io')(http);
const { exec } = require('child_process');
const pug = require("pug");

var multer = require("multer");
var fs = require("fs");
const { PassThrough } = require('stream');

const porta = 3000;

verificarEInstalarPrograma('p7zip-full')
  .then(() => {
      console.log('Continuando com o restante do servidor...');
      // SERVIDOR
      app.use(express.static('public'));
     

      app.set("view engine", "pug");
      app.set("/views", __dirname); // Defina o diretório de visualizações

      http.listen(porta, () => {
          console.log("servidor iniciado.")
      })

      
      
      app.get('/', (req, resp) => {
          resp.sendFile(__dirname + '/');
      })

      app.use(multer({ dest: "temp" }).single("file"));
      app.use(express.json());
      app.use(express.json({ limit: "10mb" }));

      app.post("/uploadEXP", async (request, response) => {
          var file = "arquivos/recebidos/" + request.file.originalname;
          let dados;
          fs.readFile(request.file.path, (err, data) => {
            if (err) {
              console.log("Erro readFile: " + err);
          }
              fs.writeFile(file, data, async (err) => {
                  if (err) {
                      console.log("Erro writeFile: " + err);
                  } else {
                      responseJSON = {
                          
                          mensagem: "Upload concluído",
                          arquivo: request.file.originalname
                      }                
                        dados = await executarFuncoesEmSequencia(request);
                  }
                  console.log("upload realizado");
                  
                  let data = dados;
                  const keys = Object.keys(data[0]);
                  
                  response.render("dados", {keys, data });
                  limparDiretorios();

              });
          })
      });
      
      
      

      app.post("/upload-json-and-convert", async (request, response) => {
          var file = "arquivos/preparacaojson/" + request.file.originalname;
          let dados;
          fs.readFile(request.file.path, (err, data) => {
            if (err) {
              console.log("Erro readFile: " + err);
          }
              fs.writeFile(file, data, async (err) => {
                  if (err) {
                      console.log("Erro writeFile: " + err);
                  } else {
                      responseJSON = {
                          
                          mensagem: "Upload concluído",
                          arquivo: request.file.originalname
                      }                
                        dados = await executarFuncoesEmSequenciaReceber(request);
                  }
               
                  //limparDiretorios();

              });
          })
      });

    });
      

function verificarEInstalarPrograma(programa) {
  return new Promise((resolve, reject) => {
    // Comando para verificar se o programa está instalado
    const comandoVerificar = `sudo dpkg -l | grep ${programa}`;

    exec(comandoVerificar, (erro, stdout, stderr) => {
        
        // O programa não está instalado, então tentamos instalá-lo
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

function limparDiretorios(){
  const comandos = ['sudo rm arquivos/descompactados/*','sudo rm arquivos/json/*','sudo rm arquivos/recebidos/*'];
  comandos.forEach(comando => {
    exec(comando, (erro, stdout, stderr) => {
      if (erro) {
        console.error(`Erro ao executar o comando: ${erro}`);
        return;
      }
      
    });
  });
 
}
async function executarFuncoesEmSequenciaReceber  (request)  {
  return new Promise(async (resolve, reject) => {
    try {
      await converterParaTexto(request.file.originalname);
      // await lerArquivoEnviado(request.file.originalname);
      // dados = await lerJson(request.file.originalname);      
      // console.log('Ambas as funções foram concluídas.' + JSON.stringify(dados));      
      // resolve(dados);
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      reject(error)
    }
  });
  };

  function converterParaTexto(nomeDoArquivo) {
    return new Promise((resolve, reject) => {
      
      const caminhoArquivoJSON = `${__dirname}/arquivos/preparacaojson/${nomeDoArquivo}`; // Adicione a extensão .json ao caminho
      const nomeSemExtensao = nomeDoArquivo.replace('.json', '');
      const caminhoArquivoTexto = `${__dirname}/arquivos/txtsalvo/${nomeSemExtensao}`; // Caminho para o arquivo de texto
      let arquivoTexto = '';
  
      fs.readFile(caminhoArquivoJSON, 'utf8', (err, content) => {
        if (err) {
          console.error('Erro ao ler o arquivo JSON:', err);
          reject(err);
          return;
        }
  
        try {
          const dadosJSON = JSON.parse(content);
  
          // Lógica para formatar os dados no arquivo de texto
          for (const jsonData of dadosJSON) {
            for (const chave in jsonData) {
              arquivoTexto += jsonData[chave] + '\t'; // Use o delimitador apropriado, como '\t' (tabulação)
            }
            arquivoTexto += '\n'; // Adicione uma quebra de linha após cada conjunto de dados
          }
  
          // Escreva o arquivo de texto no servidor
          fs.writeFile(caminhoArquivoTexto, arquivoTexto, 'utf8', (err) => {
            if (err) {
              console.error('Erro ao escrever o arquivo de texto:', err);
              reject(err);
            } else {
              console.log('Arquivo de texto salvo com sucesso:', caminhoArquivoTexto);
              resolve(caminhoArquivoTexto); // Resolve com o caminho do arquivo de texto salvo
            }
          });
        } catch (error) {
          console.error('Erro ao fazer parsing do JSON:', error);
          reject(error);
        }
      });
    });
  }
  

async function executarFuncoesEmSequencia  (request)  {
  return new Promise(async (resolve, reject) => {
    try {
      await descompactarEXP(request.file.originalname);
      await lerArquivoEnviado(request.file.originalname);
      dados = await lerJson(request.file.originalname);      
      console.log('Ambas as funções foram concluídas.' + JSON.stringify(dados));      
      resolve(dados);
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      reject(error)
    }
  });
  };

  function lerJson(nomeDoArquivo) {
    return new Promise((resolve, reject) => {
      const nomeSemExtensao = nomeDoArquivo.replace('.EXP', '');
      const caminhoArquivoJSON = `${__dirname}/arquivos/json/${nomeSemExtensao}.json`;

      fs.readFile(caminhoArquivoJSON, 'utf8', (err, content) => {
        if (err) {
          console.error('Erro ao ler o arquivo JSON:', err);
          return;
        }
    
        try {
          const dadosJSON = JSON.parse(content);

          console.log('Dados lidos do arquivo JSON:', dadosJSON);
          resolve(dadosJSON);
          // Agora você pode usar os dadosJSON como um dicionário de dados
          // Por exemplo, para acessar um valor específico: dadosJSON.chave
        } catch (error) {
          console.error('Erro ao fazer parsing do JSON:', error);
        }
      });
    });
  }

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




