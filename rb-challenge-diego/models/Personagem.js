module.exports = Personagem;
module.exports.schemas = schemas;
module.exports.clear = clear;
var Schema = require('mongoose').Schema;

var sch = {
		nome:String,
		sexo:String,
		idade:Number,
		cabelo:String,
	   olhos: String,
	   pessoasRelacionadas: {type:Schema.Types.Mixed},
		origem: String,	
		atividade: String,	
		voz: String,	
		caracteristicas: {type:Schema.Types.Mixed},	
	};
	

function clear(){
	
	for (var elem in sch) {
	    if (sch.hasOwnProperty(elem)) {
	        sch[elem] = '';
	    }
	}

	return sch;

}

function schemas(){
	
	return sch;

}

function Personagem(){
	
	return new Object();
	
}