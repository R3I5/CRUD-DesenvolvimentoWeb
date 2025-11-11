document.addEventListener("DOMContentLoaded", () => {
    const url = new URLSearchParams(window.location.search);
    const idEspaco = url.get("id");
    if (!idEspaco) {
        alert("ID do espaço não informado.");
        window.location.href = "index.html";
        return;
    }

    const formEspaco = document.getElementById("formEspaco");

    buscar(idEspaco, formEspaco);

    formEspaco.addEventListener("submit", (e) => {
        e.preventDefault();
        alterar(idEspaco, formEspaco);
    });

    const btnCancelar = document.getElementById("cancelar");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});

async function buscar(id, form) {
    try {
        const retorno = await fetch(`../../php/handlers/espaco/espacoGET.php?id=${id}`);
        const resposta = await retorno.json();

        if (resposta.status === "ok" && resposta.data.length) {
            const espaco = resposta.data[0];
            
            form.nome.value = espaco.nome || "";
            form.descricao.value = espaco.descricao || "";
            form.endereco.value = espaco.endereco || "";
            form.cidade.value = espaco.cidade || "";
            form.estado.value = espaco.estado || "";
            form.cep.value = espaco.cep || "";
            form.disponibilidade.checked = (espaco.disponibilidade == 1);
        } else {
            alert("Espaço não encontrado.");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Ocorreu um erro ao buscar os dados.");
    }
}

async function alterar(id, form) {
    const fd = new FormData(form);

    if (!fd.has("disponibilidade")) {
        fd.append("disponibilidade", "0");
    }

    try {
        const retorno = await fetch(`../../php/handlers/espaco/atualizarEspaco.php?id=${id}`, {
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