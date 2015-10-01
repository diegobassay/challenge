var gridPersonagens;

$(function(){

	$("#pesquisarPersonagens").click(function(){
		
		var term = $("#termoPesquisaPersonagem").val();
		
		$.post("/home/search", {term:term}, function(result){
			gridPersonagens.records = result;
			gridPersonagens.refresh();
		
		})

	});
	
	$("#removerPersonagens").click(function(){
		
		var term = $("#termoPesquisaPersonagem").val();
		
		$.post("/home/remove", {}, function(result){
			gridPersonagens.records = result;
			gridPersonagens.refresh();
		
		})

	});

	$('#gridPersonagens').w2grid({ 
	  name   : 'myGrid', 
	  columns: [                
	      { field: 'nome', caption: 'Nome', size: '10%' },
	      { field: 'sexo', caption: 'Sexo', size: '5%' },
	      { field: 'idade', caption: 'Idade', size: '5%' },
	      { field: 'cabelo', caption: 'Cabelo', size: '10%' },
	      { field: 'olhos', caption: 'Olhos', size: '5%' },
	      { field: 'pessoasRelacionadas', caption: 'Pessoas', size: '10%' ,render: function(record) {		
				return "<b>"+JSON.stringify(record.pessoasRelacionadas)+"</b>";
			} },
			{ field: 'origem', caption: 'Origem', size: '10%' },
			{ field: 'atividade', caption: 'Atividade', size: '10%' },
			{ field: 'voz', caption: 'Voz', size: '10%' },
	      { field: 'caracteristicas', caption: 'Caracteristicas', size: '10%' ,render: function(record) {		
				return "<b>"+JSON.stringify(record.caracteristicas)+"</b>";
			} },
	  ],
		onRender: function(event){

			gridPersonagens = this;

		}
	});
	
});