import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.criarDocumento = functions.firestore
    .document('sistema/{sistemaId}')
    .onCreate((snapshot) => {        
        const data = {
            id: snapshot.id,
            doc: snapshot.data()
        };
    console.log("Dados inseridos: ", data);

});

exports.atualizarDocumento = functions.firestore
    .document('sistema/{sistemaId}')
    .onUpdate((change, context) => {      
        const data = {
            id: after.id,
            change: change.after.data(),
            before: change.before.data()
        };
    console.log("Dados atualizados: ", data);

});

exports.excluirDocumento = functions.firestore
    .document('sistema/{sistemaId}')
    .onDelete((snapshot) => {        
        const data = {
            id: snapshot.id,
            doc: snapshot.data()
        };
    console.log("Dados Excluídos: ", data);

});

exports.escreverDocumento = functions.firestore
    .document('sistema/{sistemaId}')
    .onWrite((change, context) => {
        const data = {
            id: 0,
            doc: 'teste'
        };
    console.log(change);    
    console.log(context);    
    console.log("Dados escritos: ", data);
});