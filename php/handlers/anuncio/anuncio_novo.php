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
    $stmt = $conexao->prepare("INSERT INTO ANUNCIO (titulo, descricao, tipo, preco) VALUES (?,?,?,?)");

    $stmt->bind_param("sssd", $titulo, $descricao, $tipo, $preco);
    
    if($stmt->execute()){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Registro inserido com sucesso!',
            'data' => ['id_anuncio' => $conexao->insert_id]
        ];
    } else {
        $retorno['mensagem'] = 'Falha ao inserir o registro: ' . $stmt->error;
    }
    $stmt->close();

} catch (Throwable $e) {
    error_log("Erro em anuncio_novo.php: " . $e->getMessage());
    $retorno['mensagem'] = "ERRO: " . $e->getMessage();
}

$conexao->close();
echo json_encode($retorno);
?>