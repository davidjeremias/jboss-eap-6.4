function Util(){};

// **********************************************************************************************************************

Util.keysValidas = new Array(
	8, // backspace
	9, // tab
	13 // enter
);

// **********************************************************************************************************************

/**
 * Informa se o navegador é o internet explorer.
 * @author Leandro da Silva Vieira
 */
Util.isIE = function(){
	return /MSIE/.test(navigator.userAgent);
};

// **********************************************************************************************************************

/**
 * Recupera a tecla que disparou o evento.
 * @param e event
 * @author Leandro da Silva Vieira
 */	
Util.recuperarTecla = function(e){
	e = e || window.event;
	return e.which || e.keyCode;
};

// **********************************************************************************************************************

/**
 * Verifica se a tecla é válida.
 * @param e event
 * @author Leandro da Silva Vieira
 */	
Util.teclaEspecial = function(e){
	var key = Util.recuperarTecla(e);

	if(e.ctrlKey || e.altKey){
		return true;
	}
	// Se não for IE "e" o charCode for de função 
	else if((! Util.isIE()) && e.charCode == 0){
		return true;
	}
	else {
		for(var r = 0; r < Util.keysValidas.length; r++){
			if(Util.keysValidas[r] == key){
				return true;
			}
		}
	}
	
	return false;
};

// **********************************************************************************************************************

/**
 * Verifica se a tecla é para mudar de campo.
 * @param e event
 * @author Leandro da Silva Vieira
 */	
Util.teclaMudarCampo = function(e){
	var key = Util.recuperarTecla(e);
	// Se for enter
	return (key == 13);
};

/**
 * Verifica se a tecla é Tab.
 * @param e event
 * @author Leandro da Silva Vieira
 */	
Util.isTab = function(e){
	return Util.recuperarTecla(e) == 9;
};

// **********************************************************************************************************************

/**
 * Verifica se o campo está bloqueado.
 * @param obj componente
 * @author Leandro da Silva Vieira
 */	
Util.estaBloqueado = function(obj){
	if(obj.readOnly || obj.disabled){
		return true;
	}
	return false;
};

// **********************************************************************************************************************

/**
 * Seleciona o texto ou retorna os dados do cursor.
 * @param obj componente
 * @param inicio - onde inicia a seleção
 * @param fim - onde termina a seleção
 * @author Leandro da Silva Vieira
 */
Util.faixaCursor = function(obj, inicio, fim){
	if(obj.length == 0){
		return;
	}
	// Se início for número, seleciona o texto
	if(typeof inicio == 'number') {
		fim = (typeof fim == 'number') ? fim : inicio;
		
		if(obj.setSelectionRange) {
			obj.focus();
			obj.setSelectionRange(inicio, fim);
		}
		else if(obj.createTextRange){
			var range = obj.createTextRange();
			range.collapse(true);
			range.moveEnd("character", fim);
			range.moveStart("character", inicio);
			range.select();			
		}
	}
	// Senão retorna os dados do posicionamento do cursor
	else{
        if(obj.setSelectionRange){
			inicio = obj.selectionStart;
			fim = obj.selectionEnd;
		}
		else if(obj.document.selection && obj.document.selection.createRange){
			var range = obj.document.selection.createRange();
			inicio = 0 - range.duplicate().moveStart('character', -100000);
			fim = inicio + range.text.length;
		}
		
		return {inicio:inicio,fim:fim};
	}
};

// **********************************************************************************************************************

/**
 * Formata o campo numérico com a máscara enquanto digita.
 * @param obj componente
 * @param key código do caractere
 * @param mascara máscara
 * @author Leandro da Silva Vieira
 */
