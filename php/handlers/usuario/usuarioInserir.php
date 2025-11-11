<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

include_once('../../includes/conexao.php');

$retorno = [
    'status' => 'nok',
    'mensagem' => 'Ocorreu um erro inesperado.',
    'data' => []
];

if (!isset($conexao) || $conexao === null) {
    $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
    echo json_encode($retorno);
    exit;
}

$nome_completo = isset($_POST['nome_completo']) ? trim($_POST['nome_completo']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$senha = isset($_POST['senha']) ? $_POST['senha'] : '';
$telefone = isset($_POST['telefone']) ? trim($_POST['telefone']) : null;
$tipo_perfil = isset($_POST['tipo_perfil']) ? $_POST['tipo_perfil'] : '';

if (empty($nome_completo) || empty($email) || empty($senha) || empty($tipo_perfil)) {
    $retorno['mensagem'] = 'Todos os campos são obrigatórios: nome, email, senha e tipo de perfil.';
    echo json_encode($retorno);
    exit;
}
if ($tipo_perfil !== 'Dono de Espaço' && $tipo_perfil !== 'Jardineiro') {
    $retorno['mensagem'] = 'Tipo de perfil inválido. Use "Dono de Espaço" ou "Jardineiro".';
    echo json_encode($retorno);
    exit;
}

try {
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    $data_cadastro = date('Y-m-d H:i:s');

    $stmt = $conexao->prepare("INSERT INTO USUARIO (nome_completo, email, senha, telefone, data_cadastro, tipo_perfil) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $nome_completo, $email, $senha_hash, $telefone, $data_cadastro, $tipo_perfil);
    
    if ($stmt->execute()) {
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Usuário cadastrado com sucesso!',
            'data'      => ['id' => $stmt->insert_id]
        ];
    } else {
        $retorno['mensagem'] = 'Não foi possível cadastrar o usuário: ' . $stmt->error;
    }
    $stmt->close();

} catch (mysqli_sql_exception $e) {
    if ($e->getCode() === 1062) {
        $retorno['mensagem'] = 'Erro: O email informado já está cadastrado.';
    } else {
        $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    }
    error_log("Erro em usuarioInserir.php: " . $e->getMessage());
} catch (Throwable $e) {
    $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    error_log("Erro em usuarioInserir.php: " . $e->getMessage());
}

$conexao->close();
echo json_encode($retorno);
?>