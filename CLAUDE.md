# Manual de setup automatizado — SIF

> **⚠️ IA: ANTES DE QUALQUER COISA, leia `HANDOFF-IA.md` na raiz.** Ele tem o
> contexto da conversa anterior, as regras de deploy da HostGator e o bug
> aberto no momento. Se o ambiente local já estiver rodando, pule o setup
> abaixo.

> **Para a IA que está lendo isto:** este documento descreve como deixar
> o projeto SIF rodando localmente do zero. Execute cada etapa em ordem,
> validando o resultado antes de prosseguir. Pergunte ao usuário **apenas**
> nas etapas marcadas com 🟡 **PERGUNTAR**. Tudo o que estiver marcado com
> 🟢 **EXECUTAR** deve ser feito automaticamente.

---

## Contexto do projeto

- **Frontend:** React + Vite (porta `5173`)
- **Backend:** PHP servido pelo Apache do XAMPP, em `C:\xampp\htdocs\sif-api`
- **Banco:** MySQL/MariaDB do XAMPP, banco `sif_db`
- **Sistema operacional alvo:** Windows com XAMPP instalado
- **Repositório já clonado:** assuma que o usuário está no diretório do
  projeto (raiz contém `package.json`, `src/`, `sif-api/`, `database/`)

O objetivo final é ter:
1. Apache + MySQL do XAMPP rodando
2. Banco `sif_db` populado com o dump
3. Backend PHP em `C:\xampp\htdocs\sif-api` com os uploads restaurados
4. Frontend rodando em http://localhost:5173
5. Tudo idêntico ao ambiente do dono do projeto

---

## ETAPA 1 — Verificar pré-requisitos 🟢 EXECUTAR

Verifique se o usuário tem:

### XAMPP

```powershell
Test-Path 'C:\xampp\xampp-control.exe'
```

Se **False**: avise o usuário que precisa instalar XAMPP em
https://www.apachefriends.org e parar aqui até concluir.

### Node.js (versão 18+)

```bash
node --version
```

Se não estiver instalado ou for < 18: avise pra baixar em
https://nodejs.org (versão LTS).

### Git (opcional, só se o projeto ainda não foi clonado)

```bash
git --version
```

---

## ETAPA 2 — Copiar backend PHP para o XAMPP 🟢 EXECUTAR

A pasta `sif-api/` da raiz deste repositório precisa estar em
`C:\xampp\htdocs\sif-api\`.

```powershell
$src = (Get-Location).Path + '\sif-api'
$dst = 'C:\xampp\htdocs\sif-api'
if (Test-Path $dst) {
    # Backup defensivo se já existir algo lá
    Move-Item $dst "$dst.backup-$(Get-Date -Format 'yyyyMMddHHmmss')"
}
Copy-Item -Path $src -Destination $dst -Recurse -Force
Write-Output "Backend copiado para $dst"
```

**Validação:** confirmar que `C:\xampp\htdocs\sif-api\db.php` existe.

---

## ETAPA 3 — Iniciar Apache e MySQL do XAMPP 🟡 PERGUNTAR

Pergunte ao usuário: **"Suba o Apache e o MySQL no painel do XAMPP
(`C:\xampp\xampp-control.exe`) e me avise quando os dois estiverem
rodando (status verde). Posso prosseguir?"**

Após confirmação, valide com:

```powershell
# Apache
Test-NetConnection -ComputerName localhost -Port 80 -InformationLevel Quiet
# MySQL
Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet
```

Ambos devem retornar `True`. Se falhar, peça ao usuário pra verificar
o painel do XAMPP.

---

## ETAPA 4 — Restaurar o banco de dados 🟢 EXECUTAR

O dump completo está em `database/sif_db.sql`.

```powershell
# Criar banco vazio (idempotente)
& 'C:\xampp\mysql\bin\mysql.exe' -u root -e "CREATE DATABASE IF NOT EXISTS sif_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Importar dump
$dumpPath = (Get-Location).Path + '\database\sif_db.sql'
Get-Content $dumpPath -Raw | & 'C:\xampp\mysql\bin\mysql.exe' -u root sif_db

