document.addEventListener("DOMContentLoaded", () => {
    buscar();
});

const btnNovo = document.getElementById("novo");
if (btnNovo) {
    btnNovo.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = 'novoUsuario.html';
    });
}

async function buscar() {
    try {
        const retorno = await fetch("../../php/handlers/usuario/usuarioGET.php");
        const resposta = await retorno.json();
        if (resposta.status === "ok") {
            preencherTabela(resposta.data);
        } else {
            preencherTabela([]);
        }
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        preencherTabela([]);
    }
}

async function excluir(id) {
    if (!confirm(`Confirma exclusão do usuário #${id}?`)) return;

    try {
        const retorno = await fetch(`../../php/handlers/usuario/usuarioExcluir.php?id=${id}`);
        const resposta = await retorno.json();
        alert(resposta.mensagem || "Ocorreu um erro.");
        if (resposta.status === "ok") {
            window.location.reload();
        }
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Falha ao comunicar com o servidor.");
    }
}

function preencherTabela(dados) {
    const tbody = document.getElementById('listaUsuarios');
    if (!tbody) return;

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum usuário encontrado</td></tr>';
        return;
    }

    let tbodyHtml = '';
    for (const usuario of dados) {
        const id = usuario.id_usuario;
        const nome = usuario.nome_completo || '';
        const email = usuario.email || '';
        const telefone = usuario.telefone || '-';
        
        const dataCadastro = usuario.data_cadastro 
            ? new Date(usuario.data_cadastro).toLocaleDateString('pt-BR') 
            : '-';
            
        const tipo = usuario.tipo_perfil || '';

        tbodyHtml += `
            <tr>
                <td>${id}</td>
                <td>${nome}</td>
                <td>${email}</td>
                <td>${telefone}</td>
                <td>${dataCadastro}</td> <td class="text-center">${tipo}</td>
                <td class="text-center">
                    <a class="btn btn-sm btn-outline-primary me-1" href="atualizarUsuario.html?id=${id}" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluir(${id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
    }
    tbody.innerHTML = tbodyHtml;
}

/*
================================================================================
GUIA COMPLETO: Como Adicionar um Novo Campo no CRUD "Usuário"
================================================================================

Este é o guia final, baseado nos seus arquivos de "Usuário".
Este CRUD é o mais complexo, pois lida com HASH DE SENHA.
Nossas instruções vão MANTER essa lógica de segurança.

O PROCESSO (O Checklist de 7 Passos):
----------------------------------------------------------------
1.  [ BANCO DE DADOS ]  Alterar a tabela MySQL `USUARIO`.
2.  [ BACKEND ]  Editar `usuarioInserir.php` (para o CREATE)
3.  [ BACKEND ]  Editar `usuarioAtualizar.php` (para o UPDATE)
4.  [ BACKEND ]  Editar `usuarioGET.php` (para o READ)
5.  [ FRONTEND ] Editar `novoUsuario.html` & `novoUsuario.js` (Formulário de CREATE)
6.  [ FRONTEND ] Editar `atualizarUsuario.html` & `atualizarUsuario.js` (Formulário de UPDATE)
7.  [ FRONTEND ] Editar `index.html` & `index.js` (Lista do READ, na pasta /usuario/)

----------------------------------------------------------------
NOTAS IMPORTANTES SOBRE SEU PROJETO:

1. (BOM!) Seu JS (`novoUsuario.js`, `atualizarUsuario.js`) usa `new FormData(form)`.
   Isso facilita o trabalho, pois o JS pega os campos do HTML automaticamente.

2. (MUITO IMPORTANTE!) Seu backend `usuarioAtualizar.php` tem uma lógica
   CONDICIONAL para a senha (só atualiza se o campo `senha` não estiver vazio).
   Isso é ÓTIMO. Nossos exemplos vão adicionar o novo campo DENTRO
   dessa lógica condicional (tanto no `if` quanto no `else`).

3. (IMPORTANTE!) Seus arquivos JS (`novoUsuario.js`, `atualizarUsuario.js`)
   NÃO têm a lógica para tratar checkboxes (que não enviam valor se
   desmarcados). No Exemplo 3 (Checkbox), mostrarei como adicionar
   essa lógica nos arquivos JS.
----------------------------------------------------------------


Abaixo estão 5 exemplos completos, um para cada tipo de campo:

================================================================================
EXEMPLO 1: Adicionando um TEXT INPUT (Ex: "Apelido")
================================================================================

CAMPO: `apelido`
TIPO HTML: <input type="text">
TIPO MYSQL: VARCHAR(100)

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE USUARIO ADD apelido VARCHAR(100) NULL DEFAULT NULL AFTER nome_completo;


---
2. BACKEND (CREATE): `usuarioInserir.php`
---
// ... (perto da linha 25)
$nome_completo = isset($_POST['nome_completo']) ? trim($_POST['nome_completo']) : '';
// ADICIONE ISTO:
$apelido = isset($_POST['apelido']) ? trim($_POST['apelido']) : '';
// FIM DA ADIÇÃO
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
// ...

// ... (perto da linha 48)
// MUDE DE: (6 colunas)
$stmt = $conexao->prepare("INSERT INTO USUARIO (nome_completo, email, senha, telefone, data_cadastro, tipo_perfil) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $nome_completo, $email, $senha_hash, $telefone, $data_cadastro, $tipo_perfil);
// PARA: (7 colunas)
$stmt = $conexao->prepare("INSERT INTO USUARIO (nome_completo, apelido, email, senha, telefone, data_cadastro, tipo_perfil) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $nome_completo, $apelido, $email, $senha_hash, $telefone, $data_cadastro, $tipo_perfil); // "ssssss" -> "sssssss"


---
3. BACKEND (UPDATE): `usuarioAtualizar.php`
---
// ... (perto da linha 29)
$nome_completo = isset($_POST['nome_completo']) ? trim($_POST['nome_completo']) : '';
// ADICIONE ISTO:
$apelido = isset($_POST['apelido']) ? trim($_POST['apelido']) : '';
// FIM DA ADIÇÃO
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
// ...

// ----- ATUALIZE OS DOIS BLOCOS (IF e ELSE) -----

// (perto da linha 47)
if (!empty($senha)) {
    // MUDE DE:
    $query = "UPDATE USUARIO SET nome_completo = ?, email = ?, telefone = ?, tipo_perfil = ?, senha = ? WHERE id_usuario = ?";
    $types = "sssssi";
    $params = [$nome_completo, $email, $telefone, $tipo_perfil, $senha_hash, $id_usuario];
    // PARA:
    $query = "UPDATE USUARIO SET nome_completo = ?, apelido = ?, email = ?, telefone = ?, tipo_perfil = ?, senha = ? WHERE id_usuario = ?";
    $types = "ssssssi"; // Adiciona 's'
    $params = [$nome_completo, $apelido, $email, $telefone, $tipo_perfil, $senha_hash, $id_usuario]; // Adiciona $apelido

} else {
    // MUDE DE:
    $query = "UPDATE USUARIO SET nome_completo = ?, email = ?, telefone = ?, tipo_perfil = ? WHERE id_usuario = ?";
    $types = "ssssi";
    $params = [$nome_completo, $email, $telefone, $tipo_perfil, $id_usuario];
    // PARA:
    $query = "UPDATE USUARIO SET nome_completo = ?, apelido = ?, email = ?, telefone = ?, tipo_perfil = ? WHERE id_usuario = ?";
    $types = "sssssi"; // Adiciona 's'
    $params = [$nome_completo, $apelido, $email, $telefone, $tipo_perfil, $id_usuario]; // Adiciona $apelido
}


---
4. BACKEND (READ): `usuarioGET.php`
---
// ... (perto da linha 27)
// MUDE O "SELECT" NAS DUAS QUERIES (de 6 para 7 colunas)
// 1ª Query (com ID):
$stmt = $conexao->prepare("SELECT id_usuario, nome_completo, apelido, email, telefone, data_cadastro, tipo_perfil FROM USUARIO WHERE id_usuario = ?");
// 2ª Query (sem ID):
$stmt = $conexao->prepare("SELECT id_usuario, nome_completo, apelido, email, telefone, data_cadastro, tipo_perfil FROM USUARIO ORDER BY id_usuario DESC");


---
5. FRONTEND (CREATE FORM): `novoUsuario.html`
---
<!-- (Adicione depois do "Nome Completo", perto da linha 48) -->
<div class="mb-3">
    <label for="nome_completo" class="form-label">Nome Completo</label>
    <input type="text" class="form-control" id="nome_completo" name="nome_completo" required>
</div>
<!-- ADICIONE ISTO: -->
<div class="mb-3">
    <label for="apelido" class="form-label">Apelido (Opcional)</label>
    <input type="text" class="form-control" id="apelido" name="apelido">
</div>
<!-- FIM DA ADIÇÃO -->
<div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <!-- ... -->


---
6. FRONTEND (UPDATE FORM): `atualizarUsuario.html` & `atualizarUsuario.js`
---
// ARQUIVO: `atualizarUsuario.html`
// (Adicione EXATAMENTE o mesmo HTML do passo 5, no mesmo lugar)
<!-- ADICIONE ISTO: -->
<div class="mb-3">
    <label for="apelido" class="form-label">Apelido (Opcional)</label>
    <input type="text" class="form-control" id="apelido" name="apelido">
</div>


// ARQUIVO: `atualizarUsuario.js` (na função `buscar()`)
// (perto da linha 47)
            form.elements.namedItem("nome_completo").value = usuario.nome_completo || "";
            // ADICIONE ISTO:
            form.elements.namedItem("apelido").value = usuario.apelido || "";
            // FIM DA ADIÇÃO
            form.elements.namedItem("email").value = usuario.email || "";
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js` (na pasta /usuario/)
---
// ARQUIVO: `index.html` (perto da linha 48)
<thead>
    <tr>
        <th>ID</th>
        <th>Nome</th>
        <!-- ADICIONE ISTO: -->
        <th>Apelido</th>
        <!-- FIM DA ADIÇÃO -->
        <th>Email</th>
        <th>Telefone</th>
// ...

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 79)
        const id = usuario.id_usuario;
        const nome = usuario.nome_completo || '';
        // ADICIONE ISTO:
        const apelido = usuario.apelido || '-';
        // FIM DA ADIÇÃO
        const email = usuario.email || '';
