<!DOCTYPE HTML>
<html>
<head>
</head>
<body>
<div style="display:none">
<?php
mail("marianocarrazana@gmail.com","GE Sponsor","De:".$_POST["name"]."\nMensaje:".$_POST["message"],"FROM: ".$_POST["email"]); 
?>
</div>
Mensaje Enviado. <a href="about.html">Volver</a>
</body>
</html>