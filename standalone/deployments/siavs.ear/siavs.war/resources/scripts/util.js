var U = function(){};

/**
 * Executa os procedimentos inciais da tela.
 */
U.iniciarTela = function () {
	// Adiciona os eventos aos campos
	try{
		$(":text:visible,:checkbox,select").not("textarea,.numero,.rf-cal-inp,.data,.matriculaRede").campoAlfaNumero();
		$(".data,.rf-cal-inp").campoData();
	}
	catch(e) {}
	try{
		$(".numero").campoNumero();
	}
	catch(e) {}
	
	try{
		// Nas telas que não tem o botão incluir do layout padrão, ajusta a tabela para 100% da largura da página
		if(U.getComp("btIncluirPadrao") == null){
			$("div.tabelaPesquisa")[0].style.width = "100%";
		}
	}
	catch(e) {}

	try{
		$(".matriculaRede").mask('C000000');
	}
	catch(e) {}
	
	U.posRender();
};

/**
 * Executa os procedimentos executados apos a renderização da tela.
 */
U.posRender = function (fnPosterior) {
	// Exibe a msg caso tenha alguma
	try{
		if($('#msgAutoConteudo').text().length > 0) {
			Mensagem.exibir(fnPosterior ? fnPosterior : U.colocarFoco);
		}
		else {
			U.colocarFoco();
		}
	}
	catch(e) {}
};

/**
 * Coloca o foco no campo validado ou no primeiro campo habilitado.
 */
U.colocarFoco = function() {
	// Atribui o foco
	try{
		var atributoFoco = U.recuperarComponente("atributoFoco").value;
		// Seta o foco no campo informado 
		if(atributoFoco != ""){
			atributoFoco = atributoFoco.substring(0, 1).toUpperCase() + atributoFoco.substring(1);
			U.recuperarComponente(atributoFoco).focus();
		}
		else {
			// Seta o foco no primeiro campo da tela
			$(":text:visible:enabled:first,:checkbox:enabled:first,select:enabled:first").not("div .dialog input")[0].focus();
		}
	}
	catch(e) {}
};

/**
 * Fecha a tela de popup.
 * @param nomeComponente
 */
U.fecharPopup = function(nomeComponente) {
	U.getCompRF(nomeComponente).hide(window.event);
};

/**
 * Abre o popup.
 * @param nomeComponente
 * @param configuracoes
 */
U.abrirPopup = function(nomeComponente, configuracoes) {
	U.getCompRF(nomeComponente).show(window.event, configuracoes);
};

/**
 * Recupera o componente pelo final do nome
 * @param nomeComponente
 * @returns componente 	
 */
U.getCompRF = function (idCampo, filtro) {
	var temp = $(filtro ? filtro : "body");
	if(idCampo) {
		temp = temp.find("[id$='" + idCampo + "']");
	}
	try{
		return RichFaces.$(temp[0].id);
	}
	catch(e){return null;}
};

/**
 * Recupera o componente pelo final do nome
 * @param nomeComponente
 * @returns componente html
 */
U.getComp = function (nomeComponente) {
	return U.recuperarComponente(nomeComponente);
};

/**
 * Recupera o componente pelo final do nome
 * @param nomeComponente
 * @returns componente html
 */
U.recuperarComponente = function (nomeComponente) {
	// Lista os registros os quais o id termina com o parâmetro informado e retorna o primeiro encontrado
	return $("[id$='" + nomeComponente + "']")[0];
};

/**
 * Exibe ou oculta o status de processando do ajax.
 * @param processando Se e para iniciar o status de processamento.
 * @param automatico Se é uma solicitação automática do ajax ou disparada manualmente.
 */
U.processando = function(processando, automatico) {
	var comp = $("#statusAjax");
	
	if(!window.top.processando || // Se está parado 
	  (window.top.processando != processando && window.top.automatico == automatico) // Se é para mudar o processamento 
	  ) {
		window.top.processando = processando;
		window.top.automatico = automatico;
		comp.css("display", processando ? "" : "none");
	}
};