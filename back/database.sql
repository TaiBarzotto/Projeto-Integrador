Criação das tabelas
CREATE TABLE Cliente (
    Genero CHAR,
    Email VARCHAR PRIMARY KEY,
    Telefone VARCHAR,
    nome VARCHAR,
    fk_Endereco INT,
    Nascimento DATE,
    aceita_promocoes BOOLEAN
);

CREATE TABLE Fornecedor (
    Email VARCHAR,
    id INT PRIMARY KEY,
    nome_pessoa VARCHAR,
    Telefone VARCHAR,
    nome_da_marca VARCHAR
);

CREATE TABLE Despesa (
    observacao VARCHAR,
    Id INT PRIMARY KEY,
    valor DECIMAL(10,2),
    fk_categoria_despesa INT
);

CREATE TABLE Categoria_Despesa (
    Id INT PRIMARY KEY,
    descricao VARCHAR,
    nome VARCHAR
);

CREATE TABLE Categoria_Produto (
    nome VARCHAR,
    descricao VARCHAR,
    Id INT PRIMARY KEY
);

CREATE TABLE Datas_Importantes (
    Data DATE PRIMARY KEY,
    descricao VARCHAR,
    Dias_antecedencia_alerta INT
);

CREATE TABLE Usuario (
    nome VARCHAR,
    Administrador BOOLEAN,
    Senha VARCHAR,
    Email VARCHAR PRIMARY KEY
);

CREATE TABLE Caixa (
    Id INT PRIMARY KEY,
    data DATE,
    saldo_inicial DECIMAL(10,2),
    total_entradas DECIMAL(10,2),
    total_saidas DECIMAL(10,2),
    saldo_final DECIMAL(10,2)
);

CREATE TABLE Alertas (
    id INT PRIMARY KEY,
    Texto VARCHAR,
    Resolvido BOOLEAN,
    fk_padrao_texto_id INT
);

CREATE TABLE Padrao_Texto (
    texto_padrao VARCHAR,
    ID INT PRIMARY KEY
);

CREATE TABLE Produto (
    Id INT PRIMARY KEY,
    nome VARCHAR,
    Preco_venda DECIMAL(10,2)
);

CREATE TABLE Vendas (
    id INT PRIMARY KEY,
    valor_total DECIMAL(10,2),
    forma_de_pagamento VARCHAR,
    desconto DECIMAL(10,2),
    data_venda DATE,
    fk_usuario_email VARCHAR,
    fk_cliente_email VARCHAR
);

CREATE TABLE Variante_Produto_Estoque (
    ID INT PRIMARY KEY,
    codigo_de_barras BIGINT,
    tamanho VARCHAR,
    cor VARCHAR,
    quantidade_estoque INT,
    limite_minimo INT,
    data_cadastro DATE,
    ativo BOOLEAN,
    Custo DECIMAL(10,2),
    fk_produto_id INT
);

CREATE TABLE Parcela_despesa (
    Id INT PRIMARY KEY,
    numero_parcela INT,
    valor_parcela DECIMAL(10,2),
    data_vencimento DATE,
    pago BOOLEAN,
    data_pagamento DATE,
    fk_despesa_id INT
);

CREATE TABLE Parcela_venda (
    Id INT PRIMARY KEY,
    numero_parcela INT,
    valor_parcela DECIMAL(10,2),
    data_vencimento DATE,
    pago BOOLEAN,
    data_pagamento DATE,
    fk_vendas_id INT
);

CREATE TABLE Endereco (
    ID INT NOT NULL PRIMARY KEY,
    CEP VARCHAR,
    Rua VARCHAR,
    Cidade VARCHAR,
    Bairro VARCHAR,
    Complemento VARCHAR,
    Estado VARCHAR,
    Numero INT
);

CREATE TABLE Fornecedor_Estoque (
    fk_fornecedor_id INT,
    fk_estoque_id INT,
    CONSTRAINT PK_Fornecedor_Estoque
        PRIMARY KEY (fk_fornecedor_id, fk_estoque_id)
);

CREATE TABLE Categoria_Produto_Produto (
    fk_categoria_produto_id INT,
    fk_produto_id INT,
    CONSTRAINT PK_Categoria_Produto_Produto
        PRIMARY KEY (fk_categoria_produto_id, fk_produto_id)
);

CREATE TABLE item_venda (
    fk_variante_produto_estoque_id INT,
    fk_vendas_id INT,
    preco_unitario DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    quantidade INT,
    CONSTRAINT PK_Item_Venda
        PRIMARY KEY (fk_variante_produto_estoque_id, fk_vendas_id)
);

Referenciação das chaves estrangeiras
ALTER TABLE Cliente
    ADD CONSTRAINT FK_Cliente_2 FOREIGN KEY (fk_Endereco)
    REFERENCES Endereco (ID) ON DELETE SET NULL;

ALTER TABLE Alertas
    ADD CONSTRAINT FK_Alertas_2 FOREIGN KEY (fk_padrao_texto_id)
    REFERENCES Padrao_Texto (ID) ON DELETE CASCADE;