// ... (perto da linha 92)
            <tr>
                <td>${id}</td>
                <td>${nome}</td>
                <!-- ADICIONE ISTO: -->
                <td>${apelido}</td>
                <!-- FIM DA ADIÇÃO -->
                <td>${email}</td>
                <td>${telefone}</td>
// ...

// (E ATUALIZE O COLSPAN na linha 76!)
// MUDE DE:
tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum usuário encontrado</td></tr>';
// PARA:
tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum usuário encontrado</td></tr>';


================================================================================
EXEMPLO 2: Adicionando um TEXTAREA (Ex: "Biografia")
================================================================================

CAMPO: `biografia`
TIPO HTML: <textarea>
TIPO MYSQL: TEXT

O processo é IDÊNTICO ao EXEMPLO 1,
mas você usará um tipo de coluna diferente no MySQL e uma tag HTML diferente.

1. DB: `ALTER TABLE USUARIO ADD biografia TEXT NULL DEFAULT NULL AFTER tipo_perfil;`
2. PHP (novo):
   `$biografia = isset($_POST['biografia']) ? trim($_POST['biografia']) : '';`
   `... VALUES (?, ?, ?, ?, ?, ?, ?)`
   `$stmt->bind_param("sssssSs", ..., $tipo_perfil, $biografia);` // Adiciona 's'
