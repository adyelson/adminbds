const express = require('express');

const app = express();
const http = require('http').createServer(app);// rever
const pug = require("pug");
var multer = require("multer");
var fs = require("fs");
const { PassThrough } = require('stream');
const porta = 3000;
const { checar7zip } = require('./utils/checar7zip');
const {limparDiretorios} = require('./utils/limpardiretorios');
const {sequenciaEnviando} = require('./utils/sequenciaenviando');
const {sequenciaRequisitando} = require('./utils/sequeciarequisitando');
checar7zip('p7zip-full')
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
                    //limparDiretorios();
                });
            })
        });

        app.post("/upload-json-and-convert", async (request, response) => {
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
                    //limparDiretorios();
                });
            })
        });
    });