// Toast leve para feedback no admin (substitui os alert() do navegador).
// Manipula o DOM diretamente — não depende de React state, então pode ser
// chamado de qualquer lugar via window.showToast(...).
export function showToast(message, type) {
  if (typeof document === 'undefined' || !message) return;

  // Detecta automaticamente erro pela mensagem, se o tipo não for informado.
  if (!type) {
    const m = String(message).toLowerCase();
    type = /(erro|falh|inv[aá]lid|obrigat|n[aã]o foi|n[aã]o permit)/.test(m) ? 'error' : 'success';
  }

  let c = document.getElementById('sif-toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'sif-toast-container';
    c.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none';
    document.body.appendChild(c);
  }

  const t = document.createElement('div');
  const ok = type !== 'error';
  t.style.cssText = 'pointer-events:auto;min-width:220px;max-width:360px;padding:14px 18px;border-radius:14px;'
    + 'font-family:Montserrat,system-ui,sans-serif;font-weight:600;font-size:13px;line-height:1.4;color:#fff;'
    + 'box-shadow:0 10px 30px rgba(0,0,0,.18);opacity:0;transform:translateY(-8px);transition:all .25s ease;'
    + 'background:' + (ok ? '#007a3d' : '#dc2626');
  t.textContent = message;
  c.appendChild(t);

  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(-8px)';
    setTimeout(() => t.remove(), 250);
  }, 3000);
}

if (typeof window !== 'undefined') {
  window.showToast = showToast;
}
