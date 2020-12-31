# FIREBASE

Este é um exemplo de integração do Firebase utilizando NodeJS. Neste exemplo a persistência de dados é feita através do firestore.

![Firebase](logo.png)

## INSTALAÇÃO

>git clone https://github.com/dbins/firebase.git

>npm install

>npm start

Para acessar abra no seu navegador o endereço **http://localhost:3000**

## CONFIGURAÇÃO

Edite os arquivos /server.js e cert/cet.json e adicione as configurações do projeto que foi criado no Firebase

## CLOUD FUNCTIONS

Dentro da pasta /functions existe um segundo projeto, que é para criar as Cloud Functions. As Cloud Functions permitem criar gatilhos que são executados quando ocorre alguma alteração de dados no firestore.

Para criar um projeto no firebase, você precisa ter instalado as ferramentas de linha de comando

> npm install -g firebase-tools

Depois, para iniciar o projeto


> firebase init 

Selecionar **Functions: Configure and deploy Cloud Functions**

E crie um novo projeto.

Nos exemplos, as Cloud Function apenas geram um log no Firebase, mas elas podem ser programadas para postar os dados para outro servidor. A seguir um exemplo de como isso pode ser feito:

    const functions = require("firebase-functions");
    const admin = require("firebase-admin");
    const request = require('request')
    
    admin.initializeApp();

    exports.criarDocumento = functions.firestore
    .document("sistema/{sistemaId}")
    .onCreate(snapshot => {
        const data = {
            id: snapshot.id,
            doc: snapshot.data()
        };

        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'http://www.endereco_do_site.com.br/pagina.php',
            timeout: 30000,
            json: {
                id: snapshot.id,
                doc: snapshot.data()
            }
        }, function(error, response, body) {
            if (error) {
                console.error(error)
                return
            }
            console.log('statusCode:', response && response.statusCode); 
            console.log('body:', body); 
        });

        console.log("Dados inseridos: ", data);
        return data;
    });

Dentro da pasta /function, será necessário instalar as dependências do projeto

> npm install

Para subir as functions para o Firebase

> npm run deploy

Antes de executar o deploy você precisa estar logado. Execute **firebase login** para obter permissões. Em caso de estar logado a muito tempo, fazer primeiro  **firebase logout** para evitar erro de credenciais inválidas