3. PHP (alterar):
   `$biografia = isset($_POST['biografia']) ? trim($_POST['biografia']) : '';`
   - `if (!empty($senha))`:
     `query = "... tipo_perfil = ?, biografia = ?, senha = ? WHERE ..."`
     `types = "ssssssi"` (adiciona 's' antes do 'i')
     `params = [..., $tipo_perfil, $biografia, $senha_hash, $id_usuario]`
   - `else`:
     `query = "... tipo_perfil = ?, biografia = ? WHERE ..."`
     `types = "sssssi"` (adiciona 's' antes do 'i')
     `params = [..., $tipo_perfil, $biografia, $id_usuario]`
4. PHP (get):
   `$sql_cols = "... data_cadastro, tipo_perfil, biografia";` (em ambos os SELECTs)
5. HTML (novo - `novoUsuario.html`):
   `<div class="mb-3">
        <label for="biografia" class="form-label">Biografia</label>
        <textarea class="form-control" id="biografia" name="biografia" rows="3"></textarea>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarUsuario.html`.
   - Em `atualizarUsuario.js`, na função `buscar()`:
     `form.elements.namedItem("biografia").value = usuario.biografia || "";`
7. HTML/JS (lista):
   - Adicione `<th>Biografia</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const biografia = item.biografia || '-';`
     `...<td>${biografia}</td>...`
   - Lembre de aumentar o `colspan` para 8!


