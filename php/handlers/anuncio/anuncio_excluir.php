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

$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
if(empty($id)){
    $retorno['mensagem'] = 'ID do anúncio não informado.';
    echo json_encode($retorno);
    exit;
}

try {
    $stmt = $conexao->prepare("DELETE FROM ANUNCIO WHERE id_anuncio = ?");
    $stmt->bind_param("i", $id);
    
    if($stmt->execute()){
        if($stmt->affected_rows > 0){
            $retorno = [
                'status' => 'ok',
                'mensagem' => 'Registro excluído com sucesso!',
                'data' => []
            ];
        } else {
            $retorno['mensagem'] = 'Registro não encontrado ou já removido.';
        }
    } else {
        $retorno['mensagem'] = 'Erro ao executar a exclusão.';
    }

    $stmt->close();
    $conexao->close();
    echo json_encode($retorno);

} catch(Throwable $e){
    error_log('Anuncio EXCLUIR error: ' . $e->getMessage());
    $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    echo json_encode($retorno);
    exit;
}
?>