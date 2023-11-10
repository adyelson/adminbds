function criarBancoDeDados(db) {

    //Crie uma tabela de usuários (exemplo)
    db.serialize(() => {
        db.run('CREATE TABLE users (id INT, name TEXT, username TEXT, password TEXT)');
        // Inserir dados, consultar dados, etc.
    });

    // Certifique-se de fechar o banco de dados quando não estiver em uso

    const name = 'DEV+ GBDS';
    const username = 'univesp';
    const password = 'univesp';

    db.run('INSERT INTO users (name, username, password) VALUES (?,?, ?)', [name, username, password], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Registro inserido com ID: ${this.lastID}`);
    });

    db.close();

}

module.exports = {
    criarBancoDeDados
  };