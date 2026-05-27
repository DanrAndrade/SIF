# Como rodar o projeto SIF localmente

Guia para clonar o repositório e rodar o site idêntico ao ambiente
de desenvolvimento, com todos os conteúdos já cadastrados.

## 1. Pré-requisitos

- **XAMPP** (Apache + MySQL/MariaDB + PHP 8+) — https://www.apachefriends.org
- **Node.js 18+** — https://nodejs.org
- **Git** — https://git-scm.com

## 2. Clonar o repositório

```bash
git clone https://github.com/DanrAndrade/SIF.git
cd SIF
```

## 3. Configurar o backend PHP

A pasta `sif-api/` deste repositório deve ficar dentro de `htdocs/` do
XAMPP:

```bash
# Windows (XAMPP padrão)
xcopy /E /I sif-api C:\xampp\htdocs\sif-api
```

Ou simplesmente copie a pasta `sif-api/` para `C:\xampp\htdocs\` pelo
Explorer.

Depois suba o **Apache** e o **MySQL** pelo painel do XAMPP.

## 4. Restaurar o banco de dados

1. Abra http://localhost/phpmyadmin
2. Clique em **Novo** na lateral → crie o banco `sif_db` com collation
   `utf8mb4_unicode_ci`
3. Selecione o banco recém-criado → aba **Importar** → escolha
   `database/sif_db.sql` → **Executar**

Ou via terminal:

```bash
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE sif_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
"C:\xampp\mysql\bin\mysql.exe" -u root sif_db < database/sif_db.sql
```

Credenciais padrão (XAMPP): usuário `root`, sem senha. Se for diferente,
editar `sif-api/db.php`.

## 5. Restaurar os uploads (imagens, PDFs)

Os arquivos cadastrados (imagens de eventos, PDFs do boletim, capas etc.)
**não estão no Git** porque pesam ~420 MB. Eles são compartilhados em
separado num arquivo `sif-uploads.zip`.

1. Baixe `sif-uploads.zip` (link enviado pelo dono do projeto)
2. Extraia o arquivo
3. Coloque a pasta `uploads/` resultante dentro de
   `C:\xampp\htdocs\sif-api\` — o caminho final deve ser
   `C:\xampp\htdocs\sif-api\uploads\` com as subpastas `eincol/`,
   `eventos/`, `pdfs/`, `images/`, etc.

Sem esses arquivos o site abre, mas as imagens/PDFs vão aparecer
quebrados.

## 6. Rodar o frontend

```bash
npm install
npm run dev
```

Acesso:
- Site: http://localhost:5173
- Admin: http://localhost:5173/admin
- Backend (Apache): http://localhost/sif-api

## Atualizar o dump do banco (manutenção)

Sempre que houver mudanças no schema ou em dados importantes:

```bash
"C:\xampp\mysql\bin\mysqldump.exe" -u root --routines --triggers --events \
  --add-drop-table --skip-comments sif_db > database/sif_db.sql
```

E para atualizar o zip de uploads:

```powershell
Compress-Archive -Path C:\xampp\htdocs\sif-api\uploads `
  -DestinationPath C:\Users\<usuario>\Desktop\sif-uploads.zip `
  -CompressionLevel Optimal -Force
```
