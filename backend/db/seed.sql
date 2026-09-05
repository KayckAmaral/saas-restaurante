-- ============================================================
-- Seed inicial — cria o usuário administrador do sistema
-- Senha: admin123  (hash bcrypt com 10 rounds)
-- IMPORTANTE: troque a senha após o primeiro login!
-- ============================================================

USE DB_ESTAGIO;

-- 1) Insere na tabela base PESSOA
INSERT INTO PESSOA (nome, telefone, endereco, tipo, ativo)
VALUES ('Administrador', NULL, NULL, 'F', true);

-- 2) Insere na PESSOA_FISICA com o mesmo id gerado acima
INSERT INTO PESSOA_FISICA (id_pessoa, cpf, data_nascimento, login, senha, id_pessoa_juridica)
VALUES (
    LAST_INSERT_ID(),
    NULL,
    NULL,
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuu', -- admin123
    NULL
);
