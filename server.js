

const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http').createServer(app);// rever

const bodyParser = require('body-parser'); // Adicione o body-parser para processar dados do formulário

var multer = require("multer");
var fs = require("fs");
const porta = 3000;
const { checar7zip } = require('./utils/checar7zip');
const { limparDiretorios } = require('./utils/limpardiretorios');
const { sequenciaEnviando } = require('./utils/sequenciaenviando');
const { criarBancoDeDados } = require('./utils/criadb.js');
const { sequenciaRequisitando } = require('./utils/sequeciarequisitando');

const sqlite3 = require('sqlite3').verbose();
const dbFile = 'mydb.sqlite';
const db = new sqlite3.Database(dbFile);
// Verifique se o arquivo SQLite existe
if (fs.existsSync(dbFile)) {
 
} else {
  criarBancoDeDados(db);
}


checar7zip('p7zip-full')
  .then(() => {
    console.log('Continuando com o restante do servidor...');

    function autenticacaoMiddleware(req, res, next) {
      if (req.session && req.session.autenticado) {
        // O usuário está autenticado, permita o acesso à rota
        next();
      } else {
        // O usuário não está autenticado, redirecione para a página de login ou exiba uma mensagem de erro
        res.render('login'); // Redireciona para a página de login
        // Ou você pode renderizar uma página de erro, se preferir
        // res.render('erro', { mensagem: 'Você não está autenticado.' });
      }
    }

    // SERVIDOR

    app.set("view engine", "pug");
    app.set("/views", __dirname); // Defina o diretório de visualizações
    app.use(express.static('public'));
    app.use(express.static('arquivos/arquivosEXP'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(multer({ dest: "temp" }).single("file"));
    app.use(session({
      secret: '3ad4g2g4v46zxnVDAbDgBD24@', // Configure uma chave secreta para as sessões
      resave: false,
      saveUninitialized: false,
    }));


    http.listen(porta, () => {
      console.log("servidor iniciado.")
    })



    app.get('/', (req, res) => {
      res.render('login');
    });
    app.get('/dashboard', autenticacaoMiddleware, (req, res) => {
      res.render('dashboard');
    });


    app.post('/login', (req, res) => {
      const username = req.body.username;
      const password = req.body.password;

      autenticarUsuario(username, password, (err, result) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          res.render('login', { mensagemErro: 'Erro na autenticação.' });
        } else if (result.autenticado) {
          // Autenticação bem-sucedida, defina a variável de sessão
          req.session.autenticado = true;
          // Redirecione para a página de dashboard
          res.render('dashboard', {name: result.name});
        } else {
          // Autenticação falhou, renderize uma mensagem de erro
          res.render('login', { mensagemErro: 'Credenciais inválidas.' });
        }
      });
    });

    app.post('/logout', (req, res) => {
      // Limpe a sessão e redirecione o usuário para a página de login
      req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao encerrar a sessão:', err);
        }
        res.render('login');
      });
    });

    function autenticarUsuario(username, password, callback) {
      db.get('SELECT name, username, password FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
          return callback(err);
        }
        if (!row) {
          // Usuário não encontrado
          return callback(null, false);
        }
        if (row.password === password) {
          // Credenciais corretas
          return callback(null, { autenticado: true, name: row.name });
        } else {
          // Senha incorreta
          
          return callback(null, { autenticado: false, name: row.name });
        }
      });
    }
    
  
    app.post("/uploadEXP", async (request, response) => {
      var file = "arquivos/recebidos/" + request.file.originalname;
      let dados;
      fs.readFile(request.file.path, (err, data) => {
        if (err) {
          console.log("Erro readFile: " + err);
        }
        fs.writeFile(file, data, async (err) => {
          if (err) { console.log("Erro writeFile: " + err) } else {
            responseJSON = {
              mensagem: "Upload concluído",
              arquivo: request.file.originalname
            }
            dados = await sequenciaEnviando(request);
          }
          console.log("upload realizado");

          let data = dados;
          const keys = Object.keys(data[0]);
          let originalname = request.file.originalname;
          response.render("dados", { keys, data, originalname });
          limparDiretorios();
        });
      })
    });

    app.post("/downloadexp", async (request, response) => {
      var file = "arquivos/preparacaojson/" + request.file.originalname;
      let dados;
      fs.readFile(request.file.path, (err, data) => {
        if (err) { console.log("Erro readFile: " + err); }
        fs.writeFile(file, data, async (err) => {
          if (err) {
            console.log("Erro writeFile: " + err);
          } else {
            responseJSON = {
              mensagem: "Upload concluído",
              arquivo: request.file.originalname
            }
            dados = await sequenciaRequisitando(request, response);
          }
          limparDiretorios();
        });
      })
    });
  });


