document.addEventListener("DOMContentLoaded", () => {
    const url = new URLSearchParams(window.location.search);
    const idAnuncio = url.get("id");
    if (!idAnuncio) {
        alert("ID do anúncio não informado.");
        window.location.href = "index.html";
        return;
    }

    const formAnuncio = document.getElementById("formAnuncio");
    if (!formAnuncio) return;

    buscar(idAnuncio, formAnuncio);

    formAnuncio.addEventListener("submit", (e) => {
        e.preventDefault();
        alterar(idAnuncio, formAnuncio);
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
        const retorno = await fetch(`../../php/handlers/anuncio/anuncio_get.php?id=${id}`);
        const resposta = await retorno.json();

        if (resposta.status === "ok" && resposta.data.length) {
            const anuncio = resposta.data[0];
            
            form.titulo.value = anuncio.titulo || "";
            form.descricao.value = anuncio.descricao || "";
            form.preco.value = anuncio.preco || "";

            const categoria = (anuncio.tipo === "Venda de Semente") ? "venda_plantas" : "servico_jardinagem";
            form.categoria.value = categoria;

        } else {
            alert("Anúncio não encontrado.");
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
        const retorno = await fetch(`../../php/handlers/anuncio/anuncio_alterar.php?id=${id}`, {
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