// ==========================================
// 📌 DANH SÁCH TÁC PHẨM — THÊM/SỬA Ở ĐÂY
// ==========================================
const WORKS = [
  // ⬇️ BẠN THÊM TÁC PHẨM MỚI BẮT ĐẦU TỪ DÒNG NÀY ⬇️
  {
    id: 'work-001',
    title: 'Tên tác phẩm ví dụ',
    type: 'Ảnh Nghệ Thuật',
    date: '2026-07-30',
    media: 'https://i.imgur.com/abc123.jpg', // Link ảnh/video của bạn
    mediaType: 'image', // hoặc 'video'
    description: 'Mô tả chi tiết về tác phẩm này, câu chuyện đằng sau, ý nghĩa...'
  }
  // ⬆️ KẾT THÚC Ở ĐÂY — PHÂN TÁCH BẰNG DẤU PHẨM PHẨY , ⬆️
];

// ========================
// KHỞI TẠO & HIỂN THỊ
// ========================
document.addEventListener('DOMContentLoaded', () => {
  initGalleryPage();
  initWorkPage();
});

// === TRANG DANH SÁCH ===
function initGalleryPage() {
  const grid = document.getElementById('artGrid');
  if (!grid) return;

  renderGrid(WORKS);

  // Tìm kiếm
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
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-gray);">Chưa có tác phẩm nào được đăng.</p>`;
    return;
  }
  grid.innerHTML = list.map(work => `
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
    container.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-gray);">Không tìm thấy tác phẩm này.<br><a href="gallery.html" style="color:var(--gold);margin-top:20px;display:inline-block">Quay lại thư viện</a></div>`;
    return;
  }

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const d = new Date(work.date);
  const dateShow = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  container.innerHTML = `
    <div class="work-single">
      <div class="work-image-wrap">
        ${work.mediaType === 'video'
          ? `<video class="work-detail-img" controls src="${work.media}"></video>`
          : `<img src="${work.media}" alt="${work.title}" class="work-detail-img">`
        }
      </div>
      <p class="work-author">Trần Quang Trung</p>
      <h1>${work.title}</h1>
      <span class="work-date">${dateShow}</span>
      <div class="work-body">${work.description.replace(/\n/g,'<br>')}</div>
      <a href="mailto:?subject=${encodeURIComponent('Liên hệ về tác phẩm: ' + work.title)}&body=${encodeURIComponent('Xin chào Trần Quang Trung,%0D%0A%0D%0A')}" class="inquire-btn">Liên hệ về tác phẩm</a>
    </div>
  `;
}
