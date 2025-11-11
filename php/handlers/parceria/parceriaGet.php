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

if (!isset($conexao) || $conexao === null) {
    $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
    echo json_encode($retorno);
    exit;
}

try {
    $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

    if (!empty($id)) {
        $stmt = $conexao->prepare("SELECT id_parceria, data_inicio, data_fim, status, id_jardineiro, id_espaco FROM PARCERIA WHERE id_parceria = ?");
        $stmt->bind_param("i", $id);
    } else {
        $stmt = $conexao->prepare("SELECT id_parceria, data_inicio, data_fim, status, id_jardineiro, id_espaco FROM PARCERIA ORDER BY id_parceria DESC");
    }

    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if ($resultado && $resultado->num_rows > 0) {
        while ($linha = $resultado->fetch_assoc()) {
            $tabela[] = $linha;
        }
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Consulta realizada com sucesso.',
            'data'      => $tabela
        ];
    } else {
        $retorno['mensagem'] = 'Nenhum registro encontrado.';
    }

    $stmt->close();
    $conexao->close();

} catch (Throwable $e) {
    error_log("Erro em parceriaGet.php: " . $e->getMessage());
    $retorno['mensagem'] = 'Erro: ' . $e->getMessage();
}

echo json_encode($retorno);
?>