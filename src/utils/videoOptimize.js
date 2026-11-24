// Otimiza um vídeo NO NAVEGADOR antes de enviar (a hospedagem não tem
// conversor de vídeo). O vídeo é tocado escondido, redesenhado em no máximo
// 1920 px de largura e regravado com compressão (MP4 H.264 quando o
// navegador permite; senão WebM). Se o arquivo original já for um MP4/WebM
// leve (até 25 MB e até 1920 px), ele é enviado como está: regravar só piora. O áudio é mantido (para o "Assistir vídeo")
// e não toca alto durante a conversão. Também gera uma capa em WebP (1º
// quadro), mostrada enquanto o vídeo carrega.
//
// A conversão leva o mesmo tempo do vídeo (é gravada em tempo real).

const MAX_W = 1920;
const VIDEO_BPS = 6_000_000; // ~6 Mbps: bom para Full HD
const AUDIO_BPS = 128_000;
const LOOP_SECONDS = 30;     // trecho do fundo (sem áudio) quando o vídeo é longo
const LOOP_FULL_UNTIL = 60;  // vídeo até 60 s: o fundo cobre o vídeo inteiro (não corta)
const LOOP_MAX_W = 1920;
const LOOP_BPS = 4_000_000;  // ~4 Mbps no fundo
// Limites do servidor (upload_video.php): 40 MB o vídeo e 15 MB o fundo.
// A taxa é reduzida só quando a duração faria passar disso.
const VIDEO_MAX_BYTES = 32 * 1024 * 1024;
const LOOP_MAX_BYTES = 12 * 1024 * 1024;
const KEEP_ORIGINAL_BYTES = 25 * 1024 * 1024;
const capBps = (bps, bytes, seconds) => Math.max(500_000, Math.min(bps, Math.floor((bytes * 8) / Math.max(1, seconds))));

const MIME_OPTIONS = [
  'video/mp4;codecs=avc1.42E01F,mp4a.40.2',
  'video/mp4;codecs=avc1,mp4a.40.2',
  'video/mp4',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
];

export function canOptimizeVideo() {
  return typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined'
    && !!HTMLCanvasElement.prototype.captureStream
    && MIME_OPTIONS.some(m => MediaRecorder.isTypeSupported?.(m));
}

const once = (el, ev) => new Promise((res, rej) => {
  const ok = () => { el.removeEventListener('error', bad); res(); };
  const bad = () => { el.removeEventListener(ev, ok); rej(new Error('Não foi possível ler este vídeo.')); };
  el.addEventListener(ev, ok, { once: true });
  el.addEventListener('error', bad, { once: true });
});

/**
 * @param {File} file
 * @param {(p:number)=>void} onProgress  0..1
 * @returns {Promise<{ video: File, loop: File|null, poster: File|null, width:number, height:number, original?:boolean }>}
 * video = completo, com som (botão "Assistir vídeo"); loop = trecho sem som
 * (fundo do topo; o vídeo inteiro se tiver até 60 s). Os dois saem da mesma
 * passada, sem gastar mais tempo. original = true quando o arquivo foi
 * mantido sem regravar (loop vem nulo e o fundo usa o próprio vídeo).
 */