ALTER TABLE Vendas
    ADD CONSTRAINT FK_Vendas_2 FOREIGN KEY (fk_usuario_email)
    REFERENCES Usuario (Email) ON DELETE RESTRICT;

ALTER TABLE Vendas
    ADD CONSTRAINT FK_Vendas_3 FOREIGN KEY (fk_cliente_email)
    REFERENCES Cliente (Email) ON DELETE RESTRICT;

ALTER TABLE Variante_Produto_Estoque
    ADD CONSTRAINT FK_Variante_Produto_Estoque_2 FOREIGN KEY (fk_produto_id)
    REFERENCES Produto (Id) ON DELETE RESTRICT;

ALTER TABLE Parcela_despesa
    ADD CONSTRAINT FK_Parcela_despesa_2 FOREIGN KEY (fk_despesa_id)
    REFERENCES Despesa (Id) ON DELETE RESTRICT;

ALTER TABLE Parcela_venda
    ADD CONSTRAINT FK_Parcela_venda_2 FOREIGN KEY (fk_vendas_id)
    REFERENCES Vendas (id) ON DELETE CASCADE;

ALTER TABLE Fornecedor_Estoque
    ADD CONSTRAINT FK_Fornecedor_Estoque_1 FOREIGN KEY (fk_fornecedor_id)
    REFERENCES Fornecedor (id) ON DELETE RESTRICT;

ALTER TABLE Fornecedor_Estoque
    ADD CONSTRAINT FK_Fornecedor_Estoque_2 FOREIGN KEY (fk_estoque_id)
    REFERENCES Variante_Produto_Estoque (ID);

ALTER TABLE Despesa
    ADD CONSTRAINT FK_Despesa_2 FOREIGN KEY (fk_categoria_despesa)
    REFERENCES Categoria_Despesa (Id);

ALTER TABLE Categoria_Produto_Produto
    ADD CONSTRAINT FK_Categoria_Produto_Produto_1 FOREIGN KEY (fk_categoria_produto_id)
    REFERENCES Categoria_Produto (Id) ON DELETE RESTRICT;

ALTER TABLE Categoria_Produto_Produto
    ADD CONSTRAINT FK_Categoria_Produto_Produto_2 FOREIGN KEY (fk_produto_id)
    REFERENCES Produto (Id) ON DELETE RESTRICT;

ALTER TABLE item_venda
    ADD CONSTRAINT FK_item_venda_1 FOREIGN KEY (fk_variante_produto_estoque_id)
    REFERENCES Variante_Produto_Estoque (ID) ON DELETE RESTRICT;

ALTER TABLE item_venda
    ADD CONSTRAINT FK_item_venda_2 FOREIGN KEY (fk_vendas_id)
    REFERENCES Vendas (id) ON DELETE RESTRICT;

--Dados aleatórios para popular as tabelas e testar consultas
INSERT INTO Endereco (ID, CEP, Rua, Cidade, Bairro, Complemento, Estado, Numero) VALUES
(1, '89000-101', 'Rua Ametista', 'Blumenau', 'Centro', NULL, 'SC', 101),
(2, '89000-102', 'Rua Safira', 'Blumenau', 'Velha', 'Bloco B', 'SC', 202),
(3, '89000-103', 'Rua Rubi', 'Blumenau', 'Itoupava', NULL, 'SC', 303),
(4, '89000-104', 'Av. Brasil', 'Blumenau', 'Garcia', 'Sala 2', 'SC', 404),
(5, '89000-105', 'Rua Esmeralda', 'Blumenau', 'Centro', NULL, 'SC', 505),
(6, '89000-106', 'Rua Granada', 'Blumenau', 'Velha', NULL, 'SC', 606),
(7, '89000-107', 'Rua Citrino', 'Blumenau', 'Itoupava', NULL, 'SC', 707),
(8, '89000-108', 'Rua Opala', 'Blumenau', 'Ponta Aguda', 'Casa 1', 'SC', 808),
(9, '89000-109', 'Rua Jade', 'Blumenau', 'Centro', NULL, 'SC', 909),
(10, '89000-110', 'Rua Turquesa', 'Blumenau', 'Garcia', 'Fundos', 'SC', 110),
(11, '89000-111', 'Rua Pérola', 'Blumenau', 'Centro', NULL, 'SC', 111),
(12, '89000-112', 'Rua Coral', 'Blumenau', 'Velha', NULL, 'SC', 122),
(13, '89000-113', 'Rua Topázio', 'Blumenau', 'Itoupava', NULL, 'SC', 133),
(14, '89000-114', 'Rua Quartzo', 'Blumenau', 'Centro', 'Ap 3', 'SC', 144),
(15, '89000-115', 'Rua Onix', 'Blumenau', 'Velha', NULL, 'SC', 155),
(16, '89000-116', 'Rua Hematita', 'Blumenau', 'Garcia', NULL, 'SC', 166),
(17, '89000-117', 'Rua Aço', 'Blumenau', 'Centro', NULL, 'SC', 177),
(18, '89000-118', 'Rua Bronze', 'Blumenau', 'Ponta Aguda', NULL, 'SC', 188),
(19, '89000-119', 'Rua Prata', 'Blumenau', 'Velha', NULL, 'SC', 199),
(20, '89000-120', 'Rua Ouro', 'Blumenau', 'Itoupava', NULL, 'SC', 200);

