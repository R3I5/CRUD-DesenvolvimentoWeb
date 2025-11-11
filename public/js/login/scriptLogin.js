document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fd = new FormData(formLogin);

        const retorno = await fetch("../../php/handlers/login/login.php", {
            method: "POST",
            credentials: 'same-origin',
            body: fd
        });

        let resposta;
        try {
            resposta = await retorno.json();
        } catch (err) {
            const text = await retorno.text();
            console.error('Resposta inválida do servidor:', text);
            alert('Erro do servidor. Tente novamente mais tarde.');
            return;
        }

        if (resposta && resposta.status == "ok") {
            window.location.href = "../../views/home/index.html";
        } else {
            alert(resposta.mensagem || "Credenciais inválidas.");
        }
    });
});


/*
================================================================================
GUIA COMPLETO: Como Adicionar um Novo Campo ao "ADMINISTRADOR"
================================================================================

Este guia é um pouco diferente. Seus arquivos (login.php, logoff.php)
são para AUTENTICAÇÃO, não um CRUD completo.

Não temos os arquivos "novoAdmin.php" ou "atualizarAdmin.php".

Este guia vai focar em como adicionar um campo (ex: `email`) na sua
tabela `ADMINISTRADOR` e garantir que o `login.php` o salve
corretamente na sessão para ser usado em outras páginas.

O PROCESSO (O Checklist de 4 Passos):
----------------------------------------------------------------
1.  [ BANCO DE DADOS ]  Alterar a tabela MySQL `ADMINISTRADOR`.
2.  [ BACKEND ]  Verificar `login.php` (para o READ/SELECT).
3.  [ BACKEND ]  Modificar `validaSessao.php` (Arquivo Faltando) para ENVIAR o novo dado.
4.  [ FRONTEND ] Modificar `validaSessao.js` para USAR o novo dado.

---
NOTA: Os passos para "Criar" e "Atualizar" um Admin seriam idênticos
aos seus outros guias de CRUD (Exemplo: GUIA_CRUD_ESPACO.js),
mas você precisaria criar os arquivos:
- novoAdmin.html
- novoAdmin.js
- novoAdmin.php
- atualizarAdmin.html
- atualizarAdmin.js
- atualizarAdmin.php
----------------------------------------------------------------


Abaixo está o exemplo de como adicionar um campo `email`:

================================================================================
EXEMPLO: Adicionando um TEXT INPUT (Ex: "Email")
================================================================================

CAMPO: `email`
TIPO HTML: <input type="email">
TIPO MYSQL: VARCHAR(255)

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE ADMINISTRADOR ADD email VARCHAR(255) NULL DEFAULT NULL AFTER senha;

(Depois disso, preencha manualmente o email de seus usuários no banco de dados
para poder testar)


---
2. BACKEND (READ / LOGIN): `login.php`
---
BOAS NOTÍCIAS! Nenhuma alteração é necessária aqui.

POR QUÊ?
1.  Sua query `SELECT * FROM ADMINISTRADOR...` já pega TODAS as colunas,
    incluindo o novo `email`.
2.  Sua linha `$_SESSION['ADMINISTRADOR'] = $tabela[0];` já salva
    A LINHA INTEIRA do admin na sessão.

O campo `email` já está sendo salvo na sessão automaticamente.


---
3. BACKEND (VALIDAÇÃO): `validaSessao.php` (Arquivo Faltando)
---
O seu arquivo `validaSessao.js` chama um arquivo `validaSessao.php`
que não foi fornecido.

Baseado no seu JS, o `validaSessao.php` deve parecer algo assim:

// ARQUIVO: `validaSessao.php` (VERSÃO ANTIGA)
<?php
    session_start();
    if (isset($_SESSION['ADMINISTRADOR'])) {
        // Ele provavelmente pegava só o 'usuario'
        $nome_admin = $_SESSION['ADMINISTRADOR']['usuario'];
        
        echo json_encode([
            'status' => 'ok',
            'admin_nome' => $nome_admin 
        ]);
    } else {
        echo json_encode(['status' => 'nok']);
    }
?>

//
// PARA ENVIAR O NOVO CAMPO `email`, modifique o PHP:
//

// ARQUIVO: `validaSessao.php` (VERSÃO NOVA)
<?php
    session_start();
    if (isset($_SESSION['ADMINISTRADOR'])) {
        
        // Agora pegue os dados da sessão:
        $nome_admin = $_SESSION['ADMINISTRADOR']['usuario'];
        $email_admin = $_SESSION['ADMINISTRADOR']['email']; // <-- NOSSO NOVO CAMPO
        
        echo json_encode([
            'status' => 'ok',
            'admin_nome' => $nome_admin,
            'admin_email' => $email_admin // <-- ENVIE O NOVO CAMPO
        ]);
    } else {
        echo json_encode(['status' => 'nok']);
    }
?>


---
4. FRONTEND (DISPLAY): `validaSessao.js`
---
Agora que o PHP está enviando o `admin_email`, você pode usá-lo
no seu frontend.

// ARQUIVO: `validaSessao.js`
document.addEventListener("DOMContentLoaded", function() {
    
    fetch('../../php/includes/validaSessao.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            
            const spanMensagem = document.getElementById('mensagem-ola');
            
            if (spanMensagem) {
                spanMensagem.innerText = "Olá, " + data.admin_nome;
            }

            // --- ADICIONE ISTO ---
            // Exemplo: Mostrar o email em um novo local
            const spanEmail = document.getElementById('admin-email');
            if (spanEmail) {
                spanEmail.innerText = data.admin_email; // <-- Use o novo campo
            }
            // --- FIM DA ADIÇÃO ---

        } else {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '../../views/login/index.html';
        }
    })
    // ... (resto do arquivo)

*/