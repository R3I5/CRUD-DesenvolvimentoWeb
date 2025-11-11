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

try {
    $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
    
    $sql_cols = "id_anuncio, titulo, descricao, tipo, preco";

    if(!empty($id)){
        $stmt = $conexao->prepare("SELECT $sql_cols FROM ANUNCIO WHERE id_anuncio = ?");
        $stmt->bind_param("i", $id);
    }else{
        $stmt = $conexao->prepare("SELECT $sql_cols FROM ANUNCIO ORDER BY id_anuncio DESC");
    }

    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if($resultado && $resultado->num_rows > 0){
        while($linha = $resultado->fetch_assoc()){
            $tabela[] = $linha;
        }
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Consulta efetuada com sucesso.',
            'data'      => $tabela
        ];
    }else{
        $retorno['mensagem'] = 'Não há registros';
    }

    $stmt->close();
    $conexao->close();
    echo json_encode($retorno);

} catch(Throwable $e){
    error_log('Anuncio GET error: ' . $e->getMessage());
    $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    echo json_encode($retorno);
    exit;
}
?>