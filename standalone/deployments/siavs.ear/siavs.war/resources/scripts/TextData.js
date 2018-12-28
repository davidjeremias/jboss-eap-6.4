/**
 * Usa o JQuery.
 * @author Leandro da Silva Vieira
 */
(function($) {

	/**
	 * Informa que o campo é do tipo data.
	 * @param mascara - máscara usada para a data. Padrão é "dd/mm/aaaa".
	 * Aceita "dd" para dia, "mm" para mês e "aaaa" para ano.
	 * @author Leandro da Silva Vieira
	 */
	$.fn.campoData = function(mascara){
		function onKeyPressEvent(e){
//			semaforo=false;
			return Data.keypress(e, this, mascara);
		};
		function onFocus(e){
		//	semaforo=false;
		};		
		function onBlur(e){
		//	if(semaforo==false)
			Data.blur(this, mascara);
		//	semaforo=true;
		};
		
		var input = $(this);
		input.bind("keypress", onKeyPressEvent);
		input.bind("blur", onBlur);
	};
	
})(jQuery);

// **********************************************************************************************************************

function Data(){}

Data.MASCARA_PADRAO = "dd/mm/aaaa";

// **********************************************************************************************************************

/**
 * Trata o onkeypress do campo data.
 * @param e
 * @param obj
 * @param mascara
 * @author Leandro da Silva Vieira
 */
Data.keypress = function(e, obj, mascara) {
	// Se o campo estiver bloqueado
	if(Util.estaBloqueado(obj)){
		return false;
	}
	// Se for alguma tecla especial
	else if(Util.teclaEspecial(e)){
		// Se for alguma tecla associada a mudança de campo
		if(Util.teclaMudarCampo(e)){
			Util.proximoCampo(obj);
			return false;
		}
		return true;
	}
	else{
		// Se for dígito
		if(/\d/.test(String.fromCharCode(Util.recuperarTecla(e)))){
			mascara = mascara || Data.MASCARA_PADRAO;
			// Formata o campo
			Util.formatarCampo(obj, Util.recuperarTecla(e), mascara.replace(/\w/g, '0'));
		}
		
		return false;
	}
};

// **********************************************************************************************************************

/**
 * Trata o onblur do campo data.
 * @param obj
 * @param mascara
 * @author Leandro da Silva Vieira
 */
Data.blur = function(obj, mascara){

	//if (semaforo==false){
	mascara = mascara || Data.MASCARA_PADRAO;

	obj.value = Util.formatarValor(obj.value, mascara.replace(/\w/g, '0'));
	if(obj.value == ""){
		return;
	}
		
	// Se não passar pela validação de data
	if(! Data.validaData(obj, mascara)){
		
	//	if(Util.isIE()){
		//	obj.focus();
	//	}
	//	else{
		//	globalvar = obj;
	//		setTimeout("globalvar.focus()",1);
	//	}
		//alert('focus');
//		obj.focus();
    	Mensagem.okUsuario=fnFoco(obj);
	}
//	};
	
};

// **********************************************************************************************************************

/**
 * Formata um objeto Date de acordo com a máscara.
 * @param data - objeto Date
 * @param mascara
 * @author Leandro da Silva Vieira
 */
Data.formatarData = function(data, mascara){
	var dataFormatada = mascara;
	
	dataFormatada.replace("dd", Util.formatarTamanhoCampo(data.getDate(), 2, true));
	dataFormatada.replace("mm", Util.formatarTamanhoCampo(data.getMonth(), 2, true));
	dataFormatada.replace("aaaa", Util.formatarTamanhoCampo(data.getYear(), 4, true));

	return dataFormatada;
};

// **********************************************************************************************************************

/**
 * Retorna um objeto Date com os dados do campo.
 * @param obj
 * @param mascara
 * @author Leandro da Silva Vieira
 */
Data.getData = function(obj, mascara){
	var dadosData = Data.getDadosData(obj, mascara);
	if(dadosData){
		return new Date(dadosData.ano, dadosData.mes - 1, dadosData.dia);
	}
	return null;
};

