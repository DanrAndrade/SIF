# Scripts de manutenção antigos

Estes scripts ficavam dentro de `sif-api/` e podiam ser executados por
qualquer pessoa que abrisse o endereço no navegador (alguns apagam ou
reescrevem dados). Foram movidos para cá — **fora da pasta que vai para o
servidor** — e ficam só como histórico.

- `migrate*.php` — migrações antigas de colunas/tabelas. **Não são mais
  necessárias**: a estrutura do banco agora é ajustada sozinha por
  `sif_ensure_schema()` em `sif-api/api_guard.php` (versionado, roda uma vez
  quando o admin abre o painel).
- `cleanup_duplicates.php`, `repair_photos.php` — reparos pontuais de dados
  de 2026 (bug de duplicação já corrigido).
- `converter_webp.php` — conversão única das imagens para WebP (já aplicada).

Se algum precisar ser usado de novo: copie para `sif-api/` **só no ambiente
local (XAMPP)**. No servidor, o `sif-api/.htaccess` bloqueia esses nomes de
arquivo mesmo que sejam enviados por engano.