Util.formatarCampo = function(obj, key, mascara){
	if(! Util.inserirTexto(obj, String.fromCharCode(key), mascara)){ // Efetua os tratamentos necessários no campo
		return;
	}

	var posicaoCursor = Util.faixaCursor(obj);
	
	// Retira a máscara do campo
	obj.value = Util.removerCaracteres(obj.value, mascara); 
	var textoAux = obj.value;
	
	// Percorre a máscara e o texto, ambos ao contrário, mas mantendo o contador do texto sempre 1 número maior
	// pra poder inserir na posição correta 
	for(var r = mascara.length - 1, a = textoAux.length; r >= 0 && a > 0; r--, a--){
		var charAux = mascara.charAt(r);
		
		if(charAux != '0' && charAux != 'x'){
			if(a < posicaoCursor.inicio){ // Se inserir texto a esquerda do cursor
				posicaoCursor.inicio++;
			}
			textoAux = Util.inserirTextoEntreTexto(textoAux, charAux, a, a);
			a++; // O tamanho do campo aumentou
		}
	}

	obj.value = textoAux;
	Util.faixaCursor(obj, posicaoCursor.inicio);  // Coloca o cursor na posição correta
};

// **********************************************************************************************************************

/**
 * Cuida da inserção do texto.
 * @param obj componente
 * @param texto 
 * @param mascara máscara
 * @author Leandro da Silva Vieira
 */
Util.inserirTexto = function(obj, texto, mascara){
	var posCursor = Util.faixaCursor(obj);
	var tamMaxCampo = (mascara == null ? obj.maxLength : mascara.length);
	var isPreenchido = (obj.value.length >= tamMaxCampo);
	var textoSelecionado = obj.value.substring(posCursor.inicio, posCursor.fim);
	textoSelecionado = Util.removerCaracteres(textoSelecionado, mascara);
	
	if(isPreenchido && // Se está totalmente preenchido e  
	   textoSelecionado.length == 0){ // não tem nenhum caractere, que não fa�a parte da máscara, selecionado
		return false;
	}
	// Se o tamanho final do campo ficará maior que sua capacidade
	if(tamMaxCampo < (obj.value.length + texto.length - textoSelecionado.length)){
		// Retira a parte que ficaria sobrando
		texto = texto.substring(0, (tamMaxCampo + textoSelecionado.length - obj.value.length));
	}

	var cursorInicio = posCursor.inicio;
	var inicio = obj.value.substring(0, cursorInicio); // Parte inicial do texto	
	cursorInicio -= (inicio.length - Util.removerCaracteres(inicio, mascara).length); // diminui a posição caso tenha caracteres a esquerda
	
	obj.value = Util.inserirTextoEntreTexto(obj.value, texto, posCursor.inicio, posCursor.fim); // Monta o novo texto
	cursorInicio += texto.length; // Aumenta a quantidade de caracteres adicionados
	Util.faixaCursor(obj, cursorInicio);
	
	return true;
};

// **********************************************************************************************************************

/**
 * Formata o campo numérico com a máscara após sair do campo.
 * @param valor
 * @param mascara máscara
 * @author Leandro da Silva Vieira
 */
