require('./globals/constants');

var express = require('express')
  , nstatic = require('node-static')
  , http = require('http')
  , util = require('util')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , models = require('./globals/models')
  , logger = require('./globals/logger') 
  , path = require('path')
  , bodyParser = require('body-parser')
  , router = express.Router();

var app = express();

var file;

var webroot = './public';



var msgs = [];

/* Usado para carregar os Schemas do Mongoose e adcionar as */
models.create(function(mods){
	
	app.set('models', mods);
	
});
/* Usado bodyParser para enviar requisiçoes POST em formato JSON */
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true })); 
/* Configurando diretorio de templates do Express.js */
app.set('views', __dirname + '/views');
/* Configurando para utilizar templates no estilo EJS */
app.set('view engine', 'ejs');

app.use(router);

app.set('view options', { layout: true }); 

app.use(express.static('public'));


file = new(nstatic.Server)(webroot, {
	cache: 600,
	headers: { 'X-Powered-By': 'node-static' }
});

app.use(function (req, res, next) {

    next();
	
});

/**
 * Instancia objetos da camada 'service' que serão chamado por qualquer tipo de requisição (POST,GET, DELETE ou PUT)
 * Usa o objeto response do Express para renderizar paginas com template e sub-template
 *
 * @param {app} espera uma instancia do Express para passagem de parametros
 * @param {req} objeto request
 * @param {res} objeto response
 * @param {entity} entidade envolvida na requisição, será a entidade envolvida na chamada de serviço
 * @param {action} metodo de negócio que srá chamado apartir da camada de serviço
 * @param {params} valores que serão passados para o metodo de negócio
 */
var service = function(app, req, res, entity, action, params, next){
	
	var models = app.get('models');
	
	var service = require('./service/'+entity);

	var go = eval('service.'+action);

	var host = req.protocol + "://" + req.get('host');

	app.set('service', entity);
	
	app.set('params', params);

	app.set('action', action);

	app.set('method', req.method);

	app.set('host', host);

	app.set('headers', req.headers);

	app.set('request', req);
	
	app.set('response', res);
	
	go(app, function(err, docs) {

		//logger.accessLog(req, docs);
		
		res.render(app.get('service')+'/'+app.get('action'), {data:docs, action: app.get('action'), host: app.get('host')}, function(err, html){

			if(err != null) logger.accessLog(req, err);

			res.render("index", { session: req.session, title: entity, entity: entity, body: html, host: app.get('host')});

		});

	});

  
}

/**
 * processa o metodo POST de cada requisição, depois passa para service processar como serviço
 *
 * @param {req} objeto request
 * @paraq, res, next, appm {res} objeto response
 * @param {app} espera uma instancia do Express para passagem de parametros
 * @param {next} objeto que possui o estado final da rota de cada requisição
 */
var post = function(req, res, next, app) {
  
  var entity = req.params.entity; 
  
  var action = req.params.action;
  
  var params = req.body;
  
  service(app, req, res, entity, action, params, next); 
  
}

/**
 * processa o metodo DELETE de cada requisição, depois passa para service processar como serviço
 *
 * @param {req} objeto request
 * @param {res} objeto response
 * @param {app} espera uma instancia do Express para passagem de parametros
 * @param {next} objeto que possui o estado final da rota de cada requisição
 */
var del = function(req, res, next, app){

  var entity = req.params.id; 
  
  var action = req.params.action;
  
  var params = req.body;
  
  service(app, req, res, entity, action, params, next);

}


/**
 * constrói objeto com paramentros necessario para carregar o service via GET
 *
 * @param {req} objeto request
 * @return {x = {},x['entity'],x['action'],x['params'], } objeto
 */
var buildGetRequest = function(req){
	
    var urlParams = req.url.split("/");
  
    var entity = urlParams[1];
	
    if(entity == '' || entity == null){
    
      entity = "home";
    
    }
  
    var action = urlParams[2];

    if(action == '' || action == null){
    
      action = "index";
    
    }
  
    var params = {};
  
    urlParams.shift();
  
    urlParams.shift();
  
    urlParams.shift();
  
    if(urlParams.length > 0 && urlParams.length % 2 == 0){
    
      var paramSize = urlParams.length / 2;
    
      for (a =0;a<paramSize;a = a + 2) {
    
        params[urlParams[a]] = urlParams[a+1];
    
      }   
    
    }else{
    
      params = null;
    
    
    }
	
	var objParams = {};
	
	objParams.entity = entity;
	
	objParams.action = action;
	
	objParams.params = params;
	
	return objParams;
	
}

/**
 * processa o metodo GET de cada requisição, depois passa para service processar como serviço
 *
 * @param {req} objeto request
 * @param {res} objeto response
 * @param {app} espera uma instancia do Express para passagem de parametros
 * @param {next} objeto que possui o estado final da rota de cada requisição
 */
var get = function(req, res, next, app){

  if(req.url.indexOf(".") !== -1){
	  
		res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
	
		var json = JSON.stringify("{erro:'URL Invalida'}");
	
		res.end(json);
    
    }else{

		var params = buildGetRequest(req);

  	  	service(app, req, res, params.entity, params.action, params.params, next);
  
	}

}


/* Adiciona metodo para processar requisições GET */
app.get(EXPRESS_GET_URL_PROCESSOR, function(req, res, next) {	get(req, res, next, app); });

/* Adiciona metodo para processar requisições POST */
app.post(EXPRESS_POST_URL_PROCESSOR, function(req, res, next) {	post(req, res, next, app); });

console.log("Servidor HTTP iniciado na porta : "+EXPRESS_SERVER_PORT)
/* Inicia servidor HTTP */
var server = app.listen(EXPRESS_SERVER_PORT);
