/**
 * Usa o JQuery.
 * @author Leandro da Silva Vieira
 */
;(function($) {

	/**
	 * Informa que o campo � do tipo num�rico.
	 * @author Leandro da Silva Vieira
	 */
	$.fn.campoNumero = function (){	
		function onKeyPressEvent(e){
			return Numero.keypress(e, this);
		};

		function onBlur(e){
			Numero.blur(this);
		};
		
		function onPaste(e){
			return Numero.paste(this);
		}
		
		var input = $(this);
		input.bind("keypress", onKeyPressEvent);
		input.bind("blur", onBlur);
		input.bind("paste", onPaste);
	};
	
})(jQuery);

// **********************************************************************************************************************

function Numero(){}

// **********************************************************************************************************************

/**
 * Trata o onkeypress do campo n�mero.
 * @param e
 * @param obj
 * @author Leandro da Silva Vieira
 */
Numero.keypress = function(e, obj){
	// Se o campo estiver bloqueado
	if(Util.estaBloqueado(obj)){
		return false;
	}
	// Se for alguma tecla especial
	else if(Util.teclaEspecial(e)){
		// Se for alguma tecla associada a mudan�a de campo
		if(Util.teclaMudarCampo(e)){
			Util.proximoCampo(obj);
			return false;
		}
		return true;
	}
	else{
		// Se for d�gito
		return /\d/.test(String.fromCharCode(Util.recuperarTecla(e)));
	}
};

// **********************************************************************************************************************

/**
 * Trata o onblur do campo n�mero.
 * @param obj
 * @author Leandro da Silva Vieira
 */
Numero.blur = function(obj){
	// Remove tudo que n�o for d�gito
	obj.value = Util.removerCaracteres(obj.value);
};

// **********************************************************************************************************************

/**
 * Trata o onpaste do campo n�mero.
 * @param obj
 * @author Leandro da Silva Vieira
 */
Numero.paste = function(obj){
	// Remove o que n�o for d�gito
	// Cuida da inser��o do texto
	Util.inserirTexto(obj, Util.removerCaracteres(Util.getTextoClipboard()));
	
	return false;
};
	
// **********************************************************************************************************************