================================================================================
EXEMPLO 3: Adicionando um CHECKBOX (Ex: "Conta Verificada?")
================================================================================

CAMPO: `conta_verificada`
TIPO HTML: <input type="checkbox">
TIPO MYSQL: TINYINT(1) (0 = Não, 1 = Sim)

**ESTE É O MAIS DIFERENTE!** Precisamos adicionar lógica ao JS.

---
1. BANCO DE DADOS (MySQL)
---
ALTER TABLE USUARIO ADD conta_verificada TINYINT(1) NOT NULL DEFAULT 0 AFTER tipo_perfil;


---
2. BACKEND (CREATE): `usuarioInserir.php`
---
// ... (perto da linha 30)
$tipo_perfil = isset($_POST['tipo_perfil']) ? $_POST['tipo_perfil'] : '';
// ADICIONE ISTO (LÓGICA ESPECIAL):
$conta_verificada = isset($_POST['conta_verificada']) ? 1 : 0; // Se foi enviado, é 1. Senão, é 0.

// ... (perto da linha 48)
// MUDE DE: (6 colunas)
$stmt = $conexao->prepare("... (..., tipo_perfil) VALUES (..., ?)");
$stmt->bind_param("ssssss", ..., $tipo_perfil);
// PARA: (7 colunas)
$stmt = $conexao->prepare("... (..., tipo_perfil, conta_verificada) VALUES (..., ?, ?)");
$stmt->bind_param("ssssssi", ..., $tipo_perfil, $conta_verificada); // "ssssss" -> "ssssssi" (i = integer)


---
3. BACKEND (UPDATE): `usuarioAtualizar.php`
---
// ... (perto da linha 33)
$tipo_perfil = isset($_POST['tipo_perfil']) ? $_POST['tipo_perfil'] : '';
// ADICIONE ISTO (LÓGICA ESPECIAL):
$conta_verificada = isset($_POST['conta_verificada']) ? 1 : 0;
// FIM DA ADIÇÃO
$senha = ...

// ----- ATUALIZE OS DOIS BLOCOS (IF e ELSE) -----

// (perto da linha 47)
if (!empty($senha)) {
    // MUDE DE:
    $query = "UPDATE USUARIO SET nome_completo = ?, email = ?, telefone = ?, tipo_perfil = ?, senha = ? WHERE id_usuario = ?";
    $types = "sssssi";
    $params = [$nome_completo, $email, $telefone, $tipo_perfil, $senha_hash, $id_usuario];
    // PARA:
    $query = "UPDATE USUARIO SET nome_completo = ?, email = ?, telefone = ?, tipo_perfil = ?, conta_verificada = ?, senha = ? WHERE id_usuario = ?";
    $types = "ssssisi"; // Adiciona 'i'
    $params = [$nome_completo, $email, $telefone, $tipo_perfil, $conta_verificada, $senha_hash, $id_usuario]; // Adiciona $conta_verificada

} else {
    // MUDE DE:
    $query = "UPDATE USUARIO SET nome_completo = ?, email = ?, telefone = ?, tipo_perfil = ? WHERE id_usuario = ?";
    $types = "ssssi";
    $params = [$nome_completo, $email, $telefone, $tipo_perfil, $id_usuario];
    // PARA:
    $query = "UPDATE USUARIO SET nome_completo = ?, email = ?, telefone = ?, tipo_perfil = ?, conta_verificada = ? WHERE id_usuario = ?";
    $types = "ssssii"; // Adiciona 'i'
    $params = [$nome_completo, $email, $telefone, $tipo_perfil, $conta_verificada, $id_usuario]; // Adiciona $conta_verificada
}


---
4. BACKEND (READ): `usuarioGET.php`
---
// ... (perto da linha 27)
// Adicione `conta_verificada` em ambos os SELECTs
// Ex:
$stmt = $conexao->prepare("SELECT ..., tipo_perfil, conta_verificada FROM USUARIO WHERE id_usuario = ?");
$stmt = $conexao->prepare("SELECT ..., tipo_perfil, conta_verificada FROM USUARIO ORDER BY id_usuario DESC");


---
5. FRONTEND (CREATE FORM): `novoUsuario.html` & `novoUsuario.js`
---
// ARQUIVO: `novoUsuario.html`
// (Adicione antes da linha "d-grid gap-2...")
<div class="mb-3">
    <label for="tipo_perfil" class="form-label">Tipo de Perfil</label>
    <select ...> ... </select>
