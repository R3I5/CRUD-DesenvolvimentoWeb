document.addEventListener("DOMContentLoaded", () => {
    buscar();
});

const btnNovo = document.getElementById("novo");
if (btnNovo) {
    btnNovo.addEventListener("click", (e) => {
        window.location.href = 'novoEspaco.html';
    });
}

async function buscar() {
    const retorno = await fetch("../../php/handlers/espaco/espacoGET.php");
    const resposta = await retorno.json();
    if (resposta.status === "ok") {
        preencherTabela(resposta.data);
    } else {
        preencherTabela([]);
    }
}

async function excluir(id) {
    if (!confirm('Confirma excluir este espaço?')) return;
    const retorno = await fetch(`../../php/handlers/espaco/espacoExcluir.php?id=${id}`);
    const resposta = await retorno.json();
    if (resposta.status === "ok") {
        alert(resposta.mensagem);
        window.location.reload();
    } else {
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela) {
    const tbody = document.getElementById('listaEspacos');
    let tbodyHtml = '';

    if (tabela.length > 0) {
        for (const item of tabela) {
            const id = item.id_espaco;
            
            const disponibilidade = item.disponibilidade == 1 ? 
                '<span class="badge bg-success">Sim</span>' : 
                '<span class="badge bg-danger">Não</span>';
            
            tbodyHtml += `
                <tr>
                    <td>${item.id_espaco}</td>
                    <td>${item.nome}</td>
                    <td>${item.descricao}</td>
                    <td>${item.endereco}</td>
                    <td>${item.cidade}</td>
                    <td>${item.estado}</td>
                    <td>${item.cep}</td>
                    <td>${disponibilidade || '-'}</td>
                    <td class="text-center">
                        <a class="btn btn-sm btn-outline-primary me-2" href="atualizarEspaco.html?id=${id}">Alterar</a>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${id})">Excluir</button>
                    </td>
                </tr>`;
        }
    } else {
        tbodyHtml = `<tr><td colspan="9" class="text-center">Nenhum espaço encontrado.</td></tr>`;
    }

    if (tbody) {
        tbody.innerHTML = tbodyHtml;
    }
}


/*
================================================================================
GUIA COMPLETO: Como Adicionar um Novo Campo no CRUD "Espaço"
================================================================================

Este é um guia de consulta baseado nos seus arquivos de "Espaço".
Para adicionar QUALQUER campo novo, você precisa seguir este "checklist" de 7 passos.

O PROCESSO (O Checklist de 7 Passos):
----------------------------------------------------------------
1.  [ BANCO DE DADOS ]  Alterar a tabela MySQL `ESPACO`.
2.  [ BACKEND ]  Editar `espacoNovo.php` (para o CREATE)
3.  [ BACKEND ]  Editar `atualizarEspaco.php` (para o UPDATE)
4.  [ BACKEND ]  Editar `espacoGET.php` (para o READ)
5.  [ FRONTEND ] Editar `novoEspaco.html` (Formulário de CREATE)
6.  [ FRONTEND ] Editar `atualizarEspaco.html` & `atualizarEspaco.js` (Formulário de UPDATE)
7.  [ FRONTEND ] Editar `index.html` & `index.js` (Lista do READ, na pasta /espaco/)

----------------------------------------------------------------
NOTAS IMPORTANTES SOBRE SEU JS (FormData & Checkbox):

1. (BOM!) Seu JS nos arquivos `espacoNovo.js` e `atualizarEspaco.js` usa `new FormData(form)`.
   Isso significa que para os passos 5 e 6, você só precisa adicionar o campo no HTML.
   O JavaScript vai pegá-lo AUTOMATICAMENTE ao salvar.

2. (MUITO BOM!) Seu JS já tem a lógica correta para checkboxes (para o campo 'disponibilidade'):
   `if (!fd.has("disponibilidade")) { fd.append("disponibilidade", "0"); }`
   Se você adicionar um NOVO checkbox (como no Exemplo 3), você DEVE
   replicar esta linha de código para o novo campo.
----------------------------------------------------------------


Abaixo estão 5 exemplos completos, um para cada tipo de campo:

================================================================================
EXEMPLO 1: Adicionando um TEXT INPUT (Ex: "Tipo de Espaço")
================================================================================

CAMPO: `tipo_espaco` (Ex: "Sala de Reunião", "Auditório")
TIPO HTML: <input type="text">
TIPO MYSQL: VARCHAR(100)

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE ESPACO ADD tipo_espaco VARCHAR(100) NULL DEFAULT NULL AFTER disponibilidade;


---
2. BACKEND (CREATE): `espacoNovo.php`
---
// ... (perto da linha 25)
$estado = isset($_POST['estado']) ? trim($_POST['estado']) : '';
$cep = isset($_POST['cep']) ? trim($_POST['cep']) : null;
$disponibilidade = isset($_POST['disponibilidade']) ? (int)$_POST['disponibilidade'] : 0;
// ADICIONE ISTO:
$tipo_espaco = isset($_POST['tipo_espaco']) ? trim($_POST['tipo_espaco']) : '';

// ... (perto da linha 34)
// MUDE DE: (7 colunas, 7 placeholders)
$stmt = $conexao->prepare(
    "INSERT INTO ESPACO (titulo, descricao, endereco, cidade, estado, cep, disponibilidade) 
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssssssi", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $disponibilidade);

// PARA: (8 colunas, 8 placeholders)
$stmt = $conexao->prepare(
    "INSERT INTO ESPACO (titulo, descricao, endereco, cidade, estado, cep, disponibilidade, tipo_espaco) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssssssis", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $disponibilidade, $tipo_espaco); // "ssssssi" -> "ssssssis"


---
3. BACKEND (UPDATE): `atualizarEspaco.php`
---
// ... (perto da linha 30)
$estado = isset($_POST['estado']) ? trim($_POST['estado']) : '';
$cep = isset($_POST['cep']) ? trim($_POST['cep']) : null;
$disponibilidade = isset($_POST['disponibilidade']) ? (int)$_POST['disponibilidade'] : 0;
// ADICIONE ISTO:
$tipo_espaco = isset($_POST['tipo_espaco']) ? trim($_POST['tipo_espaco']) : '';

// ... (perto da linha 39)
// MUDE DE: (SET 7 colunas)
$stmt = $conexao->prepare(
    "UPDATE ESPACO SET 
        titulo = ?, descricao = ?, endereco = ?, cidade = ?, estado = ?, cep = ?, disponibilidade = ? 
     WHERE id_espaco = ?"
);
$stmt->bind_param("ssssssii", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $disponibilidade, $id);

// PARA: (SET 8 colunas)
$stmt = $conexao->prepare(
    "UPDATE ESPACO SET 
        titulo = ?, descricao = ?, endereco = ?, cidade = ?, estado = ?, cep = ?, disponibilidade = ?, tipo_espaco = ? 
     WHERE id_espaco = ?"
);
$stmt->bind_param("ssssssisi", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $disponibilidade, $tipo_espaco, $id); // "ssssssii" -> "ssssssisi"


---
4. BACKEND (READ): `espacoGET.php`
---
// ... (perto da linha 28)
// MUDE O "SELECT" NAS DUAS QUERIES (de 8 para 9 colunas)
// 1ª Query (com ID):
$stmt = $conexao->prepare("SELECT id_espaco, titulo as nome, descricao, endereco, cidade, estado, cep, disponibilidade, tipo_espaco FROM ESPACO WHERE id_espaco = ?");
// 2ª Query (sem ID):
$stmt = $conexao->prepare("SELECT id_espaco, titulo as nome, descricao, endereco, cidade, estado, cep, disponibilidade, tipo_espaco FROM ESPACO ORDER BY id_espaco DESC");


---
5. FRONTEND (CREATE FORM): `novoEspaco.html`
---
<!-- (Adicione depois do "CEP", perto da linha 77) -->
<div class="mb-4">
    <label for="cep" class="form-label">CEP</label>
    <input type="text" class="form-control" id="cep" name="cep" placeholder="CEP" required>
</div>

<!-- ADICIONE ISTO: -->
<div class="mb-3">
    <label for="tipo_espaco" class="form-label">Tipo de Espaço</label>
    <input type="text" class="form-control" id="tipo_espaco" name="tipo_espaco" placeholder="Ex: Sala de Reunião">
</div>
<!-- FIM DA ADIÇÃO -->

<div class="mb-3 form-check">
<!-- ... -->


---
6. FRONTEND (UPDATE FORM): `atualizarEspaco.html` & `atualizarEspaco.js`
---
// ARQUIVO: `atualizarEspaco.html`
// (Adicione EXATAMENTE o mesmo HTML do passo 5, no mesmo lugar - depois do CEP)
<!-- ADICIONE ISTO: -->
<div class="mb-3">
    <label for="tipo_espaco" class="form-label">Tipo de Espaço</label>
    <input type="text" class="form-control" id="tipo_espaco" name="tipo_espaco" placeholder="Ex: Sala de Reunião">
</div>


// ARQUIVO: `atualizarEspaco.js` (na função `buscar()`)
// (perto da linha 48)
            form.estado.value = espaco.estado || "";
            form.cep.value = espaco.cep || "";
            // ADICIONE ISTO:
            form.tipo_espaco.value = espaco.tipo_espaco || "";
            // FIM DA ADIÇÃO
            form.disponibilidade.checked = (espaco.disponibilidade == 1);
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js` (na pasta /espaco/)
---
// ARQUIVO: `index.html` (perto da linha 57)
<thead>
    <tr>
        <!-- ... -->
        <th>Estado</th>
        <th>CEP</th>
        <!-- ADICIONE ISTO: -->
        <th>Tipo</th>
        <!-- FIM DA ADIÇÃO -->
        <th>Disponibilidade</th>
        <th class="text-center">Ações</th>
    </tr>
</thead>

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 52)
            const id = item.id_espaco;
            // ADICIONE ISTO:
            const tipo_espaco = item.tipo_espaco || '-';
            // FIM DA ADIÇÃO
            
            const disponibilidade = item.disponibilidade == 1 ? 
// ... (perto da linha 64)
            tbodyHtml += `
                <tr>
                    <!-- ... -->
                    <td>${item.estado}</td>
                    <td>${item.cep || '-'}</td>
                    <!-- ADICIONE ISTO: -->
                    <td>${tipo_espaco}</td>
                    <!-- FIM DA ADIÇÃO -->
                    <td>${disponibilidade}</td>
// ...

// (E ATUALIZE O COLSPAN na linha 75!)
// MUDE DE:
tbodyHtml = `<tr><td colspan="9" class="text-center">Nenhum espaço encontrado.</td></tr>`;
// PARA:
tbodyHtml = `<tr><td colspan="10" class="text-center">Nenhum espaço encontrado.</td></tr>`;


================================================================================
EXEMPLO 2: Adicionando um TEXTAREA (Ex: "Regras de Uso")
================================================================================

CAMPO: `regras_uso`
TIPO HTML: <textarea>
TIPO MYSQL: TEXT

O processo é IDÊNTICO ao EXEMPLO 1,
mas você usará um tipo de coluna diferente no MySQL e uma tag HTML diferente.

1. DB: `ALTER TABLE ESPACO ADD regras_uso TEXT NULL DEFAULT NULL AFTER disponibilidade;`
2. PHP (novo):
   `$regras_uso = isset($_POST['regras_uso']) ? trim($_POST['regras_uso']) : '';`
   `... VALUES (?, ..., ?)`
   `$stmt->bind_param("ssssssis", ..., $disponibilidade, $regras_uso);` // Adiciona 's'
3. PHP (alterar):
   `$regras_uso = isset($_POST['regras_uso']) ? trim($_POST['regras_uso']) : '';`
   `... SET ..., disponibilidade = ?, regras_uso = ? WHERE ...`
   `$stmt->bind_param("ssssssisi", ..., $disponibilidade, $regras_uso, $id);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... disponibilidade, regras_uso FROM...` (em ambos os SELECTs)
5. HTML (novo - `novoEspaco.html`):
   `<div class="mb-3">
        <label for="regras_uso" class="form-label">Regras de Uso</label>
        <textarea class="form-control" id="regras_uso" name="regras_uso" rows="3"></textarea>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarEspaco.html`.
   - Em `atualizarEspaco.js`, na função `buscar()`:
     `form.regras_uso.value = espaco.regras_uso || "";`
7. HTML/JS (lista):
   - Adicione `<th>Regras</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const regras_uso = item.regras_uso || '-';`
     `...<td>${regras_uso}</td>...`
   - Lembre de aumentar o `colspan` para 10!


================================================================================
EXEMPLO 3: Adicionando um CHECKBOX (Ex: "Possui WiFi?")
================================================================================

CAMPO: `possui_wifi`
TIPO HTML: <input type="checkbox">
TIPO MYSQL: TINYINT(1) (0 = Não, 1 = Sim)

**ESTE É O MAIS IMPORTANTE!** Vamos reusar a lógica do `disponibilidade`.

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE ESPACO ADD possui_wifi TINYINT(1) NOT NULL DEFAULT 0 AFTER disponibilidade;


---
2. BACKEND (CREATE): `espacoNovo.php`
---
// ... (perto da linha 25)
$disponibilidade = isset($_POST['disponibilidade']) ? (int)$_POST['disponibilidade'] : 0;
// ADICIONE ISTO (Seu JS já envia '0' ou '1', mas isso é uma garantia):
$possui_wifi = isset($_POST['possui_wifi']) ? (int)$_POST['possui_wifi'] : 0;

// ... (perto da linha 34)
// MUDE DE: (7 colunas)
$stmt = $conexao->prepare("... (..., disponibilidade) VALUES (..., ?)");
$stmt->bind_param("ssssssi", ..., $disponibilidade);
// PARA: (8 colunas)
$stmt = $conexao->prepare("... (..., disponibilidade, possui_wifi) VALUES (..., ?, ?)");
$stmt->bind_param("ssssssii", ..., $disponibilidade, $possui_wifi); // "ssssssi" -> "ssssssii" (i = integer)


---
3. BACKEND (UPDATE): `atualizarEspaco.php`
---
// ... (perto da linha 30)
$disponibilidade = isset($_POST['disponibilidade']) ? (int)$_POST['disponibilidade'] : 0;
// ADICIONE ISTO:
$possui_wifi = isset($_POST['possui_wifi']) ? (int)$_POST['possui_wifi'] : 0;

// ... (perto da linha 39)
// MUDE DE: (SET 7 colunas)
$stmt = $conexao->prepare("... SET ..., disponibilidade = ? WHERE id_espaco = ?");
$stmt->bind_param("ssssssii", ..., $disponibilidade, $id);
// PARA: (SET 8 colunas)
$stmt = $conexao->prepare("... SET ..., disponibilidade = ?, possui_wifi = ? WHERE id_espaco = ?");
$stmt->bind_param("ssssssiii", ..., $disponibilidade, $possui_wifi, $id); // "ssssssii" -> "ssssssiii"


---
4. BACKEND (READ): `espacoGET.php`
---
// ... (perto da linha 28)
// Adicione `possui_wifi` em ambos os SELECTs
// Ex:
$stmt = $conexao->prepare("SELECT ..., disponibilidade, possui_wifi FROM ESPACO WHERE id_espaco = ?");
$stmt = $conexao->prepare("SELECT ..., disponibilidade, possui_wifi FROM ESPACO ORDER BY id_espaco DESC");


---
5. FRONTEND (CREATE FORM): `novoEspaco.html` & `espacoNovo.js`
---
// ARQUIVO: `novoEspaco.html`
// (Adicione junto do checkbox 'disponibilidade', perto da linha 80)
<div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="disponibilidade" name="disponibilidade" value="1" checked>
    <label class="form-check-label" for="disponibilidade">Disponível</label>
</div>
<!-- ADICIONE ISTO: -->
<div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="possui_wifi" name="possui_wifi" value="1">
    <label class="form-check-label" for="possui_wifi">Possui WiFi</label>
</div>
<!-- FIM DA ADIÇÃO -->

// ARQUIVO: `espacoNovo.js`
// (Adicione a mesma lógica do 'disponibilidade' para o 'possui_wifi')
// (perto da linha 9)
if (!fd.has("disponibilidade")) {
    fd.append("disponibilidade", "0");
}
// ADICIONE ISTO:
if (!fd.has("possui_wifi")) {
    fd.append("possui_wifi", "0");
}
// FIM DA ADIÇÃO
try {
// ...


---
6. FRONTEND (UPDATE FORM): `atualizarEspaco.html` & `atualizarEspaco.js`
---
// ARQUIVO: `atualizarEspaco.html`
// (Adicione no mesmo lugar do passo 5)
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="disponibilidade" name="disponibilidade" value="1">
  <label class="form-check-label" for="disponibilidade">Disponível</label>
</div>
<!-- ADICIONE ISTO: -->
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="possui_wifi" name="possui_wifi" value="1">
  <label class="form-check-label" for="possui_wifi">Possui WiFi</label>
</div>
<!-- FIM DA ADIÇÃO -->


// ARQUIVO: `atualizarEspaco.js` (na função `buscar()`)
// (perto da linha 49)
            form.cep.value = espaco.cep || "";
            form.disponibilidade.checked = (espaco.disponibilidade == 1);
            // ADICIONE ISTO:
            form.possui_wifi.checked = (espaco.possui_wifi == 1);
            // FIM DA ADIÇÃO
// ...

// ARQUIVO: `atualizarEspaco.js` (na função `alterar()`)
// (perto da linha 66)
if (!fd.has("disponibilidade")) {
    fd.append("disponibilidade", "0");
}
// ADICIONE ISTO:
if (!fd.has("possui_wifi")) {
    fd.append("possui_wifi", "0");
}
// FIM DA ADIÇÃO
try {
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js` (na pasta /espaco/)
---
// ARQUIVO: `index.html` (perto da linha 57)
<thead>
    <tr>
        <!-- ... -->
        <th>CEP</th>
        <th>Disponibilidade</th>
        <!-- ADICIONE ISTO: -->
        <th>WiFi?</th>
        <!-- FIM DA ADIÇÃO -->
        <th class="text-center">Ações</th>
    </tr>
</thead>

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 52)
            const id = item.id_espaco;
            const disponibilidade = item.disponibilidade == 1 ? 
                '<span class="badge bg-success">Sim</span>' : 
                '<span class="badge bg-danger">Não</span>';
            // ADICIONE ISTO (LÓGICA ESPECIAL):
            const possui_wifi_texto = (item.possui_wifi == 1) ? "Sim" : "Não";
            // FIM DA ADIÇÃO
            
            tbodyHtml += `
// ... (perto da linha 64)
            tbodyHtml += `
                <tr>
                    <!-- ... -->
                    <td>${item.cep || '-'}</td>
                    <td>${disponibilidade}</td>
                    <!-- ADICIONE ISTO: -->
                    <td>${possui_wifi_texto}</td>
                    <!-- FIM DA ADIÇÃO -->
                    <td class="text-center">
// ...

// (E ATUALIZE O COLSPAN na linha 75!)
// MUDE DE:
tbodyHtml = `<tr><td colspan="9" ...
// PARA:
tbodyHtml = `<tr><td colspan="10" ...


================================================================================
EXEMPLO 4: Adicionando RADIO BUTTONS (Ex: "Acessibilidade")
================================================================================

CAMPO: `acessibilidade`
TIPO HTML: <input type="radio">
TIPO MYSQL: VARCHAR(50) (ou ENUM('Total', 'Parcial', 'Nenhuma'))

O processo é quase idêntico ao EXEMPLO 1 (Text Input),
mas o HTML é diferente e o JS de atualização (`buscar()`) também.

1. DB: `ALTER TABLE ESPACO ADD acessibilidade VARCHAR(50) NULL DEFAULT 'N/A' AFTER disponibilidade;`
2. PHP (novo):
   `$acessibilidade = isset($_POST['acessibilidade']) ? trim($_POST['acessibilidade']) : 'N/A';`
   `... VALUES (?, ..., ?)`
   `$stmt->bind_param("ssssssis", ..., $disponibilidade, $acessibilidade);` // Adiciona 's'
3. PHP (alterar):
   `$acessibilidade = isset($_POST['acessibilidade']) ? trim($_POST['acessibilidade']) : 'N/A';`
   `... SET ..., disponibilidade = ?, acessibilidade = ? WHERE ...`
   `$stmt->bind_param("ssssssisi", ..., $disponibilidade, $acessibilidade, $id);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... disponibilidade, acessibilidade FROM...` (em ambos os SELECTs)
5. HTML (novo - `novoEspaco.html`):
   `<div class="mb-3">
        <label class="form-label">Acessibilidade</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="acessibilidade" id="acess_total" value="Total">
            <label class="form-check-label" for="acess_total">Total</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="acessibilidade" id="acess_parcial" value="Parcial">
            <label class="form-check-label" for="acess_parcial">Parcial</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="acessibilidade" id="acess_nenhuma" value="Nenhuma" checked>
            <label class="form-check-label" for="acess_nenhuma">Nenhuma</label>
        </div>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarEspaco.html`.
   - Em `atualizarEspaco.js`, na função `buscar()`:
     // **LÓGICA ESPECIAL PARA RADIO**:
     `form.acessibilidade.value = espaco.acessibilidade || "Nenhuma";`
     // O navegador vai marcar o radio button que tiver o `value` correspondente.
7. HTML/JS (lista):
   - Adicione `<th>Acessibilidade</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const acessibilidade = item.acessibilidade || 'N/A';`
     `...<td>${acessibilidade}</td>...`
   - Lembre de aumentar o `colspan` para 10!


================================================================================
EXEMPLO 5: Adicionando um SELECT/DROPDOWN (Ex: "Capacidade")
================================================================================

CAMPO: `capacidade_faixa`
TIPO HTML: <select>
TIPO MYSQL: VARCHAR(50)

O processo é IDÊNTICO ao EXEMPLO 1 (Text Input),
mas o HTML é uma tag `<select>`.

1. DB: `ALTER TABLE ESPACO ADD capacidade_faixa VARCHAR(50) NULL DEFAULT 'N/A' AFTER disponibilidade;`
2. PHP (novo):
   `$capacidade_faixa = isset($_POST['capacidade_faixa']) ? trim($_POST['capacidade_faixa']) : 'N/A';`
   `... VALUES (?, ..., ?)`
   `$stmt->bind_param("ssssssis", ..., $disponibilidade, $capacidade_faixa);` // Adiciona 's'
3. PHP (alterar):
   `$capacidade_faixa = isset($_POST['capacidade_faixa']) ? trim($_POST['capacidade_faixa']) : 'N/A';`
   `... SET ..., disponibilidade = ?, capacidade_faixa = ? WHERE ...`
   `$stmt->bind_param("ssssssisi", ..., $disponibilidade, $capacidade_faixa, $id);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... disponibilidade, capacidade_faixa FROM...` (em ambos os SELECTs)
5. HTML (novo - `novoEspaco.html`):
   `<div class="mb-3">
        <label for="capacidade_faixa" class="form-label">Capacidade (Pessoas)</label>
        <select class="form-select" id="capacidade_faixa" name="capacidade_faixa">
            <option value="N/A">Não Aplicável</option>
            <option value="1-10">1-10</option>
            <option value="11-25">11-25</option>
            <option value="26-50">26-50</option>
            <option value="50+">50+</option>
        </select>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarEspaco.html`.
   - Em `atualizarEspaco.js`, na função `buscar()`:
     `form.capacidade_faixa.value = espaco.capacidade_faixa || "N/A";`
7. HTML/JS (lista):
   - Adicione `<th>Capacidade</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const capacidade_faixa = item.capacidade_faixa || 'N/A';`
     `...<td>${capacidade_faixa}</td>...`
   - Lembre de aumentar o `colspan` para 10!
*/