// **********************************************************************************************************************

/**
 * Retorna um objeto com os dados do campo data.
 * @param obj
 * @param mascara
 * @author Leandro da Silva Vieira
 */
Data.getDadosData = function(obj, mascara){
	// Se o campo não está totalmente preenchido
	if(mascara.length != obj.value.length){
		Mensagem.exibirManual("Informe a data no padrão " + mascara + ".");
		return null;
	}

	var dia = 1;
	var mes = 1;
	var ano = 1000;
	var char;
	
	for(var r = 0; r < mascara.length; r++){
		char = mascara.substring(r, r+1);
		
		if(char == "d"){
			dia = parseInt(obj.value.substring(r, r+2), 10);
			r += 2;
		}
		else if(char == "m"){
			mes = parseInt(obj.value.substring(r, r+2), 10);
			r += 2;
		}
		else if(char == "a"){
			ano = parseInt(obj.value.substring(r, r+4), 10);
			r += 4;
		}
	}

	return {dia:dia,mes:mes,ano:ano};
};
	
// **********************************************************************************************************************
		
/**
 * Valida o objeto.
 * @param obj
 * @param mascara
 * @author Leandro da Silva Vieira
 */
Data.validaData = function(obj, mascara){	
	if(obj.value == ""){
		return true;
	}

	var r = -1;
	
	var dadosData = Data.getDadosData(obj, mascara);
	if(dadosData == null){
		// Coloca o cursor no final do campo
		Util.faixaCursor(obj, obj.value.length);
		return false;
	}
	
	r = mascara.indexOf("d");
    if(r > -1 && !Data.validarDia(dadosData.dia, dadosData.mes, dadosData.ano)){
 		// Seleciona o dia
 		Util.faixaCursor(obj, r, r + 2);
  		return false;
    }
    r = mascara.indexOf("m");
 	if(r > -1 && !Data.validarMes(dadosData.mes)){
		// Seleciona o mês
  		Util.faixaCursor(obj, r, r + 2);
  		return false;
 	}
 	r = mascara.indexOf("a");
 	if(r > -1 && !Data.validarAno(dadosData.ano)){
		// Seleciona o ano
		Util.faixaCursor(obj, r, r + 4);
  		return false;
 	}
 	
 	return true;
};

// **********************************************************************************************************************


/**
 * Valida o dia.
 * @param dia
 * @param mes
 * @param ano
 */
Data.validarDia = function(dia, mes, ano){
	var retorno = true;
	var msg = "O dia informado deve estar entre 01 e ";
	
	// Dia fora do padrão
    if(dia == 0 || dia > 31){
    	msg += "31";
  		retorno = false;
    }
    // Em fevereiro
 	else if(mes == 2){
 		// dia maior que 29 ou igual a 29 sem ser ano bissesto
 		if(dia > 29 || (dia == 29 && (ano % 4) != 0)) {
			retorno = false;
			msg += ((ano % 4) == 0 ? "29" : "28");
		}
 	}
 	// Meses que só possuem 30 dias
    else if((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia > 30){
    	retorno = false;
    	msg += "30";
    }
    
    if(! retorno){
		Mensagem.exibirManual(msg + ".");
    }
    
    return retorno;
};

//obj.focus();
// **********************************************************************************************************************
	
/**
 * Valida o mês.
 * @param mes
 */
Data.validarMes = function(mes){
 	if(mes == 0 || mes > 12){
  		Mensagem.exibirManual("O mês informado deve estar entre 01 e 12.");
  		return false;
 	}
 	return true;
};

// **********************************************************************************************************************

/**
 * Valida o ano.
 * @param ano
 */
Data.validarAno = function(ano){
 	if(ano < 2008 || ano > 2020){
  		Mensagem.exibirManual("O ano informado deve estar entre 2008 e 2020.");
  		return false;
 	}
 	return true;	
};

// **********************************************************************************************************************