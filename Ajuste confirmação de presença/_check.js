
    
    const gifts = [
      ["Café no Aeroporto", "R$70", "gift-images/gift_1.jpeg"],
      ["Chocolate quente para aquecer nossa viagem", "R$70", "gift-images/gift_2.jpeg"],
      ["Tomar um sorvete em uma Heladería", "R$70", "gift-images/gift_3.jpeg"],
      ["Passeio no parque", "R$85,00", "gift-images/gift_4.jpeg"],
      ["Uma noite de pizza em Santiago", "R$100", "gift-images/gift_5.jpeg"],
      ["Comidas típicas", "R$120", "gift-images/gift_6.jpeg"],
      ["Um drink para comemorarmos o casamento", "R$120", "gift-images/gift_7.jpeg"],
      ["Um almoço durante a viagem", "R$150", "gift-images/gift_8.jpeg"],
      ["Visita a monumentos históricos", "R$200", "gift-images/gift_9.jpeg"],
      ["Passeio de teleférico", "R$200", "gift-images/gift_10.jpeg"],
      ["Transfer aeroporto", "R$200", "gift-images/gift_11.jpeg"],
      ["Aluguel das roupas de neve", "R$300", "gift-images/gift_12.jpeg"],
      ["Cotas para as passagens aéreas", "R$300", "gift-images/gift_13.jpeg"],
      ["Cotas para hospedagem", "R$300", "gift-images/gift_14.jpeg"],
      ["Passeio na Vinícola Concha y Toro", "R$700", "gift-images/gift_15.jpeg"],
    ];


    const giftGrid = document.getElementById("giftGrid");
    const giftModal = document.getElementById("giftModal");
    const giftTitle = document.getElementById("giftTitle");
    const giftDesc = document.getElementById("giftDesc");
    const pixCode = document.getElementById("pixCode");
    const pixFreeCode = document.getElementById("pixFreeCode");
    const copyPix = document.getElementById("copyPix");
    const copyPixFree = document.getElementById("copyPixFree");

    gifts.forEach(([title, price, image]) => {
      const card = document.createElement("article");
      card.className = "gift";
      card.innerHTML = `
        <img src="${image}" alt="${title}" class="gift-image">
        <div class="price">${price}</div>
        <p class="title">${title}</p>
        <button class="btn primary" type="button">Presentear</button>
      `;
      card.querySelector("button").addEventListener("click", () => {
        giftTitle.textContent = title;
        giftDesc.textContent = `Contribuição: ${price}. Para presentear, use a chave Pix abaixo.`;
        pixCode.textContent = "50034539816";
        giftModal.classList.add("open");
        giftModal.setAttribute("aria-hidden", "false");
      });
      giftGrid.appendChild(card);
    });

    function copyText(text) {
      navigator.clipboard.writeText(text).then(() => {
        const old = copyPix.textContent;
        copyPix.textContent = "Copiado!";
        setTimeout(() => copyPix.textContent = old, 1400);
      }).catch(() => {
        alert("Não foi possível copiar automaticamente. A chave é: " + text);
      });
    }

    copyPix.addEventListener("click", () => copyText(pixCode.textContent));
    copyPixFree.addEventListener("click", () => {
      const old = copyPixFree.textContent;
      copyPixFree.textContent = "Copiado!";
      navigator.clipboard.writeText(pixFreeCode.textContent).catch(() => {});
      setTimeout(() => copyPixFree.textContent = old, 1400);
    });

    const closeModal = () => {
      giftModal.classList.remove("open");
      giftModal.setAttribute("aria-hidden", "true");
    };
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("closeModal2").addEventListener("click", closeModal);
    giftModal.addEventListener("click", (e) => {
      if (e.target === giftModal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    const target = new Date("2026-09-07T00:00:00-03:00");
    const updateCountdown = () => {
      const now = new Date();
      const diff = target - now;
      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
      const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
      const seconds = Math.max(0, Math.floor((diff / 1000) % 60));
      document.getElementById("d").textContent = String(days).padStart(2, "0");
      document.getElementById("h").textContent = String(hours).padStart(2, "0");
      document.getElementById("m").textContent = String(minutes).padStart(2, "0");
      document.getElementById("s").textContent = String(seconds).padStart(2, "0");
    };
    updateCountdown();
    setInterval(updateCountdown, 1000);

    const RSVP_STORAGE_KEY = "patricia_gabriel_rsvps";
    const rsvpForm = document.getElementById("rsvpForm");
    const rsvpList = document.getElementById("rsvpList");
    const rsvpCount = document.getElementById("rsvpCount");
    const exportRsvp = document.getElementById("exportRsvp");
    const copyRsvpList = document.getElementById("copyRsvpList");
    const clearRsvpList = document.getElementById("clearRsvpList");

    const loadRsvps = () => {
      try {
        return JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY) || "[]");
      } catch {
        return [];
      }
    };

    const saveRsvps = (items) => {
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(items));
    };

    const formatDate = (iso) => {
      try {
        return new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit"
        }).format(new Date(iso));
      } catch {
        return iso;
      }
    };

    const renderRsvps = () => {
      const items = loadRsvps();
      rsvpCount.textContent = `${items.length} confirmação(ões) salva(s)`;
      if (!items.length) {
        rsvpList.innerHTML = '<div class="rsvp-empty">Nenhuma confirmação registrada ainda.</div>';
        return;
      }
      rsvpList.innerHTML = items.map((item, index) => `
        <article class="rsvp-item">
          <strong>#${index + 1} · ${item.name}</strong>
          <div class="meta">
            <span><b>Telefone:</b> ${item.phone}</span>
            <span><b>Acompanhantes:</b> ${item.guests}</span>
            <span><b>Data:</b> ${formatDate(item.createdAt)}</span>
          </div>
          ${item.message ? `<div class="meta" style="margin-top:6px;"><span><b>Obs.:</b> ${item.message}</span></div>` : ''}
        </article>
      `).join('');
    };

    const downloadTextFile = (filename, content, mimeType) => {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    const csvEscape = (value) => '"' + String(value ?? '').replaceAll('"', '""') + '"';

    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(rsvpForm);
      const entry = {
        name: String(formData.get('name') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        guests: String(formData.get('guests') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        createdAt: new Date().toISOString(),
      };
      const items = loadRsvps();
      items.unshift(entry);
      saveRsvps(items);
      renderRsvps();
      document.getElementById("rsvpSuccess").style.display = "block";
      e.target.reset();
      document.getElementById("rsvpSuccess").scrollIntoView({behavior: "smooth", block: "nearest"});
    });

    exportRsvp.addEventListener('click', () => {
      const items = loadRsvps();
      const header = ['Nome','Telefone','Acompanhantes','Observações','Registrado em'];
      const rows = items.map(item => [item.name, item.phone, item.guests, item.message, formatDate(item.createdAt)]);
      const csv = [header, ...rows].map(row => row.map(csvEscape).join(';')).join('\n');
      downloadTextFile('confirmados.csv', csv, 'text/csv;charset=utf-8');
    });

    copyRsvpList.addEventListener('click', async () => {
      const items = loadRsvps();
      const text = items.length
        ? items.map((item, index) => `${index + 1}. ${item.name} | ${item.phone} | acompanhantes: ${item.guests} | ${item.message || '-'} | ${formatDate(item.createdAt)}`).join('\n')
        : 'Nenhuma confirmação registrada.';
      try {
        await navigator.clipboard.writeText(text);
        const old = copyRsvpList.textContent;
        copyRsvpList.textContent = 'Copiado!';
        setTimeout(() => copyRsvpList.textContent = old, 1400);
      } catch {
        alert(text);
      }
    });

    clearRsvpList.addEventListener('click', () => {
      if (!confirm('Quer apagar todas as confirmações salvas neste navegador?')) return;
      localStorage.removeItem(RSVP_STORAGE_KEY);
      renderRsvps();
    });

    renderRsvps();
  