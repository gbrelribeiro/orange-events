<h1 align="center">
  Orange Events
</h1>

<p align="center">
  Este projeto utiliza Next.JS, Prisma, Supabase (PostgreSQL) e bibliotecas auxiliares como Zod e Jose.
</p>

## Extensões recomendadas para IDE
<div>
  Você pode utilizar as seguintes extensões para auxiliar na implementação do projeto:
</div>

- Color Info (Matt Bierner)
- ESLint (Microsoft)
- JavaScript and TypeScript Nightly (Microsoft)
- Prisma (Prisma)
- Tailwind CSS IntelliSense (Tailwind Labs)

## Configurações de ambiente
<div>
  Instale as dependências principais do projeto:
</div>

```bash
npm install react-icons
npm install jose
npm install bcrypt
npm install --save-dev @types/bcrypt
npm install zod
npm install ts-node
npm install nodemailer
npm install --save-dev @types/nodemailer
npm install resend
npm install qrcode
npm install --save-dev @types/qrcode
```

<div>
  Adicione a seguinte propriedade ao <code>package.json</code> (após <code>"private": true,</code>, por exemplo):
</div>

```bash
"type": "module",
```

### Caso aponte erro do import do 'globals.css' dentro do 'layout.tsx'
<div>
  Crie o arquivo <code>globals.d.ts</code> na raíz do projeto e o preencha com os seguintes dados:
</div>

```bash
declare module "*.css";
```

## Prisma ORM

### • Instalação do Prisma
<div>
  Instale as dependências para utilizar o Prisma ORM:
</div>

```bash
npm install prisma @types/node @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

### • Inicializando o Prisma
<div>
  Utilize o seguinte comando para inicializar o prisma:
</div>

```bash
npx prisma init
```

### • Gerar o Prisma Client
<div>
  Utilize o seguinte comando para gerar o cliente do prisma (é bom utilizá-lo após alguma alteração no schema e antes do migrate):
</div>

```bash
npx prisma generate
```

### • Migrações do Prisma
<div>
  Migração (quando quiser enviar qualquer alteração do schema para o Banco de Dados):
</div>

```bash
npx prisma migrate dev --name (nome da migração)
```

<div>
  Caso precise resetar o banco de dados:
</div>

```bash
npx prisma migrate reset
```

### • Informações do .env
<div>
  Adicione o arquivo <code>.env</code> à raiz do projeto (caso ele não tenha sido automaticamente gerado) e configure as seguintes variáveis:
</div>

```bash
JWT_SECRET=Código de segurança longo, da sua preferência (sem aspas)
DATABASE_URL="Link fornecido pelo Supabase na área de Conexão" (com aspas)
SUPER_ADMIN_EMAIL="Email do super admin" (com aspas)
SUPER_ADMIN_PASSWORD="Senha do super admin" (com aspas)
SUPER_ADMIN_FIRST_NAME="Primeiro Nome do Super Admin" (com aspas)
SUPER_ADMIN_LAST_NAME="Segundo Nome do Super Admin" (com aspas)
RESEND_API_KEY=Chave da API do Resend (sem aspas)
```

### • Para gerar um JWT Secret
<div>
  No seu terminal, você pode escrever o seguinte comando para gerar uma chave <code>JWT_SECRET</code> para utilizar no seu código:
</div>

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### • Seed e Sincronização

<div>
  No arquivo <code>prisma.config.ts</code>, adicione a seguinte propriedade dentro de 'migrations':
</div>

```bash
seed: "npx ts-node prisma/seed.ts",
```

<div>
  Para executar algum <code>seed.ts</code> dentro da pasta prisma:
</div>

```bash
npx prisma db seed
```

<div>
  Para deixar o seu schema igual ao o Banco de Dados atual (caminho inverso do migrate):
</div>

```bash
npx prisma db pull
```

## Configurações no Supabase:

<div>
  Execute os comandos abaixo no SQL Editor do Supabase:
</div>

<br/>

### • Ativar Row Level Security na tabela <code>Client</code>:

```bash
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;
```

### • Bloquear acesso público à tabela <code>Client</code>

```bash
CREATE POLICY "Block public access"
ON "Client"
FOR ALL
TO anon, authenticated
USING (false);
```

### •Ativar RLS na tabela de migrações do Prisma:

```bash
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
```