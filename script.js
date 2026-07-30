let works = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('works.json');
        works = await res.json();
        console.log('✅ Loaded works:', works);
    } catch (err) {
        console.error('❌ Cannot load works.json:', err);
        works = [];
    }

    if(document.getElementById('featuredGrid')) renderFeatured();
    if(document.getElementById('artGrid')) renderGallery();
    if(document.getElementById('workDetail')) renderWorkDetail();
});

// === Tác phẩm nổi bật ===
function renderFeatured(){
    const grid = document.getElementById('featuredGrid');
    const featured = works.slice(0,3);
    if(featured.length === 0){
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">No artworks found</p>`;
        return;
    }
    grid.innerHTML = featured.map(work => `
        <div class="art-card" onclick="location.href='work.html?id=${work.id}'">
            <div class="art-media">
                ${(work.mediaType === 'video')
                    ? `<video src="${work.media}" muted playsinline loading="lazy"></video>`
                    : `<img src="${work.media}" alt="${work.title}" loading="lazy">`
                }
            </div>
            <div class="art-info">
                <h3>${work.title}</h3>
                <span class="art-tag">${work.type || 'Artwork'}</span>
            </div>
        </div>
    `).join('');
}

// === Trang thư viện / Bộ sưu tập ===
function renderGallery(filter=''){
    const grid = document.getElementById('artGrid');
    let filtered = works;
    if(filter){
        filtered = works.filter(w => 
            w.title.toLowerCase().includes(filter.toLowerCase()) ||
            (w.type || '').toLowerCase().includes(filter.toLowerCase())
        );
    }
    if(filtered.length === 0){
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;">No artworks found</p>`;
        return;
    }
    grid.innerHTML = filtered.map(work => `
        <div class="art-card" onclick="location.href='work.html?id=${work.id}'">
            <div class="art-media">
                ${(work.mediaType === 'video')
                    ? `<video src="${work.media}" muted playsinline loading="lazy"></video>`
                    : `<img src="${work.media}" alt="${work.title}" loading="lazy">`
                }
            </div>
            <div class="art-info">
                <h3>${work.title}</h3>
                <span class="art-tag">${work.type || 'Artwork'}</span>
            </div>
        </div>
    `).join('');
}

// === Trang chi tiết tác phẩm — ĐÃ SỬA LỖI CHÍNH ===
function renderWorkDetail(){
    const container = document.getElementById('workDetail');
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // ❗ Giữ nguyên chuỗi, KHÔNG parse số

    if(!id){
        container.innerHTML = `
        <div class="work-single" style="text-align:center;padding:60px 24px;">
            <h2 style="color:var(--brown-deep);margin-bottom:16px;">❌ Missing Artwork ID</h2>
            <p style="color:var(--text-muted);margin-bottom:24px;">Link is invalid or missing parameters.</p>
            <a href="gallery.html" class="view-all-btn">← Back to Collection</a>
        </div>`;
        return;
    }

    const work = works.find(w => w.id === id); // So sánh đúng chuỗi với chuỗi
    if(!work){
        container.innerHTML = `
        <div class="work-single" style="text-align:center;padding:60px 24px;">
            <h2 style="color:var(--brown-deep);margin-bottom:16px;">❌ Artwork Not Found</h2>
            <p style="color:var(--text-muted);margin-bottom:24px;">The artwork you are looking for does not exist.</p>
            <a href="gallery.html" class="view-all-btn">← Back to Collection</a>
        </div>`;
        return;
    }

    // ✅ Hiển thị đúng ảnh/video từ trường media
    container.innerHTML = `
        <div class="work-single">
            <div class="work-image-wrap">
                ${(work.mediaType === 'video')
                    ? `<video src="${work.media}" controls class="work-detail-img" style="width:100%;border-radius:8px;"></video>`
                    : `<img src="${work.media}" alt="${work.title}" class="work-detail-img">`
                }
            </div>
            <p class="work-author">Enkai Art Agency</p>
            <h1>${work.title}</h1>
            <span class="work-date">${work.date || 'Unknown date'}</span>
            <div class="work-body">
                <p>${work.description || 'No description yet.'}</p>
            </div>
            <a href="mailto:quangtrungtran.info@gmail.com?subject=Inquiry: ${encodeURIComponent(work.title)}" class="inquire-btn">Inquire about this artwork</a>
            <br><br>
            <a href="gallery.html" class="view-all-btn">← Back to all works</a>
        </div>
    `;
}

// === Tìm kiếm ===
document.addEventListener('input', e => {
    if(e.target.classList.contains('search-box')){
        renderGallery(e.target.value.trim());
    }
});
