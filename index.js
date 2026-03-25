(() => {
  const tracks = new Map();
  
  // Функция для извлечения данных
  const extract = () => {
    // Находим все блоки треков (используем ваш класс из примера)
    const elements = document.querySelectorAll('.HorizontalCardContainer_root__YoAAP');
    
    elements.forEach(el => {
      const titleEl = el.querySelector('.Meta_title__GGBnH');
      const artistEls = el.querySelectorAll('.Meta_artistCaption__JESZi');
      
      if (titleEl && artistEls.length > 0) {
        const title = titleEl.textContent.trim();
        const artists = Array.from(artistEls).map(a => a.textContent.trim()).join(', ');
        const fullTrack = `${artists} - ${title}`;
        
        // Если такого трека еще нет в нашем Map, добавляем его
        if (!tracks.has(fullTrack)) {
          tracks.set(fullTrack, true);
          updateUI();
        }
      }
    });
  };

  const updateUI = () => {
    let panel = document.getElementById('ym-scraper');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'ym-scraper';
      panel.style = "position:fixed;top:20px;right:20px;z-index:10000;background:#111;color:#c8f560;padding:20px;border:2px solid #c8f560;border-radius:10px;font-family:sans-serif;box-shadow:0 0 20px rgba(0,0,0,0.5);text-align:center;min-width:200px;";
      document.body.appendChild(panel);
    }
    panel.innerHTML = `
      <div style="font-weight:bold;margin-bottom:10px;">СОБРАНО ТРЕКОВ</div>
      <div style="font-size:40px;margin-bottom:15px;color:#fff;">${tracks.size}</div>
      <div style="font-size:12px;color:#888;margin-bottom:15px;">Медленно крутите список вниз...</div>
      <button id="ym-dl" style="background:#c8f560;color:#000;border:none;padding:10px 15px;border-radius:5px;cursor:pointer;font-weight:bold;width:100%;">СКАЧАТЬ .TXT</button>
    `;
    document.getElementById('ym-dl').onclick = download;
  };

  const download = () => {
    const content = Array.from(tracks.keys()).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'yandex_music_list.txt';
    a.click();
  };

  // Настройка наблюдения за изменениями на странице (MutationObserver)
  // Это позволит ловить треки сразу, как только они подгружаются
  const observer = new MutationObserver(extract);
  observer.observe(document.body, { childList: true, subtree: true });

  // Также оставляем проверку по скроллу для надежности
  window.addEventListener('scroll', extract, { passive: true });

  // Первый запуск
  extract();
  updateUI();
  
  console.log("Скрипт запущен. Начинайте скроллить плейлист.");
})();