INSERT INTO Categoria_Produto (nome, descricao, Id) VALUES
('Roupas', 'Peças de vestuário geral', 1),
('Calçados', 'Sapatos variados', 2),
('Acessórios', 'Itens complementares', 3),
('Infantil', 'Vestuário para crianças', 4),
('Esportivo', 'Artigos esportivos', 5),
('Praia', 'Roupas de banho', 6),
('Inverno', 'Peças para frio', 7),
('Verão', 'Peças para calor', 8),
('Social', 'Roupas formais', 9),
('Casual', 'Roupas do dia a dia', 10),
('Festa', 'Vestuário para eventos', 11),
('Fitness', 'Roupas esportivas', 12),
('Intima', 'Lingerie e similares', 13),
('Acessórios Premium', 'Itens de luxo', 14),
('Jeans', 'Produtos em jeans', 15),
('Camisetas', 'Linha de camisetas', 16),
('Mochilas', 'Bolsas e mochilas', 17),
('Meias', 'Meias diversas', 18),
('Bonés', 'Bonés e chapéus', 19),
('Linha Executiva', 'Moda corporativa', 20);

INSERT INTO Categoria_Despesa (Id, descricao, nome) VALUES
(1, 'Despesas com energia', 'Energia'),
(2, 'Despesas com água', 'Água'),
(3, 'Internet e telecom', 'Internet'),
(4, 'Compras de embalagens', 'Embalagens'),
(5, 'Serviços de limpeza', 'Limpeza'),
(6, 'Materiais de escritório', 'Escritório'),
(7, 'Manutenções diversas', 'Manutenção'),
(8, 'Despesa com transporte', 'Transporte'),
(9, 'Impostos mensais', 'Impostos'),
(10, 'Serviços bancários', 'Bancos'),
(11, 'Publicidade e marketing', 'Marketing'),
(12, 'Taxas municipais', 'Taxas'),
(13, 'Suprimentos internos', 'Suprimentos'),
(14, 'Equipamentos', 'Equipamentos'),
(15, 'Softwares', 'Software'),
(16, 'Consultorias', 'Consultoria'),
(17, 'Treinamentos', 'Treinamento'),
(18, 'Licenças', 'Licenças'),
(19, 'Seguros', 'Seguro'),
(20, 'Serviços terceirizados', 'Terceirização');

INSERT INTO Padrao_Texto (texto_padrao, ID) VALUES
('Pagamento atrasado', 1),
('Estoque baixo', 2),
('Produto com vencimento próximo', 3),
('Despesa pendente', 4),
('Cliente inadimplente', 5),
('Cadastro incompleto', 6),
('Erro no sistema', 7),
('Backup recomendado', 8),
('Revisar dados de venda', 9),
('Conferir caixa', 10),
('Atualizar preços', 11),
('Pesquisar fornecedores', 12),
('Revisar metas', 13),
('Atualizar catálogo', 14),
('Registrar despesas', 15),
('Baixa nas parcelas', 16),
('Revisar alertas', 17),
('Atualizar estoque', 18),
('Manutenção preventiva', 19),
('Aviso geral', 20);

INSERT INTO Fornecedor (Email, id, nome_pessoa, Telefone, nome_da_marca) VALUES
('forn1@mail.com', 1, 'Carlos Mendes', '47990010001', 'ModaSul'),
('forn2@mail.com', 2, 'Julia Rocha', '47990010002', 'TopWear'),
('forn3@mail.com', 3, 'Fernanda Alves', '47990010003', 'Estilo+'),
('forn4@mail.com', 4, 'Rafael Dias', '47990010004', 'FashionPrime'),
('forn5@mail.com', 5, 'Amanda Luz', '47990010005', 'EliteFit'),
('forn6@mail.com', 6, 'Tiago Souza', '47990010006', 'UrbanLook'),
('forn7@mail.com', 7, 'Larissa Lima', '47990010007', 'VesteBem'),
('forn8@mail.com', 8, 'Gabriel Farias', '47990010008', 'SportMax'),
('forn9@mail.com', 9, 'Daniela Reis', '47990010009', 'Luxio'),
('forn10@mail.com', 10, 'Marcos Klein', '47990010010', 'MegaStore'),
('forn11@mail.com', 11, 'Paula Meireles', '47990010011', 'NovaModa'),
('forn12@mail.com', 12, 'Henrique Rios', '47990010012', 'FitClub'),
('forn13@mail.com', 13, 'Marina Duarte', '47990010013', 'LinhaFina'),
('forn14@mail.com', 14, 'Rodrigo Pinto', '47990010014', 'LojaMix'),
('forn15@mail.com', 15, 'Patrícia Gomes', '47990010015', 'Clássico'),
('forn16@mail.com', 16, 'Ricardo Campos', '47990010016', 'OutletMax'),
('forn17@mail.com', 17, 'Carla Ribeiro', '47990010017', 'Estilo Vip'),
('forn18@mail.com', 18, 'Felipe Braga', '47990010018', 'ModaFit'),
('forn19@mail.com', 19, 'Sandra Costa', '47990010019', 'CityWear'),
('forn20@mail.com', 20, 'Lucas Barros', '47990010020', 'StorePro');

