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

$titulo = isset($_POST['titulo']) ? trim($_POST['titulo']) : '';
$descricao = isset($_POST['descricao']) ? trim($_POST['descricao']) : '';
$preco = isset($_POST['preco']) ? (float)$_POST['preco'] : 0.0;
$categoria = isset($_POST['categoria']) ? $_POST['categoria'] : '';

if (empty($titulo) || empty($descricao) || empty($categoria)) {
    $retorno['mensagem'] = 'Campos obrigatórios: Título, Descrição, Categoria.';
    echo json_encode($retorno);
    exit;
}

$tipo = ($categoria === 'venda_plantas') ? 'Venda de Semente' : 'Aluguel de Ferramenta';

try {
    $stmt = $conexao->prepare("UPDATE ANUNCIO SET titulo = ?, descricao = ?, tipo = ?, preco = ? WHERE id_anuncio = ?");
    $stmt->bind_param("sssdi", $titulo, $descricao, $tipo, $preco, $id);
    
    if($stmt->execute()){
        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Registro alterado com sucesso.',
                'data'      => []
            ];
        } else {
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Nenhuma alteração foi feita (dados iguais).',
                'data'      => []
            ];
        }
    }else{
        $retorno['mensagem'] = 'Falha ao alterar o registro: ' . $stmt->error;
    }
    $stmt->close();

} catch (Throwable $e) {
    error_log("Erro em anuncio_alterar.php: " . $e->getMessage());
    $retorno['mensagem'] = "ERRO: " . $e->getMessage();
}

$conexao->close();
echo json_encode($retorno);
?>