<?php
$servidor = "localhost";
$usuario  = "root";
$senha    = "240723";
$nome_banco = "Crud";
$porta = 3306;

$conexao = null;
try{
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexao = new mysqli($servidor, $usuario, $senha, $nome_banco, $porta);
    $conexao->set_charset('utf8mb4');
}catch (Throwable $e){
    error_log('DB connection error: ' . $e->getMessage());
    $conexao = null;
}