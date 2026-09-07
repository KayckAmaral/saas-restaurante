# PROGRESSO.md — SaaS Restaurante

> Arquivo de acompanhamento de desenvolvimento. Atualizado a cada funcionalidade concluída.
> Fonte de verdade para padrões e decisões: `CONTEXT.md`.

---

## 1. Estado atual do código (verificado em 2026-09-07)

### Backend (`backend/`)
Implementado e em produção:
- `db/database.js` — pool mysql2 com `ExecutaComando`, `ExecutaComandoNonQuery`, `ExecutaComandoLastInserted`, `AbreTransacao`, `Commit`, `Rollback`
- `entities/entity.js` — classe base (`toJSON()`)
- `middlewares/authMiddleware.js` — `gerarToken()` + `validar()` (JWT via cookie httpOnly)
- **Pessoa Física** — entity + repository + controller + router completos (CRUD + `trocarSenha` + `validarAcesso`)
- **Autenticação** — `autenticacaoRouter.js` (login/logout/usuario logado)
- `swagger.js` / `swagger.json` — documentação gerada
- `db/seed.sql` — usuário admin inicial

Ainda não existem no backend: `repositories/repository.js` já existe (base genérica), mas **nenhum outro módulo de negócio** (Marca, Tipo de Produto, Pessoa Jurídica, Produto, Lote, Venda, Caixa, etc.) tem entity/repository/controller/router ainda.

### Frontend (`frontend/`)
Implementado:
- `app/login/page.jsx` — tela de login
- `app/dashboard/page.jsx` — dashboard com cards dos módulos (todos "Em breve" exceto Pessoas)
- `app/layout.jsx`, `app/globals.css`, `app/page.jsx` (redirect pra /login)
- `utils/apiClient.js` — cliente HTTP estático (get/post/put/patch/delete)

Ainda não existem: nenhuma tela de CRUD (nem para Pessoa Física, que já existe no backend). O dashboard aponta "Disponível" pra Pessoas mas não há página implementada ainda.

### Banco de dados
16 tabelas todas criadas conforme `CONTEXT.md` seção 4 (ambiente de produção MySQL HeatWave, `DB_ESTAGIO`).

---

## 2. As 15 funcionalidades (do CONTEXT.md, seção 1)

| Id | Função | Classificação | Complexidade | Backend | Frontend |
|---|---|---|---|---|---|
| 1 | Gerenciar Pessoa (Física) | Básica | BAIXA | ✅ | ⬜ |
| 1b | Gerenciar Pessoa Jurídica | Básica | BAIXA | ⬜ | ⬜ |
| 2 | Gerenciar Produtos e Insumos | Básica | BAIXA | ⬜ | ⬜ |
| 3 | Gerenciar Tipo de Produto | Básica | BAIXA | ⬜ | ⬜ |
| 4 | Gerenciar Marca | Básica | BAIXA | ✅ | ✅ |
| 5 | Registrar Venda | Fundamental | ALTA | ⬜ | ⬜ |
| 6 | Atualizar Estoque | Fundamental | BAIXA | ⬜ | ⬜ |
| 7 | Registrar Recebimento | Fundamental | MÉDIA | ⬜ | ⬜ |
| 8 | Abrir Caixa | Fundamental | BAIXA | ⬜ | ⬜ |
| 9 | Fechar Caixa | Fundamental | BAIXA | ⬜ | ⬜ |
| 10 | Lançar uso de Insumo | Fundamental | MÉDIA | ⬜ | ⬜ |
| 11 | Registrar Entrada de Insumo e Produto | Fundamental | MÉDIA | ⬜ | ⬜ |
| 12 | Relatório de Vendas | Saída | BAIXA | ⬜ | ⬜ |
| 13 | Relatório de Produtos | Saída | MUITO ALTA | ⬜ | ⬜ |
| 14 | Relatório de Pessoas | Saída | BAIXA | ⬜ | ⬜ |
| 15 | Fluxo de Caixa | Saída | BAIXA | ⬜ | ⬜ |

---

## 3. Ordem de desenvolvimento planejada

