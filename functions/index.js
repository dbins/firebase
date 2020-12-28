const functions = require("firebase-functions");
const admin = require("firebase-admin");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp();

exports.criarDocumento = functions.firestore
  .document("sistema/{sistemaId}")
  .onCreate(snapshot => {
    const data = {
      id: snapshot.id,
      doc: snapshot.data()
    };
    console.log("Dados inseridos: ", data);
    return data;
  });

exports.atualizarDocumento = functions.firestore
  .document("sistema/{sistemaId}")
  .onUpdate((change, context) => {
    var before = "";
    var after = "";
    if (change.after.data()) {
      after = change.after.data();
    }
    if (change.before.data()) {
      before = change.before.data();
    }

    const data = {
      id: context.params.sistemaId,
      change: after,
      before: before
    };
    console.log("Dados atualizados: ", data);
    return data;
  });

exports.excluirDocumento = functions.firestore
  .document("sistema/{sistemaId}")
  .onDelete(snapshot => {
    const data = {
      id: snapshot.id,
      doc: snapshot.data()
    };
    console.log("Dados Excluídos: ", data);
    return data;
  });

exports.escreverDocumento = functions.firestore
  .document("sistema/{sistemaId}")
  .onWrite((change, context) => {
    const data = {
      id: 0,
      doc: "teste"
    };
    console.log(change);
    console.log(context);
    console.log("Dados escritos: ", data);
    return data;
  });
