@echo off
REM ============================================================
REM Limpa worktrees do Claude Code que ficam causando sugestoes
REM chatas de "criar PR" em outras conversas.
REM
REM Use SOMENTE depois de FECHAR todas as conversas Claude Code.
REM
REM Como usar: clique duplo neste arquivo.
REM ============================================================

cd /d "%~dp0"

echo === 1) Worktrees do projeto SIF (Git) ===
git worktree list

echo.
echo === 2) Removendo worktrees em .claude/worktrees/ ===
for /d %%D in (".claude\worktrees\*") do (
  echo Removendo: %%D
  git worktree remove "%%D" --force 2>nul
)
git worktree prune

echo.
echo === 3) Removendo branches claude/* ===
for /f "tokens=*" %%B in ('git branch ^| findstr /R "claude/"') do (
  echo Apagando branch: %%B
  git branch -D %%B 2>nul
)

echo.
echo === 4) Forcando remocao da pasta .claude/worktrees ===
if exist ".claude\worktrees" rmdir /s /q ".claude\worktrees" 2>nul

echo.
echo === 5) Removendo registros de "projetos recentes" do Claude ===
REM Estas pastas em ~/.claude/projects/ sao o que faz o Claude Desktop
REM sugerir "criar PR" em outras conversas. Apaga somente entradas de
REM worktrees (mantem os projetos principais).
set CLAUDE_PROJ=%USERPROFILE%\.claude\projects
if exist "%CLAUDE_PROJ%" (
  for /d %%P in ("%CLAUDE_PROJ%\*claude-worktrees*") do (
    echo Removendo entrada de worktree: %%~nxP
    rmdir /s /q "%%P" 2>nul
  )
) else (
  echo Pasta de projetos do Claude nao encontrada.
)

echo.
echo === Estado final ===
git worktree list
echo --- branches ---
git branch

echo.
echo ============================================================
echo Limpeza concluida.
echo.
echo As sugestoes de "criar PR" devem parar de aparecer em outras
echo conversas. Se ainda aparecerem, abra o Claude Code, va em
echo "Recent Projects" e remova manualmente qualquer item antigo.
echo ============================================================
pause
