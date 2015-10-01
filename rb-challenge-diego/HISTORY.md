COISAS QUE PODERIAM MELHORAR:

1 - Implementar um "handler" para mapear todas as "ações" do pacote "service" para funcionar em conjunto com socket.io.
Ex: Em um service chamado "home" que possui a ação "endpoint" poderia estar disponibilizado também com um metodo ouvinte do socket.io, fazendo com que cada ação fosse adicionada com um evento que poderia ser disparada também pelo client javascript.

2 - Usar modelos do diretorio "config" para construção de um "Scaffold", com capacidade para construir formulários no pacote view, construir serviçoes e abtrações de operações que repondam tanto via http request como ws socket.

3 - Persistir a sessão no Redis.io ou no Riak para compartilhar seus dados entre os clusters.

==============================================================================================================================
WEB (web.js)

1 - Pensando em um tipo de arquitetura que poderia atender minimamente os requisitos necessários para o "challenge" resolvi adotar um padrão MVC para o aplicativo WEB implementando um estrutura contruida em node.js com mongodb, que usa configuração por convenção, irei usar abstração de pacote em um conceito reponsabilidade simples como "model" ou "service", por isso resolvi usar uma estrutura feita manualmente ao invés de estruturar o aplicativo com frameowrks como "locomotive.js" ou "sails.js"

OBS: Como foi falado na descrição do "challenger", eu vou representar essas "tabelas" por schemas (até porque os jsons de personagem são idênticos e não possuem os mesmo atributos normalizados).

DESCRIÇÃO DE CADA PACOTE:

--config - Esse diretório possui um mapeamento json padrão para uma entidade que precisa ser representada no sistema.

--globals - Esse diretorio possui utilitários que são utilizados em conjunto aos outros pacotes.

--log - Diretorio do arquivo de log.

--models - Esse diretorio possui modelos que inventei que serão carregados pelo Mongoose, nesse caso temos a representação de nossas entidades como um schema.

--node_modules - *_* 

--public - Eu posso carregar os possiveis estaticos, o south-park entra aqui.

--service - Esse diretorio chama o que chamo de "ações" são na verdade metodos js disponibibilizado em cada "serviço" pelo "exports" do node.js esse diretório permite que possa carregar para arquivo em web.js pelo "require" e coloco cada "ação" para ser processada pelo "express.js" com uma função de "callback", no web.js o express faz com que cada serviço esteja disponível via http ou seja http://localhost/home/test, no caso da url "home/test" o "home" é o um diretorio dentro do "service" com um arquivo "index.js" onde possui vários métodos disponibilizados para cada "require" através do exports, o service é a PONTE DE COMUNICAÇÃO ENTRE O MODELO E A VISÃO, cada "service" e suas "ações"(action) possuem uma "view" equivalente.

--views - possui as "views" que são renderizadas no final do "callback" que é passado para o serviço, o express.js foi programado para rederizar cada view, cada view é relacionada com seu proprio serviço ou seja  

--web.js - Aqui é o core de execução do node.js esse arquivo centraliza tudo que foi falado acima carregando os modelos no mongoose, registra cada chamada http como um serviço e operação, registra diretorios estaticos, no exemplo trato apenas requisições "GET" e "POST" 

BIBLIOTECAS UTILIZADAS
body-parser - biblioteca usada enconjunto ao express para transmitir JSON através de requisições POST
ejs - ferramenta para rederizar os templates é configurado no web.js
express - uso para criar um criar um servidor na porta 2000 e gerenciar as requisições http
nodexml - biblioteca para transformar um objeto json em xml e um xml em json (mesma biblioteca do projeto WORKER).
mongodb, mongoose, Usa para ciar o "models" que são distribuidos na aplicação através do Express para realizar operacoes no mongodb, o mogoose foi escolhido para trabalhar com Schemas normalizados no mongoDB.
fuzzy - bliblioteca usada para pesquisa por similaridade textual

BIBLIOTECAS NÃO UTILIZADAS
js2xmlparser - Substituida pela "nodexml" por os mesmo faz a operação xml-json e json-xml
xml2json - funciona perfeitamente, poré coloca na hora de fazer o parse ela representa cada String como Array de String
xml2js - não funciona bem em ambiente OSX, desatualizada com a versão atual no node.js

==============================================================================================================================
WORKER (worker.js)

1 - Listener que escuta arquivos que são enviados ao diretório padrão e evia para o endpoint do projeto WEB.

BIBLIOTECAS UTILIZADAS
nodexml - biblioteca para transformar um objeto json em xml e um xml em json (mesma biblioteca do projeto WORKER).
fs - biblioteca nativa do node.js usada para "escutar" modificações no diretorio de arquivos e ler arquivos de em formato stream