Util.formatarValor = function(valor, mascara){
	valor = Util.removerCaracteres(valor, mascara);

	if(valor == ""){
		return "";
	}
	else if(parseInt(valor, 10) == 0){
		// Apaga todos os caracteres "#" e os "." do início da máscara 
		return mascara.replace(/#/g, "").replace(/^\.+/, "");
	}

	var aux = Util.removerCaracteres(mascara, mascara);
	
	// Se tiver mais caracteres do que a máscara aceita
	if(valor.length > aux.length) {
		valor = valor.substring(0, aux.length);
	}
	else{
		// Se tiver menos caracteres do que a máscara aceita
		while(valor.length < aux.length){
			valor = aux.charAt(aux.length - valor.length - 1) + valor;
		}
	}

	for(var r = mascara.length - 1, a = valor.length; r >= 0 && a > 0; r--, a--){
		var charAux = mascara.charAt(r);
		
		if(charAux != '0' && charAux != 'x'){
			valor = Util.inserirTextoEntreTexto(valor, charAux, a, a);
			a++; // O tamanho do campo aumentou
		}
	}

	return valor;
};

// **********************************************************************************************************************

/**
 * Apaga a máscara do campo.
 * @param valor
 * @param mascara
 * @author Leandro da Silva Vieira
 */
Util.removerCaracteres = function(valor, mascara){
	if(mascara){
		return Util.temLetra(mascara) ? valor.replace(/\W/g, '') : valor.replace(/\D/g, '');
	}
	else {
		return valor.replace(/\W/g, '');
	}	
};

// **********************************************************************************************************************

/**
 * Se o texto só possuir dígitos.
 * @param valor
 * @author Leandro da Silva Vieira
 */
Util.temDigito = function(valor){
	return valor.replace(/\D/g, '').length > 0;
};

// **********************************************************************************************************************

/**
 * Se o texto só possuir letras.
 * @param valor
 * @author Leandro da Silva Vieira
 */
Util.temLetra = function(valor){
	return valor.replace(/[^a-zA-Z]/g, '').length > 0;
};

// **********************************************************************************************************************

/**
 * Insere um texto dentro de outro texto.
 * @param textoOriginal - onde deve ser inserido o texto.
 * @param textoMeio - texto a ser inserido.
 * @param posicaoInicial - Delimita a parte inicial do texto.
 * @param posicaoFinal - Delimita a parte final do texto.
 * @author Leandro da Silva Vieira
 */
Util.inserirTextoEntreTexto = function(textoOriginal, textoMeio, posInicial, posFinal){
	var inicio = textoOriginal.substring(0, posInicial); // Parte inicial do texto
	var fim = textoOriginal.substring(posFinal, textoOriginal.length); // Parte final do texto
	return inicio + textoMeio + fim; // Retorna o novo texto
};

// **********************************************************************************************************************

/**
 * Move o foco para o próximo campo.
 * @param obj Objeto
 * @author Leandro da Silva Vieira
 */
Util.proximoCampo = function(obj){
    var encontrouCampo = false;
    var campo;

	// Percorre o formulário onde está o campo
	for(var r = 0; obj.form != null && r < obj.form.elements.length; r++) {
		campo = obj.form.elements[r];

		// Se já passou pelo campo, começa a procurar o próximo válido
		if(encontrouCampo){
			if(campo.type != "hidden" && !campo.readOnly && !campo.disabled && campo.tabIndex > -1){
				try{
					campo.focus();
				}
				catch(ex){}

				return;
			}
		}
		else{
			encontrouCampo = (campo.id == obj.id);
		}
	}
};

// *************************************************************************************************************************

/**
 * Retorna o texto em memória.
 * @param obj
 * @author Leandro da Silva Vieira
 */
Util.getTextoClipboard = function(){
	if(window.clipboardData){
		return window.clipboardData.getData("Text");
	}
	else if(window.netscape) {
		try{
			// Dá privilégios
			// Para possibilitar autorização:
			// 1 - Acesse "about:config"
			// 2 - Pesquise por "signed.applets.codebase_principal_support" e altere para "true"
		    netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
	    }
	    catch(e){
/*	    
	    	var msg = 'Para que essa operação funcione corretamente:\n' +
	    			  '1 - Acesse "about:config"\n' +
	    			  '2 - Pesquise por "signed.applets.codebase_principal_support" e altere para "true"\n' +
	    			  '3 - Quando lhe for solicitado, autorize a execução do script.';
			alert(msg);
	    	return null;
*/
			throw e;
	    }
	
		// Criar uma interface para a �rea de transferência
    	var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
    	if(! clip){
    		return "";
    	}
    	
    	// Criar um objeto transmissor
    	var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    	if(! trans) {
    		return "";
    	}
    	
    	// Espec�fica que tipo de dados pretendemos usar
    	trans.addDataFlavor('text/unicode');
    	
    	// Obtém os dados
    	clip.getData(trans, clip.kGlobalClipboard);

	    // 	Visualiza os dados a partir da transferência capaz de conseguir 2 novos itens que precisamos para salvar
	    var str = new Object();
	    var len = new Object();
	
	    // Obtém os dados do comprimento em novos objetos
	    try {
	    	trans.getTransferData('text/unicode', str, len);
	    }
	    catch(error) { 
	    	return "";
	    }
	
		// Se o objeto de dados cont�m algo, convertê-lo para um objeto string
		if(str) {
			// Para NS7
			if(Components.interfaces.nsISupportsWString) {
				str = str.value.QueryInterface(Components.interfaces.nsISupportsWString);
			}
			// Para Mozilla 1.2
			else if(Components.interfaces.nsISupportsString) {
				str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
			}
			else {
				str = null;
			}
	    }
	
	    // Obtém o texto a partir de dados do segmento, o comprimento é metade do comprimento, 
	    // tal como foi obtida a partir do transmissor
	    if(str) {
	    	return (str.data.substring(0, len.value / 2));
	    }
	}
	
	return "";
};

// **********************************************************************************************************************

/**
 * Formata o valor para ficar com determinada quantidade de caracteres.
 * Caso necessário, preenche com zero a esquerda.
 * @param valor - valor a ser formatado
 * @param tamanho - quantidade de caracteres que o valor deve ficar
 * @preencherZero
 * @author Leandro da Silva Vieira
 */
Util.formatarTamanhoCampo = function(valor, tamanho, preencherZero){
	valor = valor || "";
	
	if(valor.length > tamanho){
		valor = valor.substring(0, tamanho);
	}
	else if(preencherZero){
		while(valor.length < tamanho){
			valor = "0" + valor;
		}
	}
	
	return valor;
};

// **********************************************************************************************************************

/**
 * Apaga os espaços no início, no final e substitui os espaços duplos no meio.
 * @param valor
 * @param maxLength
 * @author Leandro da Silva Vieira
 */
Util.trim = function(valor, maxLength){
	valor = valor.replace(/^\s*/g, "").replace(/\s*$/g, "").replace(/\s+/g, " ");
	if(maxLength && valor.length > maxLength){
		valor = valor.substring(0, maxLength);
	}
	return valor;
};

// **********************************************************************************************************************

/**
 * Valida o CPF.
 * @param valor
 * @author Leandro da Silva Vieira
 */
Util.validarCPF = function(valor){
	if(! Util.validarDigito(valor, Mascara.CPF.mascara, 2, 11)){
		Mensagem.exibirManual("O número do CPF é inválido.");
		return false;
	}

	return true;
};

// **********************************************************************************************************************

/**
 * Valida o PIS/PASEP.
 * @param valor
 * @author Leandro da Silva Vieira
 */
Util.validarPIS_PASEP = function(valor){
	if(! Util.validarDigito(valor, Mascara.PIS_PASEP.mascara, 1, 9)){
		Mensagem.exibirManual("O número do PIS/PASEP é inválido.");
		return false;
	}

	return true;
};

// **********************************************************************************************************************

/**
 * Valida a placa.
 * @param valor
 * @author Leandro da Silva Vieira
 */
Util.validarPlaca = function(valor){
	if(valor == null || valor.length == 0) {
		return false;
	}

	var dadosPlaca = valor.split("-");
	
	// Se a primeira parte tem dígito "OU"
	// Se a segunda parte tem letra
	if(Util.temDigito(dadosPlaca[0]) || Util.temLetra(dadosPlaca[1])){
		Mensagem.exibirManual("O número da placa é inválido.");
	   return false;
	}

	return true;
};

// *************************************************************************************************************************

/**
 * Valida dígitos.
 * @param value String
 * @param value mask
 * @param qtdeDig int
 * @param pesoMaximo int
 * @return boolean
 */
Util.validarDigito = function(valor, mask, qtdeDig, pesoMaximo) {
	if(valor == null || valor.length == 0) {
		return false;
	}
	
	if(valor.length != mask.length) {
		return false;
	}

	valor = Util.removerCaracteres(valor);
	if(parseInt(valor, 10) == 0) {
		return false;
	}
	
	var corpo = valor.substring(0, valor.length - qtdeDig);
	
	return Util.calcDigitoMod11(corpo, qtdeDig, pesoMaximo) == valor;
};

// *************************************************************************************************************************

/**
 * Gera o(s) dígito(s) verificador(es).
 * @param value String
 * @param qtdeDig int
 * @param pesoMaximo int
 * @return String
 */
Util.calcDigitoMod11 = function(value, qtdeDig, pesoMaximo) {
	for(var r = 1; r <= qtdeDig; r++) {
		var soma = 0;
		var mult = 2;
		
		for(var a = value.length; a > 0; a--) {
			soma += (mult * parseInt(value.substring(a - 1, a), 10));
			mult++;
			
			if(mult > pesoMaximo) {
				mult = 2;
			}
		}
		
		soma = (soma * 10) % 11;
		value += (soma == 10 ? "0" : soma);	
	}
	
	return value;
};

// *************************************************************************************************************************

/**
 * Retorna o campo.
 * @param nomeCampo
 * @author Leandro da Silva Vieira
 */
Util.get = function(nomeCampo){
	return document.getElementById(nomeCampo);
};

// **********************************************************************************************************************

/**
 * Retorna o valor do campo.
 * @param nomeCampo
 * @author Leandro da Silva Vieira
 */
Util.getValor = function(nomeCampo){
	return Util.get(nomeCampo).value;
};

// **********************************************************************************************************************

/**
 * Seta o valor no campo.
 * @param nomeCampo
 * @param valor
 * @author Leandro da Silva Vieira
 */
Util.set = function(nomeCampo, valor){
	var campo = Util.get(nomeCampo);
	if(campo.value != null){
		campo.value = valor;
	}
	else {
		campo.innerHTML = valor;
	}
};

// **********************************************************************************************************************

/**
 * Retorna os dados do tamanho da página.
 * @author Leandro da Silva Vieira
 */
Util.getPageSize = function() {
	var xScroll, yScroll;
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = window.innerWidth + window.scrollMaxX;
		yScroll = window.innerHeight + window.scrollMaxY;
	}
	// all but Explorer Mac
	else if (document.body.scrollHeight > document.body.offsetHeight){
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	}
	// Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
	else { 
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	var windowWidth = null;
	var windowHeight = null;
	
	// all except Explorer
	if (self.innerHeight) {	
		if(document.documentElement.clientWidth){
			windowWidth = document.documentElement.clientWidth; 
		}
		else {
			windowWidth = self.innerWidth;
		}
		windowHeight = self.innerHeight;
	}
	// Explorer 6 Strict Mode
	else if (document.documentElement && document.documentElement.clientHeight) { 
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	}
	// other Explorers
	else if (document.body) { 
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}	
	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}
	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = xScroll;		
	} else {
		pageWidth = windowWidth;
	}
	
	return new Array(pageWidth,pageHeight,windowWidth,windowHeight);
};

/**
 * Retorna os dados do posicionamento da barra de rolagem.
 * @author Leandro da Silva Vieira
 */
Util.getPageScroll = function() {
	var xScroll= null;
	var yScroll = null;
	
	if(self.pageYOffset) {
		yScroll = self.pageYOffset;
		xScroll = self.pageXOffset;
	}
	// IE 6
	else if (document.documentElement && document.documentElement.scrollTop) {
		yScroll = document.documentElement.scrollTop;
		xScroll = document.documentElement.scrollLeft;
	}
	// Todos os IE
	else if (document.body) {
		yScroll = document.body.scrollTop;
		xScroll = document.body.scrollLeft;	
	}
	
	return new Array(xScroll,yScroll);
};