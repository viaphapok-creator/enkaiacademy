// ==========================================
// 📌 ĐỌC DỮ LIỆU TỪ FILE RIÊNG works.json
// ==========================================
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

// ========================
// 🚀 KHỞI CHẠY TOÀN BỘ
// ========================
document.addEventListener('DOMContentLoaded', async () => {
  await loadWorksData(); // Đợi tải dữ liệu xong
  initFeaturedWorks();
  initGalleryPage();
  initWorkPage();
});

// === TRANG CHỦ: HIỂN THỊ TÁC PHẨM NỔI BẬT ===
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

// === TRANG DANH SÁCH ===
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

// === TRANG CHI TIẾT ===
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
      <a href="gallery.html">Tác phẩm</a>
    `;
  }

  if (!work) {
    container.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-gray);">❌ Không tìm thấy tác phẩm này.<br><a href="gallery.html" style="color:var(--gold);margin-top:20px;display:inline-block">← Quay lại thư viện</a></div>`;
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
      <p class="work-author">Trần Quang Trung</p>
      <h1>${work.title}</h1>
      <span class="work-date">${dateShow}</span>
      <div class="work-body">${work.description.replace(/\n/g,'<br>')}</div>
      <a href="mailto:?subject=${encodeURIComponent('Liên hệ: ' + work.title)}&body=${encodeURIComponent('Xin chào Trần Quang Trung,%0D%0A%0D%0A')}" class="inquire-btn">Liên hệ về tác phẩm</a>
    </div>
  `;
}
