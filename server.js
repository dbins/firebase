//https://firebase.google.com/docs/functions/get-started?hl=pt-br
//https://medium.com/feedflood/write-to-cloud-firestore-using-node-js-server-c84859fefb86
//https://firebase.google.com/docs/firestore/extend-with-functions?hl=pt-br
//https://www.youtube.com/watch?v=DYfP-UIKxH0
const express = require('express')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = process.env.PORT || 3000
var firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyAhY9fzxHr33Tkby1lhIoYLYZvySHjCaZE",
    authDomain: "bins-nodejs-crud.firebaseapp.com",
    databaseURL: "https://bins-nodejs-crud.firebaseio.com",
    projectId: "bins-nodejs-crud",
    storageBucket: "bins-nodejs-crud.appspot.com",
    messagingSenderId: "125259093807",
    appId: "1:125259093807:web:fbdb9e93c41cc8084b73da"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

var admin = require("firebase-admin");
var serviceAccount = require("./cert/cert.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bins-nodejs-crud.firebaseio.com"
});

app.set('view engine', 'ejs')     // Setamos que nossa engine será o ejs
//app.use(expressLayouts)           // Definimos que vamos utilizar o express-ejs-layouts na nossa aplicação
app.use(bodyParser.urlencoded({extended: true}))  // Com essa configuração, vamos conseguir parsear o corpo das requisições

app.use(express.static(__dirname + '/public'))

app.get('/home2', (req, res) => {
    const db = admin.firestore();
    let citiesRef = db.collection('sistema');
    //let query = citiesRef.where('capital', '==', true).get()
    let query = citiesRef.get().then(snapshot => {
        if (snapshot.empty) {
            //Nao foi localizado um documento
            return;
        }
        var dados = []
        snapshot.forEach(doc => {
            //console.log(doc.id, '=>', doc.data());
            var tmp = doc.data();
            tmp.id = doc.id
            dados.push(tmp);
        });
        res.render('home2', {resultados: dados})
    })
    .catch(err => {
        console.log('Erro ao retornar documento', err);
    });
    //res.render('home2', {resultados: []})
});


app.get('/', (req, res) => {
    var db =  firebase.database();
    var ref = db.ref("/sistema");
    var dados = [];
    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
        //console.log(snapshot.val());
        snapshot.forEach(function(childSnapshot) {
            //var key = Object.keys(childSnapshot.val())[0];
            const key = childSnapshot.key;
            //console.log(key);
            var tmp_item = childSnapshot.val();
            tmp_item.id = key;
            dados.push(tmp_item);
        });
        //console.log(dados);
        res.render('home', {resultados: dados})
    }, function (errorObject) {
        console.log("Houve problemas ao ler o documento: " + errorObject.code);
    });
    
})
app.get('/cadastro', (req, res) => {
   res.render('cadastro', {resultados: {}})
})
app.get('/cadastro2', (req, res) => {
    res.render('cadastro2', {resultados: {}})
 })
 app.post('/cadastro2', (req, res) => {
    const db = admin.firestore();
    const dados = {
            nome: req.body.nome,
            email: req.body.email,
            website:"https://jane.foo.bar"
    };
    let addDoc = db.collection('sistema').add(dados).then(ref => {
        console.log('Adidionado documento com o ID: ', ref.id);
        res.redirect("/home2")
    });
      
    
 })


app.get('/atualizar/:id', (req, res) => {
    var db =  firebase.database();
    var id = req.params.id;
    var ref = db.ref("/sistema/" + id);
    ref.on("value", function(snapshot) {
        var dados =snapshot.val();
        dados.id = id;
        res.render('cadastro', {resultados: dados})
    }, function (errorObject) {
        console.log("Houve problemas ao ler o documento: " + errorObject.code);
    });
})

app.get('/atualizar2/:id', (req, res) => {
    var db =  admin.firestore();
    var id = req.params.id;
    let cityRef = db.collection('sistema').doc(id);
    let getDoc = cityRef.get().then(doc => {
        if (!doc.exists) {
          console.log('Documento não existe!');
        } else {
          console.log('Conteudo do documento:', doc.data());
          res.render('cadastro2', {resultados: doc.data()});
        }
      })
      .catch(err => {
        console.log('Houve problemas ao ler o documento:', err);
      });
})


app.post('/atualizar/:id', (req, res) => {
    var db =  firebase.database();
    var id = req.params.id;
    var dados = {
        nome: req.body.nome,
        email: req.body.email,
        website:"https://jane.foo.bar"
    };
    var ref = db.ref("/sistema/" + id);
    ref.update(dados).then(function(){
	  console.log("Dados atualizados com sucesso!");
	  res.redirect("/");
	}).catch(function(error) {
	  console.log("Houve um problema ao atualizar os dados." + error);
	});
    
});
app.post('/atualizar2/:id', (req, res) => {
    const db = admin.firestore();
    var id = req.params.id;
    var dados = {
        nome: req.body.nome,
        email: req.body.email,
        website:"https://jane.foo.bar"
    };
    let registro = db.collection('sistema').doc(id).update(dados).then(doc => {
        res.redirect("/home2");
    });
    
});

app.get('/apagar/:id', (req, res) => {

    var db =  firebase.database();
    var id = req.params.id;
    db.ref("/sistema/" + id).remove().then(function() {
		console.log("Excluído com sucesso!");
		res.redirect("/");
	  }).catch(function(error) {
		console.log("Houve um problema ao excluir: " + error.message)
	});
    
 });
 app.get('/apagar2/:id', (req, res) => {

    var db =  admin.firestore();
    var id = req.params.id;
    let registro = db.collection('sistema').doc(id).delete().then(doc => {
        res.redirect("/home2");
    });
 });

app.post('/cadastro', (req, res) => {
    var db = firebase.database();
    var ref = db.ref("/sistema");
    ref.push(
        {
            nome: req.body.nome,
            email: req.body.email,
           website:"https://jane.foo.bar"
        }, function(error) {
		  if (error)
			console.log('Houve um erro durante a gravação');
		  else
			 res.redirect("/");
		});
   
 })


app.listen(port, () => {
    console.log(`Servidor ativo em http://localhost:${port}`)
})