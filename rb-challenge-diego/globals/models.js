var mongodb = require('mongodb');

var logger = require("./logger");

var fs = require('fs');

var modelObjects = [];

var msgs = [];


/**
 * Metodo para chamada externa a criação de modelos, 
 * é usado para criar conecção apenas uma vez e aproveita uma conexão já criada
 *
 * @param {obj} espera um objeto JSON para criação a string de conecção com MongoDB
 * @return {Array} Retorna os objetos de modelos criados e os schemas repectivos como chave para acessos a dados do MongoDB
 */
exports.create = function(call){
	
	var mongoose = connection();
	
	mongoose.connection.on('error', console.error.bind(console, 'Problemas na conexão com MongoDB'));
		
	mongoose.connection.once('open', function callback () {
		
		msgs.push("Aplicativo conectado com sucesso ao Mongoose");

		modelObjects = models(mongoose);

		logger.accessLog(null, msgs);
		
		call(modelObjects);
	
	});	
	
	//return modelObjects;
	
};

/**
 * Cria string de conexão com o MongoDB para o Mongoose 
 * @param {obj} espera um objeto JSON para criação a string de conecção com MongoDB
 * @return {String} Retorna string de conexão formatada
 */
var url = function(obj){

	obj.hostname = (obj.hostname || MONGODB_HOST);

	obj.port = (obj.port || MONGODB_PORT);

	obj.db = (obj.db || MONGODB_DATABASE);

	urlSimple = "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;

	if(obj.username && obj.password){

		return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;

	} else {

		return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;

  	}
}

/**
 * Cria conexão com o MongoDB através do Mongoose 
 * @param 
 * @return {Mongoose#Connection} Retorna conexão com estabeleciada com o Mongoose
 */
var connection = function(){
	
	var mongo = {};
	
	var mongoose = require('mongoose');

	mongo = {
		"hostname":MONGODB_HOST,
		"port":MONGODB_PORT,
		"username":MONGODB_USERNAME,
		"password":MONGODB_PASSWORD,
		"db":MONGODB_DATABASE
	}

	return mongoose.connect(url(mongo), function(err){
		
		msgs.push("Conectando ao mongoose");
		
	});		
	
	
}

/**
 * Carrega os modelos presentes no schemas do Moongose 
 * @param {mongoose} Instancia do framework Mongoose
 * @return {Array} Retorna os objetos de modelos criados e os schemas repectivos como chave para acessos a dados do MongoDB 
 */
var models = function(mongoose){
	
	modelObjects['connection'] = mongoose.connection;
		
	var dir = './models';

	var files = fs.readdirSync(dir);
	
	for (var i in files) {
		
		var currentModel = files[i].replace(".js","");
		
		if(currentModel != "index" && currentModel != ".DS_Store"){
			
			eval('var '+currentModel+' = require("../models/'+currentModel+'");');
			
			var currentSchema = eval(currentModel+'.schemas()');
			
			var modelSchema = mongoose.Schema(currentSchema);
			
			modelObjects[currentModel] = mongoose.model(currentModel, modelSchema);
			
			msgs.push("Carregando modelo : "+currentModel+"");
			
		
		}
	}
	
	return modelObjects;
}