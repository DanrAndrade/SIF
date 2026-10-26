// Otimiza um vídeo NO NAVEGADOR antes de enviar (a hospedagem não tem
// conversor de vídeo). O vídeo é tocado escondido, redesenhado em no máximo
// 1280 px de largura e regravado com compressão (MP4 H.264 quando o
// navegador permite; senão WebM). O áudio é mantido (para o "Assistir vídeo")
// e não toca alto durante a conversão. Também gera uma capa em WebP (1º
// quadro), mostrada enquanto o vídeo carrega.
//
// A conversão leva o mesmo tempo do vídeo (é gravada em tempo real).

const MAX_W = 1280;
const VIDEO_BPS = 2_500_000; // ~2,5 Mbps: bom para 720p
const AUDIO_BPS = 128_000;
const LOOP_SECONDS = 20;     // trecho do fundo (sem áudio, mais leve)
const LOOP_BPS = 1_200_000;

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
 * @returns {Promise<{ video: File, loop: File|null, poster: File|null, width:number, height:number }>}
 * video = completo, com som (botão "Assistir vídeo"); loop = primeiros
 * segundos, sem som e mais leve (fundo do topo). Os dois saem da mesma
 * passada, sem gastar mais tempo.
 */
export async function optimizeVideo(file, onProgress = () => {}) {
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

    // Capa: quadro em ~0,3 s
    video.currentTime = Math.min(0.3, (video.duration || 1) / 2);
    await once(video, 'seeked');
    ctx.drawImage(video, 0, 0, w, h);
    const posterBlob = await new Promise(r => canvas.toBlob(r, 'image/webp', 0.8));
    video.currentTime = 0;
    await once(video, 'seeked');

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

    const mimeType = MIME_OPTIONS.find(m => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: VIDEO_BPS, audioBitsPerSecond: AUDIO_BPS });
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const stopped = new Promise(r => { rec.onstop = r; });

    // Trecho do fundo: só imagem, primeiros segundos, taxa menor
    const loopStream = new MediaStream(stream.getVideoTracks().map(t => t.clone()));
    const sameFamily = /mp4/.test(mimeType) ? ['video/mp4;codecs=avc1.42E01F', 'video/mp4;codecs=avc1', 'video/mp4'] : ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    const loopMime = sameFamily.find(m => MediaRecorder.isTypeSupported(m)) || mimeType;
    const loopRec = new MediaRecorder(loopStream, { mimeType: loopMime, videoBitsPerSecond: LOOP_BPS });
    const loopChunks = [];
    loopRec.ondataavailable = (e) => { if (e.data && e.data.size) loopChunks.push(e.data); };
    const loopStopped = new Promise(r => { loopRec.onstop = r; });
    const loopLimit = Math.min(LOOP_SECONDS, video.duration || LOOP_SECONDS);
    let loopDone = false;
    const stopLoop = () => { if (!loopDone) { loopDone = true; try { loopRec.stop(); } catch { /* já parou */ } loopStream.getTracks().forEach(t => t.stop()); } };

    let raf = 0;
    const draw = () => {
      ctx.drawImage(video, 0, 0, w, h);
      if (video.duration) onProgress(Math.min(0.99, video.currentTime / video.duration));
      if (!loopDone && video.currentTime >= loopLimit) stopLoop();
      raf = video.requestVideoFrameCallback ? video.requestVideoFrameCallback(draw) : requestAnimationFrame(draw);
    };

    rec.start(1000);
    loopRec.start(1000);
    await audioCtx?.resume?.();
    // play() pode "falhar" se o vídeo acabar antes da resposta: não é erro
    await video.play().catch((e) => { if (!video.ended) throw e; });
    draw();
    if (!video.ended) await new Promise(r => video.addEventListener('ended', r, { once: true }));
    if (video.cancelVideoFrameCallback && raf) video.cancelVideoFrameCallback(raf); else cancelAnimationFrame(raf);
    rec.stop();
    stopLoop();
    await Promise.all([stopped, loopStopped]);
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
