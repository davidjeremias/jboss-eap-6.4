<html style="height: 100%;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="resources/css/bootstrap.min.css">
<script src="resources/scripts/jquery-1.9.1.js"></script>
<script src="resources/scripts//bootstrap.min.js"></script>
<script src="resources/js/keycloak.js" type="text/javascript"></script>

<script type="text/javascript">
	var kc = Keycloak('http://localhost:8080/resources/keycloak.json');

	var loadData = function() {
		console.log(kc);
		var data = new Date()
		data.setTime(data.getTime() + 600000);
		
		var realm = kc.tokenParsed.preferred_username;
		for(var i = 0; i < kc.realmAccess.roles.length; i++){
		realm +="-"+kc.realmAccess.roles[i];
		}
		console.log(realm);
		document.cookie = "keycloak=" + realm + "; expires=" + data.toUTCString()+ "; path=/";
	};

	var reloadData = function() {

		kc.updateToken(10).success(loadData).error(function() {
			console.log('Failed to load data.  User is logged out.');
		});
	}

	kc.init({
		onLoad : 'login-required'
	}).success(reloadData).error(
			function(errorData) {
				console.log("Failed to load data. Error: "
						+ JSON.stringify(errorData));
			});
</script>

</head>
<body style="margin: 0; height: 100%;">
	<iframe id="home" name="home" src="pages/home.jsf"
		style="width: 100%; height: 100%; border: none;"></iframe>
</body>
</html>

