<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    header('Content-Type: application/json; charset=utf-8');

    $retorno = [
        'status'    => 'nok',
        'mensagem'  => 'Sessão inválida ou expirada. Faça login novamente.',
        'admin_nome' => null
    ];


    if (isset($_SESSION['ADMINISTRADOR']) && !empty($_SESSION['ADMINISTRADOR'])) {
        
        $admin_data = $_SESSION['ADMINISTRADOR'];
        
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Sessão ativa.',
            
            'admin_nome' => $admin_data['nome'] ?? 'Admin' 
        ];
    }


    echo json_encode($retorno);

?>