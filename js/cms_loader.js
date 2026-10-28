// Dynamic CMS Loader & Live Content Hydrator
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Announcement Banner
    const annRes = await fetch('data/announcements.json').catch(() => null);
    if (annRes && annRes.ok) {
      const ann = await annRes.json();
      const banner = document.getElementById('tuesday-event-banner');
      if (banner) {
        if (!ann.active) {
          banner.style.display = 'none';
        } else {
          banner.style.display = 'block';
          banner.style.backgroundColor = ann.bg_color || '#fd5f00';
          banner.innerHTML = (ann.text || '') + ' ' +
            '<a href="' + (ann.link || '#') + '" style="color: var(--tx-navy); text-decoration: underline; margin-left: 10px;">' +
            (ann.button_text || 'Learn More ➔') + '</a>';
        }
      }
    }

    // 2. Settings & Links
    const setRes = await fetch('data/settings.json').catch(() => null);
    if (setRes && setRes.ok) {
      const s = await setRes.json();
      if (s.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
          el.href = 'tel:' + s.phone.replace(/\D/g, '');
          el.textContent = s.phone;
        });
      }
      if (s.email) {
        document.querySelectorAll('a[href^="mailto:"]:not([href*="?"])').forEach(el => {
          el.href = 'mailto:' + s.email;
          if (el.textContent.includes('@')) el.textContent = s.email;
        });
      }
      if (s.donate_link) {
        document.querySelectorAll('.tx-clone-btn-donate, a[href*="actblue.com"]').forEach(el => {
          el.href = s.donate_link;
        });
      }
      if (s.linktree_link) {
        document.querySelectorAll('a[href*="linktr.ee"]').forEach(el => {
          el.href = s.linktree_link;
        });
      }
    }

    // 3. Leadership
    const leadRes = await fetch('data/leadership.json').catch(() => null);
    if (leadRes && leadRes.ok) {
      const l = await leadRes.json();
      const cecList = document.querySelector('.glass-card ul');
      if (cecList && window.location.pathname.includes('about.html')) {
        let html = '<li><strong>' + (l.chair_title || 'County Chair & Parliamentarian') + ':</strong> ' + (l.chair || 'Aaron Gonzalez') + '</li>' +
                   '<li><strong>' + (l.vice_chair_title || 'Vice-Chair & Treasurer') + ':</strong> ' + (l.vice_chair || 'Lucidora Perez') + '</li>' +
                   '<li><strong>' + (l.secretary_title || 'Secretary & Historian') + ':</strong> ' + (l.secretary || 'Victoria Dodge') + '</li>' +
                   '<li><strong>' + (l.social_media_title || 'Social Media Liaison') + ':</strong> ' + (l.social_media || 'Anastasia Maldonado') + '</li>';
        if (l.precinct_chairs && Array.isArray(l.precinct_chairs)) {
          l.precinct_chairs.forEach(p => {
            html += '<li><strong>' + p.precinct + ' Chair:</strong> ' + p.name + ' (' + p.status + ')</li>';
          });
        }
        cecList.innerHTML = html;
      }
    }

    // 4. Articles on news.html
    const artRes = await fetch('data/articles.json').catch(() => null);
    if (artRes && artRes.ok) {
      const arts = await artRes.json();
      const newsGrid = document.getElementById('articles-grid');
      if (newsGrid && Array.isArray(arts)) {
        if (arts.length === 0) {
          newsGrid.innerHTML = '<p style="color: var(--text-muted); grid-column: span 3; text-align: center;">No articles published yet. Check back soon!</p>';
        } else {
          newsGrid.innerHTML = arts.map((a, i) => `
            <div class="glass-card" style="display: flex; flex-direction: column; overflow: hidden; border-radius: 12px;">
              ${a.image ? '<img src="' + a.image + '" alt="' + a.title + '" style="width: 100%; height: 200px; object-fit: cover;" />' : ''}
              <div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">${a.category || 'Article'} • ${a.date || ''}</span>
                <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0 0 0.75rem 0; color: #fff;">${a.title}</h3>
                <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem; flex: 1;">${a.excerpt || a.content.substring(0, 140) + '...'}</p>
                <div style="border-top: 1px solid var(--glass-border); padding-top: 1rem; font-size: 0.85rem; color: #94a3b8;">By ${a.author || 'Hockley County Dems'}</div>
              </div>
            </div>
          `).join('');
        }
      }
    }
  } catch (e) {
    console.debug('CMS Loader active with fallback base');
  }
});
