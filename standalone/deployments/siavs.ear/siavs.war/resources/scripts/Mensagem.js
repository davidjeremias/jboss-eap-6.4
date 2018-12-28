/**
 * @author Leandro da Silva Vieira
 */

function Mensagem(){}

Mensagem.NOME_MODAL = "painelModalMsg";
Mensagem.ESTILO_AUTO = "msgAuto";
Mensagem.ESTILO_MANUAL = "msgManual";
Mensagem.ESTILO_INFO = "msgInfo";
Mensagem.ESTILO_CONFIRMACAO = "msgQuestao";
Mensagem.ESTILO_ERRO = "msgErro";

// **********************************************************************************************************************
// Uso externo
// **********************************************************************************************************************

/**
 * Exibe a tela de msg caso seja necessário.
 * @param ftnOK função chamada pelo usuário quando msg for do tipo Info e clicar no botão OK. 
 */
Mensagem.exibir = function(ftnOK){
	Mensagem.okUsuario = null;

	Mensagem.configurar([Mensagem.ESTILO_AUTO]);
	Mensagem.abrir();
	
	if(ftnOK){
		Mensagem.okUsuario = ftnOK;
	}
};

/**
 * Exibe a tela de msg caso seja necessário e um modal.
 * @param dados Map
 * @param nomeModal String
 */
Mensagem.exibirAbrirModal = function(dados, nomeModal){
	Mensagem.okUsuario = null;
	
	if(dados && (!dados.msgTipoAviso && !dados.msgTipoErro)) {
		U.abrirPopup(nomeModal);
	}
	// É chamado depois para aparecer acima do outro modal
	Mensagem.exibir(dados);
	return dados;
};

/**
 * Exibe a tela com uma msg.
 * @param msg String
 */
Mensagem.exibirManual = function(msg){
	if(msg) {
		// Configura o estilo
		Mensagem.configurar([Mensagem.ESTILO_MANUAL, Mensagem.ESTILO_INFO]);
		Mensagem.escrever(msg, Mensagem.ESTILO_INFO);
		Mensagem.abrir(msg);
	}
};

/**
 * Exibe a tela com uma msg de confirmação.
 * @param msg String
 * @param simUsuario function - Executado quando o usuário clica em sim
 * @param naoUsuario function - Executado quando o usuário clica em não
 */
Mensagem.exibirConfirmacao = function(msg, simUsuario, naoUsuario){
	if(msg != null){
		Mensagem.simUsuario = simUsuario;
		Mensagem.naoUsuario = naoUsuario;
	
		// Configura o estilo
		Mensagem.configurar([msg == null ? Mensagem.ESTILO_AUTO : Mensagem.ESTILO_MANUAL, Mensagem.ESTILO_CONFIRMACAO]);
		Mensagem.escrever(msg, Mensagem.ESTILO_CONFIRMACAO);
		Mensagem.abrir(msg);
	}
};

/**
 * Escreve o conteúdo da mensagem manual
 * @param msg String
 * @param estilo String
 */
Mensagem.escrever = function(msg, estilo){
	var containerMsg = Util.get("msgManual");
	containerMsg.className = estilo;
	containerMsg.innerHTML = msg;
};

/**
 * Abre o modal com a mensagem.
 * @param msg String a ser exibida
 */
Mensagem.abrir = function(msg){
	U.abrirPopup(Mensagem.NOME_MODAL, Mensagem.getConfiguracoesModal(msg));
};

/**
 * Fecha o modal com a mensagem.
 */
Mensagem.fechar = function(){
	U.fecharPopup(Mensagem.NOME_MODAL);
};

// **********************************************************************************************************************
// Uso interno
// **********************************************************************************************************************

/**
 * Configura a tela de mensagens de acordo com os estilos.
 * @param arrayEstilos Array
 */
Mensagem.configurar = function(arrayEstilos) {
	var componente = Util.get(Mensagem.NOME_MODAL + "_container");
	componente.className = "";
	
	for (var r in arrayEstilos) {
		componente.className += arrayEstilos[r] + " ";
	}
};

/**
 * Retorna as configurações do modal de msg.
 * @param msg String
 */
Mensagem.getConfiguracoesModal = function(msg){
	var escala = 8;
	var larguraMaxima = 600;
	var larguraMinima = 300;
	var alturaMinima = 105;
	var largura = 0;
	var tamanhoTexto = 0;
	
	// Se tiver mensagem
	if(msg){
		tamanhoTexto = msg.length;
	}
	else{
		// Recupera o array de mensagem do rich-faces
		var arrayMsg = jQuery('span.rf-msgs-det');
		if(arrayMsg){
			var aux;
			
			for(var r = 0; r < arrayMsg.length; r++){
				// Recupera o tamanho do texto da mensagem
				aux = arrayMsg[r].innerHTML;
				// Pega o maior tamanho
				if(aux.length > tamanhoTexto){
					tamanhoTexto = aux.length;
				}
			}
		}
	}
	
	largura = tamanhoTexto * escala;

	// Se for maior que o limite
	if(largura > larguraMaxima){
		largura = larguraMaxima;
	}
	// Se for menor que o limite
	else if(largura < larguraMinima){
		largura = larguraMinima;
	}
	else{
		// Aumenta o tamanho por causa do ícone da msg
	 	largura += 45;
	}
	
	// Faz um cálculo estimado baseado na quantidade máxima de caracteres por linha
	alturaMinima += Math.floor(tamanhoTexto.length / 100) * 16;

	return {left:"auto", top:"auto", width:largura, height:alturaMinima};
};

Mensagem.okUsuario = null;
Mensagem.simUsuario = null;
Mensagem.naoUsuario = null;

/**
 * Função executada pelo botão ok.
 */
Mensagem.ok = function(){
	//alert('aqui1.');
	Mensagem.fechar();
	//alert('aqui1.2');
	if(Mensagem.okUsuario != null){
		//alert('aqui');
		Mensagem.okUsuario();
	}
	return false;
};

function fnFoco(obj){
	obj.focus();
	//alert('focar em um campo');
}
/**
 * Função executada pelo botão sim.
 */
Mensagem.sim = function(){

	Mensagem.fechar();
	
	if(Mensagem.simUsuario != null){
		Mensagem.simUsuario();
	}
	
	return false;
};

/**
 * Função executada pelo botão não.
 * @returns {Boolean}
 */
Mensagem.nao = function(){
	Mensagem.fechar();
	
	if(Mensagem.naoUsuario != null){
		Mensagem.naoUsuario();
	}
	
	return false;
};