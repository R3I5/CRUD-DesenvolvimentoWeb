document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(window.location.search);
  const idParceria = url.get("id");
  if (!idParceria) {
      alert("ID da parceria não informado.");
      window.location.href = "index.html";
      return;
  }

  const formParceria = document.getElementById("formParceria");
  if (!formParceria) return;

  buscar(idParceria, formParceria);

  formParceria.addEventListener("submit", (e) => {
      e.preventDefault();
      alterar(idParceria, formParceria);
  });

  const btnCancelar = document.getElementById("cancelar");
  if (btnCancelar) {
      btnCancelar.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = "index.html";
      });
  }
});

async function buscar(id, form) {
  try {
      const retorno = await fetch(`../../php/handlers/parceria/parceriaGet.php?id=${id}`);
      const resposta = await retorno.json();

      if (resposta.status === "ok" && resposta.data.length) {
          const p = resposta.data[0];
          
          form.elements.namedItem("id_jardineiro").value = p.id_jardineiro || "";
          form.elements.namedItem("id_espaco").value = p.id_espaco || "";
          form.elements.namedItem("status").value = p.status || "";

          if (p.data_inicio) {
              form.elements.namedItem("data_inicio").value = new Date(p.data_inicio).toISOString().substring(0, 10);
          }
          if (p.data_fim) {
              form.elements.namedItem("data_fim").value = new Date(p.data_fim).toISOString().substring(0, 10);
          }
      } else {
          alert("Registro não encontrado.");
          window.location.href = "index.html";
      }
  } catch (erro) {
      console.error("Erro ao buscar parceria:", erro);
      alert("Erro ao buscar dados. Veja o console para mais detalhes.");
  }
}

async function alterar(id, form) {
  const fd = new FormData(form);

  try {
      const retorno = await fetch(`../../php/handlers/parceria/parceriaAlterar.php?id=${id}`, {
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
  } catch (erro) {
      console.error("Erro ao enviar atualização:", erro);
      alert("Erro ao atualizar parceria. Veja o console para detalhes.");
  }
}