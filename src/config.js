process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB

if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/Proyecto';
}
else {
	urlDB = 'mongodb+srv://Mateo:M374489723M@cluster0-juwra.mongodb.net/Proyecto?retryWrites=true'
}

process.env.URLDB = urlDB