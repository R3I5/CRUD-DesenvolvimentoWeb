<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

include_once('../../includes/conexao.php');

$retorno = [
    'status'   => 'nok',
    'mensagem' => 'Erro desconhecido',
    'data'     => []
];

if (!isset($conexao) || $conexao === null) {
    $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
    echo json_encode($retorno);
    exit;
}

$id_parceria = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
if(empty($id_parceria)){
    $retorno['mensagem'] = 'ID da parceria não informado.';
    echo json_encode($retorno);
    exit;
}

$id_jardineiro = isset($_POST['id_jardineiro']) ? (int)$_POST['id_jardineiro'] : 0;
$id_espaco     = isset($_POST['id_espaco']) ? (int)$_POST['id_espaco'] : 0;
$data_inicio   = isset($_POST['data_inicio']) ? trim($_POST['data_inicio']) : '';
$status        = isset($_POST['status']) ? trim($_POST['status']) : '';
$data_fim      = (empty($_POST['data_fim']) ? null : trim($_POST['data_fim']));

$statuses_validos = ['Ativa', 'Pendente', 'Encerrada'];
if (empty($id_jardineiro) || empty($id_espaco) || empty($data_inicio) || empty($status)) {
    $retorno['mensagem'] = 'Campos obrigatórios: ID Jardineiro, ID Espaço, Data Início, Status.';
    echo json_encode($retorno);
    exit;
}
if (!in_array($status, $statuses_validos)) {
    $retorno['mensagem'] = 'Status inválido. Use "Ativa", "Pendente" ou "Encerrada".';
    echo json_encode($retorno);
    exit;
}

try {
    $stmt = $conexao->prepare("
        UPDATE PARCERIA
        SET id_jardineiro = ?, id_espaco = ?, status = ?, data_inicio = ?, data_fim = ?
        WHERE id_parceria = ?
    ");
    $stmt->bind_param("iisssi", $id_jardineiro, $id_espaco, $status, $data_inicio, $data_fim, $id_parceria);
    
    if($stmt->execute()){
        if ($stmt->affected_rows > 0) {
            $retorno = [
                'status'   => 'ok',
                'mensagem' => 'Parceria atualizada com sucesso!',
                'data'     => []
            ];
        } else {
            $retorno = [
                'status'   => 'nok',
                'mensagem' => 'Nenhuma alteração foi feita (dados iguais).',
                'data'     => []
            ];
        }
    } else {
        $retorno['mensagem'] = 'Falha ao alterar o registro: ' . $stmt->error;
    }

    $stmt->close();

} catch (mysqli_sql_exception $e) {
    $retorno['mensagem'] = "ERRO: " . $e->getMessage();
    error_log("Erro em parceriaAlterar.php: " . $e->getMessage());
} catch (Throwable $e) {
    $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    error_log("Erro em parceriaAlterar.php: " . $e->getMessage());
}

$conexao->close();
echo json_encode($retorno);
?>