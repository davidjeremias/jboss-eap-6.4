var EDITOR = function(){};
	
/**
 * Aplica o maxlength ao editor
 * @param editor Editor
 * @param maxLength Tamanho máximo
 */
EDITOR.aplicarMaxLength = function(editor, maxLength, exibirContagem) {
	editor.maxLength = maxLength;

	
	if (!editor.config.maxLength) {
		editor.config.maxLength = 0;
	}
	// Função que retorna a quantidade de caracteres do texto (texto plano, sem formatação html).
	editor.fnGetQtdeChar = function() {
		return editor.document.getBody().getText().replace("\n", "").length;
	};
	// Função que monta o texto para ser exibido
	var fnMontarTexto = function(qtdeChar, limiteChar) {
		return (limiteChar > 0 ? limiteChar - qtdeChar : qtdeChar);
	};

	// Cria o objeto para ser exibido
	var span = $("<span/>");;
	span.css("float", "right");
	span.css("margin-right", "10px");
	
	var fnDoCharacterCount = function(evt) {
		// Se o elemento já foi criado
		if (span != null) {
			setTimeout(function() {
				// Se tiver um limite
				if(editor.maxLength > 0){
					// Se passou do limite de caracteres
					if (editor.fnGetQtdeChar() > editor.maxLength) {
						
						span.css('color', 'red');
						// Desfaz a última operação (volta ao último snapshot)
						editor.execCommand('undo');
					}
					// Se é uma quantidade válida
					else {
						span.css('color', 'black');
						// Salva o estado atual válido 
						editor.fire('saveSnapshot');
						// Se atingir o limite
						if (editor.fnGetQtdeChar() == editor.maxLength) {
							span.css('color', 'red');
						}
					}
				}
				// Atualiza o texto com a contagem no rodapé
				span.html(fnMontarTexto(editor.fnGetQtdeChar(), editor.maxLength));
				
			}, 100);
		}
	};

	// Se for para exibir a contagem
	if(exibirContagem){
		// Escreve as configurações na barra de status do componente
		span.html(fnMontarTexto(editor.fnGetQtdeChar(), editor.maxLength));
		// Adiciona ao rodapé do componente
		$(".cke_bottom").append(span);
	}
	
	editor.on('key', fnDoCharacterCount);
	editor.on('paste', fnDoCharacterCount);
};
