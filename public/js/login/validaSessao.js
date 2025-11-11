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

        } else {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '../../views/login/index.html';
        }
    })
    .catch(error => {
        console.error('Erro ao validar sessão:', error);
        window.location.href = '../../views/login/index.html';
    });

    const botaoLogoff = document.getElementById('botao-logoff');
    if (botaoLogoff) {
        botaoLogoff.addEventListener('click', function(e) {
            e.preventDefault();

            fetch('../../php/handlers/login/logoff.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                window.location.href = '../../views/login/index.html';
            })
            .catch(error => {
                console.error('Erro ao fazer logoff:', error);
                window.location.href = '../../views/login/index.html';
            });
        });
    }

});