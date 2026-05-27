# Banco de dados SIF

Dump completo do banco MySQL `sif_db` usado pelo backend PHP em
`C:\xampp\htdocs\sif-api`.

## Restaurar do zero (ambiente novo)

1. Instalar XAMPP (ou MySQL/MariaDB standalone).
2. Subir o serviço MySQL.
3. Criar o banco vazio:

   ```sql
   CREATE DATABASE sif_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   Ou via phpMyAdmin: `http://localhost/phpmyadmin` → Novo banco → `sif_db`.

4. Importar o dump:

   ```bash
   # Pelo terminal (Windows, XAMPP padrão)
   "C:\xampp\mysql\bin\mysql.exe" -u root sif_db < database/sif_db.sql
   ```

   Ou via phpMyAdmin: selecione o banco `sif_db` → aba **Importar** →
   escolha o arquivo `sif_db.sql` → Executar.

## Backend PHP

A pasta `api/` deste repositório (ou os arquivos `.php` que vivem em
`C:\xampp\htdocs\sif-api`) precisa ser copiada para o `htdocs` do XAMPP do
seu sócio. As credenciais padrão (root sem senha) já estão configuradas
em `db.php` — ajustar se necessário.

## Frontend

```bash
npm install
npm run dev
```

A URL da API está em `src/apiConfig.js` (`http://localhost/sif-api`).

## Atualizar o dump

Sempre que houver mudanças no schema ou em dados importantes:

```bash
"C:\xampp\mysql\bin\mysqldump.exe" -u root --routines --triggers --events \
  --add-drop-table --skip-comments sif_db > database/sif_db.sql
```