INSERT INTO Produto (Id, nome, Preco_venda) VALUES
(1, 'Produto 1', 49.90),
(2, 'Produto 2', 69.90),
(3, 'Produto 3', 89.90),
(4, 'Produto 4', 39.90),
(5, 'Produto 5', 79.90),
(6, 'Produto 6', 149.90),
(7, 'Produto 7', 129.90),
(8, 'Produto 8', 99.90),
(9, 'Produto 9', 59.90),
(10, 'Produto 10', 119.90),
(11, 'Produto 11', 199.90),
(12, 'Produto 12', 34.90),
(13, 'Produto 13', 29.90),
(14, 'Produto 14', 54.90),
(15, 'Produto 15', 74.90),
(16, 'Produto 16', 89.50),
(17, 'Produto 17', 139.90),
(18, 'Produto 18', 159.90),
(19, 'Produto 19', 179.90),
(20, 'Produto 20', 24.90);

INSERT INTO Usuario (nome, Administrador, Senha, Email) VALUES
('Admin01', TRUE, 'senha01', 'user01@mail.com'),
('Vendedora02', FALSE, 'senha02', 'user02@mail.com'),
('Marcos', FALSE, 'senha03', 'user03@mail.com'),
('Paula', FALSE, 'senha04', 'user04@mail.com'),
('Renata', TRUE, 'senha05', 'user05@mail.com'),
('Gilson', FALSE, 'senha06', 'user06@mail.com'),
('Clara', FALSE, 'senha07', 'user07@mail.com'),
('Fábio', FALSE, 'senha08', 'user08@mail.com'),
('Helena', TRUE, 'senha09', 'user09@mail.com'),
('Tadeu', FALSE, 'senha10', 'user10@mail.com'),
('Tiago', FALSE, 'senha11', 'user11@mail.com'),
('Amanda', TRUE, 'senha12', 'user12@mail.com'),
('Rafaela', FALSE, 'senha13', 'user13@mail.com'),
('Bruno', FALSE, 'senha14', 'user14@mail.com'),
('Juliana', TRUE, 'senha15', 'user15@mail.com'),
('Pedro', FALSE, 'senha16', 'user16@mail.com'),
('Sofia', FALSE, 'senha17', 'user17@mail.com'),
('Lucas', FALSE, 'senha18', 'user18@mail.com'),
('Carolina', TRUE, 'senha19', 'user19@mail.com'),
('Henrique', FALSE, 'senha20', 'user20@mail.com');

INSERT INTO Cliente (Genero, Email, Telefone, nome, fk_Endereco, Nascimento, aceita_promocoes) VALUES
('F', 'ana.silva@example.com', '48998540011', 'Ana Silva', 1, '1994-05-14', TRUE),
('M', 'joao.mendes@example.com', '11987651234', 'João Mendes', 2, '1988-10-22', FALSE),
('F', 'mariana.rocha@example.com', '51992213344', 'Mariana Rocha', 3, '1999-03-30', TRUE),
('M', 'carlos.pereira@example.com', '21992117890', 'Carlos Pereira', 4, '1991-12-05', TRUE),
('F', 'julia.frota@example.com', '31998564432', 'Júlia Frota', 5, '2000-07-21', FALSE),
('M', 'ricardo.souza@example.com', '11993445566', 'Ricardo Souza', 6, '1985-11-03', TRUE),
('F', 'camila.moraes@example.com', '41999887766', 'Camila Moraes', 7, '1997-01-18', TRUE),
('M', 'eduardo.alves@example.com', '11988775544', 'Eduardo Alves', 8, '1990-06-12', FALSE),
('F', 'larissa.santos@example.com', '21995543322', 'Larissa Santos', 9, '1995-04-27', TRUE),
('M', 'luiz.fernando@example.com', '41994433221', 'Luiz Fernando', 10, '1987-09-15', TRUE),
('F', 'patricia.lima@example.com', '31990011223', 'Patrícia Lima', 11, '1993-08-12', FALSE),
('M', 'marcos.azevedo@example.com', '21996677889', 'Marcos Azevedo', 12, '1989-03-03', TRUE),
('F', 'renata.cardoso@example.com', '31995566778', 'Renata Cardoso', 13, '1998-10-10', TRUE),
('M', 'allan.silveira@example.com', '11999887755', 'Allan Silveira', 14, '1992-02-25', FALSE),
('F', 'isabela.torres@example.com', '51997766554', 'Isabela Torres', 15, '1996-11-11', TRUE),
('M', 'felipe.castro@example.com', '11990088776', 'Felipe Castro', 16, '1990-01-05', TRUE),
('F', 'sabrina.costa@example.com', '41998877665', 'Sabrina Costa', 17, '1997-09-09', TRUE),
('M', 'tiago.martins@example.com', '31991122334', 'Tiago Martins', 18, '1986-04-16', FALSE),
('F', 'andressa.vieira@example.com', '22998855443', 'Andressa Vieira', 19, '1994-03-12', TRUE),
('M', 'rafael.dias@example.com', '31996543221', 'Rafael Dias', 20, '1993-12-23', TRUE);

