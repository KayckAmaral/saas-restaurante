# CONTEXT.md — SaaS Restaurante

> **Leia este arquivo antes de qualquer alteração no projeto.**
> Ele contém todas as decisões de arquitetura, padrões de código, infraestrutura e estado atual do desenvolvimento.

---

## 1. Visão Geral do Projeto

**Nome:** SaaS Restaurante  
**Descrição:** Sistema de gestão para o restaurante J.P. Moreira Silva (TCC).  
**Repositório:** https://github.com/KayckAmaral/saas-restaurante  
**Disciplina:** Estágio Supervisionado (TCC)  
**Orientador:** Professor da UNOESTE/FIPP  

### Funcionalidades previstas (15 estórias de usuário)

| Classificação | Função |
|---|---|
| Básica | Gerenciar Pessoa, Gerenciar Produtos e Insumos, Gerenciar Tipo de Produto, Gerenciar Marca |
| Fundamental | Registrar Venda, Atualizar Estoque, Registrar Recebimento, Abrir Caixa, Fechar Caixa, Lançar uso de Insumo, Registrar Entrada de Insumo e Produto |
| Saída (relatórios) | Relatório de Vendas, de Produtos, de Pessoas, Fluxo de Caixa |

### Status atual de implementação

- ✅ Controle de acesso (login/logout via JWT + cookie httpOnly)
- ✅ Gerenciar Pessoa Física (CRUD completo com exclusão lógica)
- ⏳ Gerenciar Marca (próxima)
- ⏳ Gerenciar Tipo de Produto (próxima)
- ⏳ Gerenciar Pessoa Jurídica (próxima)
- ⏳ Todas as funções fundamentais e relatórios

---

## 2. Stack Tecnológica

### Backend
- **Runtime:** Node.js 18 LTS
- **Framework:** Express 5
- **Módulos:** ES Modules (`"type": "module"` no package.json) — usar `import/export`, NUNCA `require()`
- **Banco:** mysql2
- **Autenticação:** jsonwebtoken (JWT via cookie httpOnly)
- **Senhas:** bcryptjs (hash com 10 rounds)
- **Documentação:** swagger-ui-express + swagger.json manual
- **Processo:** PM2 (`pm2 start server.js --name saas-backend`)
- **Porta:** 5000

### Frontend
- **Framework:** Next.js 15 + React 19
- **Estilo:** CSS-in-JS inline (objeto `styles` no final de cada componente) — NÃO usar Tailwind, NÃO usar CSS modules
- **Toast:** react-hot-toast
- **HTTP:** `utils/apiClient.js` (classe estática com métodos get/post/put/patch/delete)
- **Processo:** PM2 (`pm2 start npm --name saas-frontend -- start`)
- **Porta:** 3000
- **Tema:** escuro com laranja (`#e85d04`) como cor primária

### Proxy
- **Nginx** na porta 80 fazendo reverse proxy → porta 3000 (frontend) e porta 5000 (backend via `/api`)
- **Configuração atual:** ainda aponta tudo pra 5000 (precisa ajustar quando o frontend estiver estável)

---

## 3. Infraestrutura OCI (Oracle Cloud)

### VM
- **IP público:** `137.131.159.192`
- **SO:** Ubuntu 24.04 LTS
- **Shape:** VM.Standard.E2.1.Micro (1 OCPU, 1GB RAM + 2GB swap)
- **Usuário SSH:** `ubuntu`
- **Chave SSH:** `chave.key` (arquivo local do desenvolvedor)

### MySQL HeatWave
- **Acesso externo via NLB:** `137.131.181.176:3306`
- **Database:** `DB_ESTAGIO`
- **Admin:** `kayck` / senha definida pelo desenvolvedor
- **Usuário da app:** `kayck` / senha definida pelo desenvolvedor
- **Versão:** MySQL 9.7

### Network Load Balancer
- **Nome:** `nlb-aula`
- **IP público:** `137.131.181.176`
- **Função:** expõe o MySQL HeatWave (que só tem IP privado) externamente via TCP:3306

### Object Storage (bucket)
- **Nome:** `bucket-aula`
- **Namespace:** `grwryl8n1joz`
- **Região:** `sa-saopaulo-1`
- **Visibilidade:** público
- **Uso atual:** imagens do projeto anterior (ecommerce) — disponível para uso futuro

### Queue (Fila OCI)
- **Nome:** `fila-pedidos-email`
- **OCID:** `ocid1.queue.oc1.sa-saopaulo-1.amaaaaaah67uprqasm7ilpwgb5mhia7k3woa3kqaox6b4dwb5wzv6ntbqfja`
- **Endpoint:** `https://cell-1.queue.messaging.sa-saopaulo-1.oci.oraclecloud.com`
- **Uso atual:** projeto anterior (ecommerce) — consumer rodando no PM2 como `email-consumer`

