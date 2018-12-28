/**
 * Usa o JQuery.
 * @author Leandro da Silva Vieira
 */
(function($) {

	/**
	 * Informa que o campo � do tipo alfa num�rico.
	 * @param maxLength - tamanho m�ximo aceito no campo. N�o � obrigat�rio. Usado para campos textArea.
	 * @author Leandro da Silva Vieira
	 */
	$.fn.campoAlfaNumero = function (maxLength){	
		function onKeyPressEvent(e){
			return AlfaNumero.keypress(e, this, maxLength);
		};

		function onBlur(e){
			AlfaNumero.blur(this, maxLength);
		};
		
		var input = $(this);
		input.bind("keypress", onKeyPressEvent);
		input.bind("blur", onBlur);
	};
	
})(jQuery);

// **********************************************************************************************************************

function AlfaNumero(){}

// **********************************************************************************************************************

/**
 * Trata o onkeypress do campo alfa num�rico.
 * @param e
 * @param obj
 * @param maxLength
 * @author Leandro da Silva Vieira
 */
AlfaNumero.keypress = function(e, obj, maxLength){
	// Se o campo estiver bloqueado
	if(Util.estaBloqueado(obj)){
		return false;
	}
	// Se for alguma tecla associada a mudan�a de campo
	else if(Util.teclaMudarCampo(e) && obj.type != "textarea"){
		Util.proximoCampo(obj);
		return false;
	}
	// Se o tamanho estiver no máximo
	else if(maxLength && obj.value.length >= maxLength){
		return false;
	}
	return true;
};

// **********************************************************************************************************************

/**
 * Trata o onblur do campo alfa num�rico.
 * @param obj
 * @param maxLength
 * @author Leandro da Silva Vieira
 */
AlfaNumero.blur = function(obj, maxLength){
	obj.value = Util.trim(obj.value, maxLength);
};

// **********************************************************************************************************************