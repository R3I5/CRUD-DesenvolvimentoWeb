document.addEventListener("DOMContentLoaded", () => {
    buscar();
});

const btnNovo = document.getElementById("novo");
if(btnNovo){
    btnNovo.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = 'novoAnuncio.html';
    });
}

async function buscar(){
    const retorno = await fetch(`../../php/handlers/anuncio/anuncio_get.php?_=${new Date().getTime()}`);
    const resposta = await retorno.json();
    if(resposta.status === "ok"){
        preencherTabela(resposta.data);
    }else{
        preencherTabela([]);
    }
}

async function excluir(id){
    if(!confirm('Confirma excluir este anúncio?')) return;
    const retorno = await fetch(`../../php/handlers/anuncio/anuncio_excluir.php?id=${id}`);
    const resposta = await retorno.json();
    if(resposta.status === "ok"){
        alert(resposta.mensagem);
        window.location.reload();
    }else{
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela){
    const tbody = document.getElementById('listaAnuncios');
    if (!tbody) return;

    let tbodyHtml = '';
    
    if (tabela.length > 0) {
        for(let i = 0; i < tabela.length; i++){
            const item = tabela[i];
            const descricao = item.descricao;
            const id = item.id_anuncio; 
            const titulo = item.titulo || '';
            const tipo = item.tipo || '';
            const preco = (item.preco !== undefined && item.preco !== null) ? Number(item.preco).toFixed(2) : '0.00';

            tbodyHtml += `
                <tr>
                    <td>${titulo}</td>
                    <td>${descricao}</td>
                    <td>${tipo}</td>
                    <td class="text-end">${preco}</td>
                    <td class="text-center">
                        <a class="btn btn-sm btn-outline-primary me-2" href="atualizarAnuncio.html?id=${id}">Alterar</a>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${id})">Excluir</button>
                    </td>
                </tr>`;
        }
    } else {
        tbodyHtml = `<tr><td colspan="4" class="text-center">Nenhum anúncio encontrado.</td></tr>`;
    }

    tbody.innerHTML = tbodyHtml; 
}

/*
================================================================================
GUIA COMPLETO: Como Adicionar um Novo Campo no seu CRUD (Passo-a-Passo)
================================================================================

Este é um guia de consulta baseado nos seus arquivos.
Para adicionar QUALQUER campo novo, você precisa seguir este "checklist" de 7 passos.

O PROCESSO (O Checklist de 7 Passos):
----------------------------------------------------------------
1.  [ BANCO DE DADOS ]  Alterar a tabela MySQL.
2.  [ BACKEND ]  Editar `anuncio_novo.php` (para o CREATE)
3.  [ BACKEND ]  Editar `anuncio_alterar.php` (para o UPDATE)
4.  [ BACKEND ]  Editar `anuncio_get.php` (para o READ)
5.  [ FRONTEND ] Editar `novoAnuncio.html` (Formulário de CREATE)
6.  [ FRONTEND ] Editar `atualizarAnuncio.html` & `atualizar_anuncio.js` (Formulário de UPDATE)
7.  [ FRONTEND ] Editar `index.html` & `index.js` (Lista do READ)

----------------------------------------------------------------
NOTA IMPORTANTE SOBRE SEU JS (FormData):
Seu JS nos arquivos `anuncio_novo.js` e `atualizar_anuncio.js` usa `new FormData(formAnuncio)`.
Isso é EXCELENTE! Significa que para os passos 5 e 6, você só precisa
adicionar o campo no HTML. O JavaScript vai pegá-lo AUTOMATICAMENTE.

A única parte "manual" do JS é em `atualizar_anuncio.js`, onde você
precisa preencher o campo na função `buscar()`.
----------------------------------------------------------------


Abaixo estão 5 exemplos completos, um para cada tipo de campo:

================================================================================
EXEMPLO 1: Adicionando um TEXT INPUT (Ex: "Localização")
================================================================================

CAMPO: `localizacao`
TIPO HTML: <input type="text">
TIPO MYSQL: VARCHAR(255)

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE anuncio ADD localizacao VARCHAR(255) NULL DEFAULT NULL AFTER preco;


---
2. BACKEND (CREATE): `anuncio_novo.php`
---
// ... (perto da linha 20)
$preco = isset($_POST['preco']) ? (float)$_POST['preco'] : 0.0;
$categoria = isset($_POST['categoria']) ? $_POST['categoria'] : '';
// ADICIONE ISTO:
$localizacao = isset($_POST['localizacao']) ? trim($_POST['localizacao']) : '';

// ... (perto da linha 33)
// MUDE DE:
$stmt = $conexao->prepare("INSERT INTO ANUNCIO (titulo, descricao, tipo, preco) VALUES (?,?,?,?)");
$stmt->bind_param("sssd", $titulo, $descricao, $tipo, $preco);
// PARA:
$stmt = $conexao->prepare("INSERT INTO ANUNCIO (titulo, descricao, tipo, preco, localizacao) VALUES (?,?,?,?,?)");
$stmt->bind_param("sssds", $titulo, $descricao, $tipo, $preco, $localizacao); // "sssd" -> "sssds"


---
3. BACKEND (UPDATE): `anuncio_alterar.php`
---
// ... (perto da linha 25)
$preco = isset($_POST['preco']) ? (float)$_POST['preco'] : 0.0;
$categoria = isset($_POST['categoria']) ? $_POST['categoria'] : '';
// ADICIONE ISTO:
$localizacao = isset($_POST['localizacao']) ? trim($_POST['localizacao']) : '';

// ... (perto da linha 36)
// MUDE DE:
$stmt = $conexao->prepare("UPDATE ANUNCIO SET titulo = ?, descricao = ?, tipo = ?, preco = ? WHERE id_anuncio = ?");
$stmt->bind_param("sssdi", $titulo, $descricao, $tipo, $preco, $id);
// PARA:
$stmt = $conexao->prepare("UPDATE ANUNCIO SET titulo = ?, descricao = ?, tipo = ?, preco = ?, localizacao = ? WHERE id_anuncio = ?");
$stmt->bind_param("ssSdsi", $titulo, $descricao, $tipo, $preco, $localizacao, $id); // "sssdi" -> "sssdsi"


---
4. BACKEND (READ): `anuncio_get.php`
---
// ... (perto da linha 25)
// MUDE DE:
$sql_cols = "id_anuncio, titulo, descricao, tipo, preco";
// PARA:
$sql_cols = "id_anuncio, titulo, descricao, tipo, preco, localizacao";


---
5. FRONTEND (CREATE FORM): `novoAnuncio.html`
---
<!-- (Adicione depois da Descrição, perto da linha 44) -->
<div class="mb-3">
    <label for="descricao" class="form-label">Descrição</label>
    <textarea class="form-control" id="descricao" name="descricao" rows="4" required></textarea>
</div>

<!-- ADICIONE ISTO: -->
<div class="mb-3">
    <label for="localizacao" class="form-label">Localização</label>
    <input type="text" class="form-control" id="localizacao" name="localizacao" placeholder="Ex: Bairro, Cidade">
</div>
<!-- FIM DA ADIÇÃO -->

<div class="row">
    <!-- ... -->


---
6. FRONTEND (UPDATE FORM): `atualizarAnuncio.html` & `atualizar_anuncio.js`
---
// ARQUIVO: `atualizarAnuncio.html`
// (Adicione EXATAMENTE o mesmo HTML do passo 5, no mesmo lugar)
<!-- ADICIONE ISTO: -->
<div class="mb-3">
    <label for="localizacao" class="form-label">Localização</label>
    <input type="text" class="form-control" id="localizacao" name="localizacao" placeholder="Ex: Bairro, Cidade">
</div>


// ARQUIVO: `atualizar_anuncio.js` (na função `buscar()`)
// (perto da linha 55)
form.descricao.value = anuncio.descricao || "";
form.preco.value = anuncio.preco || "";
// ADICIONE ISTO:
form.localizacao.value = anuncio.localizacao || "";
// FIM DA ADIÇÃO
const categoria = (anuncio.tipo === "Venda de Semente") ? "venda_plantas" : "servico_jardinagem";
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js`
---
// ARQUIVO: `index.html` (perto da linha 34)
<thead>
    <tr>
        <th>Título</th>
        <th>Descrição</th>
        <th>Tipo</th>
        <!-- ADICIONE ISTO: -->
        <th>Localização</th>
        <!-- FIM DA ADIÇÃO -->
        <th class="text-end">Preço (R$)</th>
        <th class="text-center">Ações</th>
    </tr>
</thead>

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 48)
const titulo = item.titulo || '';
const tipo = item.tipo || '';
// ADICIONE ISTO:
const localizacao = item.localizacao || 'N/D';
// FIM DA ADIÇÃO
const preco = (item.preco !== undefined && item.preco !== null) ? Number(item.preco).toFixed(2) : '0.00';

// ... (perto da linha 55)
tbodyHtml += `
    <tr>
        <td>${titulo}</td>
        <td>${descricao}</td>
        <td>${tipo}</td>
        <!-- ADICIONE ISTO: -->
        <td>${localizacao}</td>
        <!-- FIM DA ADIÇÃO -->
        <td class="text-end">${preco}</td>
        <td class="text-center">
// ...

// (E ATUALIZE O COLSPAN na linha 64!)
// MUDE DE:
tbodyHtml = `<tr><td colspan="5" class="text-center">Nenhum anúncio encontrado.</td></tr>`;
// PARA:
tbodyHtml = `<tr><td colspan="6" class="text-center">Nenhum anúncio encontrado.</td></tr>`;


================================================================================
EXEMPLO 2: Adicionando um TEXTAREA (Ex: "Observações")
================================================================================

CAMPO: `observacoes`
TIPO HTML: <textarea>
TIPO MYSQL: TEXT

O processo é IDÊNTICO ao EXEMPLO 1 (Text Input),
mas você usará um tipo de coluna diferente no MySQL e uma tag HTML diferente.

1. DB: `ALTER TABLE anuncio ADD observacoes TEXT NULL DEFAULT NULL AFTER localizacao;`
2. PHP (novo):
   `$observacoes = isset($_POST['observacoes']) ? trim($_POST['observacoes']) : '';`
   `... VALUES (?,?,?,?,?,?)`
   `$stmt->bind_param("sssdsS", ..., $localizacao, $observacoes);` // Adiciona 's'
3. PHP (alterar):
   `$observacoes = isset($_POST['observacoes']) ? trim($_POST['observacoes']) : '';`
   `... SET ..., localizacao = ?, observacoes = ? WHERE ...`
   `$stmt->bind_param("sssdsSi", ..., $localizacao, $observacoes, $id);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... preco, localizacao, observacoes";`
5. HTML (novo):
   `<div class="mb-3">
        <label for="observacoes" class="form-label">Observações</label>
        <textarea class="form-control" id="observacoes" name="observacoes" rows="3"></textarea>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarAnuncio.html`.
   - Em `atualizar_anuncio.js`, na função `buscar()`:
     `form.observacoes.value = anuncio.observacoes || "";`
7. HTML/JS (lista):
   - Adicione `<th>Observações</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const observacoes = item.observacoes || 'N/D';`
     `...<td>${observacoes}</td>...`
   - Lembre de aumentar o `colspan` para 7!


================================================================================
EXEMPLO 3: Adicionando um CHECKBOX (Ex: "Em Estoque?")
================================================================================

CAMPO: `em_estoque`
TIPO HTML: <input type="checkbox">
TIPO MYSQL: TINYINT(1) (0 = Não, 1 = Sim)

**ESTE É O MAIS DIFERENTE! PRESTE ATENÇÃO!**
Checkboxes não enviam NADA se estiverem desmarcados.

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE anuncio ADD em_estoque TINYINT(1) NOT NULL DEFAULT 0 AFTER preco;


---
2. BACKEND (CREATE): `anuncio_novo.php`
---
// ... (perto da linha 20)
$categoria = isset($_POST['categoria']) ? $_POST['categoria'] : '';
// ADICIONE ISTO (LÓGICA ESPECIAL):
$em_estoque = isset($_POST['em_estoque']) ? 1 : 0; // Se 'em_estoque' foi enviado, é 1. Senão, é 0.

// ... (perto da linha 33)
// MUDE DE:
$stmt = $conexao->prepare("INSERT INTO ANUNCIO (titulo, descricao, tipo, preco) VALUES (?,?,?,?)");
$stmt->bind_param("sssd", $titulo, $descricao, $tipo, $preco);
// PARA:
$stmt = $conexao->prepare("INSERT INTO ANUNCIO (titulo, descricao, tipo, preco, em_estoque) VALUES (?,?,?,?,?)");
$stmt->bind_param("sssdi", $titulo, $descricao, $tipo, $preco, $em_estoque); // "sssd" -> "sssdi" (i = integer)


---
3. BACKEND (UPDATE): `anuncio_alterar.php`
---
// ... (perto da linha 25)
$categoria = isset($_POST['categoria']) ? $_POST['categoria'] : '';
// ADICIONE ISTO (LÓGICA ESPECIAL):
$em_estoque = isset($_POST['em_estoque']) ? 1 : 0;

// ... (perto da linha 36)
// MUDE DE:
$stmt = $conexao->prepare("UPDATE ANUNCIO SET titulo = ?, descricao = ?, tipo = ?, preco = ? WHERE id_anuncio = ?");
$stmt->bind_param("sssdi", $titulo, $descricao, $tipo, $preco, $id);
// PARA:
$stmt = $conexao->prepare("UPDATE ANUNCIO SET titulo = ?, descricao = ?, tipo = ?, preco = ?, em_estoque = ? WHERE id_anuncio = ?");
$stmt->bind_param("sssdiI", $titulo, $descricao, $tipo, $preco, $em_estoque, $id); // "sssdi" -> "sssdii"


---
4. BACKEND (READ): `anuncio_get.php`
---
// ... (perto da linha 25)
// MUDE DE:
$sql_cols = "id_anuncio, titulo, descricao, tipo, preco";
// PARA:
$sql_cols = "id_anuncio, titulo, descricao, tipo, preco, em_estoque";


---
5. FRONTEND (CREATE FORM): `novoAnuncio.html`
---
<!-- (Adicione antes da linha "d-grid gap-2...") -->
<!-- ADICIONE ISTO: -->
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="1" id="em_estoque" name="em_estoque" checked>
  <label class="form-check-label" for="em_estoque">
    Em Estoque
  </label>
</div>
<!-- FIM DA ADIÇÃO -->

<div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <!-- ... -->


---
6. FRONTEND (UPDATE FORM): `atualizarAnuncio.html` & `atualizar_anuncio.js`
---
// ARQUIVO: `atualizarAnuncio.html`
// (Adicione no mesmo lugar do passo 5, mas SEM o 'checked')
<!-- ADICIONE ISTO: -->
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="1" id="em_estoque" name="em_estoque">
  <label class="form-check-label" for="em_estoque">
    Em Estoque
  </label>
</div>


// ARQUIVO: `atualizar_anuncio.js` (na função `buscar()`)
// (perto da linha 55)
form.descricao.value = anuncio.descricao || "";
form.preco.value = anuncio.preco || "";
// ADICIONE ISTO (LÓGICA ESPECIAL):
form.em_estoque.checked = (anuncio.em_estoque == 1); // Use .checked, NÃO .value
// FIM DA ADIÇÃO
const categoria = ...
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js`
---
// ARQUIVO: `index.html` (perto da linha 34)
<thead>
    <tr>
        <th>Título</th>
        <th>Descrição</th>
        <th>Tipo</th>
        <!-- ADICIONE ISTO: -->
        <th>Estoque?</th>
        <!-- FIM DA ADIÇÃO -->
        <th class="text-end">Preço (R$)</th>
// ...

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 48)
const tipo = item.tipo || '';
// ADICIONE ISTO (LÓGICA ESPECIAL):
const em_estoque_texto = (item.em_estoque == 1) ? "Sim" : "Não";
// FIM DA ADIÇÃO
const preco = ...

// ... (perto da linha 55)
tbodyHtml += `
    <tr>
        <td>${titulo}</td>
        <td>${descricao}</td>
        <td>${tipo}</td>
        <!-- ADICIONE ISTO: -->
        <td>${em_estoque_texto}</td>
        <!-- FIM DA ADIÇÃO -->
        <td class="text-end">${preco}</td>
// ...

// (E ATUALIZE O COLSPAN na linha 64!)
// MUDE DE:
tbodyHtml = `<tr><td colspan="5" ...
// PARA:
tbodyHtml = `<tr><td colspan="6" ...


================================================================================
EXEMPLO 4: Adicionando RADIO BUTTONS (Ex: "Condição")
================================================================================

CAMPO: `condicao`
TIPO HTML: <input type="radio">
TIPO MYSQL: VARCHAR(50) (ou ENUM('Novo', 'Usado'))

O processo é quase idêntico ao EXEMPLO 1 (Text Input),
mas o HTML é diferente e o JS de atualização (`buscar()`) também.

1. DB: `ALTER TABLE anuncio ADD condicao VARCHAR(50) NULL DEFAULT 'Novo' AFTER preco;`
2. PHP (novo):
   `$condicao = isset($_POST['condicao']) ? trim($_POST['condicao']) : 'Novo';`
   `... VALUES (?,?,?,?,?)`
   `$stmt->bind_param("sssds", ..., $preco, $condicao);` // Adiciona 's'
3. PHP (alterar):
   `$condicao = isset($_POST['condicao']) ? trim($_POST['condicao']) : 'Novo';`
   `... SET ..., preco = ?, condicao = ? WHERE ...`
   `$stmt->bind_param("sssdsi", ..., $preco, $condicao, $id);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... tipo, preco, condicao";`
5. HTML (novo):
   `<div class="mb-3">
        <label class="form-label">Condição</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="condicao" id="condicao_novo" value="Novo" checked>
            <label class="form-check-label" for="condicao_novo">Novo</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="condicao" id="condicao_usado" value="Usado">
            <label class="form-check-label" for="condicao_usado">Usado</label>
        </div>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarAnuncio.html`.
   - Em `atualizar_anuncio.js`, na função `buscar()`:
     // **LÓGICA ESPECIAL PARA RADIO**:
     `form.condicao.value = anuncio.condicao || "Novo";`
     // O navegador vai marcar o radio button que tiver o `value` correspondente.
7. HTML/JS (lista):
   - Adicione `<th>Condição</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const condicao = item.condicao || 'N/D';`
     `...<td>${condicao}</td>...`
   - Lembre de aumentar o `colspan` para 6!


================================================================================
EXEMPLO 5: Adicionando um SELECT/DROPDOWN (Ex: "Garantia")
================================================================================

CAMPO: `garantia`
TIPO HTML: <select>
TIPO MYSQL: VARCHAR(100)

O processo é IDÊNTICO ao EXEMPLO 1 (Text Input),
mas o HTML é uma tag `<select>`.

1. DB: `ALTER TABLE anuncio ADD garantia VARCHAR(100) NULL DEFAULT NULL AFTER preco;`
2. PHP (novo):
   `$garantia = isset($_POST['garantia']) ? trim($_POST['garantia']) : '';`
   `... VALUES (?,?,?,?,?)`
   `$stmt->bind_param("sssds", ..., $preco, $garantia);` // Adiciona 's'
3. PHP (alterar):
   `$garantia = isset($_POST['garantia']) ? trim($_POST['garantia']) : '';`
   `... SET ..., preco = ?, garantia = ? WHERE ...`
   `$stmt->bind_param("sssdsi", ..., $preco, $garantia, $id);` // Adiciona 's'
4. PHP (get):
   `$sql_cols = "... tipo, preco, garantia";`
5. HTML (novo):
   `<div class="mb-3">
        <label for="garantia" class="form-label">Garantia</label>
        <select class="form-select" id="garantia" name="garantia">
            <option value="">Sem garantia</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
            <option value="1a">1 ano</option>
        </select>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarAnuncio.html`.
   - Em `atualizar_anuncio.js`, na função `buscar()`:
     `form.garantia.value = anuncio.garantia || "";` // O JS cuida de selecionar a <option> correta.
7. HTML/JS (lista):
   - Adicione `<th>Garantia</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const garantia = item.garantia || 'N/D';`
     `...<td>${garantia}</td>...`
   - Lembre de aumentar o `colspan` para 6!
*/