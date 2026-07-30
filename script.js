// ========================
// QUẢN LÝ DỮ LIỆU
// ========================
const STORAGE_KEY = 'enkai_works_data';

function getWorks() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}
function saveWorks(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function generateId() {
    return 'work' + Date.now();
}
function formatDateInput(dateStr) {
    if(!dateStr) return '';
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
}
function formatDateShow(dateStr) {
    const d = new Date(dateStr);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ========================
// TRANG INDEX — TRỞ LẠI NHƯ CŨ + NỘI DUNG ĐỘNG
// ========================
function renderIndexGallery() {
    const grid = document.querySelector('.art-grid');
    if(!grid) return;
    const works = getWorks();
    if(!works.length) {
        grid.innerHTML = `
        <!-- Ví dụ hiển thị khi chưa có gì, bạn có thể xoá đi -->
        <p style="grid-column:1/-1;text-align:center;color:var(--text-gray);">Chưa có tác phẩm nào. Vào admin.html để thêm nhé!</p>`;
        return;
    }
    grid.innerHTML = works.map(work => `
        <a href="works.html?work=${work.id}" class="art-card-link">
            <div class="art-card">
                <div class="art-media">
                    ${work.mediaType==='video'
                        ? `<video autoplay muted loop playsinline preload="metadata"><source src="${work.media}" type="video/mp4"></video>`
                        : `<img src="${work.media}" alt="${work.title}" loading="lazy">`
                    }
                </div>
                <div class="art-info">
                    <h3>${work.title}</h3>
                    <span class="art-tag">${work.type}</span>
                </div>
            </div>
        </a>
    `).join('');
}

// Tìm kiếm giữ nguyên như cũ
document.addEventListener('input', e => {
    if(e.target.classList.contains('search-box')){
        const kw = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.art-card-link').forEach(card => {
            card.style.display = (!kw || card.textContent.toLowerCase().includes(kw)) ? '' : 'none';
        });
    }
});

// ========================
// TRANG WORKS
// ========================
function renderWorksPage() {
    if(!document.querySelector('.work-detail')) return;
    const works = getWorks();
    const nav = document.querySelector('.main-nav');
    const detailWrap = document.querySelector('.work-detail');

    nav.innerHTML = `<a href="index.html">← Quay Lại</a>`;
    works.forEach((w,i) => nav.innerHTML += `<a href="#" class="work-tab" data-target="${w.id}">${i+1}</a>`);

    detailWrap.innerHTML = '';
    works.forEach(work => {
        const mediaHtml = work.mediaType==='video'
            ? `<video class="work-detail-img" controls><source src="${work.media}" type="video/mp4"></video>`
            : `<img src="${work.media}" alt="${work.title}" class="work-detail-img">`;

        detailWrap.innerHTML += `
            <div class="work-single" id="${work.id}">
                <div class="work-image-wrap">${mediaHtml}</div>
                <p class="work-author">Trần Quang Trung</p>
                <h1>${work.title}</h1>
                <span class="work-date">${formatDateShow(work.date)}</span>
                <div class="work-body"><p>${work.desc.replace(/\n/g,'</p><p>')}</p></div>
                <a href="mailto:iamdinhtuan.hakai@gmail.com?subject=Hợp tác — ${encodeURIComponent(work.title)}" class="inquire-btn">Liên hệ hợp tác</a>
                <div class="copy-link-box">
                    <input type="text" class="link-input" readonly>
                    <button class="copy-btn">Sao chép Link</button>
                </div>
            </div>
        `;
    });

    initWorkTabsAndCopy();
}

function initWorkTabsAndCopy(){
    const workTabs = document.querySelectorAll('.work-tab');
    const workSingles = document.querySelectorAll('.work-single');

    function showWork(id) {
        workSingles.forEach(el => el.classList.toggle('active', el.id === id));
        workTabs.forEach(el => el.classList.toggle('active', el.dataset.target === id));
    }

    workTabs.forEach(tab => {
        tab.addEventListener('click', e => {
            e.preventDefault();
            showWork(tab.dataset.target);
        });
    });

    let openId = null;
    if (window.location.search.includes('work=')) {
        openId = new URLSearchParams(window.location.search).get('work');
    }
    if(openId) showWork(openId);
    else if(workTabs[0]) { workTabs[0].classList.add('active'); workSingles[0]?.classList.add('active'); }

    document.querySelectorAll('.work-single').forEach(single => {
        const btn = single.querySelector('.copy-btn');
        const input = single.querySelector('.link-input');
        if(btn && input){
            input.value = window.location.href;
            btn.addEventListener('click', async () => {
                try{ await navigator.clipboard.writeText(input.value); btn.classList.add('copied'); btn.textContent='✅ Đã sao chép!'; }
                catch{ input.select(); document.execCommand('copy'); btn.classList.add('copied'); btn.textContent='✅ Đã sao chép!'; }
                setTimeout(()=>{ btn.classList.remove('copied'); btn.textContent='Sao chép Link'; },2500);
            });
        }
    });
}