</div>
<!-- ADICIONE ISTO: -->
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="1" id="conta_verificada" name="conta_verificada">
  <label class="form-check-label" for="conta_verificada">
    Conta Verificada
  </label>
</div>
<!-- FIM DA ADIÇÃO -->
<div class="d-flex justify-content-end">
    <!-- ... -->


// ARQUIVO: `novoUsuario.js`
// (Adicione a lógica que falta!)
// (perto da linha 9)
        e.preventDefault();

        const fd = new FormData(formUsuario);
        // ADICIONE ISTO: Lógica especial para checkbox
        if (!fd.has("conta_verificada")) {
            fd.append("conta_verificada", "0");
        }
        // FIM DA ADIÇÃO
        const endpoint = '../../php/handlers/usuario/usuarioInserir.php';
// ...


---
6. FRONTEND (UPDATE FORM): `atualizarUsuario.html` & `atualizarUsuario.js`
---
// ARQUIVO: `atualizarUsuario.html`
// (Adicione no mesmo lugar do passo 5)
<!-- ADICIONE ISTO: -->
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="1" id="conta_verificada" name="conta_verificada">
  <label class="form-check-label" for="conta_verificada">
    Conta Verificada
  </label>
</div>


// ARQUIVO: `atualizarUsuario.js` (na função `buscar()`)
// (perto da linha 47)
            form.elements.namedItem("telefone").value = usuario.telefone || "";
            form.elements.namedItem("tipo_perfil").value = usuario.tipo_perfil || "";
            // ADICIONE ISTO (LÓGICA ESPECIAL):
            form.elements.namedItem("conta_verificada").checked = (usuario.conta_verificada == 1); // Use .checked
            // FIM DA ADIÇÃO
            form.elements.namedItem("senha").value = "";
// ...