INSERT INTO Variante_Produto_Estoque
(id, codigo_de_barras, tamanho, cor, quantidade_estoque, limite_minimo, data_cadastro, ativo, Custo, fk_produto_id)
VALUES
(1, 7891234560011, 'M', 'Branco', 4, 10, '2025-01-10', TRUE, 45.90, 1),
(2, 7891234560012, 'G', 'Branco', 11, 10, '2025-01-10', TRUE, 45.90, 1),
(3, 7891234560013, 'M', 'Preto', 30, 8, '2025-01-11', TRUE, 49.90, 2),
(4, 7891234560014, '40', 'Azul', 18, 5, '2025-01-12', TRUE, 79.90, 3),
(5, 7891234560015, '42', 'Bege', 20, 5, '2025-01-12', TRUE, 82.50, 4),
(6, 7891234560016, 'M', 'Floral', 12, 4, '2025-01-13', TRUE, 55.00, 5),
(7, 7891234560017, 'P', 'Preto', 10, 3, '2025-01-13', TRUE, 42.00, 6),
(8, 7891234560018, '38', 'Azul', 22, 6, '2025-01-14', TRUE, 78.90, 7),
(9, 7891234560019, 'M', 'Cinza', 35, 10, '2025-01-14', TRUE, 39.90, 8),
(10, 7891234560020, 'M', 'Verde', 15, 4, '2025-01-15', TRUE, 48.00, 9),
(11, 7891234560021, '38', 'Azul', 18, 5, '2025-01-15', TRUE, 69.90, 10),
(12, 7891234560022, 'M', 'Preto', 7, 3, '2025-01-16', TRUE, 32.00, 11),
(13, 7891234560023, 'G', 'Azul', 14, 4, '2025-01-16', TRUE, 46.50, 12),
(14, 7891234560024, 'M', 'Verde', 16, 5, '2025-01-17', TRUE, 44.00, 13),
(15, 7891234560025, 'M', 'Colorido', 12, 3, '2025-01-17', TRUE, 58.50, 14),
(16, 7891234560026, '39', 'Branco', 28, 10, '2025-01-18', TRUE, 89.90, 15),
(17, 7891234560027, '41', 'Cinza', 20, 8, '2025-01-18', TRUE, 92.00, 16),
(18, 7891234560028, '35', 'Ouro', 11, 3, '2025-01-19', TRUE, 99.90, 17),
(19, 7891234560029, '36', 'Preto', 13, 4, '2025-01-19', TRUE, 89.00, 18),
(20, 7891234560030, 'Único', 'Marrom', 40, 10, '2025-01-20', TRUE, 29.90, 19),
(21, 7891234560031, 'Único', 'Rosa', 22, 6, '2025-01-20', TRUE, 27.90, 20);


