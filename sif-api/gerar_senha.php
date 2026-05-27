<?php
$senha_desejada = "123456"; 

$hash = password_hash($senha_desejada, PASSWORD_DEFAULT);

echo "<h1>Sua senha criptografada:</h1>";
echo "<p style='background:#eee; padding:10px; font-family:monospace; font-size:18px;'>" . $hash . "</p>";
echo "<p>Copie o código acima e cole no campo 'password' da tabela 'admins' no seu Banco de Dados.</p>";
?>