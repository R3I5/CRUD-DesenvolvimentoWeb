document.addEventListener("DOMContentLoaded", () => {
    const formAvaliacao = document.getElementById("formAvaliacao");

    formAvaliacao.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fd = new FormData(formAvaliacao);

        try {
            const retorno = await fetch("../../php/handlers/avaliacao/avaliacaoNovo.php", {
                method: "POST",
                body: fd,
            });

            const resposta = await retorno.json();

            if (resposta.status === "ok") {
                alert("SUCESSO: " + resposta.mensagem);
                window.location.href = "index.html";
            } else {
                alert("ERRO: " + resposta.mensagem);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Ocorreu um erro ao enviar o formulário: " + error.message);
        }
    });
});