### Email Delivery OCI
- **SMTP:** `smtp.email.sa-saopaulo-1.oci.oraclecloud.com:587`
- **Approved Sender:** `kayck@gmail.com`
- **Uso atual:** projeto anterior (ecommerce) — consumer separado no PM2

### PM2 — processos ativos na VM
| id | nome | porta | descrição |
|---|---|---|---|
| 1 | email-consumer | — | consumer da fila OCI do projeto ecommerce (manter rodando) |
| 3 | saas-backend | 5000 | API REST do SaaS Restaurante |
| 5 | saas-frontend | 3000 | Next.js do SaaS Restaurante |

---

## 4. Banco de Dados — `DB_ESTAGIO`

### Convenções do banco
- PKs: `INT AUTO_INCREMENT`
- Exclusão lógica: coluna `ativo BOOLEAN DEFAULT TRUE` nas tabelas principais
- FA (relacionamento fraco): FK nullable, `ON DELETE SET NULL`
- FO (relacionamento forte): FK NOT NULL, `ON DELETE RESTRICT`
- Nomes em MAIÚSCULAS (tabelas) e snake_case (colunas)

### Tabelas criadas (16 no total)

```
MARCA           → id_marca, nome, ativo
TIPO_PRODUTO    → id_tipo_produto, descricao (mín 10 chars), ativo
PRODUTO         → id_produto, nome, uso (INSUMO/VENDA/AMBOS), id_marca(FA), id_tipo_produto(FA), ativo
LOTE            → id_lote, id_produto(FO), quantidade, data_validade
PESSOA          → id_pessoa, nome, telefone, endereco, tipo(F/J), ativo
PESSOA_JURIDICA → id_pessoa(PK/FK), cnpj, razao_social
PESSOA_FISICA   → id_pessoa(PK/FK), cpf, data_nascimento, login, senha(bcrypt), id_pessoa_juridica(FA)
CAIXA           → id_caixa, data_abertura(UNIQUE), valor_abertura, valor_fechamento, data_fechamento, status(ABERTO/FECHADO)
VENDA           → id_venda, data_venda, forma_pagamento(DINHEIRO/PIX/CARTAO/A_PRAZO), total, id_pessoa(FA), id_colaborador(FA→PESSOA_FISICA)
ITEM_V          → id_item_v, id_venda(FO), id_produto(FO), quantidade, preco_unitario, subtotal
C_RECEBER       → id_c_receber, id_venda(FO UNIQUE), valor_total, valor_pago, status(ABERTO/QUITADO)
MOV_CAIXA       → id_mov_caixa, id_caixa(FO), id_venda(FA), id_c_receber(FA), valor, forma_pagamento(DINHEIRO/PIX/CARTAO), data_hora
ENTRADA         → id_entrada, data_entrada, id_colaborador(FA), observacao
IT_E            → id_it_e, id_entrada(FO), id_produto(FO), quantidade, data_validade
USO             → id_uso, data_uso, id_colaborador(FA), observacao
IT_USO          → id_it_uso, id_uso(FO), id_produto(FO), quantidade
```

### Regras de negócio importantes
- `PESSOA_FISICA` e `PESSOA_JURIDICA` herdam de `PESSOA` (mesma PK)
- Venda `A_PRAZO` → gera `C_RECEBER` automaticamente no backend
- Venda à vista → gera `MOV_CAIXA` diretamente
- Recebimento parcial de `C_RECEBER` → gera `MOV_CAIXA` e atualiza `valor_pago`
- Quando `C_RECEBER.valor_pago >= valor_total` → status muda para `QUITADO`
- `IT_E` ao ser inserido → cria `LOTE` automaticamente no backend
- `MOV_CAIXA` tem constraint XOR: sempre tem `id_venda` OU `id_c_receber`, nunca os dois
- Exclusão lógica em: `PESSOA` (via `ativo`), `PRODUTO`, `MARCA`, `TIPO_PRODUTO`

---

## 5. Padrão de Código — Backend

### Estrutura de pastas
```
backend/
├── server.js                  ← entry point, configura express + cors + swagger + rotas
├── package.json               ← "type": "module" obrigatório
├── swagger.js                 ← gerador do swagger.json (npm run swagger)
├── swagger.json               ← documentação gerada (commitar junto)
├── .env                       ← NÃO commitar (está no .gitignore)
├── .env.example               ← versão sem valores sensíveis (commitar)
├── db/
│   └── database.js            ← pool MySQL2, métodos: ExecutaComando, ExecutaComandoNonQuery, ExecutaComandoLastInserted, AbreTransacao, Commit, Rollback
├── entities/
│   └── entity.js              ← classe base com toJSON() genérico
├── repositories/
│   └── repository.js          ← classe base com this.banco (instância de Database)
├── middlewares/
│   └── authMiddleware.js      ← gerarToken(id, nome, login) + validar(req, res, next)
├── controllers/               ← lógica de negócio, chama repository
└── routes/                    ← define endpoints, aplica middleware, chama controller
```