// ARQUIVO: `atualizarUsuario.js` (na função `alterar()`)
// (Adicione a lógica que falta!)
// (perto da linha 69)
async function alterar(id, form) {
    const fd = new FormData(form);

    // ADICIONE ISTO: Lógica especial para checkbox
    if (!fd.has("conta_verificada")) {
        fd.append("conta_verificada", "0");
    }
    // FIM DA ADIÇÃO

    try {
// ...


---
7. FRONTEND (READ LIST): `index.html` & `index.js` (na pasta /usuario/)
---
// ARQUIVO: `index.html` (perto da linha 48)
<thead>
    <tr>
        <!-- ... -->
        <th class="text-center">Tipo de Perfil</th>
        <!-- ADICIONE ISTO: -->
        <th>Verificado?</th>
        <!-- FIM DA ADIÇÃO -->
        <th class="text-center">Ações</th>
    </tr>
</thead>

// ARQUIVO: `index.js` (na função `preencherTabela()`)
// (perto da linha 79)
        const tipo = usuario.tipo_perfil || '';
        // ADICIONE ISTO (LÓGICA ESPECIAL):
        const verificado_texto = (usuario.conta_verificada == 1) ? "Sim" : "Não";
        // FIM DA ADIÇÃO

        tbodyHtml += `
// ... (perto da linha 92)
            <tr>
                <!-- ... -->
                <td>${dataCadastro}</td>
                <td class="text-center">${tipo}</td>
                <!-- ADICIONE ISTO: -->
                <td>${verificado_texto}</td>
                <!-- FIM DA ADIÇÃO -->
                <td class="text-center">
// ...

// (E ATUALIZE O COLSPAN na linha 76!)
// MUDE DE:
tbody.innerHTML = '<tr><td colspan="7" ...
// PARA:
tbody.innerHTML = '<tr><td colspan="8" ...


================================================================================
EXEMPLO 4: Adicionando RADIO BUTTONS (Ex: "Gênero")
================================================================================

CAMPO: `genero`
TIPO HTML: <input type="radio">
TIPO MYSQL: VARCHAR(50) (ou ENUM('Masculino', 'Feminino', 'Outro'))

O processo é quase idêntico ao EXEMPLO 1 (Text Input),
mas o HTML é diferente e o JS de atualização (`buscar()`) também.

1. DB: `ALTER TABLE USUARIO ADD genero VARCHAR(50) NULL DEFAULT 'N/A' AFTER tipo_perfil;`
2. PHP (novo):
   `$genero = isset($_POST['genero']) ? trim($_POST['genero']) : 'N/A';`
   `... VALUES (?, ..., ?, ?)`
   `$stmt->bind_param("sssssSs", ..., $tipo_perfil, $genero);` // Adiciona 's'
3. PHP (alterar):
   `$genero = isset($_POST['genero']) ? trim($_POST['genero']) : 'N/A';`
   - `if (!empty($senha))`:
     `query = "... tipo_perfil = ?, genero = ?, senha = ? WHERE ..."`
     `types = "ssssssi"` (adiciona 's' antes do 'i')
     `params = [..., $tipo_perfil, $genero, $senha_hash, $id_usuario]`
   - `else`:
     `query = "... tipo_perfil = ?, genero = ? WHERE ..."`
     `types = "sssssi"` (adiciona 's' antes do 'i')
     `params = [..., $tipo_perfil, $genero, $id_usuario]`
4. PHP (get):
   `$sql_cols = "... data_cadastro, tipo_perfil, genero";` (em ambos os SELECTs)
5. HTML (novo - `novoUsuario.html`):
   `<div class="mb-3">
        <label class="form-label">Gênero</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="genero" id="gen_m" value="Masculino">
            <label class="form-check-label" for="gen_m">Masculino</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="genero" id="gen_f" value="Feminino">
            <label class="form-check-label" for="gen_f">Feminino</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="genero" id="gen_o" value="Outro" checked>
            <label class="form-check-label" for="gen_o">Outro / Prefiro não informar</label>
        </div>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarUsuario.html`.
   - Em `atualizarUsuario.js`, na função `buscar()`:
     // **LÓGICA ESPECIAL PARA RADIO**:
     `form.elements.namedItem("genero").value = usuario.genero || "Outro";`
7. HTML/JS (lista):
   - Adicione `<th>Gênero</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const genero = item.genero || 'N/A';`
     `...<td>${genero}</td>...`
   - Lembre de aumentar o `colspan` para 8!


================================================================================
EXEMPLO 5: Adicionando um SELECT/DROPDOWN (Já existe um: "Tipo de Perfil")
================================================================================

Seu CRUD já possui um `<select>` para o campo "tipo_perfil". O processo para
adicionar um NOVO select (ex: `plano`) é idêntico ao EXEMPLO 1 (Text Input).

CAMPO: `plano`
TIPO HTML: <select>
TIPO MYSQL: VARCHAR(50)

1. DB: `ALTER TABLE USUARIO ADD plano VARCHAR(50) NULL DEFAULT 'basico' AFTER tipo_perfil;`
2. PHP (novo):
   `$plano = isset($_POST['plano']) ? trim($_POST['plano']) : 'basico';`
   `... VALUES (?, ..., ?, ?)`
   `$stmt->bind_param("sssssSs", ..., $tipo_perfil, $plano);` // Adiciona 's'
3. PHP (alterar):
   `$plano = isset($_POST['plano']) ? trim($_POST['plano']) : 'basico';`
   - `if (!empty($senha))`:
     `query = "... tipo_perfil = ?, plano = ?, senha = ? WHERE ..."`
     `types = "ssssssi"` (adiciona 's' antes do 'i')
     `params = [..., $tipo_perfil, $plano, $senha_hash, $id_usuario]`
   - `else`:
     `query = "... tipo_perfil = ?, plano = ? WHERE ..."`
     `types = "sssssi"` (adiciona 's' antes do 'i')
     `params = [..., $tipo_perfil, $plano, $id_usuario]`
4. PHP (get):
   `$sql_cols = "... data_cadastro, tipo_perfil, plano";` (em ambos os SELECTs)
5. HTML (novo - `novoUsuario.html`):
   `<div class="mb-3">
        <label for="plano" class="form-label">Plano</label>
        <select class="form-select" id="plano" name="plano">
            <option value="basico">Básico</option>
            <option value="premium">Premium</option>
        </select>
    </div>`
6. HTML/JS (atualizar):
   - Adicione o mesmo HTML do passo 5 em `atualizarUsuario.html`.
   - Em `atualizarUsuario.js`, na função `buscar()`:
     `form.elements.namedItem("plano").value = usuario.plano || "basico";`
7. HTML/JS (lista):
   - Adicione `<th>Plano</th>` em `index.html`.
   - Em `index.js`, na função `preencherTabela()`:
     `const plano = item.plano || 'basico';`
     `...<td>${plano}</td>...`
   - Lembre de aumentar o `colspan` para 8!
*/