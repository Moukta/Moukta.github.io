/*
   TRABALHO 1 DE APLICAÇÕES MULTIMÉDIA 2020
   GRUPO: 
   Pedro Mota | 160172005@esg.ipsantarem.pt
   Gilberto Fernandes | 160118033@esg.ipsantarem.pt
   Cáudio Hervet | 170100250@esg.ipsantarem.pt 
*/

(function () {

	// variaveis para as stages do jogo
	var stage;
	var stageFinal;

	// o aleatorio define se o array está baralhado , default é true 
	var aleatorio = true;
	//a solucaoAtiva representa se estamos no modo para ver a solução , default é false
	var solucaoAtiva = false;

	// toma o valor da stage ou da stageFinal , dependendo da variavel aleatorio e da solucaoAtiva
	var modo;

	//butao para mostrar imagem final
	var verResultado;

	// serve para ir buscar a referência da butão do som
	var botaoVolume;
	// se o volume esta ligado ou desligado , default é desligado
	var volume = false;

	// serve para ir buscar a referência da pontuação
	var contador;
	// contador dos moves do jogador
	var moves;
	
	// botao para fazer reset
	var btnReset;
	

	var imagens = ["images/algarve.png", "images/casino.png", "images/chaves.png", "images/girl.jpg", "images/obidos.jpg", "images/panda.jpg", "images/vchaves.jpg", "images/vidago.jpg"];
	
	// toma o valor de uma imagem escolhida de forma random, serve para definir a imagem do puzzle 
	var imagemRandom = imagens[Math.floor(Math.random() * imagens.length)];



	// array onde são armazenadas as peças 
	var	arrayPecas = new Array();
	var arrayOrdenado = new Array();

	// tamanho do puzzle (dimensao x dimensao), default é 2,
	var dimensao = 2;
	var TAMANHO ;//tamanho de cada celula
	var ESPACO = 1; //espaço entre celulas



	// sons de jogo
	const sounds = {
		somDeFundo: new Audio ('audio/Ori.mp3'),
		//somDeFundo: new Audio ('audio/introMusic.mp3'),
		mover: new Audio('audio/mover.mp3'),
		erro: new Audio('audio/erro.mp3'),
		solution: new Audio ('audio/showfinal.mp3'),
		baralhar: new Audio('audio/baralhar.mp3'),
		victory: new Audio('audio/victory.mp3')
	}


	// referência para a modal
	var modal; 

	// botao para jogar outra vez, dentro da modal
	var btn ;

	//  botao "x" , serve para fechar a modal
	var span;



	window.addEventListener("load", init, false);

	function init() {
		stage = document.querySelector("#stage");//obtemuma referencia da stage
		stageFinal = document.querySelector("#final");
		modo = stage; 
	
		//setup(dimensao); //criação e instanciação do array 2D
		verResultado = document.querySelector("#showResult");
		verResultado.addEventListener("click", mostarResultado);

		botaoVolume = document.querySelector("#muteOpt");
		botaoVolume.style.backgroundPosition = "100%";
		botaoVolume.addEventListener("click", semVolume);

		contador = document.querySelector("#contador");
		contador.innerText = 0;

		//sounds.somDeFundo = document.querySelector("#somDeFundo");
		sounds.somDeFundo.volume = 0.2;
		sounds.erro.volume = 0.2;
		sounds.mover.volume = 0.8;
		sounds.solution.volume = 0.2;
		sounds.baralhar.volume = 0.8;
		sounds.victory.volume = 0.2;


		modal = document.querySelector("#myModal");
		btn = document.getElementById("myBtn");
		span = document.getElementsByClassName("close")[0];

		btnReset = document.querySelector("#btnReset");
		btnReset.addEventListener("click",fazerReset);


		// este click serve para reiniciar o jogo atráves da modal
		btn.onclick = function() {

			modal.style.display = "none";
			fazerReset();
			

		  }


		  // quando se carrega no "x" fecha a modal, está ação só é possivel dentro da modal
		  span.onclick = function() {
			modal.style.display = "none";
		  }
		  
		  // quando a modal está aberta, se carregar fora da modal, a mesma fecha-se
		  window.onclick = function(event) {
			if (event.target == modal) {
			  modal.style.display = "none";
			}
		  }
		  
		

		// descoberto por acaso, apesar da funcao render() não ter parametros, conseguimos à mesma executar o a função setup().
		// o render() funciona da corretamente mesmo se não tiver o setup() dentro dele, é preciso que o setup() corra primeiro
		render(setup());
		// menu dos botões para mudar a imagem do puzzle
		menuContentPuzzle();
		// menu dos botões para mudar o tamanho do puzzle
		menuTamanhos();


	



	}









	

	// aqui é definida o tamanho do puzzle  4 x 4 ou 5 x 5 ou  6 x 6
	function setup(){
		
	
		//definir size/length do 1D array
		var h = 0; 
		moves = 0;
		arrayPecas.length = 0;
		arrayPecas[linha] = 0;
		
		for (var linha = 0; linha < dimensao; linha++) { 
			arrayPecas[linha] = [];
				
			

			for(var col = 0; col  < dimensao; col++){
				
				arrayPecas[linha].push(h++);
			
				
				
			}	

			arrayOrdenado = JSON.parse(JSON.stringify(arrayPecas)); // ISTO É QUE FAZ COM QUE O arrayOrdenado NAO FIQUE COM AS MESMAS REFERÊNCIAS DE MEMORIA DO arrayPecas;

		} 

		//arrayOrdenado = arrayPecas.slice();


		// isto decide ao criar o puzzle se é aleatorio ou nao
		switch (aleatorio) {
			case true: 
				shuffle(arrayPecas);
			break;

			case false:
			break;
		}

		console.log(arrayPecas);
		console.log(arrayOrdenado);
		
	}//setup

	// função para baralhar um array 2D
	function shuffle() {
		for (var i = 0; i < arrayPecas.length; i++) {
			for (var j = 0; j < arrayPecas[i].length; j++) {
				var i1 = Math.floor(Math.random() * (arrayPecas.length));
				var j1 = Math.floor(Math.random() * (arrayPecas.length));
	
				var temp = arrayPecas[i][j];
				arrayPecas[i][j] = arrayPecas[i1][j1];
				arrayPecas[i1][j1] = temp;
			}	
		}
	}


	// esta função divide o tamanho do puzzle pelo o numero de peças por linha, e depois chama setCellDimensões() 
	//(neste caso usamos um numero predefinido, mas podiamos usar uma váriavel com uma referência para obter a width da stage);
	function getTamanhoParaCadaPeca(pCell){
			TAMANHO = 363/dimensao;
			setCellDimensoes(pCell);
			return TAMANHO
	}



	
	// aplica as width e a height para cada celula calculada na funcao getTamanhoParaCadaPeça(pCell);
	function setCellDimensoes(pCell){
		//TODO: alterar css através do DOM [resolvido: apagar espaco no " px" para "px"]
		pCell.style.width = TAMANHO + "px";
		pCell.style.height = TAMANHO + "px";

	}//setCellDimensoes

	
	// cria uma div e atribui a imagem que será uma peça do puzzle
	function criarDiv(){
		
		celula= document.createElement("div");//cria o elemento HTML div   chamado celula
		//classificar a div como célula
		celula.setAttribute("class", "cell");

		
		img = document.createElement("img");
		img.width = getTamanhoParaCadaPeca(celula);
		img.height = getTamanhoParaCadaPeca(celula);
		img.src = imagemRandom;	//atribuir img escolhida, a partir do imagens[]

		
		modo.appendChild(celula);//adicionar à stage

	}//criarDiv




	// define a posição da imagem em cada peça  (ou podemos dizer que corta a imagem pelas peças do puzzle)
	function setPostionXY(celula) {
		backgroundPositionX=-(Math.floor(celula.id % arrayPecas[0].length))*(getTamanhoParaCadaPeca(celula));
		backgroundPositionY=-(Math.floor(celula.id / arrayPecas[0].length))*(getTamanhoParaCadaPeca(celula));

		celula.style.backgroundPosition = backgroundPositionX+"px " + backgroundPositionY+"px ";
	}//setPostionXY







	// carrega as peças do puzzle para dentro das stages, esta função será chamada sempre que se move uma peça para atualizar a vista do puzzle  
	function render() {

		//limpar a stage da jogada anterior
		while(modo.hasChildNodes())modo.removeChild(modo.firstChild);
		
		// torna-se uma referência para o array ordenado ou o array baralhado, dependendo do estado da solucaoAtiva
		var arraySuporte;

		if (solucaoAtiva){

			arraySuporte = arrayOrdenado;

		}else{

			arraySuporte = arrayPecas;

		}
	
		// serve para carregar as peças para dentro da stage 
		for(let linha = 0; linha < arraySuporte.length; linha++)  { 
			
			for(let coluna = 0; coluna < arraySuporte[0].length; coluna++)  { 
				
				criarDiv(); 
				celula.id = arraySuporte[linha][coluna];
				
				setPostionXY(celula);
				
				if (modo == stageFinal){

					celula.style.animation = "rodar 0.2s";

				}

				// se a solução estiver ativa, carrega o numero de paças total 
				if (solucaoAtiva){

					celula.style.top= linha * (getTamanhoParaCadaPeca(celula) + ESPACO) + "px";
					celula.style.left=  coluna * (getTamanhoParaCadaPeca(celula) + ESPACO) + "px";
					celula.style.backgroundImage = "url(" + img.src + ") "; // colocar as várias peças da img


				// se não estiver ativa, carrega o numero de peças total - 1 , sendo que a primeira será a peça vazia (o espaço)
				}else{

					if(arraySuporte[linha][coluna] == 0 ) {

						//remover img
						celula.style.top= linha * (getTamanhoParaCadaPeca(celula) + ESPACO) + "px";
						celula.style.left=  coluna * (getTamanhoParaCadaPeca(celula) + ESPACO) + "px";
						celula.style.cursor = "unset";
						
						
	
					}else{
	
						celula.style.top= linha * (getTamanhoParaCadaPeca(celula) + ESPACO) + "px";
						celula.style.left=  coluna * (getTamanhoParaCadaPeca(celula) + ESPACO) + "px";
						celula.style.backgroundImage = "url(" + img.src + ") "; 
	
					}



				}

				

				//evento para o click em cada peça, 
				celula.onclick = () => {
					console.log("ID C = " + arraySuporte[linha][coluna]);

				
					// desta maneira, as peças ficam sem a função do click, utilizado quando estamos na vista de solução ativa, ou quando o puzzle foi terminado
					if (solucaoAtiva){


					}else{
						moverPeca(linha, coluna);

					}
					
				
				}

			}
			
		}
		
	
	}


	// esta função vai mostar os botões para escolher uma imagem do puzzle
	function menuContentPuzzle(){

		//uma instancia do contentor de puzzles
		let contentor = document.querySelector("#thumbSet");
		while(contentor.hasChildNodes())contentor.removeChild(contentor.firstChild);
		for (let i = 0 ; i < imagens.length; i++){

			//cria o elemento HTML div   chamado contPuzzle
			var contPuzzle =  document.createElement("div");

				//classificar a div como teste1
				contPuzzle.setAttribute("class", "menuImagens");
				contPuzzle.style.backgroundImage = "url(" + imagens[i] + ") ";
				
				// Ao escolher uma nova imagem para o puzzle, é feito o update a stage
				contPuzzle.addEventListener("click", function(){
					imagemRandom = imagens[i];
					moves = 0;
					contador.innerText = moves ;
					render();
					menuContentPuzzle();
				
					// verifica se o som esta ligado
					if (volume == true){
						if (solucaoAtiva){

						}else{

							sounds.baralhar.play();
						}
						
					}
			
				});
				
				//serve para deixar o botao selecionado, com uma animação
				if(imagens[i]===imagemRandom){

				contPuzzle.setAttribute("id", "animado");
				
				}

				contentor.appendChild(contPuzzle);

		}
	

	}

	// esta função vai mostar os botões para escolher o tamanho do puzzle
	function menuTamanhos(){

		//uma instancia do contentor de puzzles
		let contentor = document.querySelector("#menuTamanho");
		while(contentor.hasChildNodes())contentor.removeChild(contentor.firstChild);
		for (let i = 2 ; i < 8; i++){

			//cria o elemento HTML div   chamado contPuzzle
			var botaoTamanho =  document.createElement("button");

			//classificar a div como menuTamanho
			botaoTamanho.setAttribute("class", "menuTamanho");
			botaoTamanho.value = i;
			console.log(botaoTamanho.value);
			botaoTamanho.innerText = i + " x " + i;
			
			botaoTamanho.addEventListener("click", function(){
				dimensao = i;
				console.log(botaoTamanho.value);
				moves = 0;
				contador.innerText = moves ;
				// o setup tem de ser enviado, visto que é nele onde é criado o array com as dimensões escolhidas
				render(setup());
				menuTamanhos();
	
			});

			if(i == dimensao){
				//serve para deixar o botão selecionado, com uma animação
				botaoTamanho.setAttribute("id", "animado");
					
			}

			contentor.appendChild(botaoTamanho);

		}
	

	}

	// está funcão serve para mostar a imagemCompleta, ou seja, com o numero total de peças todas ordenadas
	function renderImgCompleta() {
		
		//limpar a stage da jogada anterior
		
		while(modo.hasChildNodes())modo.removeChild(modo.firstChild);

			for(let linha = 0; linha < arrayOrdenado.length; linha++)  { 
				
				for(let coluna = 0; coluna < arrayOrdenado[0].length; coluna++)  { 
					
					criarDiv();

					celula.id = arrayOrdenado[linha][coluna];

					celula.style.animation = "rodar 0.2s";

					if (volume == true){

						sounds.solution.play();

					}
				
					setPostionXY(celula);

					celula.style.top= linha * (getTamanhoParaCadaPeca(celula) + ESPACO) + "px";
					celula.style.left=  coluna * (getTamanhoParaCadaPeca(celula) + ESPACO) + "px";
					celula.style.backgroundImage = "url(" + img.src + ") "; // colocar as várias peças da img
			
				}
				
			}

		}



		// esta função recebe 2 parametros, a linha do array e a coluna do array onde se encontra a peça que queremos mover, e vai comprar se pode mover com ajuda da funcao ""
		function moverPeca(tableRow, tableColumn){
			
			if (verificarMobilidade(tableRow, tableColumn, "cima") || verificarMobilidade(tableRow, tableColumn, "baixo") ||verificarMobilidade(tableRow, tableColumn, "esquerda") ||
				verificarMobilidade(tableRow, tableColumn, "direita")){

					if (volume == true){
					
						sounds.mover.play();

					}
					
					// se a peça pode mover, isto vai fazer update ao moves no menu
					moves++;
					contador.innerText = moves ;
					

			}else{


				console.log(" ESTA PEÇA NAO PODE MEXER");
				if (volume == true){
					
					sounds.erro.play();

				}
				
			}
		   


			// chegamos aqui se a peça for movida com sucesso, após mover a peça esta funçao testa se o puzzle está completado, se sim , é apresentado a modal de vitoria , 
			//e a imagem completa é carregada com o renderImgCompleta.
			if (verificarVitoria()){

				
				renderImgCompleta();
				menuContentPuzzle();
				solucaoAtiva = true;
				verResultado.style.backgroundPosition = "100%";
				verResultado.removeEventListener("click", mostarResultado);

				if (volume == true){

					sounds.victory.play();

				}

				setTimeout(mostrarModal, 200);
							
			}

  		}

		  // esta funcao vai testa se o array está ordenado ou não ()
		function verificarVitoria(){
			var count = 0;

			for (var i = 0; i < arrayPecas.length; i++){

				for (var j = 0; j < arrayPecas[0].length; j++){

					if (arrayPecas[i][j] != count){			

						if ( !(count === arrayPecas.length * arrayPecas[0].length && arrayPecas[i][j] === 0 )){

							return false;
						}
					}

				count++;

				}
			}
			
			
			return true;
			
			
		}





	// 
	// Vai testar se peça se pode mover para algum lado
	function verificarMobilidade(rowCoordinate, columnCoordinate, direction){


		rowOffset = 0;
		columnOffset = 0;
		
		if (direction == "cima"){

		rowOffset = -1;
		
		}else if (direction == "baixo"){

		rowOffset = 1;

		}else if (direction == "esquerda"){

		columnOffset = -1;

		}
		else if (direction == "direita"){

		columnOffset = 1;

		}  

		// move a peça se haver espaço para a ação
		if (rowCoordinate + rowOffset >= 0 && columnCoordinate + columnOffset >= 0 &&
			rowCoordinate + rowOffset < arrayPecas.length && columnCoordinate + columnOffset < arrayPecas[0].length){

				if ( arrayPecas[rowCoordinate + rowOffset][columnCoordinate + columnOffset] == 0){

					arrayPecas[rowCoordinate + rowOffset][columnCoordinate + columnOffset] = arrayPecas[rowCoordinate][columnCoordinate];
					arrayPecas[rowCoordinate][columnCoordinate] = 0;
					render();
					return true;
				}
		}

		return false; 
	}

	// faz o reset ao jogo, define os parametros originais e volta a carregar as funções que dão load ao puzzle
	function fazerReset(){

			
			solucaoAtiva = false;
			moves = 0;
			contador.innerText = moves ;
			modo = stage;
			stage.style.display="block";
			stageFinal.style.display = "none";
			verResultado.style.backgroundPosition = "0%";
			verResultado.addEventListener("click", mostarResultado);
			render(setup());
			menuContentPuzzle();
			menuTamanhos();

		
	}




/***************************************BOTOES SOM E SOLUCAO E MODAL****************************************** */
	//função para lidar com o botao de mostrar o resultado
	function mostarResultado(){
		
		switch(solucaoAtiva){

			// AQUI É PARA DESATIVAR A SOLUCAO	
			case true:
				
			//
				solucaoAtiva = false;
				verResultado.style.backgroundPosition = "0%";
			//	aleatorio = true;
				modo = stage;
				stage.style.display = "block";
				stageFinal.style.display = "none";
				render();
				
			
			break;

			//AQUI ATIVA A SOLUÇÃO
			case false:
			
				solucaoAtiva = true;
				verResultado.style.backgroundPosition = "100%";
			//	aleatorio = false;
				modo = stageFinal;
				stage.style.display = "none";
				stageFinal.style.display = "block";
				renderImgCompleta();

			break;


		}
		
			
	}
	// função para lidar com o botao do volume
	function semVolume(){
		
		switch(volume){
			//AQUI DESATIVA O VOLUME
			case true:

				
				botaoVolume.style.backgroundPosition = "100%";
				volume = false;	
				sounds.somDeFundo.volume = 0;
				//sounds.somDeFundo.pause();
				//sounds.somDeFundo.currentTime = 0;


			break;
			//AQUI ATIVA O VOLUME
			case false:

				botaoVolume.style.backgroundPosition = "0%";
				volume = true;
				sounds.somDeFundo.loop = true;
				sounds.somDeFundo.volume = 0.2;
				sounds.somDeFundo.load();
				sounds.somDeFundo.play();
		
				
			break;
		}
	
			
	}


	// mostra a modal quando a vitória é alcaçada
	function mostrarModal(){
		var	para = document.getElementById("textoVitoria");
		para.innerText = "Parabens ganhaste, a tua pontuação é de : " + moves ;
		para.style.margin.left="center";
		modal.style.display = "block";
		
			
	}


	
})();
