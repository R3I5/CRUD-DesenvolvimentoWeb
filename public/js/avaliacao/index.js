document.addEventListener("DOMContentLoaded", () => {
    buscar();
});

const btnNovo = document.getElementById("novo");
if (btnNovo) {
    btnNovo.addEventListener("click", (e) => {
        window.location.href = 'novaAvaliacao.html';
    });
}

async function buscar() {
    try {
        const retorno = await fetch(`../../php/handlers/avaliacao/avaliacaoGET.php?_=${new Date().getTime()}`);
        const resposta = await retorno.json();
        if (resposta.status === "ok") {
            preencherTabela(resposta.data);
        } else {
            console.error('Erro ao buscar avaliações:', resposta.mensagem);
            preencherTabela([]);
        }
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        preencherTabela([]);
    }
}

async function excluir(id) {
    if (!confirm('Confirma excluir?')) return;
    const retorno = await fetch(`../../php/handlers/avaliacao/avaliacaoExcluir.php?id=${id}`);
    const resposta = await retorno.json();
    if (resposta.status === "ok") {
        alert(resposta.mensagem);
        window.location.reload();
    } else {
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela) {
    const tbody = document.getElementById('listaAvaliacoes');
    if (!tbody) {
        console.error('Elemento tbody com id "listaAvaliacoes" não encontrado!');
        return;
    }
    
    let tbodyHtml = '';

    if (tabela && tabela.length > 0) {
        for (const item of tabela) {
            const id = item.id_avaliacao;
            
            let dataFormatada = '';
            if (item.data_avaliacao) {
                const dataObj = new Date(item.data_avaliacao + 'T00:00:00Z'); 
                const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
                dataFormatada = dataObj.toLocaleDateString('pt-BR', options);
            }

            tbodyHtml += `
                <tr>
                    <td>${item.id_avaliador || '-'}</td>
                    <td>${item.id_avaliado || '-'}</td>
                    <td>${item.id_parceria || '-'}</td>
                    <td>${item.nota || '-'}</td>
                    <td>${item.comentario || '-'}</td>
                    <td>${dataFormatada || '-'}</td> 
                    
                    <td class="text-center">
                        <a class="btn btn-sm btn-outline-primary me-2" href="atualizarAvaliacao.html?id=${id}">Alterar</a>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${id})">Excluir</button>
                    </td>
                </tr>`;
        }
    } else {
        tbodyHtml = `<tr><td colspan="7" class="text-center">Nenhuma avaliação encontrada.</td></tr>`;
    }

    if (tbody) {
        tbody.innerHTML = tbodyHtml;
    }
}


/*
//<td>${item.nova_coluna || '-'}</td> 
================================================================================
GUIA COMPLETO: Como Adicionar um Novo Campo no CRUD "Avaliação"
================================================================================

Este é um guia de consulta baseado nos seus arquivos de "Avaliação".
Para adicionar QUALQUER campo novo, você precisa seguir este "checklist" de 7 passos.

O PROCESSO (O Checklist de 7 Passos):
----------------------------------------------------------------
1.  [ BANCO DE DADOS ]  Alterar a tabela MySQL `AVALIACAO`.
2.  [ BACKEND ]  Editar `avaliacaoNovo.php` (para o CREATE)
3.  [ BACKEND ]  Editar `avaliacaoAlterar.php` (para o UPDATE)
4.  [ BACKEND ]  Editar `avaliacaoGET.php` (para o READ)
5.  [ FRONTEND ] Editar `novaAvaliacao.html` (Formulário de CREATE)
6.  [ FRONTEND ] Editar `atualizarAvaliacao.html` & `atualizarAvaliacao.js` (Formulário de UPDATE)
7.  [ FRONTEND ] Editar `index.html` & `index.js` (Lista do READ, na pasta /avaliacao/)

----------------------------------------------------------------
NOTA IMPORTANTE SOBRE SEU JS (FormData):
Seu JS nos arquivos `novaAvaliacao.js` e `atualizarAvaliacao.js` usa `new FormData(formAvaliacao)`.
Isso é EXCELENTE! Significa que para os passos 5 e 6, você só precisa
adicionar o campo no HTML. O JavaScript vai pegá-lo AUTOMATICAMENTE ao salvar.

A única parte "manual" do JS é em `atualizarAvaliacao.js`, onde você
precisa preencher o campo na função `buscar()`.
----------------------------------------------------------------


Abaixo estão 5 exemplos completos, um para cada tipo de campo:

================================================================================
EXEMPLO 1: Adicionando um TEXT INPUT (Ex: "Título da Avaliação")
================================================================================

CAMPO: `titulo_avaliacao`
TIPO HTML: <input type="text">
TIPO MYSQL: VARCHAR(255)

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE AVALIACAO ADD titulo_avaliacao VARCHAR(255) NULL DEFAULT NULL AFTER id_parceria;


---
2. BACKEND (CREATE): `avaliacaoNovo.php`
---
// ... (perto da linha 25)
$id_avaliado    = isset($_POST['id_avaliado']) ? (int)$_POST['id_avaliado'] : 0;
$id_parceria    = (empty($_POST['id_parceria']) ? null : (int)$_POST['id_parceria']);
// ADICIONE ISTO:
$titulo_avaliacao = isset($_POST['titulo_avaliacao']) ? trim($_POST['titulo_avaliacao']) : '';

// ... (perto da linha 36)
// MUDE DE:
$stmt = $conexao->prepare("INSERT INTO AVALIACAO (nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria) VALUES (?,?,?,?,?,?)");
$stmt->bind_param("issiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria);
// PARA:
$stmt = $conexao->prepare("INSERT INTO AVALIACAO (nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria, titulo_avaliacao) VALUES (?,?,?,?,?,?,?)");
$stmt->bind_param("issiiis", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria, $titulo_avaliacao); // "issiii" -> "issiiis" (s = string)


---
3. BACKEND (UPDATE): `avaliacaoAlterar.php`
---
// ... (perto da linha 35)
$id_avaliado    = isset($_POST['id_avaliado']) ? (int)$_POST['id_avaliado'] : 0;
$id_parceria    = (empty($_POST['id_parceria']) ? null : (int)$_POST['id_parceria']);
// ADICIONE ISTO:
$titulo_avaliacao = isset($_POST['titulo_avaliacao']) ? trim($_POST['titulo_avaliacao']) : '';

// ... (perto da linha 46)
// MUDE DE:
$stmt = $conexao->prepare("UPDATE AVALIACAO SET nota = ?, comentario = ?, data_avaliacao = ?, id_avaliador = ?, id_avaliado = ?, id_parceria = ? WHERE id_avaliacao = ?");
$stmt->bind_param("issiiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria, $id_avaliacao);
// PARA:
$stmt = $conexao->prepare("UPDATE AVALIACAO SET nota = ?, comentario = ?, data_avaliacao = ?, id_avaliador = ?, id_avaliado = ?, id_parceria = ?, titulo_avaliacao = ? WHERE id_avaliacao = ?");
$stmt->bind_param("issiiisi", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria, $titulo_avaliacao, $id_avaliacao); // "issiiii" -> "issiiisi"


---
4. BACKEND (READ): `avaliacaoGET.php`
---
// ... (perto da linha 27)
// MUDE O "SELECT" NAS DUAS QUERIES (de 7 para 8 colunas)
// 1ª Query (com ID):
$stmt = $conexao->prepare("SELECT id_avaliacao, nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria, titulo_avaliacao FROM AVALIACAO WHERE id_avaliacao = ?");
// 2ª Query (sem ID):
$stmt = $conexao->prepare("SELECT id_avaliacao, nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria, titulo_avaliacao FROM AVALIACAO ORDER BY id_avaliacao DESC");


---
5. FRONTEND (CREATE FORM): `novaAvaliacao.html`
---
<!-- (Adicione depois do "Comentário", perto da linha 77) -->
<div class="mb-3">
    <label for="comentario" class="form-label">Comentário</label>
    <textarea class="form-control" id="comentario" name="comentario" rows="4" required></textarea>
</div>

<!-- ADICIONE ISTO: -->
<div class="mb-3">
    <label for="titulo_avaliacao" class="form-label">Título da Avaliação (Opcional)</label>
    <input type="text" class="form-control" id="titulo_avaliacao" name="titulo_avaliacao">
</div>
<!-- FIM DA ADIÇÃO -->

<div class="mb-4">
    <label for="data_avaliacao" class="form-label">Data da Avaliação</label>
    <!-- ... -->


---
6. FRONTEND (UPDATE FORM): `atualizarAvaliacao.html` & `atualizarAvaliacao.js`
---
// ARQUIVO: `atualizarAvaliacao.html`
// (Adicione EXATAMENTE o mesmo HTML do passo 5, no mesmo lugar - depois do Comentário)
<!-- ADICIONE ISTO: -->
<div class="mb-3">
    <label for="titulo_avaliacao" class="form-label">Título da Avaliação (Opcional)</label>
    <input type="text" class="form-control" id="titulo_avaliacao" name="titulo_avaliacao">
</div>


// ARQUIVO: `atualizarAvaliacao.js` (na função `buscar()`)
// (perto da linha 52)
form.elements.namedItem("nota").value = avaliacao.nota || "";
form.elements.namedItem("comentario").value = avaliacao.comentario || "";
// ADICIONE ISTO:
form.elements.namedItem("titulo_avaliacao").value = avaliacao.titulo_avaliacao || "";
// FIM DA ADIÇÃO
if (avaliacao.data_avaliacao) {
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js` (na pasta /avaliacao/)
---
// ARQUIVO: `index.html` (perto da linha 47)
<thead>
    <tr>
        <th>ID Avaliador</th>
        <th>ID Avaliado</th>
        <th>ID Parceria</th>
        <th>Nota</th>
        <th>Comentário</th>
        <!-- ADICIONE ISTO: -->
        <th>Título</th>
        <!-- FIM DA ADIÇÃO -->
        <th>Data da Avaliação</th>
        <th class="text-center">Ações</th>
    </tr>
</thead>

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 80)
            const id = item.id_avaliacao;
            // ADICIONE ISTO:
            const titulo_avaliacao = item.titulo_avaliacao || '-';
            // FIM DA ADIÇÃO
            
            let dataFormatada = '';
// ... (perto da linha 89)
            tbodyHtml += `
                <tr>
                    <td>${item.id_avaliador || '-'}</td>
                    <td>${item.id_avaliado || '-'}</td>
                    <td>${item.id_parceria || '-'}</td>
                    <td>${item.nota || '-'}</td>
                    <td>${item.comentario || '-'}</td>
                    <!-- ADICIONE ISTO: -->
                    <td>${titulo_avaliacao}</td>
                    <!-- FIM DA ADIÇÃO -->
                    <td>${dataFormatada || '-'}</td>
                    <td class="text-center">
// ...

// (E ATUALIZE O COLSPAN na linha 101!)
// MUDE DE:
tbodyHtml = `<tr><td colspan="7" class="text-center">Nenhuma avaliação encontrada.</td></tr>`;
// PARA:
tbodyHtml = `<tr><td colspan="8" class="text-center">Nenhuma avaliação encontrada.</td></tr>`;


================================================================================
EXEMPLO 2: Adicionando um TEXTAREA (Ex: "Resposta do Admin")
================================================================================

CAMPO: `resposta_admin`
TIPO HTML: <textarea>
TIPO MYSQL: TEXT

O processo é IDÊNTICO ao EXEMPLO 1,
mas você usará um tipo de coluna diferente no MySQL e uma tag HTML diferente.

1. DB: `ALTER TABLE AVALIACAO ADD resposta_admin TEXT NULL DEFAULT NULL AFTER id_parceria;`
2. PHP (novo):
   `$resposta_admin = isset($_POST['resposta_admin']) ? trim($_POST['resposta_admin']) : '';`
   `... VALUES (?,?,?,?,?,?,?)`
   `$stmt->bind_param("issiiis", ..., $id_parceria, $resposta_admin);` // Adiciona 's'
3. PHP (alterar):
   `$resposta_admin = isset($_POST['resposta_admin']) ? trim($_POST['resposta_admin']) : '';`
   `... SET ..., id_parceria = ?, resposta_admin = ? WHERE ...`
   `$stmt->bind_param("issiiisi", ..., $id_parceria, $resposta_admin, $id_avaliacao);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... id_parceria, resposta_admin";` (em ambos os SELECTs)
5. HTML (novo):
   `<div class="mb-3">
        <label for="resposta_admin" class="form-label">Resposta do Admin (Opcional)</label>
        <textarea class="form-control" id="resposta_admin" name="resposta_admin" rows="3"></textarea>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarAvaliacao.html`.
   - Em `atualizarAvaliacao.js`, na função `buscar()`:
     `form.elements.namedItem("resposta_admin").value = avaliacao.resposta_admin || "";`
7. HTML/JS (lista):
   - Adicione `<th>Resposta</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const resposta_admin = item.resposta_admin || '-';`
     `...<td>${resposta_admin}</td>...`
   - Lembre de aumentar o `colspan` para 8!


================================================================================
EXEMPLO 3: Adicionando um CHECKBOX (Ex: "Visível Publicamente?")
================================================================================

CAMPO: `visivel_publicamente`
TIPO HTML: <input type="checkbox">
TIPO MYSQL: TINYINT(1) (0 = Não, 1 = Sim)

**ESTE É O MAIS DIFERENTE! PRESTE ATENÇÃO!**
Checkboxes não enviam NADA se estiverem desmarcados.

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE AVALIACAO ADD visivel_publicamente TINYINT(1) NOT NULL DEFAULT 1 AFTER id_parceria;


---
2. BACKEND (CREATE): `avaliacaoNovo.php`
---
// ... (perto da linha 25)
$id_parceria    = (empty($_POST['id_parceria']) ? null : (int)$_POST['id_parceria']);
// ADICIONE ISTO (LÓGICA ESPECIAL):
$visivel_publicamente = isset($_POST['visivel_publicamente']) ? 1 : 0; // Se foi enviado, é 1. Senão, é 0.

// ... (perto da linha 36)
// MUDE DE:
$stmt = $conexao->prepare("INSERT INTO AVALIACAO (nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria) VALUES (?,?,?,?,?,?)");
$stmt->bind_param("issiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria);
// PARA:
$stmt = $conexao->prepare("INSERT INTO AVALIACAO (nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria, visivel_publicamente) VALUES (?,?,?,?,?,?,?)");
$stmt->bind_param("issiiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria, $visivel_publicamente); // "issiii" -> "issiiii" (i = integer)


---
3. BACKEND (UPDATE): `avaliacaoAlterar.php`
---
// ... (perto da linha 35)
$id_parceria    = (empty($_POST['id_parceria']) ? null : (int)$_POST['id_parceria']);
// ADICIONE ISTO (LÓGICA ESPECIAL):
$visivel_publicamente = isset($_POST['visivel_publicamente']) ? 1 : 0;

// ... (perto da linha 46)
// MUDE DE:
$stmt = $conexao->prepare("UPDATE AVALIACAO SET nota = ?, comentario = ?, data_avaliacao = ?, id_avaliador = ?, id_avaliado = ?, id_parceria = ? WHERE id_avaliacao = ?");
$stmt->bind_param("issiiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria, $id_avaliacao);
// PARA:
$stmt = $conexao->prepare("UPDATE AVALIACAO SET nota = ?, comentario = ?, data_avaliacao = ?, id_avaliador = ?, id_avaliado = ?, id_parceria = ?, visivel_publicamente = ? WHERE id_avaliacao = ?");
$stmt->bind_param("issiiiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria, $visivel_publicamente, $id_avaliacao); // "issiiii" -> "issiiiii"


---
4. BACKEND (READ): `avaliacaoGET.php`
---
// ... (perto da linha 27)
// Adicione `visivel_publicamente` em ambos os SELECTs
// Ex:
$stmt = $conexao->prepare("SELECT ..., id_parceria, visivel_publicamente FROM AVALIACAO WHERE id_avaliacao = ?");
$stmt = $conexao->prepare("SELECT ..., id_parceria, visivel_publicamente FROM AVALIACAO ORDER BY id_avaliacao DESC");


---
5. FRONTEND (CREATE FORM): `novaAvaliacao.html`
---
<!-- (Adicione antes da linha "d-grid gap-2...") -->
<div class="mb-4">
    <label for="data_avaliacao" class="form-label">Data da Avaliação</label>
    <input type="date" class="form-control" id="data_avaliacao" name="data_avaliacao" required>
</div>

<!-- ADICIONE ISTO: -->
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="1" id="visivel_publicamente" name="visivel_publicamente" checked>
  <label class="form-check-label" for="visivel_publicamente">
    Visível Publicamente
  </label>
</div>
<!-- FIM DA ADIÇÃO -->

<div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <!-- ... -->


---
6. FRONTEND (UPDATE FORM): `atualizarAvaliacao.html` & `atualizarAvaliacao.js`
---
// ARQUIVO: `atualizarAvaliacao.html`
// (Adicione no mesmo lugar do passo 5, mas SEM o 'checked')
<!-- ADICIONE ISTO: -->
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="1" id="visivel_publicamente" name="visivel_publicamente">
  <label class="form-check-label" for="visivel_publicamente">
    Visível Publicamente
  </label>
</div>


// ARQUIVO: `atualizarAvaliacao.js` (na função `buscar()`)
// (perto da linha 52)
form.elements.namedItem("comentario").value = avaliacao.comentario || "";
// ADICIONE ISTO (LÓGICA ESPECIAL):
form.elements.namedItem("visivel_publicamente").checked = (avaliacao.visivel_publicamente == 1); // Use .checked, NÃO .value
// FIM DA ADIÇÃO
if (avaliacao.data_avaliacao) {
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js` (na pasta /avaliacao/)
---
// ARQUIVO: `index.html` (perto da linha 47)
<thead>
    <tr>
        <!-- ... -->
        <th>Comentário</th>
        <th>Data da Avaliação</th>
        <!-- ADICIONE ISTO: -->
        <th>Visível?</th>
        <!-- FIM DA ADIÇÃO -->
        <th class="text-center">Ações</th>
    </tr>
</thead>

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 80)
            const id = item.id_avaliacao;
            // ADICIONE ISTO (LÓGICA ESPECIAL):
            const visivel_texto = (item.visivel_publicamente == 1) ? "Sim" : "Não";
            // FIM DA ADIÇÃO
            
            let dataFormatada = '';
// ... (perto da linha 89)
            tbodyHtml += `
                <tr>
                    <!-- ... -->
                    <td>${item.comentario || '-'}</td>
                    <td>${dataFormatada || '-'}</td>
                    <!-- ADICIONE ISTO: -->
                    <td>${visivel_texto}</td>
                    <!-- FIM DA ADIÇÃO -->
                    <td class="text-center">
// ...

// (E ATUALIZE O COLSPAN na linha 101!)
// MUDE DE:
tbodyHtml = `<tr><td colspan="7" ...
// PARA:
tbodyHtml = `<tr><td colspan="8" ...


================================================================================
EXEMPLO 4: Adicionando RADIO BUTTONS (Ex: "Tipo de Feedback")
================================================================================

CAMPO: `tipo_feedback`
TIPO HTML: <input type="radio">
TIPO MYSQL: VARCHAR(50) (ou ENUM('Geral', 'Elogio', 'Reclamação'))

O processo é quase idêntico ao EXEMPLO 1 (Text Input),
mas o HTML é diferente e o JS de atualização (`buscar()`) também.

1. DB: `ALTER TABLE AVALIACAO ADD tipo_feedback VARCHAR(50) NULL DEFAULT 'Geral' AFTER id_parceria;`
2. PHP (novo):
   `$tipo_feedback = isset($_POST['tipo_feedback']) ? trim($_POST['tipo_feedback']) : 'Geral';`
   `... VALUES (?,?,?,?,?,?,?)`
   `$stmt->bind_param("issiiis", ..., $id_parceria, $tipo_feedback);` // Adiciona 's'
3. PHP (alterar):
   `$tipo_feedback = isset($_POST['tipo_feedback']) ? trim($_POST['tipo_feedback']) : 'Geral';`
   `... SET ..., id_parceria = ?, tipo_feedback = ? WHERE ...`
   `$stmt->bind_param("issiiisi", ..., $id_parceria, $tipo_feedback, $id_avaliacao);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... id_parceria, tipo_feedback";` (em ambos os SELECTs)
5. HTML (novo - `novaAvaliacao.html`):
   `<div class="mb-3">
        <label class="form-label">Tipo de Feedback</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="tipo_feedback" id="tipo_geral" value="Geral" checked>
            <label class="form-check-label" for="tipo_geral">Geral</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="tipo_feedback" id="tipo_elogio" value="Elogio">
            <label class="form-check-label" for="tipo_elogio">Elogio</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="tipo_feedback" id="tipo_reclamacao" value="Reclamação">
            <label class="form-check-label" for="tipo_reclamacao">Reclamação</label>
        </div>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarAvaliacao.html`.
   - Em `atualizarAvaliacao.js`, na função `buscar()`:
     // **LÓGICA ESPECIAL PARA RADIO**:
     form.elements.namedItem("tipo_feedback").value = avaliacao.tipo_feedback || "Geral";
     // O navegador vai marcar o radio button que tiver o `value` correspondente.
7. HTML/JS (lista):
   - Adicione `<th>Tipo Feedback</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const tipo_feedback = item.tipo_feedback || 'Geral';`
     `...<td>${tipo_feedback}</td>...`
   - Lembre de aumentar o `colspan` para 8!


================================================================================
EXEMPLO 5: Adicionando um SELECT/DROPDOWN (Ex: "Motivo da Nota")
================================================================================

CAMPO: `motivo_nota`
TIPO HTML: <select>
TIPO MYSQL: VARCHAR(100)

O processo é IDÊNTICO ao EXEMPLO 1 (Text Input),
mas o HTML é uma tag `<select>`.

1. DB: `ALTER TABLE AVALIACAO ADD motivo_nota VARCHAR(100) NULL DEFAULT NULL AFTER id_parceria;`
2. PHP (novo):
   `$motivo_nota = isset($_POST['motivo_nota']) ? trim($_POST['motivo_nota']) : '';`
   `... VALUES (?,?,?,?,?,?,?)`
   `$stmt->bind_param("issiiis", ..., $id_parceria, $motivo_nota);` // Adiciona 's'
3. PHP (alterar):
   `$motivo_nota = isset($_POST['motivo_nota']) ? trim($_POST['motivo_nota']) : '';`
   `... SET ..., id_parceria = ?, motivo_nota = ? WHERE ...`
   `$stmt->bind_param("issiiisi", ..., $id_parceria, $motivo_nota, $id_avaliacao);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... id_parceria, motivo_nota";` (em ambos os SELECTs)
5. HTML (novo - `novaAvaliacao.html`):
   `<div class="mb-3">
        <label for="motivo_nota" class="form-label">Motivo da Nota (Opcional)</label>
        <select class="form-select" id="motivo_nota" name="motivo_nota">
            <option value="">Selecione</option>
            <option value="comunicacao">Comunicação</option>
            <option value="qualidade">Qualidade</option>
            <option value="prazo">Prazo</option>
            <option value="outro">Outro</option>
        </select>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarAvaliacao.html`.
   - Em `atualizarAvaliacao.js`, na função `buscar()`:
     `form.elements.namedItem("motivo_nota").value = avaliacao.motivo_nota || "";`
7. HTML/JS (lista):
   - Adicione `<th>Motivo</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const motivo_nota = item.motivo_nota || '-';`
     `...<td>${motivo_nota}</td>...`
   - Lembre de aumentar o `colspan` para 8!
*/