// opts.loopStart: segundo em que o trecho do fundo começa (pula aberturas)
export async function optimizeVideo(file, onProgress = () => {}, opts = {}) {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = url;
  video.playsInline = true;
  video.preload = 'auto';
  video.crossOrigin = 'anonymous';
  let audioCtx = null;
  try {
    await once(video, 'loadedmetadata');
    // Alguns WebM não informam a duração: descobre pulando para o fim
    if (!isFinite(video.duration)) {
      video.currentTime = 1e9;
      await new Promise(r => video.addEventListener('durationchange', r, { once: true }));
      video.currentTime = 0;
      await once(video, 'seeked');
    }
    const scale = Math.min(1, MAX_W / (video.videoWidth || MAX_W));
    const w = Math.max(2, Math.round((video.videoWidth * scale) / 2) * 2);
    const h = Math.max(2, Math.round((video.videoHeight * scale) / 2) * 2);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    // Tela separada, em resolução maior, só para o trecho do fundo
    const lScale = Math.min(1, LOOP_MAX_W / (video.videoWidth || LOOP_MAX_W));
    const lw = Math.max(2, Math.round((video.videoWidth * lScale) / 2) * 2);
    const lh = Math.max(2, Math.round((video.videoHeight * lScale) / 2) * 2);
    const loopCanvas = document.createElement('canvas');
    loopCanvas.width = lw; loopCanvas.height = lh;
    const lctx = loopCanvas.getContext('2d');

    // Capa: quadro em ~0,3 s
    video.currentTime = Math.min(0.3, (video.duration || 1) / 2);
    await once(video, 'seeked');
    ctx.drawImage(video, 0, 0, w, h);
    const posterBlob = await new Promise(r => canvas.toBlob(r, 'image/webp', 0.8));
    video.currentTime = 0;
    await once(video, 'seeked');

    // Arquivo já leve e em formato web: usa o original, sem regravar
    const base0 = (file.name || 'video').replace(/\.[^.]+$/, '');
    if (/^video\/(mp4|webm)$/.test(file.type) && file.size <= KEEP_ORIGINAL_BYTES && video.videoWidth <= MAX_W) {
      const posterOnly = posterBlob ? new File([posterBlob], `${base0}-capa.webp`, { type: 'image/webp' }) : null;
      onProgress(1);
      return { video: file, loop: null, poster: posterOnly, width: video.videoWidth, height: video.videoHeight, original: true };
    }

    // Trilhas: imagem do canvas + áudio do vídeo (sem sair nas caixas de som)
    const stream = canvas.captureStream(30);
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        audioCtx = new AC();
        const src = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        src.connect(dest);
        dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
      }
    } catch { /* vídeo sem áudio ou navegador sem suporte: segue só com a imagem */ }

    const dur0 = video.duration || LOOP_SECONDS;
    const mimeType = MIME_OPTIONS.find(m => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: capBps(VIDEO_BPS, VIDEO_MAX_BYTES, dur0), audioBitsPerSecond: AUDIO_BPS });
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const stopped = new Promise(r => { rec.onstop = r; });

    // Trecho do fundo: só imagem, primeiros segundos, taxa menor
    const loopStream = loopCanvas.captureStream(30);
    const loopSpan = Math.min(dur0 <= LOOP_FULL_UNTIL ? dur0 : LOOP_SECONDS, dur0);
    const sameFamily = /mp4/.test(mimeType) ? ['video/mp4;codecs=avc1.42E01F', 'video/mp4;codecs=avc1', 'video/mp4'] : ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    const loopMime = sameFamily.find(m => MediaRecorder.isTypeSupported(m)) || mimeType;
    const loopRec = new MediaRecorder(loopStream, { mimeType: loopMime, videoBitsPerSecond: capBps(LOOP_BPS, LOOP_MAX_BYTES, loopSpan) });
    const loopChunks = [];
    loopRec.ondataavailable = (e) => { if (e.data && e.data.size) loopChunks.push(e.data); };
    const loopStopped = new Promise(r => { loopRec.onstop = r; });
    const dur = video.duration || LOOP_SECONDS;
    const loopFrom = Math.max(0, Math.min(Number(opts.loopStart) || 0, Math.max(0, dur - 3)));
    const loopLimit = dur <= LOOP_FULL_UNTIL ? dur : Math.min(loopFrom + LOOP_SECONDS, dur);
    let loopStarted = false;
    let loopDone = false;
    const stopLoop = () => { if (!loopDone) { loopDone = true; try { if (loopRec.state !== 'inactive') loopRec.stop(); } catch { /* já parou */ } loopStream.getTracks().forEach(t => t.stop()); } };

    let raf = 0;
    const draw = () => {
      ctx.drawImage(video, 0, 0, w, h);
      if (video.duration) onProgress(Math.min(0.99, video.currentTime / video.duration));
      if (!loopDone) {
        if (!loopStarted && video.currentTime >= loopFrom) { loopStarted = true; loopRec.start(1000); }
        if (loopStarted) lctx.drawImage(video, 0, 0, lw, lh);
        if (loopStarted && video.currentTime >= loopLimit) stopLoop();
      }
      raf = video.requestVideoFrameCallback ? video.requestVideoFrameCallback(draw) : requestAnimationFrame(draw);
    };

    rec.start(1000);
    await audioCtx?.resume?.();
    // play() pode "falhar" se o vídeo acabar antes da resposta: não é erro
    await video.play().catch((e) => { if (!video.ended) throw e; });
    draw();
    if (!video.ended) await new Promise(r => video.addEventListener('ended', r, { once: true }));
    if (video.cancelVideoFrameCallback && raf) video.cancelVideoFrameCallback(raf); else cancelAnimationFrame(raf);
    rec.stop();
    stopLoop();
    await Promise.all([stopped, loopStarted ? loopStopped : Promise.resolve()]);
    onProgress(1);

    const isMp4 = /mp4/.test(mimeType);
    const type = isMp4 ? 'video/mp4' : 'video/webm';
    const base = (file.name || 'video').replace(/\.[^.]+$/, '');
    const out = new File(chunks, `${base}.${isMp4 ? 'mp4' : 'webm'}`, { type });
    const poster = posterBlob ? new File([posterBlob], `${base}-capa.webp`, { type: 'image/webp' }) : null;
    const loop = loopChunks.length ? new File(loopChunks, `${base}-fundo.${isMp4 ? 'mp4' : 'webm'}`, { type }) : null;
    return { video: out, loop, poster, width: w, height: h };
  } finally {
    try { video.pause(); } catch { /* ignore */ }
    URL.revokeObjectURL(url);
    try { audioCtx?.close(); } catch { /* ignore */ }
  }
}