### Convenções obrigatórias
1. **ES Modules:** sempre `import/export`, nunca `require()`
2. **Classes com campos privados:** `#campo` com getters/setters
3. **Static `toMap(row)`** em toda entity para mapear linha do banco
4. **Método `validar()`** em toda entity para validação básica
5. **Try/catch** em todo método de controller
6. **Exclusão lógica** via `PATCH /:id/inativar` (nunca DELETE no banco)
7. **HTTP status codes:** 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 409 Conflict, 500 Internal Server Error
8. **Swagger:** todo novo endpoint deve ser adicionado ao `swagger.json` manualmente

### Template de Entity
```js
import Entity from './entity.js';

export default class XxxEntity extends Entity {
    #id;
    #nome;
    #ativo;

    get id() { return this.#id; } set id(v) { this.#id = v; }
    get nome() { return this.#nome; } set nome(v) { this.#nome = v; }
    get ativo() { return this.#ativo; } set ativo(v) { this.#ativo = v; }

    constructor(id, nome, ativo) {
        super();
        this.#id = id;
        this.#nome = nome;
        this.#ativo = ativo;
    }

    static toMap(row) {
        return new XxxEntity(row['id_xxx'], row['nome'], row['ativo']);
    }

    validar() {
        return this.#nome != null && this.#nome.trim().length > 0;
    }
}
```

### Template de Repository
```js
import Repository from './repository.js';
import XxxEntity from '../entities/xxxEntity.js';

export default class XxxRepository extends Repository {
    constructor() { super(); }

    async listar() { /* SELECT WHERE ativo = true */ }
    async obter(id) { /* SELECT WHERE id = ? */ }
    async gravar(entidade) { /* INSERT */ }
    async atualizar(entidade) { /* UPDATE */ }
    async inativar(id) { /* UPDATE SET ativo = false */ }
}
```

### Template de Controller
```js
export default class XxxController {
    #repo;
    constructor() { this.#repo = new XxxRepository(); }

    async listar(req, res) {
        try {
            const lista = await this.#repo.listar();
            if (lista.length === 0) return res.status(404).json({ msg: 'Nenhum registro encontrado.' });
            return res.status(200).json(lista);
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao processar requisição.' });
        }
    }
    // gravar, atualizar, obter, inativar...
}
```

### Template de Router
```js
import express from 'express';
import XxxController from '../controllers/xxxController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new XxxController();
const auth = new AuthMiddleware();
const proteger = (req, res, next) => auth.validar(req, res, next);

router.get('/', proteger, (req, res) => controller.listar(req, res));
router.get('/:id', proteger, (req, res) => controller.obter(req, res));
router.post('/', proteger, (req, res) => controller.gravar(req, res));
router.put('/', proteger, (req, res) => controller.atualizar(req, res));
router.patch('/:id/inativar', proteger, (req, res) => controller.inativar(req, res));

export default router;
```

---

## 6. Padrão de Código — Frontend

### Estrutura de pastas
```
frontend/
├── package.json
├── next.config.mjs            ← reactStrictMode: false
├── app/
│   ├── globals.css            ← variáveis CSS e reset
│   ├── layout.jsx             ← RootLayout com Toaster
│   ├── page.jsx               ← redirect para /login
│   ├── login/
│   │   └── page.jsx           ← tela de login (já implementada)
│   └── dashboard/
│       └── page.jsx           ← dashboard com cards dos módulos (já implementado)
└── utils/
    └── apiClient.js           ← classe estática com get/post/put/patch/delete
```

### Convenções obrigatórias
1. **`'use client'`** no topo de todo componente que usa hooks ou eventos
2. **Sem Tailwind, sem CSS modules** — usar objeto `styles` inline no final do arquivo
3. **Tema:** fundo escuro `#1a1a2e`, cor primária laranja `#e85d04`
4. **ApiClient:** sempre usar a classe de `utils/apiClient.js`, nunca fetch direto
5. **Toast:** usar `react-hot-toast` para feedback de sucesso/erro
6. **Proteção de rota:** toda página autenticada deve chamar `ApiClient.get('autenticacao/usuario')` no `useEffect` e redirecionar pra `/login` se retornar null
7. **`credentials: 'include'`** em todas as requisições (já está no ApiClient)