INSERT INTO Vendas
(id, valor_total, forma_de_pagamento, desconto, data_venda, fk_usuario_email, fk_cliente_email)
VALUES
(1, 159.90, 'PIX', 0, '2025-01-03', 'user01@mail.com', 'ana.silva@example.com'),
(2, 89.90, 'Crédito', 10, '2025-01-04', 'user02@mail.com', 'ana.silva@example.com'),
(3, 249.50, 'Débito', 5, '2025-01-06', 'user01@mail.com', 'ana.silva@example.com'),
(4, 329.90, 'PIX', 0, '2025-01-07', 'user02@mail.com', 'ana.silva@example.com'),
(5, 119.90, 'Dinheiro', 0, '2025-01-09', 'user03@mail.com', 'ana.silva@example.com'),
(6, 199.90, 'Crédito', 15, '2025-01-10', 'user04@mail.com', 'ana.silva@example.com'),
(7, 279.80, 'PIX', 0, '2025-01-11', 'user03@mail.com', 'ana.silva@example.com'),
(8, 89.90, 'Débito', 0, '2025-01-12', 'user01@mail.com', 'ana.silva@example.com'),
(9, 150.00, 'Crédito', 5, '2025-01-14', 'user02@mail.com', 'ana.silva@example.com'),
(10, 459.90, 'PIX', 20, '2025-01-15', 'user04@mail.com', 'ana.silva@example.com'),
(11, 220.00, 'Dinheiro', 0, '2025-01-16', 'user03@mail.com', 'ana.silva@example.com'),
(12, 189.90, 'Crédito', 0, '2025-01-17', 'user01@mail.com', 'ana.silva@example.com'),
(13, 330.00, 'PIX', 0, '2025-01-18', 'user02@mail.com', 'ana.silva@example.com'),
(14, 129.90, 'Débito', 0, '2025-01-19', 'user04@mail.com', 'ana.silva@example.com'),
(15, 359.70, 'Crédito', 10, '2025-01-20', 'user03@mail.com', 'ana.silva@example.com'),
(16, 219.90, 'PIX', 0, '2025-01-21', 'user02@mail.com', 'ana.silva@example.com'),
(17, 249.90, 'Dinheiro', 0, '2025-01-23', 'user01@mail.com', 'ana.silva@example.com'),
(18, 199.90, 'Débito', 0, '2025-01-24', 'user04@mail.com', 'ana.silva@example.com'),
(19, 179.80, 'PIX', 0, '2025-01-25', 'user03@mail.com', 'ana.silva@example.com'),
(20, 319.90, 'Crédito', 5, '2025-01-26', 'user02@mail.com', 'ana.silva@example.com'),
(21, 399.90, 'PIX', 15, '2025-01-27', 'user01@mail.com', 'ana.silva@example.com'),
(22, 149.90, 'Dinheiro', 0, '2025-01-28', 'user04@mail.com', 'ana.silva@example.com'),
(23, 189.90, 'Crédito', 0, '2025-01-29', 'user03@mail.com', 'ana.silva@example.com'),
(24, 249.90, 'Boleto', 5, '2025-01-30', 'user02@mail.com', 'ana.silva@example.com'),
(25, 279.90, 'PIX', 0, '2025-02-01', 'user04@mail.com', 'ana.silva@example.com'),
(26, 129.90, 'Crédito', 0, '2025-02-02', 'user01@mail.com', 'ana.silva@example.com'),
(27, 230.00, 'Débito', 0, '2025-02-03', 'user03@mail.com', 'ana.silva@example.com'),
(28, 199.90, 'PIX', 0, '2025-02-04', 'user02@mail.com', 'ana.silva@example.com'),
(29, 339.90, 'Crédito', 10, '2025-02-05', 'user04@mail.com', 'ana.silva@example.com'),
(30, 179.90, 'Dinheiro', 0, '2025-02-06', 'user01@mail.com', 'ana.silva@example.com');

INSERT INTO item_venda (fk_variante_produto_estoque_id, fk_vendas_id, preco_unitario, subtotal, quantidade) VALUES
(1, 1, 59.90, 59.90, 1),
(2, 2, 89.90, 89.90, 1),
(3, 3, 249.50, 249.50, 1),
(4, 4, 329.90, 329.90, 1),
(5, 5, 119.90, 119.90, 1),
(6, 6, 199.90, 199.90, 1),
(7, 7, 139.90, 279.80, 2),
(8, 8, 89.90, 89.90, 1),
(9, 9, 150.00, 150.00, 1),
(10, 10, 459.90, 459.90, 1),
(11, 11, 220.00, 220.00, 1),
(12, 12, 189.90, 189.90, 1),
(13, 13, 165.00, 330.00, 2),
(14, 14, 129.90, 129.90, 1),
(15, 15, 119.90, 359.70, 3),
(16, 16, 219.90, 219.90, 1),
(17, 17, 249.90, 249.90, 1),
(18, 18, 199.90, 199.90, 1),
(19, 19, 89.90, 179.80, 2),
(20, 20, 319.90, 319.90, 1);

INSERT INTO Parcela_venda 
(id, fk_vendas_id, numero_parcela, valor_parcela, data_vencimento, data_pagamento, pago)
VALUES
(1, 1, 1, 159.90, '2025-01-05', '2025-01-05', TRUE),
(2, 2, 1, 89.90, '2025-01-07', '2025-01-08', TRUE),
(3, 3, 1, 249.50, '2025-01-10', NULL, FALSE),
(4, 4, 1, 329.90, '2025-01-11', '2025-01-12', TRUE),
(5, 5, 1, 119.90, '2025-01-12', '2025-01-13', TRUE),
(6, 6, 1, 199.90, '2025-01-14', NULL, FALSE),
(7, 7, 1, 279.80, '2025-01-16', '2025-01-17', TRUE),
(8, 8, 1, 89.90, '2025-01-18', '2025-01-19', TRUE),
(9, 9, 1, 150.00, '2025-01-20', NULL, FALSE),
(10, 10, 1, 459.90, '2025-01-21', '2025-01-23', TRUE),
(11, 11, 1, 220.00, '2025-01-22', '2025-01-22', TRUE),
(12, 12, 1, 189.90, '2025-01-24', '2025-01-25', TRUE),
(13, 13, 1, 330.00, '2025-01-26', NULL, FALSE),
(14, 14, 1, 129.90, '2025-01-28', '2025-01-29', TRUE),
(15, 15, 1, 359.70, '2025-01-29', '2025-01-30', TRUE),
(16, 16, 1, 219.90, '2025-02-01', NULL, FALSE),
(17, 17, 1, 249.90, '2025-02-03', '2025-02-04', TRUE),
(18, 18, 1, 199.90, '2025-02-04', '2025-02-06', TRUE),
(19, 19, 1, 179.80, '2025-02-05', NULL, FALSE),
(20, 20, 1, 319.90, '2025-02-07', '2025-02-08', TRUE),
(21, 21, 1, 399.90, '2025-02-08', NULL, FALSE),
(22, 22, 1, 149.90, '2025-02-09', '2025-02-09', TRUE),
(23, 23, 1, 189.90, '2025-02-10', '2025-02-11', TRUE),
(24, 24, 1, 249.90, '2025-02-12', NULL, FALSE),
(25, 25, 1, 279.90, '2025-02-13', '2025-02-14', TRUE),
(26, 26, 1, 129.90, '2025-02-14', '2025-02-15', TRUE),
(27, 27, 1, 230.00, '2025-02-15', NULL, FALSE),
(28, 28, 1, 199.90, '2025-02-16', '2025-02-18', TRUE),
(29, 29, 1, 339.90, '2025-02-17', '2025-02-17', TRUE),
(30, 30, 1, 179.90, '2025-02-18', NULL, FALSE);

