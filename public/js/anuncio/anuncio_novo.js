document.addEventListener("DOMContentLoaded", () => {
    const formAnuncio = document.getElementById("formAnuncio");

    formAnuncio.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fd = new FormData(formAnuncio);

        try {
            const retorno = await fetch("../../php/handlers/anuncio/anuncio_novo.php", {
                method: "POST",
                body: fd,
            });
            const resposta = await retorno.json();

            if (resposta.status == "ok") {
                alert("SUCESSO: " + resposta.mensagem);
                window.location.href = "index.html";
            } else {
                alert("ERRO: " + resposta.mensagem);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Ocorreu um erro ao enviar o formulário.");
        }
    });
});