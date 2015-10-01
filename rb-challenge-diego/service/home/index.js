var Personagem = require("../.././models/Personagem");
var logger = require('../.././globals/logger');

exports.index = function(app, callback){
	
	var models = app.get('models');
	
	var params = app.get('params');
	
	var request = app.get('request');
	
	var queryPersonagem = models.Personagem.find();
	
	var msgs = [];
	
	queryPersonagem.exec(function (err, queryResult) {
		
		msgs.push("Carregando pagina inicial");
	
		msgs.push("Encontrados "+queryResult.length+" para fazer busca");
	
		logger.accessLog(null, msgs);
		
		callback(null, {personagens: queryResult});
		
	});	
  
};

exports.remove = function(app, callback){
	
	var models = app.get('models');
	
	var response = app.get('response');
	
	var msgs = [];
	
	var query = models.Personagem.remove();
	
	query.exec();
	
	msgs.push("Todos os personagens foram removidos");
	
	msgs.push("Adicione outros, copie um arquivo .json para o diretorio: "+DIR_JSON_PERSONAGENS);
	
	logger.accessLog(null, msgs);
	
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
	
	response.end("[]");
	
}

exports.search = function(app, callback){
	
	var models = app.get('models');
	
	var query = models.Personagem.find();
	
	var params = app.get('params');
	
	var fuzzy = require('fuzzy');
	
	var response = app.get('response');
	
	var msgs = [];
	
	query.exec(function(e, list){
		
		msgs.push("Iniciando busca fuzzy pelo termo : "+params.term);
		
		var options = {
		  extract: function(el) { return el.caracteristicas.toString() }
		};
		
		var results = fuzzy.filter(params.term, list, options);
		
		//var matches = results.map(function(el) { return el.string; });	
		
		var matches = results.map(function(el) { return el.original; });	
		
		msgs.push("Encontrados "+matches.length+" iten(s) pelo termo : "+params.term);
		
		msgs.push("Retonando JSON com o resultado");
		
		logger.accessLog(null, msgs);
		
		response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
		
		var strJson = JSON.stringify(matches)
		
		strJson = strJson.replace(new RegExp("_id", 'g'), "recid");
		
		response.end(strJson);
		
	});
  
};


exports.endpoint = function(app, callback){
	
	var models = app.get('models');
	
	var params = app.get('params');
	
	var request = app.get('request');
	
	var response = app.get('response');
	
	var nodexml = require('nodexml');
	
	var msgs = [];
	
	msgs.push("Processando XML do Worker");
	
	msgs.push(params.xml);
	
	var jsonPersonagem = nodexml.xml2obj(params.xml);
	
	msgs.push("Transformando XML do Worker em Schema JSON para gravar no MongoDB");
	
   var newPersonagem = models.Personagem(jsonPersonagem.Personagem);

	newPersonagem.save(function (err, savedPersonagem) {
		
		msgs.push("Schema JSON - Personagem - Gravado com sucesso.");
		
		msgs.push(savedPersonagem);
		
		logger.accessLog(null, msgs);
		
	});
	
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
	
	response.end(JSON.stringify(jsonPersonagem));
  
};