// ========================
// TRANG ADMIN — THÊM / SỬA / XOÁ
// ========================
function renderAdminList() {
    const listBox = document.getElementById('admin-work-list');
    if(!listBox) return;
    const works = getWorks();
    if(!works.length){
        listBox.innerHTML = '<p class="empty-txt">Chưa có tác phẩm nào. Hãy thêm ở trên!</p>';
        return;
    }
    listBox.innerHTML = works.map((work,idx) => `
        <div class="admin-work-item">
            <div class="admin-work-info">
                <h4>${idx+1}. ${work.title}</h4>
                <p>📅 ${formatDateShow(work.date)} • ${work.type}</p>
            </div>
            <div class="admin-work-actions">
                <button class="small-btn edit" onclick="editWork('${work.id}')">✏️ Sửa</button>
                <button class="small-btn del" onclick="deleteWork('${work.id}')">🗑️ Xoá</button>
            </div>
        </div>
    `).join('');
}

window.editWork = function(id){
    const works = getWorks();
    const work = works.find(w=>w.id===id);
    if(!work) return;

    document.getElementById('edit-id').value = id;
    document.getElementById('media-link').value = work.media;
    document.getElementById('work-title').value = work.title;
    document.getElementById('work-type').value = work.type;
    document.getElementById('work-date').value = formatDateInput(work.date);
    document.getElementById('work-desc').value = work.desc;

    document.getElementById('form-title').textContent = '✏️ Chỉnh Sửa Tác Phẩm';
    document.getElementById('btn-cancel').style.display = 'inline-block';
    window.scrollTo({top:0,behavior:'smooth'});
};

window.deleteWork = function(id){
    if(!confirm('⚠️ Bạn có chắc chắn muốn XOÁ vĩnh viễn? Không thể hoàn tác!')) return;
    let works = getWorks().filter(w=>w.id!==id);
    saveWorks(works);
    renderAdminList();
    renderIndexGallery();
    alert('✅ Đã xoá thành công!');
};

function resetForm(){
    document.getElementById('work-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('form-title').textContent = '➕ Thêm Tác Phẩm Mới';
    document.getElementById('btn-cancel').style.display = 'none';
}

const form = document.getElementById('work-form');
if(form){
    renderAdminList();
    form.addEventListener('submit', e => {
        e.preventDefault();
        const editId = document.getElementById('edit-id').value;
        const mediaLink = document.getElementById('media-link').value.trim();
        const title = document.getElementById('work-title').value.trim();
        const type = document.getElementById('work-type').value;
        const dateVal = document.getElementById('work-date').value;
        const desc = document.getElementById('work-desc').value.trim();

        const mediaType = /\.(mp4|webm|ogg)$/i.test(mediaLink) || mediaLink.includes('video') ? 'video' : 'image';

        let works = getWorks();
        if(editId){
            works = works.map(w=> w.id===editId ? {...w, media:mediaLink, mediaType, title, type, date:dateVal, desc} : w);
        } else {
            works.unshift({ id: generateId(), media: mediaLink, mediaType, title, type, date: dateVal, desc });
        }
        saveWorks(works);
        resetForm();
        renderAdminList();
        renderIndexGallery();
        alert('✅ Lưu thành công!');
    });
    document.getElementById('btn-cancel').addEventListener('click', resetForm);
}

// ========================
// KHỞI TẠO ĐÚNG TRANG
// ========================
if(document.querySelector('.admin-page')){
    // Trang Admin đã tự chạy
} else if(document.querySelector('.gallery')){
    renderIndexGallery(); // Trang Chủ KHỞI ĐỘNG ĐÚNG NHƯ CŨ
} else if(document.querySelector('.work-detail')){
    renderWorksPage();
        }
                                                   
