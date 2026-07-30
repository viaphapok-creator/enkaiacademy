let WORKS = [];

async function loadWorksData() {
  try {
    const res = await fetch('works.json?t=' + Date.now());
    if (!res.ok) throw new Error('File not found');
    WORKS = await res.json();
  } catch (err) {
    console.error('❌ Lỗi đọc works.json:', err);
    WORKS = [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadWorksData();
  initFeaturedWorks();
  initGalleryPage();
  initWorkPage();
});

function initFeaturedWorks() {
  const container = document.getElementById('featuredGrid');
  if (!container || !WORKS.length) return;
  const featured = WORKS.slice(0,3);
  container.innerHTML = featured.map(work => `
    <div class="art-card" onclick="window.location.href='work.html?id=${work.id}'">
      <div class="art-media">
        ${work.mediaType === 'video' 
          ? `<video autoplay muted loop playsinline src="${work.media}"></video>`
          : `<img src="${work.media}" alt="${work.title}" loading="lazy">`
        }
      </div>
      <div class="art-info">
        <h3>${work.title}</h3>
        <span class="art-tag">${work.type}</span>
      </div>
    </div>
  `).join('');
}

function initGalleryPage() {
  const grid = document.getElementById('artGrid');
  if (!grid) return;
  renderGrid(WORKS);
  const searchBox = document.querySelector('.search-box');
  if (searchBox) {
    searchBox.addEventListener('input', e => {
      const kw = e.target.value.toLowerCase().trim();
      const filtered = WORKS.filter(w => 
        w.title.toLowerCase().includes(kw) || w.type.toLowerCase().includes(kw)
      );
      renderGrid(filtered);
    });
  }
}

function renderGrid(list) {
  const grid = document.getElementById('artGrid');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-gray);padding:40px 0;">Chưa có tác phẩm nào được đăng.<br>Hãy thêm vào file works.json</p>`;
    return;
  }
  grid.innerHTML = list.map(work => `
    <div class="art-card" onclick="window.location.href='work.html?id=${work.id}'">
      <div class="art-media">
        ${work.mediaType === 'video' 
          ? `<video autoplay muted loop playsinline preload="metadata" src="${work.media}"></video>`
          : `<img src="${work.media}" alt="${work.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x500/211d14/c8a962?text=Link+LỖI+⚠️'">`
        }
      </div>
      <div class="art-info">
        <h3>${work.title}</h3>
        <span class="art-tag">${work.type}</span>
      </div>
    </div>
  `).join('');
}

function initWorkPage() {
  const container = document.getElementById('workDetail');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const workId = params.get('id');
  const work = WORKS.find(w => w.id === workId);
  const nav = document.getElementById('topNav');
  if (nav) {
    nav.innerHTML = `
      <a href="index.html">Trang chủ</a>
      <a href="gallery.html" class="active">Tác phẩm</a>
      <a href="index.html#about">Giới thiệu</a>
      <a href="index.html#contact">Liên hệ</a>
    `;
  }
  if (!work) {
    container.innerHTML = `<div class="work-single" style="text-align:center;padding:60px 24px;"><h2 style="color:var(--gold-light);margin-bottom:16px;">❌ Không tìm thấy tác phẩm</h2><p style="color:var(--text-gray);margin-bottom:24px;">Liên kết có thể đã sai hoặc tác phẩm đã bị xóa.</p><a href="gallery.html" class="view-all-btn">← Quay lại Bộ Sưu Tập</a></div>`;
    return;
  }
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const d = new Date(work.date);
  const dateShow = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  container.innerHTML = `
    <div class="work-single">
      <div class="work-image-wrap">
        ${work.mediaType === 'video'
          ? `<video class="work-detail-img" controls preload="metadata" src="${work.media}"></video>`
          : `<img src="${work.media}" alt="${work.title}" class="work-detail-img" loading="lazy">`
        }
      </div>
      <p class="work-author">Tran Quang Trung</p>
      <h1>${work.title}</h1>
      <span class="work-date">${dateShow}</span>
      <div class="work-body">${work.description.replace(/\n/g,'<br>')}</div>
      <a href="mailto:tranthanhquangtrung@email.com?subject=${encodeURIComponent('Liên hệ về tác phẩm: ' + work.title)}&body=${encodeURIComponent('Xin chào Tran Quang Trung,\n\n')}" class="inquire-btn">Liên hệ về tác phẩm</a>
    </div>
  `;
}
