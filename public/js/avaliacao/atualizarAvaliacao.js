document.addEventListener("DOMContentLoaded", () => {
    const url = new URLSearchParams(window.location.search);
    const idAvaliacao = url.get("id");
    if (!idAvaliacao) {
        alert("ID da avaliação não informado.");
        window.location.href = "index.html";
        return;
    }

    const formAvaliacao = document.getElementById("formAvaliacao");
    if (!formAvaliacao) {
        console.error("O formulário #formAvaliacao não foi encontrado.");
        return;
    }

    buscar(idAvaliacao, formAvaliacao);

    formAvaliacao.addEventListener("submit", (e) => {
        e.preventDefault();
        alterar(idAvaliacao, formAvaliacao);
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
        const retorno = await fetch(`../../php/handlers/avaliacao/avaliacaoGET.php?id=${id}`);
        const resposta = await retorno.json();

        if (resposta.status === "ok" && resposta.data.length) {
            const avaliacao = resposta.data[0];
            
            form.elements.namedItem("id_avaliador").value = avaliacao.id_avaliador || "";
            form.elements.namedItem("id_avaliado").value = avaliacao.id_avaliado || "";
            form.elements.namedItem("id_parceria").value = avaliacao.id_parceria || "";
            form.elements.namedItem("nota").value = avaliacao.nota || "";
            form.elements.namedItem("comentario").value = avaliacao.comentario || "";
            // form.elements.namedItem("nova_coluna").value = avaliacao.nova_coluna || ""; // Exemplo para nova coluna

            if (avaliacao.data_avaliacao) {
                const date = new Date(avaliacao.data_avaliacao);
                form.elements.namedItem("data_avaliacao").value = date.toISOString().substring(0, 10);
            }
        } else {
            alert("Avaliação não encontrada.");
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
        const retorno = await fetch(`../../php/handlers/avaliacao/avaliacaoAlterar.php?id=${id}`, {
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