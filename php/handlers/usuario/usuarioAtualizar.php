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

$id_usuario = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
if(empty($id_usuario)){
    $retorno['mensagem'] = 'ID do usuário não informado.';
    echo json_encode($retorno);
    exit;
}

$nome_completo = isset($_POST['nome_completo']) ? trim($_POST['nome_completo']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telefone = isset($_POST['telefone']) ? trim($_POST['telefone']) : null;
$tipo_perfil = isset($_POST['tipo_perfil']) ? $_POST['tipo_perfil'] : '';
$senha = isset($_POST['senha']) ? $_POST['senha'] : '';

if (empty($nome_completo) || empty($email) || empty($tipo_perfil)) {
    $retorno['mensagem'] = 'Nome, email e tipo de perfil são obrigatórios.';
    echo json_encode($retorno);
    exit;
}

try {
    $params = [];
    $types = "";
    
    if (!empty($senha)) {
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
        $query = "UPDATE USUARIO SET nome_completo = ?, email = ?, telefone = ?, tipo_perfil = ?, senha = ? WHERE id_usuario = ?";
        $types = "sssssi";
        $params = [$nome_completo, $email, $telefone, $tipo_perfil, $senha_hash, $id_usuario];
    } else {

        $query = "UPDATE USUARIO SET nome_completo = ?, email = ?, telefone = ?, tipo_perfil = ? WHERE id_usuario = ?";
        $types = "ssssi";
        $params = [$nome_completo, $email, $telefone, $tipo_perfil, $id_usuario];
    }

    $stmt = $conexao->prepare($query);
    $stmt->bind_param($types, ...$params);
    
    if($stmt->execute()){
        if($stmt->affected_rows > 0){
            $retorno['status'] = 'ok';
            $retorno['mensagem'] = 'Usuário alterado com sucesso.';
        } else {
            $retorno['status'] = 'nok';
            $retorno['mensagem'] = 'Nenhuma alteração foi feita (dados iguais).';
        }
    } else {
         $retorno['mensagem'] = 'Erro ao executar a atualização: ' . $stmt->error;
    }
    $stmt->close();

} catch (mysqli_sql_exception $e) {
    if ($e->getCode() === 1062) {
        $retorno['mensagem'] = 'Erro: O email informado já está cadastrado por outro usuário.';
    } else {
        $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    }
    error_log("Erro em usuarioAtualizar.php: " . $e->getMessage());
} catch (Throwable $e) {
    $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    error_log("Erro em usuarioAtualizar.php: " . $e->getMessage());
}

$conexao->close();
echo json_encode($retorno);
?>