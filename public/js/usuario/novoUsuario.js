document.addEventListener("DOMContentLoaded", () => {
    const formUsuario = document.getElementById("formUsuario");
    if (!formUsuario) return;

    formUsuario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fd = new FormData(formUsuario);
        const endpoint = '../../php/handlers/usuario/usuarioInserir.php';

        try {
            const res = await fetch(endpoint, { method: 'POST', body: fd });
            const data = await res.json();
            
            if (data.status === 'ok') {
                alert(data.mensagem || 'Usuário criado com sucesso');
                window.location.href = 'index.html';
            } else {
                alert(data.mensagem || 'Erro ao criar usuário');
            }
        } catch (err) {
            console.error(err);
            alert('Erro na requisição: ' + err.message);
        }
    });
});