INSERT INTO Datas_Importantes (Data, descricao, Dias_antecedencia_alerta) VALUES
('2025-01-05', 'Renovação do contrato de internet', 7),
('2025-01-10', 'Revisão de estoque geral', 5),
('2025-01-12', 'Pagamento de taxas municipais', 10),
('2025-01-15', 'Data limite para declaração fiscal', 15),
('2025-01-20', 'Renovação de licença operacional', 20),
('2025-01-25', 'Auditoria financeira interna', 12),
('2025-01-28', 'Revisão de equipamentos', 8),
('2025-02-01', 'Campanha promocional de fevereiro', 10),
('2025-02-05', 'Fechamento contábil mensal', 7),
('2025-02-08', 'Verificação de contratos de fornecedores', 14),
('2025-02-10', 'Renovação do certificado digital', 25),
('2025-02-12', 'Planejamento de compras trimestral', 20),
('2025-02-15', 'Data limite para envio de documentos fiscais', 10),
('2025-02-18', 'Revisão do sistema de segurança', 7),
('2025-02-20', 'Atualização do catálogo de produtos', 5),
('2025-02-25', 'Campanha de divulgação em redes sociais', 3),
('2025-03-01', 'Início da campanha de Páscoa', 15),
('2025-03-05', 'Fechamento de metas trimestrais', 7),
('2025-03-10', 'Reunião com fornecedores estratégicos', 10),
('2025-03-12', 'Renovação de plano de telefonia', 12),
('2025-03-15', 'Revisão anual de manutenção', 30),
('2025-03-20', 'Organização do inventário semestral', 20),
('2025-03-22', 'Análise de desempenho da equipe', 5),
('2025-03-25', 'Pagamento de taxas federais', 15),
('2025-03-28', 'Planejamento de marketing trimestral', 7),
('2025-04-01', 'Início da campanha de outono', 10),
('2025-04-05', 'Fechamento mensal', 3),
('2025-04-10', 'Atualização anual de fornecedores', 20),
('2025-04-12', 'Renovação de seguro empresarial', 25),
('2025-04-15', 'Treinamento da equipe', 7);

INSERT INTO Despesa (Id, observacao, valor, fk_categoria_despesa) VALUES
(1,  'Compra de materiais', 320.50, 1),
(2,  'Conta de energia', 540.00, 2),
(3,  'Pagamento fornecedor', 890.90, 3),
(4,  'Internet mensal', 129.90, 2),
(5,  'Compra de embalagens', 210.00, 1),
(6,  'Manutenção de equipamentos', 480.00, 4),
(7,  'Água mensal', 98.70, 2),
(8,  'Impostos', 1120.00, 5),
(9,  'Compra de tecidos', 760.40,1),
(10, 'Serviço de limpeza', 150.00,4),
(11, 'Marketing digital', 350.00, 6),
(12, 'Conta de energia', 530.00,2),
(13, 'Compra de acessórios', 275.90,1),
(14, 'Impostos', 950.00, 5),
(15, 'Pagamento fornecedor', 640.00,3),
(16, 'Internet mensal', 129.90,2),
(17, 'Materiais de escritório', 85.90,4),
(18, 'Água mensal', 98.50, 2),
(19, 'Compra de embalagens', 230.00,1),
(20, 'Marketing digital', 360.00,6),
(21, 'Manutenção de equipamentos', 510.00, 4),
(22, 'Compra de tecidos', 890.00,1),
(23, 'Serviço de limpeza', 160.00,4),
(24, 'Taxas municipais', 270.00, 5),
(25, 'Pagamento fornecedor', 710.00,3),
(26, 'Conta de energia', 545.00,2),
(27, 'Internet mensal', 129.90,2),
(28, 'Materiais de escritório', 95.00, 4),
(29, 'Compra de acessórios', 255.00,1),
(30, 'Impostos', 1020.00, 5);