### Variáveis CSS disponíveis (globals.css)
```css
--primary: #e85d04
--primary-dark: #c44d02
--secondary: #1a1a2e
--surface: #16213e
--text: #e0e0e0
--text-muted: #9e9e9e
--border: rgba(255,255,255,0.08)
--radius: 12px
--shadow: 0 8px 32px rgba(0,0,0,0.4)
```

---

## 7. Pipeline CI/CD

- **Trigger:** push na branch `main`
- **Workflow:** `.github/workflows/deploy.yml`
- **O que faz:** SSH na VM → `git pull origin main` → se `backend/package.json` existe: `npm install --production` + `pm2 restart saas-backend` → se `frontend/package.json` existe: `npm install` + `npm run build` + `pm2 restart saas-frontend`
- **Secrets configurados:** `SSH_PRIVATE_KEY` (chave privada ED25519)
- **Deploy key no GitHub:** chave pública em `~/.ssh/deploy_key.pub` da VM

### Fluxo de desenvolvimento
```
Edita no VS Code → git commit → git push → GitHub Actions → VM atualizada automaticamente
```

### Importante
- O `.env` **não** vai pro GitHub — precisa ser criado/atualizado manualmente na VM
- O `swagger.json` **vai** pro GitHub (é gerado uma vez e commitado)
- O `node_modules` **não** vai pro GitHub (`.gitignore`)

---

## 8. Variáveis de Ambiente

### Backend (`backend/.env`)
```
DB_HOST=137.131.181.176
DB_PORT=3306
DB_NAME=DB_ESTAGIO
DB_USER=kayck
DB_PASSWORD=<senha do kayck>
JWT_SEGREDO=restaurante-kayck-2026
PORT=5000
VM_IP=137.131.159.192
```

### Frontend — não tem `.env` ainda
Quando precisar apontar pra produção, criar `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://137.131.159.192:5000/
```
Em desenvolvimento local, o `apiClient.js` usa `http://localhost:5000/` por padrão.

---

## 9. Comandos Úteis na VM

```bash
# Ver processos rodando
pm2 list

# Ver logs de um processo
pm2 logs saas-backend --lines 50
pm2 logs saas-frontend --lines 50
pm2 logs email-consumer --lines 50

# Reiniciar após mudança manual
pm2 restart saas-backend
pm2 restart saas-frontend

# Atualizar manualmente (sem esperar o pipeline)
cd ~/saas-restaurante && git pull origin main

# Testar o backend
curl http://localhost:5000/health
curl -X POST http://localhost:5000/autenticacao/token \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"admin123"}'

# Conectar no banco
mysql -h 137.131.181.176 -P 3306 -u kayck -p
```

---

## 10. Decisões de Arquitetura Tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Módulos JS | ES Modules | Padrão do professor (pfs2) |
| ORM | Nenhum (SQL puro) | Padrão do professor |
| Autenticação | JWT via cookie httpOnly | Padrão do professor, seguro contra XSS |
| Hash de senha | bcryptjs | Seguro, sem dependências nativas |
| Exclusão | Lógica (ativo=false) | Requisito do TCC |
| Estilo frontend | CSS inline (objeto styles) | Padrão do professor (revisao) |
| Criação de Lote | Automática ao inserir IT_E | Evitar esquecimento manual |
| MOV_CAIXA origem | XOR entre Venda e C_Receber | Integridade: toda movimentação tem origem rastreável |
| Recebimento | Pode ser parcial | Requisito de negócio do restaurante |
| Cliente na venda | Opcional (pode ser anônimo) | Requisito de negócio |
| Caixa | 1 por dia (UNIQUE em data) | Requisito de negócio |

---

## 11. Próximos Passos (ordem sugerida)

1. **Gerenciar Marca** — entity + repository + controller + router (padrão simples, sem herança)
2. **Gerenciar Tipo de Produto** — mesmo padrão da Marca
3. **Gerenciar Pessoa Jurídica** — herança de PESSOA, similar à PessoaFisica
4. **Gerenciar Produtos e Insumos** — FK com Marca e TipoProduto
5. **Ajustar Nginx** — rotear `/` pro frontend (3000) e `/api` pro backend (5000)
6. **Telas do frontend** — uma tela por função básica, seguindo padrão do dashboard
7. **Funções fundamentais** — Venda, Caixa, Entrada, Uso, Recebimento
8. **Relatórios** — queries agregadas, exportação futura

---

## 12. Referências de Código

- **Padrão do professor (backend):** pasta `pfs2/` do projeto de referência
- **Padrão do professor (frontend):** pasta `revisao/frontend/` do projeto de referência
- **Script do banco:** `backend/db/seed.sql` (usuário admin inicial)
- **Script completo do banco:** `script_banco_completo.sql` (fora do repositório, salvo localmente)