A ordem segue `CONTEXT.md` seção 12, do mais simples (sem dependências) ao mais complexo:

### Fase A — Cadastros básicos (sem dependências entre si)
1. **Gerenciar Marca** — entity + repository + controller + router (backend) + tela CRUD (frontend)
2. **Gerenciar Tipo de Produto** — mesmo padrão da Marca
3. **Gerenciar Pessoa Jurídica** — herança de PESSOA (igual Pessoa Física), FK opcional para vincular pessoa física a uma jurídica

### Fase B — Cadastros com dependência
4. **Gerenciar Produtos e Insumos** — depende de Marca e Tipo de Produto (FKs fracas/FA)
5. **Tela CRUD de Pessoa Física** — o backend já existe, falta só o frontend

### Fase C — Ajuste de infraestrutura
6. **Ajustar Nginx** — rotear `/` → frontend (3000), `/api` → backend (5000) — necessário antes de expor mais funcionalidades publicamente

### Fase D — Funções fundamentais (regras de negócio mais complexas)
7. **Abrir/Fechar Caixa** — 1 caixa por dia, status ABERTO/FECHADO
8. **Registrar Entrada de Insumo e Produto** — cria LOTE automaticamente
9. **Lançar Uso de Insumo**
10. **Registrar Venda** — a mais complexa: gera C_RECEBER (a prazo) ou MOV_CAIXA (à vista) automaticamente
11. **Registrar Recebimento** — quitação parcial/total de C_RECEBER, gera MOV_CAIXA

### Fase E — Relatórios (fase final)
12. Relatório de Pessoas (BAIXA)
13. Relatório de Vendas (BAIXA)
14. Fluxo de Caixa (BAIXA)
15. Relatório de Produtos (MUITO ALTA — múltiplos filtros combináveis)

---

## 4. Checklist padrão por funcionalidade CRUD simples (ex.: Marca, Tipo de Produto)

Backend:
- [ ] `entities/xxxEntity.js` — campos privados + getters/setters + `static toMap(row)` + `validar()`
- [ ] `repositories/xxxRepository.js` — `listar/obter/gravar/atualizar/inativar`
- [ ] `controllers/xxxController.js` — try/catch, status HTTP corretos
- [ ] `routes/xxxRouter.js` — rotas protegidas por `authMiddleware`
- [ ] Registrar router em `server.js`
- [ ] Adicionar endpoints ao `swagger.json`

Frontend:
- [ ] Página em `app/<modulo>/page.jsx` com `'use client'`
- [ ] Proteção de rota (`ApiClient.get('autenticacao/usuario')` no `useEffect`)
- [ ] Listagem + formulário de cadastro/edição + inativar, via `ApiClient`
- [ ] Toast de sucesso/erro (`react-hot-toast`)
- [ ] Objeto `styles` inline no final do arquivo, tema escuro/laranja
- [ ] Atualizar card do módulo no dashboard (badge "Disponível")

---

## 5. Log de progresso

| Data | O que foi feito |
|---|---|
| 2026-09-07 | Levantamento do estado atual do projeto e criação deste arquivo de acompanhamento. Nenhum código novo ainda. |
| 2026-09-07 | **Gerenciar Marca concluído.** Backend: `marcaEntity.js`, `marcaRepository.js`, `marcaController.js`, `marcaRouter.js` (CRUD + inativar), registrado em `server.js` e `swagger.js`, endpoints documentados em `swagger.json`. Frontend: tela `/marca` (listar, cadastrar, editar, inativar) com proteção de rota, card adicionado no dashboard. `npm run build` do frontend passou sem erros. Ainda não testado ponta a ponta contra o banco (sem ambiente local rodando). |

---

## 6. Próxima ação

**Fase A, item 1 (Gerenciar Marca) concluída.** Próximo: **Fase A, item 2 — Gerenciar Tipo de Produto**, seguindo o mesmo padrão (entity/repository/controller/router + tela CRUD).

> Pendente de validação: testar o fluxo de Marca de ponta a ponta (cadastrar/editar/inativar) contra o banco real, seja localmente com túnel/`.env` apontando para a OCI, seja após o próximo deploy.
