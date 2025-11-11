<?php
    ini_set('display_errors', 0);
    error_reporting(E_ALL);
    header("Content-type:application/json;charset:utf-8");

    include_once('../../includes/conexao.php');

    $retorno = [
        'status'    => 'nok',
        'mensagem'  => 'Erro desconhecido.',
        'data'      => []
    ];

    if (!isset($conexao) || $conexao === null) {
        $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
        echo json_encode($retorno);
        exit;
    }
    

    $nota           = isset($_POST['nota']) ? (int)$_POST['nota'] : 0;
    $comentario     = isset($_POST['comentario']) ? trim($_POST['comentario']) : '';
    $data_avaliacao = isset($_POST['data_avaliacao']) ? trim($_POST['data_avaliacao']) : '';
    $id_avaliador   = isset($_POST['id_avaliador']) ? (int)$_POST['id_avaliador'] : 0;
    $id_avaliado    = isset($_POST['id_avaliado']) ? (int)$_POST['id_avaliado'] : 0;
    $id_parceria    = (empty($_POST['id_parceria']) ? null : (int)$_POST['id_parceria']);

    if (empty($nota) || empty($comentario) || empty($data_avaliacao) || empty($id_avaliador) || empty($id_avaliado)) {
        $retorno['mensagem'] = 'Campos obrigatórios: Nota, Comentário, Data, ID Avaliador, ID Avaliado.';
        echo json_encode($retorno);
        exit;
    }

    try {
        $stmt = $conexao->prepare("INSERT INTO AVALIACAO (nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria) VALUES (?,?,?,?,?,?)");
        $stmt->bind_param("issiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria);
        
        if($stmt->execute()){
            $retorno = [
                'status' => 'ok',
                'mensagem' => 'Registro inserido com sucesso!',
                'data' => []
            ];
        } else {
            $retorno['mensagem'] = 'Falha ao inserir o registro: ' . $stmt->error;
        }

        $stmt->close();
        $conexao->close();

    } catch (Throwable $e) {
        $retorno['mensagem'] = "ERRO: " . $e->getMessage();
        error_log("Erro em avaliacaoNovo.php: " . $e->getMessage());
    }

    echo json_encode($retorno);
?>