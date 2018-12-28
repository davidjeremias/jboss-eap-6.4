/**
 * Adiciona uma função de Case insensitive ao jquery.
 */
$.expr[":"].containsNoCase = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});