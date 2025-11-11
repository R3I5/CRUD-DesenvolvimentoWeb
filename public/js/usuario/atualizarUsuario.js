document.addEventListener("DOMContentLoaded", () => {
    const url = new URLSearchParams(window.location.search);
    const idUsuario = url.get("id");
    if (!idUsuario) {
        alert("ID do usuário não informado.");
        window.location.href = "index.html";
        return;
    }

    const formUsuario = document.getElementById("formUsuario");
    if (!formUsuario) return;

    buscar(idUsuario, formUsuario);

    formUsuario.addEventListener("submit", (e) => {
        e.preventDefault();
        alterar(idUsuario, formUsuario);
    });
});

async function buscar(id, form) {
    try {
        const retorno = await fetch(`../../php/handlers/usuario/usuarioGET.php?id=${id}`);
        const resposta = await retorno.json();

        if (resposta.status === "ok" && resposta.data.length) {
            const usuario = resposta.data[0];
            
            form.elements.namedItem("nome_completo").value = usuario.nome_completo || "";
            form.elements.namedItem("email").value = usuario.email || "";
            form.elements.namedItem("telefone").value = usuario.telefone || "";
            form.elements.namedItem("tipo_perfil").value = usuario.tipo_perfil || "";
            form.elements.namedItem("senha").value = "";

        } else {
            alert("Usuário não encontrado.");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Ocorreu um erro ao buscar os dados.");
    }
}

async function alterar(id, form) {
    const fd = new FormData(form);

    try {
        const retorno = await fetch(`../../php/handlers/usuario/usuarioAtualizar.php?id=${id}`, {
            method: "POST",
            body: fd,
        });

        const resposta = await retorno.json();
        alert(resposta.mensagem);
        
        if (resposta.status === "ok") {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Ocorreu um erro ao salvar as alterações.");
    }
}