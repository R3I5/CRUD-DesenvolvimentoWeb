<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

include_once('../../includes/conexao.php');

$retorno = [
    'status'    => 'nok',
    'mensagem'  => 'Erro desconhecido',
    'data'      => []
];

if(!isset($conexao) || $conexao === null){
    $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
    echo json_encode($retorno);
    exit;
}

$usuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
$senha = isset($_POST['senha']) ? trim($_POST['senha']) : '';

if(empty($usuario) || empty($senha)){
    $retorno['mensagem'] = 'Parâmetros inválidos.';
    echo json_encode($retorno);
    exit;
}

try{
    $stmt = $conexao->prepare("SELECT * FROM ADMINISTRADOR WHERE usuario = ? AND senha = ?");
    $stmt->bind_param("ss", $usuario, $senha);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if($resultado && $resultado->num_rows > 0){
        while($linha = $resultado->fetch_assoc()){
            $tabela[] = $linha;
        }

        if(session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }
        $_SESSION['ADMINISTRADOR'] = $tabela[0];

        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Sucesso, consulta efetuada.',
            'data'      => $tabela
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não há registros',
            'data'      => []
        ];
    }

    if(isset($stmt) && $stmt instanceof mysqli_stmt){
        $stmt->close();
    }
    $conexao->close();

    echo json_encode($retorno);
}catch(Throwable $e){
    error_log('Login handler error: ' . $e->getMessage());
    $retorno['mensagem'] = 'Erro na execução. Consulte o administrador.';
    echo json_encode($retorno);
    exit;
}