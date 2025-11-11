document.addEventListener("DOMContentLoaded", () => {
    const formParceria = document.getElementById("formParceria");
    if (!formParceria) return;
    
    formParceria.addEventListener("submit", async (e) => {
        e.preventDefault();
        await novo(formParceria);
    });
});

async function novo(form) {
    const fd = new FormData(form);

    try {
        const resposta = await fetch("../../php/handlers/parceria/parceriaNovo.php", {
            method: "POST",
            body: fd
        });

        const json = await resposta.json();
        
        if (json.status === "ok") {
            alert("SUCESSO: " + json.mensagem);
            window.location.href = "index.html";
        } else {
            alert("ERRO: " + json.mensagem);
        }
    } catch (erro) {
        console.error("Erro ao enviar dados:", erro);
        alert("Erro ao enviar dados. Veja o console para mais detalhes.");
    }
}