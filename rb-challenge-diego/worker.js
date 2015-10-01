require('./globals/constants');

var fs = require('fs');
var nodexml = require('nodexml');
var isActiveRead = false;
var request = require('request');
var currentJsonContent = '';
var loadedStreamContent;
var logger = require('./globals/logger');
var msgs = [];

msgs.push("Iniciando Worker para migração de arquivos JSON");

//TODO: função instavel, ver outras biblioteca como listenner.
fs.watch(DIR_JSON_PERSONAGENS, function (event, filename) {
  
  if (filename && isActiveRead == false) {
	  
	  msgs.push("Iniciando leitura do arquivo : "+filename);
     
	  isActiveRead = true;
	  
	  var readableStream = fs.createReadStream(DIR_JSON_PERSONAGENS+filename);

	  readableStream.on('readable', function() {
	      
		  while ((loadedStreamContent=readableStream.read()) != null) {
			  
	          currentJsonContent += loadedStreamContent;
	      }
			
			msgs.push("Leitura do arquivo : "+filename+" finalizada.");
			
		  	msgs.push(currentJsonContent);
	  
	  });

	  readableStream.on('end', function() {
		  
		  var currentXmlContent = nodexml.obj2xml(JSON.parse(currentJsonContent), "Personagem");
		  
		  msgs.push("Transformando JSON : "+filename+" em XML e enviado para o ENDPOINT");
		  
		  msgs.push(currentXmlContent);
		  
		  request({url:URL_ENDPOINT_PERSONAGENS, method:"POST", json:true, body:{xml:currentXmlContent}}, 
		  
		  function (error, response, body){
			  
			  msgs.push("XML enviado para o ENDPOINT ("+URL_ENDPOINT_PERSONAGENS+") com sucesso");
			  
			  msgs.push("Registrando resposta:");
			  
			  msgs.push(body);
			  
			  currentJsonContent = '';
			  
			  loadedStreamContent = null
			  
			  logger.accessLog(null, msgs);
			  
			  msgs = [];
			  
		  });
		  
	  });
	  
	  isActiveRead = false;
	  
  } else {
	  
	  logger.accessLog(null, "Aguardando arquivo");

  }
  
  
  
});

msgs.push("Escutando eventos no diretório : "+DIR_JSON_PERSONAGENS);

logger.accessLog(null, msgs);

msgs = [];