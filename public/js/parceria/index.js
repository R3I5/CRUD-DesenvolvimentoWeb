document.addEventListener("DOMContentLoaded", () => {
    buscar();
});

const btnNovo = document.getElementById("novo");
if(btnNovo){
    btnNovo.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = 'novaParceria.html';
    });
}

async function buscar(){
    const retorno = await fetch("../../php/handlers/parceria/parceriaGet.php");
    const resposta = await retorno.json();
    if(resposta.status === "ok"){
        preencherTabela(resposta.data);
    }else{
        preencherTabela([]);
    }
}

async function excluir(id){
    if(!confirm('Confirma excluir esta parceria?')) return;
    const retorno = await fetch(`../../php/handlers/parceria/parceriaExcluir.php?id=${id}`);
    const resposta = await retorno.json();
    if(resposta.status === "ok"){
        alert(resposta.mensagem);
        window.location.reload();
    }else{
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela){
    const tbody = document.getElementById('listaParceria');
    if (!tbody) return;

    let tbodyHtml = '';
    if (tabela.length > 0) {
        for(let i = 0; i < tabela.length; i++){
            const item = tabela[i];
            const id = item.id_parceria || 0;
            
            const data_inicio = item.data_inicio ? new Date(item.data_inicio).toLocaleDateString('pt-BR') : '-';
            const data_fim = item.data_fim ? new Date(item.data_fim).toLocaleDateString('pt-BR') : '-';

            tbodyHtml += `
                <tr>
                    <td>${item.id_parceria || '-'}</td>
                    <td>${item.id_jardineiro || '-'}</td>
                    <td>${item.id_espaco || '-'}</td>
                    <td>${item.status || ''}</td>
                    <td>${data_inicio}</td>
                    <td>${data_fim}</td>
                    <td class="text-center">
                        <a class="btn btn-sm btn-outline-primary me-2" href="atualizarParceria.html?id=${id}">Alterar</a>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${id})">Excluir</button>
                    </td>
                </tr>`;
        }
    } else {
        tbodyHtml = `<tr><td colspan="6" class="text-center">Nenhuma parceria encontrada.</td></tr>`;
    }

    tbody.innerHTML = tbodyHtml;
}

/*
================================================================================
GUIA COMPLETO: Como Adicionar um Novo Campo no CRUD "Parceria"
================================================================================

Este é um guia de consulta baseado nos seus arquivos de "Parceria".
Para adicionar QUALQUER campo novo, você precisa seguir este "checklist" de 7 passos.

O PROCESSO (O Checklist de 7 Passos):
----------------------------------------------------------------
1.  [ BANCO DE DADOS ]  Alterar a tabela MySQL `PARCERIA`.
2.  [ BACKEND ]  Editar `parceriaNovo.php` (para o CREATE)
3.  [ BACKEND ]  Editar `parceriaAlterar.php` (para o UPDATE)
4.  [ BACKEND ]  Editar `parceriaGet.php` (para o READ)
5.  [ FRONTEND ] Editar `novaParceria.html` & `novaParceria.js` (Formulário de CREATE)
6.  [ FRONTEND ] Editar `atualizarParceria.html` & `atualizarParceria.js` (Formulário de UPDATE)
7.  [ FRONTEND ] Editar `index.html` & `index.js` (Lista do READ, na pasta /parceria/)

----------------------------------------------------------------
NOTAS IMPORTANTES SOBRE SEU JS (FormData & Checkbox):

1. (BOM!) Seu JS nos arquivos `novaParceria.js` e `atualizarParceria.js` usa `new FormData(form)`.
   Isso significa que para os passos 5 e 6, você só precisa adicionar o campo no HTML.
   O JavaScript vai pegá-lo AUTOMATICAMENTE ao salvar.

2. (IMPORTANTE!) Este CRUD ainda não tem checkboxes. No Exemplo 3 (Checkbox),
   mostrarei como adicionar a lógica JS necessária nos arquivos
   `novaParceria.js` e `atualizarParceria.js` para que eles funcionem corretamente.
----------------------------------------------------------------


Abaixo estão 5 exemplos completos, um para cada tipo de campo:

================================================================================
EXEMPLO 1: Adicionando um TEXT INPUT (Ex: "Título da Parceria")
================================================================================

CAMPO: `titulo_parceria`
TIPO HTML: <input type="text">
TIPO MYSQL: VARCHAR(255)

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE PARCERIA ADD titulo_parceria VARCHAR(255) NULL DEFAULT NULL AFTER id_espaco;


---
2. BACKEND (CREATE): `parceriaNovo.php`
---
// ... (perto da linha 20)
$data_inicio   = isset($_POST['data_inicio']) ? trim($_POST['data_inicio']) : '';
$status        = isset($_POST['status']) ? trim($_POST['status']) : '';
$data_fim      = (empty($_POST['data_fim']) ? null : trim($_POST['data_fim']));
// ADICIONE ISTO:
$titulo_parceria = isset($_POST['titulo_parceria']) ? trim($_POST['titulo_parceria']) : '';

// ... (perto da linha 39)
// MUDE DE: (5 colunas, 5 placeholders)
$stmt = $conexao->prepare("
    INSERT INTO PARCERIA (data_inicio, data_fim, status, id_jardineiro, id_espaco)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param("sssii", $data_inicio, $data_fim, $status, $id_jardineiro, $id_espaco);

// PARA: (6 colunas, 6 placeholders)
$stmt = $conexao->prepare("
    INSERT INTO PARCERIA (data_inicio, data_fim, status, id_jardineiro, id_espaco, titulo_parceria)
    VALUES (?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("sssiis", $data_inicio, $data_fim, $status, $id_jardineiro, $id_espaco, $titulo_parceria); // "sssii" -> "sssiis"


---
3. BACKEND (UPDATE): `parceriaAlterar.php`
---
// ... (perto da linha 30)
$status        = isset($_POST['status']) ? trim($_POST['status']) : '';
$data_fim      = (empty($_POST['data_fim']) ? null : trim($_POST['data_fim']));
// ADICIONE ISTO:
$titulo_parceria = isset($_POST['titulo_parceria']) ? trim($_POST['titulo_parceria']) : '';

// ... (perto da linha 45)
// MUDE DE: (SET 5 colunas)
$stmt = $conexao->prepare("
    UPDATE PARCERIA
    SET id_jardineiro = ?, id_espaco = ?, status = ?, data_inicio = ?, data_fim = ?
    WHERE id_parceria = ?
");
$stmt->bind_param("iisssi", $id_jardineiro, $id_espaco, $status, $data_inicio, $data_fim, $id_parceria);

// PARA: (SET 6 colunas)
$stmt = $conexao->prepare("
    UPDATE PARCERIA
    SET id_jardineiro = ?, id_espaco = ?, status = ?, data_inicio = ?, data_fim = ?, titulo_parceria = ?
    WHERE id_parceria = ?
");
$stmt->bind_param("iissssi", $id_jardineiro, $id_espaco, $status, $data_inicio, $data_fim, $titulo_parceria, $id_parceria); // "iisssi" -> "iissssi"


---
4. BACKEND (READ): `parceriaGet.php`
---
// ... (perto da linha 25)
// MUDE O "SELECT" NAS DUAS QUERIES (de 6 para 7 colunas)
// 1ª Query (com ID):
$stmt = $conexao->prepare("SELECT id_parceria, data_inicio, data_fim, status, id_jardineiro, id_espaco, titulo_parceria FROM PARCERIA WHERE id_parceria = ?");
// 2ª Query (sem ID):
$stmt = $conexao->prepare("SELECT id_parceria, data_inicio, data_fim, status, id_jardineiro, id_espaco, titulo_parceria FROM PARCERIA ORDER BY id_parceria DESC");


---
5. FRONTEND (CREATE FORM): `novaParceria.html`
---
<!-- (Adicione depois da linha dos IDs, perto da linha 45) -->
                    <div class="col-md-6 mb-3">
                        <label for="id_espaco" class="form-label">ID Espaço</label>
                        <input type="number" class="form-control" id="id_espaco" name="id_espaco" required>
                    </div>
                </div>

                <!-- ADICIONE ISTO: -->
                <div class="mb-3">
                    <label for="titulo_parceria" class="form-label">Título da Parceria</label>
                    <input type="text" class="form-control" id="titulo_parceria" name="titulo_parceria" placeholder="Ex: Cuidado com o Jardim Central">
                </div>
                <!-- FIM DA ADIÇÃO -->

                <div class="mb-3">
                    <label for="status" class="form-label">Status da Parceria</label>
                    <!-- ... -->


---
6. FRONTEND (UPDATE FORM): `atualizarParceria.html` & `atualizarParceria.js`
---
// ARQUIVO: `atualizarParceria.html`
// (Adicione EXATAMENTE o mesmo HTML do passo 5, no mesmo lugar)
<!-- ADICIONE ISTO: -->
<div class="mb-3">
    <label for="titulo_parceria" class="form-label">Título da Parceria</label>
    <input type="text" class="form-control" id="titulo_parceria" name="titulo_parceria" placeholder="Ex: Cuidado com o Jardim Central">
</div>


// ARQUIVO: `atualizarParceria.js` (na função `buscar()`)
// (perto da linha 48)
          form.elements.namedItem("id_jardineiro").value = p.id_jardineiro || "";
          form.elements.namedItem("id_espaco").value = p.id_espaco || "";
          // ADICIONE ISTO:
          form.elements.namedItem("titulo_parceria").value = p.titulo_parceria || "";
          // FIM DA ADIÇÃO
          form.elements.namedItem("status").value = p.status || "";
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js` (na pasta /parceria/)
---
// ARQUIVO: `index.html` (perto da linha 46)
<thead>
    <tr>
        <th>ID Parceria</th>
        <th>ID Jardineiro</th>
        <th>ID Espaço</th>
        <!-- ADICIONE ISTO: -->
        <th>Título</th>
        <!-- FIM DA ADIÇÃO -->
        <th>Status</th>
        <th>Data Início</th>
// ...

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 58)
            const id = item.id_parceria || 0;
            // ADICIONE ISTO:
            const titulo_parceria = item.titulo_parceria || '-';
            // FIM DA ADIÇÃO
            
            const data_inicio = item.data_inicio ? new Date(item.data_inicio).toLocaleDateString('pt-BR') : '-';
// ... (perto da linha 66)
            tbodyHtml += `
                <tr>
                    <td>${item.id_parceria || '-'}</td>
                    <td>${item.id_jardineiro || '-'}</td>
                    <td>${item.id_espaco || '-'}</td>
                    <!-- ADICIONE ISTO: -->
                    <td>${titulo_parceria}</td>
                    <!-- FIM DA ADIÇÃO -->
                    <td>${item.status || ''}</td>
                    <td>${data_inicio}</td>
// ...

// (E ATUALIZE O COLSPAN na linha 81!)
// MUDE DE:
tbodyHtml = `<tr><td colspan="7" class="text-center">Nenhuma parceria encontrada.</td></tr>`;
// PARA:
tbodyHtml = `<tr><td colspan="8" class="text-center">Nenhuma parceria encontrada.</td></tr>`;


================================================================================
EXEMPLO 2: Adicionando um TEXTAREA (Ex: "Observações")
================================================================================

CAMPO: `observacoes`
TIPO HTML: <textarea>
TIPO MYSQL: TEXT

O processo é IDÊNTICO ao EXEMPLO 1,
mas você usará um tipo de coluna diferente no MySQL e uma tag HTML diferente.

1. DB: `ALTER TABLE PARCERIA ADD observacoes TEXT NULL DEFAULT NULL AFTER id_espaco;`
2. PHP (novo):
   `$observacoes = isset($_POST['observacoes']) ? trim($_POST['observacoes']) : '';`
   `... VALUES (?, ?, ?, ?, ?, ?)`
   `$stmt->bind_param("sssiis", ..., $id_espaco, $observacoes);` // Adiciona 's'
3. PHP (alterar):
   `$observacoes = isset($_POST['observacoes']) ? trim($_POST['observacoes']) : '';`
   `... SET ..., id_espaco = ?, observacoes = ? WHERE ...`
   `$stmt->bind_param("iissssi", ..., $id_espaco, $observacoes, $id_parceria);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... id_jardineiro, id_espaco, observacoes FROM...` (em ambos os SELECTs)
5. HTML (novo - `novaParceria.html`):
   `<div class="mb-3">
        <label for="observacoes" class="form-label">Observações</label>
        <textarea class="form-control" id="observacoes" name="observacoes" rows="3"></textarea>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarParceria.html`.
   - Em `atualizarParceria.js`, na função `buscar()`:
     `form.elements.namedItem("observacoes").value = p.observacoes || "";`
7. HTML/JS (lista):
   - Adicione `<th>Observações</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const observacoes = item.observacoes || '-';`
     `...<td>${observacoes}</td>...`
   - Lembre de aumentar o `colspan` para 8!


================================================================================
EXEMPLO 3: Adicionando um CHECKBOX (Ex: "Acordo Assinado?")
================================================================================

CAMPO: `acordo_assinado`
TIPO HTML: <input type="checkbox">
TIPO MYSQL: TINYINT(1) (0 = Não, 1 = Sim)

**ESTE É O MAIS DIFERENTE!** Precisamos adicionar lógica ao JS.

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE PARCERIA ADD acordo_assinado TINYINT(1) NOT NULL DEFAULT 0 AFTER id_espaco;


---
2. BACKEND (CREATE): `parceriaNovo.php`
---
// ... (perto da linha 20)
$data_fim      = (empty($_POST['data_fim']) ? null : trim($_POST['data_fim']));
// ADICIONE ISTO (LÓGICA ESPECIAL):
$acordo_assinado = isset($_POST['acordo_assinado']) ? 1 : 0; // Se foi enviado, é 1. Senão, é 0.

// ... (perto da linha 39)
// MUDE DE: (5 colunas)
$stmt = $conexao->prepare("... (..., id_jardineiro, id_espaco) VALUES (..., ?, ?)");
$stmt->bind_param("sssii", ..., $id_jardineiro, $id_espaco);
// PARA: (6 colunas)
$stmt = $conexao->prepare("... (..., id_jardineiro, id_espaco, acordo_assinado) VALUES (..., ?, ?, ?)");
$stmt->bind_param("sssiii", ..., $id_jardineiro, $id_espaco, $acordo_assinado); // "sssii" -> "sssiii" (i = integer)


---
3. BACKEND (UPDATE): `parceriaAlterar.php`
---
// ... (perto da linha 30)
$data_fim      = (empty($_POST['data_fim']) ? null : trim($_POST['data_fim']));
// ADICIONE ISTO (LÓGICA ESPECIAL):
$acordo_assinado = isset($_POST['acordo_assinado']) ? 1 : 0;

// ... (perto da linha 45)
// MUDE DE: (SET 5 colunas)
$stmt = $conexao->prepare("... SET ..., data_inicio = ?, data_fim = ? WHERE id_parceria = ?");
$stmt->bind_param("iisssi", ..., $data_inicio, $data_fim, $id_parceria);
// PARA: (SET 6 colunas)
$stmt = $conexao->prepare("... SET ..., data_inicio = ?, data_fim = ?, acordo_assinado = ? WHERE id_parceria = ?");
$stmt->bind_param("iisssii", ..., $data_inicio, $data_fim, $acordo_assinado, $id_parceria); // "iisssi" -> "iisssii"


---
4. BACKEND (READ): `parceriaGet.php`
---
// ... (perto da linha 25)
// Adicione `acordo_assinado` em ambos os SELECTs
// Ex:
$stmt = $conexao->prepare("SELECT ..., id_espaco, acordo_assinado FROM PARCERIA WHERE id_parceria = ?");
$stmt = $conexao->prepare("SELECT ..., id_espaco, acordo_assinado FROM PARCERIA ORDER BY id_parceria DESC");


---
5. FRONTEND (CREATE FORM): `novaParceria.html` & `novaParceria.js`
---
// ARQUIVO: `novaParceria.html`
// (Adicione antes da linha "d-grid gap-2...")
<div class="col-md-6 mb-4">
    <label for="data_fim" class="form-label">Data de Fim (Opcional)</label>
    <input type="date" class="form-control" id="data_fim" name="data_fim">
</div>
</div>

<!-- ADICIONE ISTO: -->
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="1" id="acordo_assinado" name="acordo_assinado">
  <label class="form-check-label" for="acordo_assinado">
    Acordo Assinado
  </label>
</div>
<!-- FIM DA ADIÇÃO -->

<div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <!-- ... -->


// ARQUIVO: `novaParceria.js` (na função `novo()`)
// (perto da linha 13)
async function novo(form) {
    const fd = new FormData(form);

    // ADICIONE ISTO: Lógica especial para checkbox
    if (!fd.has("acordo_assinado")) {
        fd.append("acordo_assinado", "0");
    }
    // FIM DA ADIÇÃO

    try {
        const resposta = await fetch(...
// ...


---
6. FRONTEND (UPDATE FORM): `atualizarParceria.html` & `atualizarParceria.js`
---
// ARQUIVO: `atualizarParceria.html`
// (Adicione no mesmo lugar do passo 5)
<!-- ADICIONE ISTO: -->
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="1" id="acordo_assinado" name="acordo_assinado">
  <label class="form-check-label" for="acordo_assinado">
    Acordo Assinado
  </label>
</div>


// ARQUIVO: `atualizarParceria.js` (na função `buscar()`)
// (perto da linha 48)
          form.elements.namedItem("status").value = p.status || "";
          // ADICIONE ISTO (LÓGICA ESPECIAL):
          form.elements.namedItem("acordo_assinado").checked = (p.acordo_assinado == 1);
          // FIM DA ADIÇÃO

          if (p.data_inicio) {
// ...

// ARQUIVO: `atualizarParceria.js` (na função `alterar()`)
// (perto da linha 70)
async function alterar(id, form) {
  const fd = new FormData(form);

  // ADICIONE ISTO: Lógica especial para checkbox
  if (!fd.has("acordo_assinado")) {
      fd.append("acordo_assinado", "0");
  }
  // FIM DA ADIÇÃO

  try {
      const retorno = await fetch(...
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js` (na pasta /parceria/)
---
// ARQUIVO: `index.html` (perto da linha 46)
<thead>
    <tr>
        <!-- ... -->
        <th>Status</th>
        <th>Data Início</th>
        <th>Data Fim</th>
        <!-- ADICIONE ISTO: -->
        <th>Acordo?</th>
        <!-- FIM DA ADIÇÃO -->
        <th class="text-center">Ações</th>
    </tr>
</thead>

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 58)
            const id = item.id_parceria || 0;
            const data_inicio = ...
            const data_fim = ...
            // ADICIONE ISTO (LÓGICA ESPECIAL):
            const acordo_texto = (item.acordo_assinado == 1) ? "Sim" : "Não";
            // FIM DA ADIÇÃO

            tbodyHtml += `
// ... (perto da linha 66)
            tbodyHtml += `
                <tr>
                    <!-- ... -->
                    <td>${item.status || ''}</td>
                    <td>${data_inicio}</td>
                    <td>${data_fim}</td>
                    <!-- ADICIONE ISTO: -->
                    <td>${acordo_texto}</td>
                    <!-- FIM DA ADIÇÃO -->
                    <td class="text-center">
// ...

// (E ATUALIZE O COLSPAN na linha 81!)
// MUDE DE:
tbodyHtml = `<tr><td colspan="7" ...
// PARA:
tbodyHtml = `<tr><td colspan="8" ...


================================================================================
EXEMPLO 4: Adicionando RADIO BUTTONS (Ex: "Tipo de Contrato")
================================================================================

CAMPO: `tipo_contrato`
TIPO HTML: <input type="radio">
TIPO MYSQL: VARCHAR(50) (ou ENUM('Mensal', 'Pontual', 'Anual'))

O processo é quase idêntico ao EXEMPLO 1 (Text Input),
mas o HTML é diferente e o JS de atualização (`buscar()`) também.

1. DB: `ALTER TABLE PARCERIA ADD tipo_contrato VARCHAR(50) NULL DEFAULT 'Pontual' AFTER id_espaco;`
2. PHP (novo):
   `$tipo_contrato = isset($_POST['tipo_contrato']) ? trim($_POST['tipo_contrato']) : 'Pontual';`
   `... VALUES (?, ?, ?, ?, ?, ?)`
   `$stmt->bind_param("sssiis", ..., $id_espaco, $tipo_contrato);` // Adiciona 's'
3. PHP (alterar):
   `$tipo_contrato = isset($_POST['tipo_contrato']) ? trim($_POST['tipo_contrato']) : 'Pontual';`
   `... SET ..., id_espaco = ?, tipo_contrato = ? WHERE ...`
   `$stmt->bind_param("iissssi", ..., $id_espaco, $tipo_contrato, $id_parceria);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... id_jardineiro, id_espaco, tipo_contrato FROM...` (em ambos os SELECTs)
5. HTML (novo - `novaParceria.html`):
   `<div class="mb-3">
        <label class="form-label">Tipo de Contrato</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="tipo_contrato" id="tipo_pontual" value="Pontual" checked>
            <label class="form-check-label" for="tipo_pontual">Pontual</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="tipo_contrato" id="tipo_mensal" value="Mensal">
            <label class="form-check-label" for="tipo_mensal">Mensal</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="tipo_contrato" id="tipo_anual" value="Anual">
            <label class="form-check-label" for="tipo_anual">Anual</label>
        </div>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarParceria.html`.
   - Em `atualizarParceria.js`, na função `buscar()`:
     // **LÓGICA ESPECIAL PARA RADIO**:
     `form.elements.namedItem("tipo_contrato").value = p.tipo_contrato || "Pontual";`
7. HTML/JS (lista):
   - Adicione `<th>Contrato</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const tipo_contrato = item.tipo_contrato || 'Pontual';`
     `...<td>${tipo_contrato}</td>...`
   - Lembre de aumentar o `colspan` para 8!


================================================================================
EXEMPLO 5: Adicionando um SELECT/DROPDOWN (Já existe um: "Status")
================================================================================

Seu CRUD já possui um `<select>` para o campo "Status". O processo para
adicionar um NOVO select (ex: `frequencia`) é idêntico.

CAMPO: `frequencia`
TIPO HTML: <select>
TIPO MYSQL: VARCHAR(100)

O processo é IDÊNTICO ao EXEMPLO 1 (Text Input).

1. DB: `ALTER TABLE PARCERIA ADD frequencia VARCHAR(100) NULL DEFAULT 'Unica' AFTER id_espaco;`
2. PHP (novo):
   `$frequencia = isset($_POST['frequencia']) ? trim($_POST['frequencia']) : 'Unica';`
   `... VALUES (?, ?, ?, ?, ?, ?)`
   `$stmt->bind_param("sssiis", ..., $id_espaco, $frequencia);` // Adiciona 's'
3. PHP (alterar):
   `$frequencia = isset($_POST['frequencia']) ? trim($_POST['frequencia']) : 'Unica';`
   `... SET ..., id_espaco = ?, frequencia = ? WHERE ...`
   `$stmt->bind_param("iissssi", ..., $id_espaco, $frequencia, $id_parceria);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... id_jardineiro, id_espaco, frequencia FROM...` (em ambos os SELECTs)
5. HTML (novo - `novaParceria.html`):
   `<div class="mb-3">
        <label for="frequencia" class="form-label">Frequência</label>
        <select class="form-select" id="frequencia" name="frequencia">
            <option value="Unica">Visita Única</option>
            <option value="Semanal">Semanal</option>
            <option value="Quinzenal">Quinzenal</option>
            <option value="Mensal">Mensal</option>
        </select>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarParceria.html`.
   - Em `atualizarParceria.js`, na função `buscar()`:
     `form.elements.namedItem("frequencia").value = p.frequencia || "Unica";`
7. HTML/JS (lista):
   - Adicione `<th>Frequência</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const frequencia = item.frequencia || 'Unica';`
     `...<td>${frequencia}</td>...`
   - Lembre de aumentar o `colspan` para 8!
*/