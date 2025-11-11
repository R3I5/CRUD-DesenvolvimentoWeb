<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

include_once('../../includes/conexao.php');

$retorno = [
    'status' => 'nok',
    'mensagem' => 'Erro desconhecido',
    'data' => []
];

if (!isset($conexao) || $conexao === null) {
    $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
    echo json_encode($retorno);
    exit;
}

$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
if (empty($id)) {
    $retorno['mensagem'] = 'ID do espaço não informado.';
    echo json_encode($retorno);
    exit;
}

$titulo = isset($_POST['nome']) ? trim($_POST['nome']) : '';
$descricao = isset($_POST['descricao']) ? trim($_POST['descricao']) : '';
$endereco = isset($_POST['endereco']) ? trim($_POST['endereco']) : '';
$cidade = isset($_POST['cidade']) ? trim($_POST['cidade']) : '';
$estado = isset($_POST['estado']) ? trim($_POST['estado']) : '';
$cep = isset($_POST['cep']) ? trim($_POST['cep']) : null;
$disponibilidade = isset($_POST['disponibilidade']) ? (int)$_POST['disponibilidade'] : 0;

if (empty($titulo) || empty($endereco) || empty($cidade) || empty($estado)) {
    $retorno['mensagem'] = 'Campos obrigatórios: Nome, Endereço, Cidade, Estado.';
    echo json_encode($retorno);
    exit;
}

try {
    $stmt = $conexao->prepare(
        "UPDATE ESPACO SET 
            titulo = ?, 
            descricao = ?, 
            endereco = ?, 
            cidade = ?, 
            estado = ?, 
            cep = ?, 
            disponibilidade = ? 
            WHERE id_espaco = ?"
    );

    $stmt->bind_param(
        "ssssssii", 
        $titulo, $descricao, $endereco, $cidade, $estado, $cep, $disponibilidade, $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $retorno = [
                'status' => 'ok',
                'mensagem' => 'Espaço atualizado com sucesso!',
                'data' => []
            ];
        } else {
            $retorno = [
                'status' => 'nok',
                'mensagem' => 'Nenhuma alteração foi realizada.',
                'data' => []
            ];
        }
    } else {
        $retorno['mensagem'] = 'Erro ao executar a atualização: ' . $stmt->error;
    }

    $stmt->close();
    $conexao->close();
    echo json_encode($retorno);

} catch (Throwable $e) {
    error_log('Erro ao alterar espaço: ' . $e->getMessage());
    $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    echo json_encode($retorno);
    exit;
}
?>