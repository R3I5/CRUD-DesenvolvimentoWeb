CREATE DATABASE Crud;

USE Crud;

CREATE TABLE ADMINISTRADOR ( 
	id_admin INT(11) PRIMARY KEY AUTO_INCREMENT, 
    nome VARCHAR(50) DEFAULT NULL, 
    email VARCHAR(50) DEFAULT NULL, 
    usuario VARCHAR(50) DEFAULT NULL, 
    senha VARCHAR(50) DEFAULT NULL, 
    ativo TINYINT(4) DEFAULT NULL );

CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_cadastro DATETIME NOT NULL,
    tipo_perfil ENUM('Dono de Espaço', 'Jardineiro') NOT NULL
);

CREATE TABLE ESPACO (
    id_espaco INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(9),
    disponibilidade BOOLEAN DEFAULT TRUE,
    id_dono INT,
    FOREIGN KEY (id_dono) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL
);

CREATE TABLE PARCERIA (
    id_parceria INT AUTO_INCREMENT PRIMARY KEY,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status ENUM('Ativa', 'Encerrada', 'Pendente') NOT NULL,
    id_jardineiro INT,
    id_espaco INT,
    FOREIGN KEY (id_jardineiro) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_espaco) REFERENCES ESPACO(id_espaco) ON DELETE SET NULL
);

CREATE TABLE AVALIACAO (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    nota INT CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao DATE NOT NULL,
    id_avaliador INT,
    id_avaliado INT,
    id_parceria INT,
    FOREIGN KEY (id_avaliador) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_avaliado) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_parceria) REFERENCES PARCERIA(id_parceria) ON DELETE SET NULL
);

CREATE TABLE ANUNCIO (
    id_anuncio INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo ENUM('Aluguel de Ferramenta', 'Venda de Semente') NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    id_anunciante INT,
    localizacao VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_anunciante) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL
);

INSERT INTO ADMINISTRADOR (nome, email, usuario, senha, ativo)
VALUES ('Giulio', 'giulio@gmail.com', 'giulio', '1234', 1);

INSERT INTO USUARIO (nome_completo, email, senha, data_cadastro, tipo_perfil)
VALUES ('Usuario Avaliador', 'avaliador@teste.com', '123', NOW(), 'Jardineiro');

INSERT INTO USUARIO (nome_completo, email, senha, data_cadastro, tipo_perfil)
VALUES ('Usuario Avaliado', 'avaliado@teste.com', '123', NOW(), 'Dono de Espaço');

INSERT INTO ESPACO (titulo, endereco, cidade, estado, id_dono)
VALUES ('Espaço Teste', 'Rua Falsa 123', 'Cidade Falsa', 'SP', 2);

INSERT INTO PARCERIA (data_inicio, status, id_jardineiro, id_espaco)
VALUES (CURDATE(), 'Ativa', 1, 1); 

SELECT * FROM USUARIO ORDER BY id_usuario DESC;
SELECT * FROM ESPACO ORDER BY id_espaco DESC;
SELECT * FROM PARCERIA ORDER BY id_parceria DESC;