# Verificar
& 'C:\xampp\mysql\bin\mysql.exe' -u root sif_db -e "SHOW TABLES;"
```

**Validação:** o `SHOW TABLES` deve listar várias tabelas
(`projetos`, `eventos`, `treinamentos`, `eincol_config`,
`page_configs`, etc.). Se a lista vier vazia, o import falhou — repita
ou peça intervenção do usuário.

---

## ETAPA 5 — Restaurar uploads (imagens, PDFs cadastrados) 🟡 PERGUNTAR

Os arquivos de upload **não estão no Git** (419 MB). O dono do projeto
envia um arquivo chamado `sif-uploads.zip` separadamente (WhatsApp,
OneDrive, etc).

Pergunte ao usuário: **"Você recebeu o arquivo `sif-uploads.zip`?
Coloque ele em algum lugar (ex: Downloads ou Desktop) e me diga o
caminho completo. Sem isso o site abre, mas todas as imagens e PDFs
vão aparecer quebrados."**

Após receber o caminho, execute:

```powershell
$zipPath = '<CAMINHO_INFORMADO_PELO_USUARIO>'  # ex: C:\Users\<user>\Downloads\sif-uploads.zip
$destDir = 'C:\xampp\htdocs\sif-api'

if (-not (Test-Path $zipPath)) {
    Write-Output "Arquivo nao encontrado: $zipPath"
    exit 1
}

# Remove uploads antigos se existirem
if (Test-Path "$destDir\uploads") { Remove-Item "$destDir\uploads" -Recurse -Force }

# Extrai diretamente em sif-api/ (o zip já contém a pasta uploads/ na raiz)
Expand-Archive -Path $zipPath -DestinationPath $destDir -Force
Write-Output "Uploads restaurados em $destDir\uploads"
Get-ChildItem "$destDir\uploads" -Directory | Select-Object Name
```

**Validação:** a pasta `C:\xampp\htdocs\sif-api\uploads\` deve existir
e conter subpastas como `eincol/`, `eventos/`, `pdfs/`, `images/`,
`pages/`.

Se o usuário não tem o zip ainda, **não bloqueie a continuação**.
Avise que as imagens/PDFs vão aparecer quebrados até ele restaurar
isso, e prossiga.

---

## ETAPA 6 — Instalar dependências e rodar o frontend 🟢 EXECUTAR

```powershell
npm install
```

(Pode levar 1–3 minutos. Se aparecer aviso de vulnerabilidades de
pacotes deprecated, ignore — é normal e não impede o funcionamento.)

Depois suba o servidor de desenvolvimento em background:

```bash
npx vite --host
```

Use o tool `run_in_background: true` (ou equivalente) pra não bloquear
a sessão.

**Validação:** após 3–5 segundos, faça uma requisição a
`http://localhost:5173` e confirme que retorna HTML.

---

## ETAPA 7 — Entregar ao usuário 🟢 EXECUTAR

Forneça ao usuário:

- **Site:** http://localhost:5173
- **Painel admin:** http://localhost:5173/admin
- **Backend (Apache):** http://localhost/sif-api
- **phpMyAdmin:** http://localhost/phpmyadmin

Sugira que ele teste:
1. Abrir a home — deve carregar com banners, parceiros, etc.
2. Ir em `/eventos` e `/treinamentos` — devem listar conteúdo
3. Entrar no `/admin` (credenciais já estão no banco)

---

## Troubleshooting

### "Apache não sobe" / porta 80 ocupada
- Geralmente é o IIS ou Skype. No painel do XAMPP, clique em
  **Config → Service and Port Settings** e mude pra porta 8080
  (mas vai precisar ajustar o `src/apiConfig.js` correspondentemente).

### "MySQL não sobe" / porta 3306 ocupada
- Verificar se já existe outro MySQL rodando como serviço do Windows
  (`Get-Service *mysql*`). Pode precisar pará-lo.

### Erro de CORS no frontend
- O `sif-api/db.php` aceita origens `localhost:5173` e `localhost:3000`.
  Se rodar em outra porta, editar a lista de `$allowedOrigins`.

### Erro "Imagem não permitida" no editor de texto rico
- Já estão suportados JPG, PNG, GIF, WebP, BMP, AVIF, HEIC, SVG.
  Outros formatos precisam ser adicionados em `sif-api/upload.php`.

### Imagens/PDFs aparecem quebrados no site
- A pasta `uploads/` não foi restaurada. Voltar à **Etapa 5**.

### `npm install` falha
- Apagar `node_modules/` e `package-lock.json`, rodar de novo.
- Verificar se a versão do Node é >= 18.

---

## Atualizar o banco depois de mudanças

Quando o dono do projeto fizer mudanças no schema ou nos dados em
produção, ele atualiza o dump:

```powershell
& 'C:\xampp\mysql\bin\mysqldump.exe' -u root --routines --triggers --events `
  --add-drop-table --skip-comments sif_db > database\sif_db.sql
```

Faz commit e push. O sócio então roda `git pull` e re-importa:

```powershell
Get-Content database\sif_db.sql -Raw | & 'C:\xampp\mysql\bin\mysql.exe' -u root sif_db
```
