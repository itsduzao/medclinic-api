# Medclinic API

API REST para gerenciamento de usuários, com o escopo atual concentrado em autenticação e autorização. A aplicação permite criar usuários, autenticar credenciais com JWT, consultar o perfil autenticado e proteger rotas por perfil de acesso.

## Tecnologias

- Node.js 24 e TypeScript
- Express 5
- PostgreSQL 16
- TypeORM e migrações
- JSON Web Token (`jsonwebtoken`)
- Argon2 para hash e validação de senhas
- `class-validator` e `class-transformer` para validação dos corpos das requisições
- Biome para lint e formatação
- Docker Compose para provisionar o banco de dados

## Requisitos

- Node.js 24 ou compatível com ESNext
- npm
- PostgreSQL 16 ou Docker com Docker Compose
- Uma cópia das variáveis definidas em `.env.example`

## Configuração

Crie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Variáveis disponíveis:

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `DB_NAME` | Nome do banco PostgreSQL | `medclinic` |
| `DB_USER` | Usuário do banco | `medclinic-adm` |
| `DB_PASSWORD` | Senha do banco | `change-me` |
| `DB_HOST` | Host do banco; use `localhost` fora do Docker | `db` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `JWT_SECRET` | Chave usada para assinar os tokens | `change-me` |
| `JWT_EXPIRES_IN` | Validade do JWT aceita pelo `jsonwebtoken` | `8h` |

Em um ambiente real, substitua os valores de exemplo por credenciais fortes. O `JWT_SECRET` deve ser mantido em segredo.

## Banco de dados

O `docker-compose.yml` disponibiliza um PostgreSQL 16 com volume persistente. Para iniciar somente o banco:

```bash
docker compose up -d db
```

Nesse cenário, configure `DB_HOST=localhost` no `.env`, pois a aplicação será executada fora da rede do Compose. Para usar outro PostgreSQL, ajuste as variáveis de conexão conforme o ambiente.

As tabelas são criadas por migração, com `synchronize` desabilitado. Execute as migrações antes de iniciar a API:

```bash
npm run migration:run
```

## Instalação e execução

```bash
npm install
cp .env.example .env
npm run migration:run
npm run dev
```

A API fica disponível em `http://localhost:3000/api/v1`.


## Arquitetura

O projeto segue uma organização por responsabilidade: rotas encaminham requisições para controllers, services concentram regras de negócio, repositories encapsulam o acesso a dados e middlewares tratam validação, autenticação, autorização e erros.

```text
src/
├── controllers/       # Entrada HTTP e formato das respostas
├── database/           # DataSource e migrações TypeORM
├── dtos/               # Contratos e validações dos corpos
├── entities/           # Entidades persistidas e enumeração de papéis
├── errors/             # Erros de aplicação
├── middlewares/        # Validação, JWT, papéis e tratamento de erros
├── repositories/       # Repositórios TypeORM
├── routes/             # Rotas /api/v1
├── services/           # Regras de autenticação e usuários
├── types/              # Extensões e tipos do Express
└── utils/              # JWT, senhas e variáveis obrigatórias
```

## Autenticação e autorização

O login devolve um token JWT. Envie-o nas rotas protegidas usando o cabeçalho:

```http
Authorization: Bearer <token>
```

Senhas são armazenadas usando Argon2. A autenticação valida o token, seu emissor e o papel do usuário. A autorização da rota `GET /users/ping` exige o papel `ADMIN`.

### `POST /api/v1/auth/register`

Cria um usuário. Todos os campos são obrigatórios; `email` deve ser válido e `role` deve ser `ADMIN` ou `STAFF`.

Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
	-H 'Content-Type: application/json' \
	-d '{
		"name": "Ana Silva",
		"email": "ana@example.com",
		"password": "senha-segura",
		"role": "STAFF"
	}'
```

Resposta `201 Created`:

```json
{
	"id": 1,
	"name": "Ana Silva",
	"email": "ana@example.com",
	"role": "STAFF"
}
```

### `POST /api/v1/auth/login`

Autentica um usuário. `email` e `password` são obrigatórios; a senha deve ter no mínimo oito caracteres.

Requisição:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
	-H 'Content-Type: application/json' \
	-d '{
		"email": "ana@example.com",
		"password": "senha-segura"
	}'
```

Resposta `200 OK`:

```json
{
	"token": "<jwt>",
	"user": {
		"id": 1,
		"name": "Ana Silva",
		"email": "ana@example.com",
		"role": "STAFF"
	}
}
```

### `GET /api/v1/users/me`

Retorna os dados do usuário associado ao JWT. Requer `Authorization: Bearer <token>`.

Resposta `200 OK`:

```json
{
	"id": 1,
	"name": "Ana Silva",
	"email": "ana@example.com",
	"role": "STAFF"
}
```

### `GET /api/v1/users/ping`

Verifica o acesso a uma rota exclusiva para administradores. Requer um JWT válido de um usuário com `role: ADMIN`.

Resposta `200 OK`:

```json
{
	"message": "Welcome, Ana Silva. You reached a route allowd to ADMIN."
}
```

## Perfis de acesso

| Perfil | Acesso |
| --- | --- |
| `STAFF` | Pode autenticar e acessar `GET /api/v1/users/me`. |
| `ADMIN` | Possui os acessos de `STAFF` e também `GET /api/v1/users/ping`. |

## Respostas de erro

Erros de aplicação seguem o formato:

```json
{
	"status": "error",
	"message": "Unauthorized"
}
```

Principais códigos usados pela API:

- `400 Bad Request`: corpo inválido ou falha de validação.
- `401 Unauthorized`: credenciais inválidas ou JWT ausente, inválido ou expirado.
- `403 Forbidden`: usuário autenticado sem o papel exigido.
- `404 Not Found`: usuário do token não existe mais.
- `409 Conflict`: já existe usuário com o e-mail informado.
- `500 Internal Server Error`: erro inesperado.