INSERT INTO Caixa (Id, data, saldo_inicial, total_entradas, total_saidas, saldo_final) VALUES
(1, '2025-01-01', 1000.00, 320.00, 150.00, 1170.00),
(2, '2025-01-02', 1170.00, 450.00, 200.00, 1420.00),
(3, '2025-01-03', 1420.00, 180.00, 300.00, 1300.00),
(4, '2025-01-04', 1300.00, 500.00, 120.00, 1680.00),
(5, '2025-01-05', 1680.00, 260.00, 140.00, 1800.00),
(6, '2025-01-06', 1800.00, 300.00, 250.00, 1850.00),
(7, '2025-01-07', 1850.00, 420.00, 190.00, 2080.00),
(8, '2025-01-08', 2080.00, 380.00, 220.00, 2240.00),
(9, '2025-01-09', 2240.00, 150.00, 300.00, 2090.00),
(10,'2025-01-10', 2090.00, 600.00, 100.00, 2590.00),
(11,'2025-01-11', 2590.00, 350.00, 200.00, 2740.00),
(12,'2025-01-12', 2740.00, 180.00, 160.00, 2760.00),
(13,'2025-01-13', 2760.00, 700.00, 300.00, 3160.00),
(14,'2025-01-14', 3160.00, 250.00, 400.00, 3010.00),
(15,'2025-01-15', 3010.00, 500.00, 150.00, 3360.00);

INSERT INTO Alertas (id, Texto, Resolvido, fk_padrao_texto_id) VALUES
(1, 'Despesa vence amanhã.', FALSE, 1),
(2, 'Estoque de camisas P abaixo do limite.', TRUE, 2),
(3, 'Despesa de energia está atrasada.', FALSE, 3),
(4, 'Entradas superaram a média semanal.', TRUE, 4),
(5, 'Saída elevada registrada hoje.', FALSE, 5),
(6, 'Meta mensal foi atingida.', TRUE, 6),
(7, 'Meta de vendas ainda não atingida.', FALSE, 7),
(8, 'Aniversário de cliente amanhã.', FALSE, 8),
(9, 'Fluxo de caixa requer revisão.', TRUE, 9),
(10,'Depósito pendente identificado.', FALSE, 10),
(11,'Inconsistência na conciliação encontrada.', TRUE, 11),
(12,'valor de venda fora do padrão.', FALSE, 12),
(13,'Hoje ocorre um evento agendado.', TRUE, 13),
(14,'Favor atualizar os cadastros pendentes.', FALSE, 14),
(15,'Realizar backup do sistema.', TRUE, 15);

INSERT INTO Fornecedor_Estoque (fk_fornecedor_id, fk_estoque_id) VALUES
(1, 3),
(2, 5),
(3, 1),
(4, 7),
(5, 2),
(6, 9),
(7, 4),
(8, 6),
(9, 8),
(10, 10),
(11, 12),
(12, 11),
(13, 14),
(14, 13),
(15, 15);

INSERT INTO Categoria_Produto_Produto (fk_categoria_produto_id, fk_produto_id) VALUES
(1, 2),
(2, 4),
(3, 1),
(4, 3),
(5, 5),
(6, 7),
(7, 6),
(8, 8),
(9, 10),
(10, 9),
(11, 11),
(12, 13),
(13, 12),
(14, 14),
(15, 15);

INSERT INTO Parcela_despesa
(Id, numero_parcela, valor_parcela, data_vencimento, pago, data_pagamento, fk_despesa_id)
VALUES
(1, 1, 120.50, '2025-01-10', TRUE,  '2025-01-09', 1),
(2, 1, 89.90,  '2025-01-12', TRUE,  '2025-01-12', 2),
(3, 1, 150.00, '2025-01-15', FALSE, NULL,          3),
(4, 1, 230.00, '2025-01-18', TRUE,  '2025-01-17', 4),
(5, 1, 75.40,  '2025-01-20', FALSE, NULL,          5),
(6, 1, 99.90,  '2025-01-22', TRUE,  '2025-01-22', 6),
(7, 1, 310.00, '2025-01-25', TRUE,  '2025-01-25', 7),
(8, 1, 65.00,  '2025-01-28', FALSE, NULL,          8),
(9, 1, 140.00, '2025-01-30', TRUE,  '2025-01-29', 9),
(10,1, 199.90, '2025-02-02', FALSE, NULL,         10),
(11,1, 180.00, '2025-02-05', TRUE,  '2025-02-05', 11),
(12,1, 220.00, '2025-02-08', FALSE, NULL,         12),
(13,1, 305.50, '2025-02-10', TRUE,  '2025-02-09', 13),
(14,1, 89.90,  '2025-02-12', TRUE,  '2025-02-12', 14),
(15,1, 149.00, '2025-02-15', FALSE, NULL,         15);
