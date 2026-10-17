/**
 * VisionPrompt Studio - Interactive Multi-Image & Supabase Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Supabase Client ---
  let supabase = null;
  if (window.supabase && typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
    try {
      supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
      console.log('✓ Supabase Client เชื่อมต่อสำเร็จ:', CONFIG.SUPABASE_URL);
    } catch (err) {
      console.error('ไม่สามารถเริ่มการเชื่อมต่อ Supabase ได้:', err);
    }
  }

  // --- High-Tech Cyber Preloader Intro Animation ---
  const appPreloader = document.getElementById('appPreloader');
  const preloaderBarFill = document.getElementById('preloaderBarFill');
  const preloaderPercent = document.getElementById('preloaderPercent');
  const preloaderStepText = document.getElementById('preloaderStepText');
  const preloaderStatusText = document.getElementById('preloaderStatusText');
  const btnSkipPreloader = document.getElementById('btnSkipPreloader');

  let preloaderFinished = false;

  function finishPreloader() {
    if (preloaderFinished || !appPreloader) return;
    preloaderFinished = true;
    if (preloaderBarFill) preloaderBarFill.style.width = '100%';
    if (preloaderPercent) preloaderPercent.textContent = '100%';
    if (preloaderStepText) preloaderStepText.textContent = 'SYSTEM ONLINE';
    if (preloaderStatusText) preloaderStatusText.textContent = '⚡ เชื่อมต่อระบบ AI Gateway สำเร็จ ยินดีต้อนรับ!';

    setTimeout(() => {
      appPreloader.classList.add('preloader-hidden');
      setTimeout(() => {
        appPreloader.style.display = 'none';
      }, 500);
    }, 350);
  }

  if (appPreloader) {
    if (btnSkipPreloader) {
      btnSkipPreloader.addEventListener('click', finishPreloader);
    }
    appPreloader.addEventListener('click', (e) => {
      if (e.target === appPreloader) finishPreloader();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') finishPreloader();
    }, { once: true });

    let currentProgress = 0;
    const preloaderInterval = setInterval(() => {
      if (preloaderFinished) {
        clearInterval(preloaderInterval);
        return;
      }
      currentProgress += Math.floor(Math.random() * 14) + 8;
      if (currentProgress > 98) currentProgress = 100;

      if (preloaderBarFill) preloaderBarFill.style.width = `${currentProgress}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${currentProgress}%`;

      if (currentProgress >= 20 && currentProgress < 50) {
        if (preloaderStepText) preloaderStepText.textContent = 'INITIALIZING AI CORE';
        if (preloaderStatusText) preloaderStatusText.textContent = 'กำลังโหลดโมเดลภาษาและการประมวลผลคำสั่ง...';
      } else if (currentProgress >= 50 && currentProgress < 80) {
        if (preloaderStepText) preloaderStepText.textContent = 'CONNECTING SUPABASE';
        if (preloaderStatusText) preloaderStatusText.textContent = 'เชื่อมโยงฐานข้อมูล Cloud Storage & Commands...';
      } else if (currentProgress >= 80 && currentProgress < 100) {
        if (preloaderStepText) preloaderStepText.textContent = 'AI ENGINES READY';
        if (preloaderStatusText) preloaderStatusText.textContent = 'ตรวจสอบ GPT-4o & DALL-E 3 พร้อมทำงาน...';
      }

      if (currentProgress >= 100) {
        clearInterval(preloaderInterval);
        finishPreloader();
      }
    }, 110);
  }

  // --- DOM Elements ---
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const dropzoneEmpty = document.getElementById('dropzoneEmpty');
  const dropzonePreview = document.getElementById('dropzonePreview');
  const imageGalleryGrid = document.getElementById('imageGalleryGrid');
  const galleryCountBadge = document.getElementById('galleryCountBadge');
  const galleryTotalSize = document.getElementById('galleryTotalSize');
  const btnAddMoreImages = document.getElementById('btnAddMoreImages');
  const btnClearAllImages = document.getElementById('btnClearAllImages');

  const promptInput = document.getElementById('promptInput');
  const charCounter = document.getElementById('charCounter');
  const btnClearPrompt = document.getElementById('btnClearPrompt');
  const suggestionChips = document.getElementById('suggestionChips');

  const btnResetAll = document.getElementById('btnResetAll');
  const btnSubmitCommand = document.getElementById('btnSubmitCommand');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnIcon = document.getElementById('btnIcon');
  const btnText = document.getElementById('btnText');
  const summaryText = document.getElementById('summaryText');

  const resultsSection = document.getElementById('resultsSection');
  const resultThumbnailsContainer = document.getElementById('resultThumbnailsContainer');
  const resultPromptText = document.getElementById('resultPromptText');
  const resultTimestamp = document.getElementById('resultTimestamp');
  const outputJsonDisplay = document.getElementById('outputJsonDisplay');
  const btnCopyJson = document.getElementById('btnCopyJson');

  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const btnModalClose = document.getElementById('btnModalClose');
  const btnThemeToggle = document.getElementById('btnThemeToggle');

  // --- Real-Time AI Generation Loading Elements ---
  const generationLoadingOverlay = document.getElementById('generationLoadingOverlay');
  const loadingStatusText = document.getElementById('loadingStatusText');
  const progressStepName = document.getElementById('progressStepName');
  const loadingPercent = document.getElementById('loadingPercent');
  const progressBarFill = document.getElementById('progressBarFill');
  const btnMinimizeLoading = document.getElementById('btnMinimizeLoading');
  const floatingProgressWidget = document.getElementById('floatingProgressWidget');
  const floatingPercentText = document.getElementById('floatingPercentText');
  const btnRestoreLoading = document.getElementById('btnRestoreLoading');

  const stepUpload = document.getElementById('stepUpload');
  const stepQueue = document.getElementById('stepQueue');
  const stepStoryboard = document.getElementById('stepStoryboard');
  const stepCover = document.getElementById('stepCover');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');

  function updateLoadingProgress(percent, stepName, statusMsg, stepIdx = 0) {
    const p = Math.min(100, Math.max(0, Math.round(percent)));
    if (loadingPercent) loadingPercent.textContent = `${p}%`;
    if (floatingPercentText) floatingPercentText.textContent = `${p}%`;
    if (progressBarFill) progressBarFill.style.width = `${p}%`;
    if (progressStepName && stepName) progressStepName.textContent = stepName;
    if (loadingStatusText && statusMsg) loadingStatusText.textContent = statusMsg;

    const steps = [stepUpload, stepQueue, stepStoryboard, stepCover];
    const lines = [line1, line2, line3];

    steps.forEach((st, idx) => {
      if (!st) return;
      if (idx < stepIdx) {
        st.className = 'pipe-step done';
      } else if (idx === stepIdx) {
        st.className = 'pipe-step active';
      } else {
        st.className = 'pipe-step';
      }
    });

    lines.forEach((ln, idx) => {
      if (!ln) return;
      if (idx < stepIdx) {
        ln.className = 'pipe-line done';
      } else {
        ln.className = 'pipe-line';
      }
    });
  }

  function showLoadingScreen() {
    if (generationLoadingOverlay) generationLoadingOverlay.style.display = 'flex';
    if (floatingProgressWidget) floatingProgressWidget.style.display = 'none';
  }

  function hideLoadingScreen() {
    if (generationLoadingOverlay) generationLoadingOverlay.style.display = 'none';
    if (floatingProgressWidget) floatingProgressWidget.style.display = 'none';
  }

  if (btnMinimizeLoading) {
    btnMinimizeLoading.addEventListener('click', () => {
      if (generationLoadingOverlay) generationLoadingOverlay.style.display = 'none';
      if (floatingProgressWidget) floatingProgressWidget.style.display = 'flex';
      showToast('ย่อหน้าต่างประมวลผลแล้ว (ทำงานในเบื้องหลัง)', 'info');
    });
  }

  if (btnRestoreLoading) {
    btnRestoreLoading.addEventListener('click', () => {
      if (generationLoadingOverlay) generationLoadingOverlay.style.display = 'flex';
      if (floatingProgressWidget) floatingProgressWidget.style.display = 'none';
    });
  }

  if (floatingProgressWidget) {
    floatingProgressWidget.addEventListener('click', (e) => {
      if (e.target !== btnRestoreLoading) {
        if (generationLoadingOverlay) generationLoadingOverlay.style.display = 'flex';
        floatingProgressWidget.style.display = 'none';
      }
    });
  }

  // --- State for Multiple Images ---
  let selectedFiles = []; // Array of { id, file, dataUrl, name, size }

  // --- Helper: Format File Size ---
  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // --- Helper: Toast Notification ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `<span style="font-weight:bold;">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- Render Image Gallery ---
  function renderGallery() {
    if (selectedFiles.length === 0) {
      dropzonePreview.style.display = 'none';
      dropzoneEmpty.style.display = 'block';
      updatePayloadSummary();
      return;
    }

    dropzoneEmpty.style.display = 'none';
    dropzonePreview.style.display = 'flex';

    // Update Header Stats
    galleryCountBadge.textContent = `${selectedFiles.length} รูปภาพ`;
    const totalBytes = selectedFiles.reduce((acc, item) => acc + item.size, 0);
    galleryTotalSize.textContent = `รวม ${formatBytes(totalBytes)}`;

    // Rebuild Grid
    imageGalleryGrid.innerHTML = '';
    selectedFiles.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-item';
      card.innerHTML = `
        <div class="gallery-thumb-wrapper">
          <img src="${item.dataUrl}" alt="${item.name}">
          <div class="gallery-item-overlay">
            <button type="button" class="gallery-btn-action btn-zoom" data-index="${index}" title="ขยายดูภาพ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <button type="button" class="gallery-btn-action btn-del" data-index="${index}" title="ลบภาพนี้">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
        <div class="gallery-item-info">
          <span class="gallery-item-name" title="${item.name}">${item.name}</span>
          <span class="gallery-item-size">${formatBytes(item.size)}</span>
        </div>
      `;
      imageGalleryGrid.appendChild(card);
    });

    updatePayloadSummary();
  }

  // --- Add Multiple Files Handler ---
  function addFiles(files) {
    if (!files || files.length === 0) return;

    let addedCount = 0;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        showToast(`ไฟล์ ${file.name} ไม่ใช่รูปภาพ ข้ามการอัปโหลด`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        selectedFiles.push({
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          file: file,
          name: file.name,
          size: file.size,
          dataUrl: e.target.result
        });
        renderGallery();
      };
      reader.readAsDataURL(file);
      addedCount++;
    });

    if (addedCount > 0) {
      showToast(`เพิ่มรูปภาพสำเร็จ (${addedCount} รูป)`);
    }
  }

  // --- Event: Click Gallery Actions (Zoom / Remove) ---
  imageGalleryGrid.addEventListener('click', (e) => {
    e.stopPropagation();
    const btnDel = e.target.closest('.btn-del');
    const btnZoom = e.target.closest('.btn-zoom');

    if (btnDel) {
      const idx = parseInt(btnDel.getAttribute('data-index'), 10);
      selectedFiles.splice(idx, 1);
      renderGallery();
      showToast('ลบรูปภาพแล้ว', 'info');
      return;
    }

    if (btnZoom) {
      const idx = parseInt(btnZoom.getAttribute('data-index'), 10);
      if (selectedFiles[idx]) {
        modalImg.src = selectedFiles[idx].dataUrl;
        imageModal.style.display = 'flex';
      }
      return;
    }
  });

  // --- Event: Add More Button ---
  btnAddMoreImages.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  // --- Event: Clear All Images ---
  btnClearAllImages.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedFiles = [];
    fileInput.value = '';
    renderGallery();
    showToast('ล้างรูปภาพทั้งหมดแล้ว', 'info');
  });

  // --- Drag & Drop Listeners ---
  dropZone.addEventListener('click', (e) => {
    if (e.target.closest('.gallery-toolbar') || e.target.closest('.gallery-item')) return;
    fileInput.click();
  });

  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      addFiles(dt.files);
    }
  });

  // --- Clipboard Paste Support (Ctrl+V) ---
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let found = false;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        addFiles([file]);
        found = true;
      }
    }
    if (found) {
      showToast('ตรวจพบภาพจากคลิปบอร์ด วางเรียบร้อย!');
    }
  });

  // --- Lightbox Modal Events ---
  btnModalClose.addEventListener('click', () => {
    imageModal.style.display = 'none';
  });

  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.style.display = 'none';
    }
  });

  // --- Default TikTok Affiliate Prompt ---
  const DEFAULT_AFFILIATE_PROMPT = `ช่วยสร้างชุดคอนเทนต์รีวิวสินค้าด้วย AI สำหรับวิดีโอ TikTok แบบปักตะกร้า โดยใช้รูปสินค้าที่ฉันแนบเป็นภาพอ้างอิง และจัดทำตามรายละเอียดต่อไปนี้

1. ภาพสตอรีบอร์ดรีวิวสินค้า 6 ซีน
- สร้างภาพ 1 รูป แบ่งเป็น 6 ช่อง เรียงตามลำดับซีน เพื่อเล่าเรื่องการรีวิวสินค้าตั้งแต่เริ่มจนจบ
- เน้นการถ่ายสินค้า การสาธิตใช้งาน และรายละเอียดที่น่าสนใจ
- ไม่ต้องมีข้อความ คำบรรยาย หรือหมายเลขซีนบนภาพ
- ไม่เห็นใบหน้าผู้ถ่ายหรือผู้สาธิต สามารถเห็นเฉพาะมือได้
- รูปลักษณ์ สี รูปทรง โลโก้ และรายละเอียดของสินค้าต้องตรงกับภาพอ้างอิงทุกซีน

2. พรอมป์ต์ภาษาอังกฤษสำหรับ Google Flow
- เขียนพรอมป์ต์ 1 ชุด ครอบคลุมทั้ง 6 ซีน โดยใช้ภาษาอังกฤษเท่านั้น
- ระบุภาพในแต่ละซีน การเคลื่อนไหวของกล้อง การสาธิตสินค้า และเสียงเอฟเฟกต์ให้ชัดเจน
- ใช้สไตล์รีวิวสินค้าจริง ดูเป็นธรรมชาติ เน้นตัวสินค้าและการใช้งาน
- ไม่มีเสียงพากย์ ไม่มีบทพูด และไม่มีเพลงประกอบ ใช้เฉพาะเสียงเอฟเฟกต์ที่สัมพันธ์กับภาพ
- ไม่เห็นใบหน้าบุคคล สามารถเห็นเฉพาะมือขณะหยิบจับหรือสาธิตสินค้าได้
- ไม่มีข้อความหรือคำบรรยายเพิ่มเติมบนวิดีโอ
- สินค้าต้องตรงกับภาพอ้างอิงตลอดทั้งวิดีโอ ห้ามเปลี่ยนรูปลักษณ์หรือเพิ่มคุณสมบัติที่ไม่มีข้อมูลรองรับ
- จัดองค์ประกอบสำหรับวิดีโอแนวตั้ง อัตราส่วน 9:16

3. ชื่อสินค้า คำอธิบาย แฮชแท็ก และปกคลิป
- ตั้งชื่อสินค้าเป็นภาษาไทยให้กระชับ น่าสนใจ และตรงกับสินค้าจริง
- เขียนคำอธิบายสำหรับโพสต์ TikTok พร้อมคำเชิญชวนให้กดดูสินค้าที่ตะกร้า โดยไม่กล่าวอ้างเกินจริง
- ใส่แฮชแท็กที่เกี่ยวข้องกับสินค้าและการใช้งาน
- สร้างภาพปกคลิป 1 รูป อัตราส่วน 9:16 ให้สินค้าโดดเด่น พร้อมข้อความภาษาไทยสั้น ๆ ที่อ่านง่ายและสะกดถูกต้อง

ผลลัพธ์ที่ต้องการ:
- ภาพ 2 รูป ได้แก่ ภาพสตอรีบอร์ดรวม 6 ซีน และภาพปกคลิป
- พรอมป์ต์ภาษาอังกฤษสำหรับ Google Flow จำนวน 1 ชุด
- ข้อความภาษาไทย ได้แก่ ชื่อสินค้า คำอธิบาย และแฮชแท็ก`;

  // Initial counter setup (keep empty for clean new start)
  if (promptInput) {
    const initLen = promptInput.value.length;
    if (charCounter) charCounter.textContent = `${initLen.toLocaleString()} / 4,000`;
    if (btnClearPrompt) btnClearPrompt.style.display = initLen > 0 ? 'inline-block' : 'none';
  }

  // --- Prompt Input & Char Counter ---
  promptInput.addEventListener('input', () => {
    const count = promptInput.value.length;
    charCounter.textContent = `${count.toLocaleString()} / 4,000`;
    btnClearPrompt.style.display = count > 0 ? 'inline-block' : 'none';
    updatePayloadSummary();
  });

  btnClearPrompt.addEventListener('click', () => {
    promptInput.value = '';
    charCounter.textContent = '0 / 4,000';
    btnClearPrompt.style.display = 'none';
    promptInput.focus();
    updatePayloadSummary();
  });

  // --- Suggestion Chips ---
  const btnDefaultPromptChip = document.getElementById('btnDefaultPromptChip');
  if (btnDefaultPromptChip) {
    btnDefaultPromptChip.addEventListener('click', () => {
      promptInput.value = DEFAULT_AFFILIATE_PROMPT;
      promptInput.dispatchEvent(new Event('input'));
      promptInput.focus();
      showToast('ใส่ชุดคำสั่งรีวิว TikTok ปักตะกร้าเรียบร้อย!');
    });
  }

  // --- Payload Summary Updater ---
  function updatePayloadSummary() {
    const count = selectedFiles.length;
    const promptLen = promptInput.value.trim().length;

    if (count > 0 && promptLen > 0) {
      summaryText.textContent = `พร้อมส่ง: ${count} รูปภาพ + ข้อความคำสั่ง`;
    } else if (count > 0) {
      summaryText.textContent = `พร้อมส่ง: ${count} รูปภาพ [ยังไม่พิมพ์คำสั่ง]`;
    } else if (promptLen > 0) {
      summaryText.textContent = `พร้อมส่ง: คำสั่งข้อความ [ไม่มีรูปภาพ]`;
    } else {
      summaryText.textContent = 'ยังไม่ได้เลือกรูปภาพหรือระบุคำสั่ง';
    }
  }

  // --- Keyboard Shortcuts: Ctrl + Enter ---
  promptInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeCommand();
    }
  });

  // --- Reset All Button ---
  btnResetAll.addEventListener('click', () => {
    selectedFiles = [];
    fileInput.value = '';
    renderGallery();
    promptInput.value = '';
    charCounter.textContent = '0 / 4,000';
    btnClearPrompt.style.display = 'none';
    resultsSection.style.display = 'none';
    updatePayloadSummary();
    showToast('รีเซ็ตแบบฟอร์มเป็นค่าว่างเรียบร้อย');
  });

  // --- Submit Command: Upload to Supabase Storage & Insert Table ---
  let isSubmitting = false;
  btnSubmitCommand.addEventListener('click', executeCommand);

  async function executeCommand() {
    if (isSubmitting) return;

    const promptText = promptInput.value.trim();
    if (selectedFiles.length === 0 && !promptText) {
      showToast('กรุณาอัปโหลดรูปภาพ หรือพิมพ์ข้อความคำสั่งก่อนส่ง', 'error');
      promptInput.focus();
      return;
    }

    isSubmitting = true;

    // Set Loading State on Button
    btnSubmitCommand.disabled = true;
    btnSpinner.style.display = 'inline-block';
    btnIcon.style.display = 'none';
    btnText.textContent = 'กำลังประมวลผล...';

    // Show Futuristic Loading Overlay
    showLoadingScreen();
    updateLoadingProgress(5, 'เริ่มต้นเชื่อมต่อ', 'กำลังเตรียมข้อมูลรูปภาพและตรวจสอบการเชื่อมต่อ Supabase...', 0);

    const uploadedImageUrls = [];
    const uploadedFileNames = [];

    try {
      if (!supabase) {
        throw new Error('ไม่พบการเชื่อมต่อกับ Supabase โปรดตรวจสอบไฟล์ config.js');
      }

      // Step 1: Upload each image to Supabase Storage Bucket
      if (selectedFiles.length > 0) {
        const bucketName = CONFIG.SUPABASE_BUCKET || 'command-images';
        const total = selectedFiles.length;

        for (let i = 0; i < total; i++) {
          const item = selectedFiles[i];
          const currentP = 10 + Math.round(((i + 1) / total) * 30);
          updateLoadingProgress(
            currentP, 
            `อัปโหลดรูปภาพ (${i + 1}/${total})`, 
            `กำลังอัปโหลด "${item.name}" ไปยัง Supabase Storage...`, 
            0
          );

          const fileExt = item.name.split('.').pop();
          const cleanName = item.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
          const storagePath = `${Date.now()}_${i}_${cleanName}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(bucketName)
            .upload(storagePath, item.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error(`Upload error for ${item.name}:`, uploadError);
            throw new Error(`อัปโหลดรูป "${item.name}" ไม่สำเร็จ: ${uploadError.message}`);
          }

          const { data: publicUrlData } = supabase
            .storage
            .from(bucketName)
            .getPublicUrl(storagePath);

          uploadedImageUrls.push(publicUrlData.publicUrl);
          uploadedFileNames.push(item.name);
        }
      }

      // Step 2: Insert Record into Supabase `commands` Table
      updateLoadingProgress(45, 'บันทึกเข้าคิวงาน AI', 'กำลังส่งข้อมูลเข้าตาราง commands...', 1);

      let insertData = null;
      let insertError = null;

      const fullPayload = {
        prompt: promptText || '(ไม่มีคำสั่งข้อความ)',
        image_url: uploadedImageUrls[0] || null,
        image_urls: uploadedImageUrls,
        image_names: uploadedFileNames,
        image_count: uploadedImageUrls.length,
        status: 'pending',
        result_data: {
          image_urls: uploadedImageUrls,
          image_names: uploadedFileNames,
          image_count: uploadedImageUrls.length
        }
      };

      const res1 = await supabase.from('commands').insert([fullPayload]).select();

      if (res1.error) {
        const fallbackPayload = {
          prompt: promptText || '(ไม่มีคำสั่งข้อความ)',
          image_url: uploadedImageUrls[0] || null,
          image_name: uploadedFileNames[0] || null,
          status: 'pending',
          result_data: {
            image_urls: uploadedImageUrls,
            image_names: uploadedFileNames,
            image_count: uploadedImageUrls.length
          }
        };
        const res2 = await supabase.from('commands').insert([fallbackPayload]).select();
        insertData = res2.data;
        insertError = res2.error;
      } else {
        insertData = res1.data;
        insertError = res1.error;
      }

      if (insertError) {
        throw new Error(`บันทึกลงฐานข้อมูลไม่สำเร็จ: ${insertError.message}`);
      }

      const insertedRecord = insertData && insertData[0] ? insertData[0] : null;
      const commandId = insertedRecord ? insertedRecord.id : null;

      updateLoadingProgress(55, 'AI Engine รับงานแล้ว', 'ตรวจพบคำสั่งแล้ว กำลังประมวลผลชุดคอนเทนต์...', 2);
      updateVaultCountBadge();

      // Step 3: Real-Time Polling for Results
      let pollCount = 0;
      let isCompleted = false;
      let simulatedProgress = 55;

      const pollInterval = setInterval(async () => {
        if (isCompleted) return;
        pollCount++;

        // Smoothly increment progress bar towards 95% while waiting
        if (simulatedProgress < 94) {
          simulatedProgress += (simulatedProgress < 75 ? 3 : 1.5);
          
          let stepIdx = 2;
          let label = 'กำลังสร้างสตอรีบอร์ด 6 ซีน';
          let msg = 'AI กำลังวิเคราะห์รายละเอียดสินค้าและจัดวางสตอรีบอร์ด 6 ซีน...';

          if (simulatedProgress >= 72 && simulatedProgress < 85) {
            stepIdx = 3;
            label = 'กำลังสร้างปก TikTok 9:16';
            msg = 'เรนเดอร์ภาพปกแนวตั้ง 9:16 และเขียนพาดหัวภาษาไทย...';
          } else if (simulatedProgress >= 85) {
            stepIdx = 3;
            label = 'เขียนแคปชัน & พรอมป์ต์';
            msg = 'กำลังจัดทำคำอธิบาย TikTok, แฮชแท็ก และพรอมป์ต์ Google Flow 6 ซีน...';
          }

          updateLoadingProgress(simulatedProgress, label, msg, stepIdx);
        }

        // Check if generation_results has the record for this command
        try {
          if (commandId) {
            const { data: genRows } = await supabase
              .from('generation_results')
              .select('*')
              .eq('command_id', commandId)
              .limit(1);

            if (genRows && genRows.length > 0) {
              isCompleted = true;
              clearInterval(pollInterval);
              deliverResultInRealtime(genRows[0]);
              return;
            }

            // Also check commands table status
            const { data: cmdRows } = await supabase
              .from('commands')
              .select('*')
              .eq('id', commandId)
              .single();

            if (cmdRows && cmdRows.status === 'completed') {
              const { data: lastGen } = await supabase
                .from('generation_results')
                .select('*')
                .eq('command_id', commandId)
                .limit(1);

              if (lastGen && lastGen.length > 0) {
                isCompleted = true;
                clearInterval(pollInterval);
                deliverResultInRealtime(lastGen[0]);
                return;
              }
            }
          }
        } catch (pollErr) {
          console.log('Poll check error:', pollErr);
        }

        // Safety fallback after 35s (25 checks)
        if (pollCount >= 25) {
          clearInterval(pollInterval);
          if (!isCompleted) {
            updateLoadingProgress(98, 'ส่งงานเข้าคิวสำเร็จ', 'ระบบบันทึกงานแล้ว สามารถตรวจสอบผลลัพธ์ได้ที่คลังเก็บของ', 3);
            setTimeout(hideLoadingScreen, 1200);
            showToast('บันทึกคำสั่งแล้ว ระบบ Watcher กำลังทำงานในเบื้องหลัง', 'info');
          }
        }
      }, 1400);

      function deliverResultInRealtime(resultItem) {
        updateLoadingProgress(100, 'เสร็จสมบูรณ์ 100%!', '✨ สร้างชุดคอนเทนต์เสร็จสิ้น กำลังแสดงผลงานแบบเรียลไทม์...', 3);
        
        setTimeout(() => {
          hideLoadingScreen();
          loadVaultItemIntoView(resultItem);
          showToast('🎉 AI สร้างชุดคอนเทนต์เสร็จสมบูรณ์แบบเรียลไทม์!', 'success');
          updateVaultCountBadge();

          // Sync result into active Chat Session
          if (typeof syncResultWithActiveSession === 'function') {
            syncResultWithActiveSession(resultItem);
          }
        }, 650);
      }

    } catch (err) {
      console.error(err);
      hideLoadingScreen();
      showToast(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล', 'error');
    } finally {
      isSubmitting = false;
      btnSubmitCommand.disabled = false;
      btnSpinner.style.display = 'none';
      btnIcon.style.display = 'inline-flex';
      btnText.textContent = 'ส่งคำสั่งประมวลผล';
    }
  }

  // --- Copy AI Content Buttons ---
  const btnCopyThaiContent = document.getElementById('btnCopyThaiContent');
  const btnCopyGoogleFlow = document.getElementById('btnCopyGoogleFlow');
  const btnRefreshResult = document.getElementById('btnRefreshResult');
  const aiImgStoryboard = document.getElementById('aiImgStoryboard');
  const aiImgCover = document.getElementById('aiImgCover');

  if (btnCopyThaiContent) {
    btnCopyThaiContent.addEventListener('click', () => {
      const title = document.getElementById('aiProductTitle').textContent;
      const caption = document.getElementById('aiCaption').textContent;
      const hashtags = document.getElementById('aiHashtags').textContent;
      const textToCopy = `${title}\n\n${caption}\n\n${hashtags}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('คัดลอกชุดข้อความภาษาไทยเรียบร้อยแล้ว!');
      });
    });
  }

  if (btnCopyGoogleFlow) {
    btnCopyGoogleFlow.addEventListener('click', () => {
      const prompt = document.getElementById('aiGoogleFlowPrompt').textContent;
      navigator.clipboard.writeText(prompt).then(() => {
        showToast('คัดลอกพรอมป์ต์ Google Flow เรียบร้อยแล้ว!');
      });
    });
  }

  // Click on generated images to zoom in lightbox
  if (aiImgStoryboard) {
    aiImgStoryboard.addEventListener('click', () => {
      modalImg.src = aiImgStoryboard.src;
      imageModal.style.display = 'flex';
    });
  }

  if (aiImgCover) {
    aiImgCover.addEventListener('click', () => {
      modalImg.src = aiImgCover.src;
      imageModal.style.display = 'flex';
    });
  }

  // Fetch Latest Completed Result from Supabase (Checks generation_results or commands)
  async function fetchLatestCompletedResult() {
    if (!supabase) return;
    try {
      let resultItem = null;
      let recordId = null;

      // 1. ตรวจสอบจากตารางใหม่ generation_results ก่อน
      try {
        const { data: resDataList, error: resError } = await supabase
          .from('generation_results')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!resError && resDataList && resDataList.length > 0) {
          const excludedIds = ['021c07c5-e340-4516-b93a-9ded0d1c3278', '9dc163a8-744d-4e7c-9ca1-5246e8b271b1', '5258062e-eba4-4dc3-869f-b971cd3438da'];
          const validRow = resDataList.find(r => !excludedIds.includes(r.id));
          if (validRow) {
            recordId = validRow.command_id || validRow.id;
            resultItem = {
              title: validRow.title,
              caption: validRow.caption,
              hashtags: validRow.hashtags,
              google_flow_prompt: validRow.google_flow_prompt,
              images: {
                storyboard_url: validRow.storyboard_url,
                cover_url: validRow.cover_url
              }
            };
          }
        }
      } catch (e) {
        console.log('ตาราง generation_results ยังไม่ถูกสร้าง กำลังดึงจาก commands...');
      }

      // 2. ถ้ายังไม่มี ให้ดึงจากตาราง commands (ฟิลด์ result_data)
      if (!resultItem) {
        const { data: cmdList, error: cmdError } = await supabase
          .from('commands')
          .select('*')
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!cmdError && cmdList && cmdList.length > 0) {
          const record = cmdList[0];
          recordId = record.id;
          resultItem = record.result_data;
        }
      }

      // 3. แสดงผลลัพธ์บนหน้าเว็บแบบไดนามิก 100%
      if (resultItem) {
        document.getElementById('displayRecordId').textContent = `ID: ${recordId ? recordId.substring(0, 8) : 'Live'}...`;
        resultsSection.style.display = 'block';

        if (resultItem.images) {
          if (resultItem.images.storyboard_url) {
            aiImgStoryboard.src = resultItem.images.storyboard_url;
          }
          if (resultItem.images.cover_url) {
            aiImgCover.src = resultItem.images.cover_url;
          }
        }

        if (resultItem.title) {
          document.getElementById('aiProductTitle').textContent = resultItem.title;
        }
        if (resultItem.caption) {
          document.getElementById('aiCaption').textContent = resultItem.caption;
        }
        if (resultItem.hashtags) {
          document.getElementById('aiHashtags').textContent = resultItem.hashtags;
        }
        if (resultItem.google_flow_prompt) {
          document.getElementById('aiGoogleFlowPrompt').textContent = resultItem.google_flow_prompt;
        }

        showToast('โหลดผลลัพธ์จากฐานข้อมูล Supabase สำเร็จ!');
      } else {
        // ยังไม่มีผลลัพธ์ ซ่อนกล่องผลลัพธ์ไว้
        resultsSection.style.display = 'none';
      }
    } catch (err) {
      console.error('Failed to fetch latest result:', err);
    }
  }

  // --- Real .jpg File Download Function ---
  async function downloadImage(imageUrl, targetFilename) {
    try {
      showToast(`กำลังเตรียมดาวน์โหลดไฟล์ ${targetFilename}...`, 'info');
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobUrl;
      tempLink.download = targetFilename;
      document.body.appendChild(tempLink);
      tempLink.click();
      setTimeout(() => {
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobUrl);
      }, 200);
      showToast(`ดาวน์โหลดไฟล์รูปภาพ ${targetFilename} เรียบร้อย!`, 'success');
    } catch (err) {
      console.warn('Direct blob download error:', err);
      const tempLink = document.createElement('a');
      tempLink.href = imageUrl;
      tempLink.download = targetFilename;
      tempLink.target = '_blank';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }
  }

  const btnDownloadStoryboard = document.getElementById('btnDownloadStoryboard');
  const btnDownloadCover = document.getElementById('btnDownloadCover');

  if (btnDownloadStoryboard) {
    btnDownloadStoryboard.addEventListener('click', () => {
      downloadImage(aiImgStoryboard.src, 'storyboard_6scenes.jpg');
    });
  }

  if (btnDownloadCover) {
    btnDownloadCover.addEventListener('click', () => {
      downloadImage(aiImgCover.src, 'tiktok_cover_916.jpg');
    });
  }

  if (btnRefreshResult) {
    btnRefreshResult.addEventListener('click', fetchLatestCompletedResult);
  }

  // --- Button: Hide Results Section ---
  const btnHideResult = document.getElementById('btnHideResult');
  if (btnHideResult) {
    btnHideResult.addEventListener('click', () => {
      resultsSection.style.display = 'none';
      showToast('ซ่อนหน้าต่างผลลัพธ์เรียบร้อย (ดูย้อนหลังได้ในคลังเก็บของ)', 'info');
    });
  }

  // ==========================================================================
  // Vault System (คลังเก็บของ / ประวัติการเจ็น)
  // ==========================================================================
  const btnOpenVault = document.getElementById('btnOpenVault');
  const vaultModal = document.getElementById('vaultModal');
  const btnCloseVault = document.getElementById('btnCloseVault');
  const btnRefreshVault = document.getElementById('btnRefreshVault');
  const vaultList = document.getElementById('vaultList');
  const vaultLoading = document.getElementById('vaultLoading');
  const vaultEmpty = document.getElementById('vaultEmpty');
  const vaultCountBadge = document.getElementById('vaultCountBadge');

  // Dedicated Product Content Detail Modal Elements (แยกหน้าต่างดูผลงาน ไม่ปนกับหน้าสั่งการ)
  const vaultDetailModal = document.getElementById('vaultDetailModal');
  const btnBackToVault = document.getElementById('btnBackToVault');
  const btnCloseDetail = document.getElementById('btnCloseDetail');
  const btnDetailDelete = document.getElementById('btnDetailDelete');
  const vaultDetailTitle = document.getElementById('vaultDetailTitle');
  const vaultDetailId = document.getElementById('vaultDetailId');
  const vaultDetailDate = document.getElementById('vaultDetailDate');
  const detailImgStoryboard = document.getElementById('detailImgStoryboard');
  const detailImgCover = document.getElementById('detailImgCover');
  const btnDetailDownloadStoryboard = document.getElementById('btnDetailDownloadStoryboard');
  const btnDetailDownloadCover = document.getElementById('btnDetailDownloadCover');
  const detailProductTitleText = document.getElementById('detailProductTitleText');
  const detailCaption = document.getElementById('detailCaption');
  const detailHashtags = document.getElementById('detailHashtags');
  const btnDetailCopyThai = document.getElementById('btnDetailCopyThai');
  const detailGoogleFlowPrompt = document.getElementById('detailGoogleFlowPrompt');
  const btnDetailCopyPrompt = document.getElementById('btnDetailCopyPrompt');
  let currentDetailItem = null;

  // Local Persistent Deletion Helper
  function getDeletedVaultIds() {
    try {
      const stored = localStorage.getItem('uplord_deleted_vault_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function addDeletedVaultId(id) {
    if (!id) return;
    try {
      const list = getDeletedVaultIds();
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem('uplord_deleted_vault_ids', JSON.stringify(list));
      }
    } catch (e) {
      console.error('Error saving deleted id:', e);
    }
  }

  // Two-step inline confirmation helper (no annoying/blocked browser popup)
  function setupDeleteButton(btn, onConfirm) {
    if (!btn) return;
    let timer = null;
    const originalHtml = btn.innerHTML;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (btn.classList.contains('btn-confirming')) {
        // Step 2: Confirmed!
        clearTimeout(timer);
        btn.classList.remove('btn-confirming');
        btn.innerHTML = originalHtml;
        onConfirm();
      } else {
        // Step 1: Ask inline confirmation
        btn.classList.add('btn-confirming');
        btn.innerHTML = `⚠️ ยืนยันลบ?`;
        showToast('กดปุ่ม "ยืนยันลบ?" อีกครั้งเพื่อลบรายการนี้', 'info');

        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.classList.remove('btn-confirming');
          btn.innerHTML = originalHtml;
        }, 3500);
      }
    });
  }

  async function deleteVaultItem(item, cardEl) {
    if (!item || !item.id) return;

    // 1. จำการลบไว้ใน LocalStorage ทันที
    addDeletedVaultId(item.id);

    // 2. ลบการ์ดออกจากหน้าจอทันทีแบบแอนิเมชันนุ่มนวล
    if (cardEl) {
      cardEl.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      cardEl.style.opacity = '0';
      cardEl.style.transform = 'scale(0.92)';
      setTimeout(() => {
        cardEl.remove();
        if (vaultList && vaultList.children.length === 0) {
          vaultEmpty.style.display = 'block';
        }
      }, 300);
    }

    // 3. ถ้าเปิดหน้าต่าง Detail Modal ของไอเทมนี้อยู่ ให้ปิดแล้วเปิดคลังที่อัปเดตแล้ว
    if (currentDetailItem && currentDetailItem.id === item.id) {
      closeVaultDetailModal();
      openVault();
    }

    // 4. อัปเดตตัวเลข badge
    setTimeout(updateVaultCountBadge, 350);
    showToast('✓ ลบผลงานออกจากคลังเก็บของเรียบร้อยแล้ว', 'success');

    // 5. ส่งคำสั่งลบไปยังฐานข้อมูล Supabase ด้วย (ถ้ามีสิทธิ์)
    try {
      if (supabase) {
        await supabase.from('generation_results').delete().eq('id', item.id);
        if (item.command_id) {
          await supabase.from('commands').delete().eq('id', item.command_id);
        }
      }
    } catch (err) {
      console.log('Server deletion notice:', err);
    }
  }

  function openVault() {
    vaultModal.style.display = 'flex';
    fetchVaultItems();
  }

  function closeVault() {
    vaultModal.style.display = 'none';
  }

  function openVaultDetailModal(item) {
    if (!vaultDetailModal) return;
    currentDetailItem = item;

    // ซ่อน Vault Drawer ชั่วคราวเพื่อให้ดูรายละเอียดได้เต็มตา
    closeVault();

    // กำหนดข้อมูลลงฟิลด์
    if (vaultDetailTitle) vaultDetailTitle.textContent = item.title || 'ชุดคอนเทนต์รีวิวสินค้า';
    if (vaultDetailId) vaultDetailId.textContent = `ID: ${item.id ? item.id.substring(0, 8) : '...'}...`;
    if (vaultDetailDate) vaultDetailDate.textContent = `วันที่สร้าง: ${formatDate(item.created_at) || 'วันนี้'}`;

    if (detailImgStoryboard) detailImgStoryboard.src = item.storyboard_url || '';
    if (detailImgCover) detailImgCover.src = item.cover_url || '';

    if (detailProductTitleText) detailProductTitleText.textContent = item.title || '-';
    if (detailCaption) detailCaption.textContent = item.caption || '-';
    if (detailHashtags) detailHashtags.textContent = item.hashtags || '-';
    if (detailGoogleFlowPrompt) detailGoogleFlowPrompt.textContent = item.google_flow_prompt || '-';

    vaultDetailModal.style.display = 'flex';
  }

  function closeVaultDetailModal() {
    if (vaultDetailModal) vaultDetailModal.style.display = 'none';
    currentDetailItem = null;
  }

  if (btnDetailDelete) {
    setupDeleteButton(btnDetailDelete, () => {
      if (currentDetailItem) {
        deleteVaultItem(currentDetailItem);
      }
    });
  }

  if (btnBackToVault) {
    btnBackToVault.addEventListener('click', () => {
      closeVaultDetailModal();
      openVault(); // ย้อนกลับมาเปิดคลังเก็บของ
    });
  }

  if (btnCloseDetail) {
    btnCloseDetail.addEventListener('click', closeVaultDetailModal);
  }

  if (vaultDetailModal) {
    vaultDetailModal.addEventListener('click', (e) => {
      if (e.target === vaultDetailModal) closeVaultDetailModal();
    });
  }

  // Detail Modal Actions: Download & Copy
  if (btnDetailDownloadStoryboard) {
    btnDetailDownloadStoryboard.addEventListener('click', () => {
      if (detailImgStoryboard && detailImgStoryboard.src) {
        downloadImage(detailImgStoryboard.src, 'storyboard_6scenes.jpg');
      }
    });
  }

  if (btnDetailDownloadCover) {
    btnDetailDownloadCover.addEventListener('click', () => {
      if (detailImgCover && detailImgCover.src) {
        downloadImage(detailImgCover.src, 'tiktok_cover_916.jpg');
      }
    });
  }

  if (btnDetailCopyThai) {
    btnDetailCopyThai.addEventListener('click', () => {
      const title = detailProductTitleText ? detailProductTitleText.textContent : '';
      const caption = detailCaption ? detailCaption.textContent : '';
      const hashtags = detailHashtags ? detailHashtags.textContent : '';
      const textToCopy = `${title}\n\n${caption}\n\n${hashtags}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('คัดลอกชุดข้อความภาษาไทยเรียบร้อยแล้ว!');
      });
    });
  }

  if (btnDetailCopyPrompt) {
    btnDetailCopyPrompt.addEventListener('click', () => {
      const prompt = detailGoogleFlowPrompt ? detailGoogleFlowPrompt.textContent : '';
      navigator.clipboard.writeText(prompt).then(() => {
        showToast('คัดลอกพรอมป์ต์ Google Flow เรียบร้อยแล้ว!');
      });
    });
  }

  if (detailImgStoryboard) {
    detailImgStoryboard.addEventListener('click', () => {
      if (detailImgStoryboard.src) {
        modalImg.src = detailImgStoryboard.src;
        imageModal.style.display = 'flex';
      }
    });
  }

  if (detailImgCover) {
    detailImgCover.addEventListener('click', () => {
      if (detailImgCover.src) {
        modalImg.src = detailImgCover.src;
        imageModal.style.display = 'flex';
      }
    });
  }

  if (btnOpenVault) btnOpenVault.addEventListener('click', openVault);
  if (btnCloseVault) btnCloseVault.addEventListener('click', closeVault);
  if (btnRefreshVault) btnRefreshVault.addEventListener('click', fetchVaultItems);

  if (vaultModal) {
    vaultModal.addEventListener('click', (e) => {
      if (e.target === vaultModal) closeVault();
    });
  }

  // Helper: Format Date
  function formatDate(isoStr) {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }

  // Fetch all Vault Items from Supabase
  async function fetchVaultItems() {
    if (!supabase) return;

    vaultLoading.style.display = 'block';
    vaultEmpty.style.display = 'none';
    vaultList.innerHTML = '';

    const allItems = [];

    try {
      // 1. ดึงจากตาราง generation_results
      const deletedIds = getDeletedVaultIds();
      const excludedIds = ['021c07c5-e340-4516-b93a-9ded0d1c3278', '9dc163a8-744d-4e7c-9ca1-5246e8b271b1', '5258062e-eba4-4dc3-869f-b971cd3438da', ...deletedIds];

      try {
        const { data: genData } = await supabase
          .from('generation_results')
          .select('*')
          .order('created_at', { ascending: false });

        if (genData && genData.length > 0) {
          genData.forEach(row => {
            if (excludedIds.includes(row.id)) return; // ข้ามรายการเก่าหรือรายการที่ถูกลบ
            allItems.push({
              id: row.id,
              command_id: row.command_id,
              title: row.title || 'ชุดคอนเทนต์รีวิวสินค้า',
              caption: row.caption || '',
              hashtags: row.hashtags || '',
              google_flow_prompt: row.google_flow_prompt || '',
              storyboard_url: row.storyboard_url || '',
              cover_url: row.cover_url || '',
              created_at: row.created_at,
              source: 'generation_results'
            });
          });
        }
      } catch (err) {
        console.log('ยังไม่มีตาราง generation_results ดึงจาก commands ต่อ...');
      }

      // 2. ดึงจากตาราง commands (completed)
      try {
        const { data: cmdData } = await supabase
          .from('commands')
          .select('*')
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (cmdData && cmdData.length > 0) {
          cmdData.forEach(row => {
            if (excludedIds.includes(row.id)) return;
            const res = row.result_data;
            if (res && res.title) {
              // เช็คไม่ให้ซ้ำ ID
              const exists = allItems.some(item => item.id === row.id || item.command_id === row.id);
              if (!exists) {
                allItems.push({
                  id: row.id,
                  command_id: row.id,
                  title: res.title,
                  caption: res.caption || '',
                  hashtags: res.hashtags || '',
                  google_flow_prompt: res.google_flow_prompt || '',
                  storyboard_url: res.images?.storyboard_url || '',
                  cover_url: res.images?.cover_url || '',
                  created_at: row.created_at,
                  source: 'commands'
                });
              }
            }
          });
        }
      } catch (err) {
        console.error('Error fetching commands:', err);
      }

      // อัปเดตตัวเลข badge
      if (vaultCountBadge) {
        vaultCountBadge.textContent = allItems.length;
      }

      vaultLoading.style.display = 'none';

      if (allItems.length === 0) {
        vaultEmpty.style.display = 'block';
        return;
      }

      // แสดงผลรายการในคลังเก็บของ
      allItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'vault-item-card';

        const thumbHtml = `
          <div class="vault-item-thumbs">
            ${item.storyboard_url ? `<div class="vault-thumb-wrap" title="สตอรีบอร์ด"><img src="${item.storyboard_url}" alt="สตอรีบอร์ด"></div>` : ''}
            ${item.cover_url ? `<div class="vault-thumb-wrap" title="ปก TikTok"><img src="${item.cover_url}" alt="ปก"></div>` : ''}
          </div>
        `;

        card.innerHTML = `
          ${thumbHtml}
          <div class="vault-item-content">
            <div class="vault-item-top">
              <span class="vault-item-title">${item.title}</span>
              <span class="vault-item-date">${formatDate(item.created_at)}</span>
            </div>
            <p class="vault-item-caption">${item.caption || item.hashtags || 'ไม่มีคำอธิบาย'}</p>
            <div class="vault-item-footer">
              <span class="vault-tag">AI Generated</span>
              <div class="vault-item-actions">
                <button type="button" class="btn-delete-record" title="ลบผลงานนี้ออกจากคลัง">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  ลบ
                </button>
                <button type="button" class="btn-open-record">เปิดดูผลงานนี้ →</button>
              </div>
            </div>
          </div>
        `;

        // ปุ่มลบรายการ (ยืนยันแบบ 2 จังหวะ Inline ปลอดภัย ไม่โดนเบราว์เซอร์บล็อก)
        const btnDelete = card.querySelector('.btn-delete-record');
        if (btnDelete) {
          setupDeleteButton(btnDelete, () => {
            deleteVaultItem(item, card);
          });
        }

        // เมื่อคลิกที่การ์ดในคลัง หรือปุ่ม 'เปิดดูผลงานนี้' -> เปิดหน้าต่างป๊อปอัปแยกเฉพาะทันที
        const btnOpen = card.querySelector('.btn-open-record');
        if (btnOpen) {
          btnOpen.addEventListener('click', (e) => {
            e.stopPropagation();
            openVaultDetailModal(item);
          });
        }
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-delete-record') || e.target.closest('.btn-open-record')) return;
          openVaultDetailModal(item);
        });

        vaultList.appendChild(card);
      });

    } catch (err) {
      vaultLoading.style.display = 'none';
      console.error('Error loading vault:', err);
    }
  }

  // Load a specific item from Vault into Main Result View
  function loadVaultItemIntoView(item) {
    closeVault();

    document.getElementById('displayRecordId').textContent = `ID: ${item.id.substring(0, 8)}...`;
    
    if (item.storyboard_url) {
      aiImgStoryboard.src = item.storyboard_url;
    }
    if (item.cover_url) {
      aiImgCover.src = item.cover_url;
    }
    if (item.title) {
      document.getElementById('aiProductTitle').textContent = item.title;
    }
    if (item.caption) {
      document.getElementById('aiCaption').textContent = item.caption;
    }
    if (item.hashtags) {
      document.getElementById('aiHashtags').textContent = item.hashtags;
    }
    if (item.google_flow_prompt) {
      document.getElementById('aiGoogleFlowPrompt').textContent = item.google_flow_prompt;
    }

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('เปิดดูผลงานจากคลังเก็บของเรียบร้อย!');
  }

  // Update Vault Count Badge quietly on page load (without showing results section)
  async function updateVaultCountBadge() {
    if (!supabase) return;
    try {
      let count = 0;
      const deletedIds = getDeletedVaultIds();
      const excludedIds = ['021c07c5-e340-4516-b93a-9ded0d1c3278', '9dc163a8-744d-4e7c-9ca1-5246e8b271b1', '5258062e-eba4-4dc3-869f-b971cd3438da', ...deletedIds];

      const { data: gList } = await supabase.from('generation_results').select('id');
      if (gList && gList.length > 0) {
        count = gList.filter(r => !excludedIds.includes(r.id)).length;
      }

      if (vaultCountBadge) {
        vaultCountBadge.textContent = count;
      }
    } catch (err) {
      console.log('Quiet count error:', err);
    }
  }

  // =========================================================================
  // Chat Sessions System (ChatGPT / Claude Style Multi-Product Sessions)
  // =========================================================================
  const btnToggleChatSidebar = document.getElementById('btnToggleChatSidebar');
  const chatSidebar = document.getElementById('chatSidebar');
  const chatSidebarBackdrop = document.getElementById('chatSidebarBackdrop');
  const btnCloseSidebar = document.getElementById('btnCloseSidebar');
  const btnNewChat = document.getElementById('btnNewChat');
  const btnInlineNewChat = document.getElementById('btnInlineNewChat');
  const currentChatNameDisplay = document.getElementById('currentChatNameDisplay');
  const activeBarTitle = document.getElementById('activeBarTitle');
  const btnRenameCurrentChat = document.getElementById('btnRenameCurrentChat');
  const chatSessionsList = document.getElementById('chatSessionsList');
  const chatSessionsEmpty = document.getElementById('chatSessionsEmpty');
  const chatCountBadge = document.getElementById('chatCountBadge');
  const chatBadgePill = document.getElementById('chatBadgePill');
  const chatTotalCountText = document.getElementById('chatTotalCountText');
  const btnClearAllChats = document.getElementById('btnClearAllChats');

  const SESSIONS_STORAGE_KEY = 'uplord_chat_sessions_v1';
  const ACTIVE_SESSION_STORAGE_KEY = 'uplord_active_session_id_v1';

  let currentActiveSessionId = null;

  function dataURLtoFile(dataurl, filename) {
    if (!dataurl || typeof dataurl !== 'string' || !dataurl.includes(',')) return null;
    try {
      const arr = dataurl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename || 'image.jpg', { type: mime });
    } catch (e) {
      console.warn('dataURLtoFile error:', e);
      return null;
    }
  }

  function getSavedSessions() {
    try {
      const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSessionsToStorage(sessions) {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('localStorage quota warning:', e);
    }
  }

  function openChatSidebar() {
    if (chatSidebar) chatSidebar.classList.add('open');
    if (chatSidebarBackdrop) chatSidebarBackdrop.style.display = 'block';
  }

  function closeChatSidebar() {
    if (chatSidebar) chatSidebar.classList.remove('open');
    if (chatSidebarBackdrop) chatSidebarBackdrop.style.display = 'none';
  }

  // Save current UI state into the active session
  function snapshotActiveSession() {
    if (!currentActiveSessionId) return;
    const sessions = getSavedSessions();
    const idx = sessions.findIndex(s => s.id === currentActiveSessionId);
    if (idx === -1) return;

    // Serialize selectedFiles (only keep dataUrl, name, size to persist)
    const serializedFiles = selectedFiles.map(item => ({
      id: item.id,
      name: item.name,
      size: item.size,
      dataUrl: item.dataUrl
    }));

    sessions[idx].files = serializedFiles;
    sessions[idx].promptText = promptInput ? promptInput.value : '';
    sessions[idx].updated_at = new Date().toISOString();
    
    // Also save current result state if visible
    if (resultsSection && resultsSection.style.display !== 'none') {
      const pTitle = document.getElementById('aiProductTitle')?.textContent || sessions[idx].title;
      sessions[idx].resultData = {
        title: pTitle,
        caption: document.getElementById('aiCaption')?.textContent || '',
        hashtags: document.getElementById('aiHashtags')?.textContent || '',
        google_flow_prompt: document.getElementById('aiGoogleFlowPrompt')?.textContent || '',
        storyboard_url: aiImgStoryboard?.src || '',
        cover_url: aiImgCover?.src || ''
      };
      if (pTitle && pTitle !== '-' && !sessions[idx].title.includes(pTitle)) {
        sessions[idx].title = pTitle;
      }
    }

    saveSessionsToStorage(sessions);
    renderSessionsUI();
  }

  // Create a new session
  function createNewChatSession(customTitle) {
    snapshotActiveSession();

    const sessions = getSavedSessions();
    const newId = 'session_' + Date.now();
    const title = customTitle || `แชทสินค้า #${sessions.length + 1}`;

    const newSession = {
      id: newId,
      title: title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      files: [],
      promptText: '',
      resultData: null
    };

    sessions.unshift(newSession);
    saveSessionsToStorage(sessions);

    loadSession(newSession.id, true);
    showToast(`✓ เริ่มแชทสินค้าใหม่: "${title}"`, 'success');
  }

  // Load a session by ID
  function loadSession(sessionId, isNew = false) {
    const sessions = getSavedSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    currentActiveSessionId = session.id;
    localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, session.id);

    // Update banner titles
    if (currentChatNameDisplay) currentChatNameDisplay.textContent = session.title;
    if (activeBarTitle) activeBarTitle.textContent = session.title;

    // Restore prompt (empty if new)
    if (promptInput) {
      promptInput.value = (session.promptText !== undefined && session.promptText !== null) ? session.promptText : '';
      charCounter.textContent = `${promptInput.value.length.toLocaleString()} / 4,000`;
      btnClearPrompt.style.display = promptInput.value ? 'inline-block' : 'none';
      updatePayloadSummary();
    }

    // Restore files
    selectedFiles = [];
    if (session.files && session.files.length > 0) {
      session.files.forEach(sf => {
        const fileObj = dataURLtoFile(sf.dataUrl, sf.name);
        selectedFiles.push({
          id: sf.id || ('img_' + Date.now()),
          name: sf.name,
          size: sf.size || 0,
          dataUrl: sf.dataUrl,
          file: fileObj
        });
      });
    }
    renderGallery();

    // Restore results
    if (session.resultData && session.resultData.title && session.resultData.title !== '-') {
      const res = session.resultData;
      if (document.getElementById('displayRecordId')) {
        document.getElementById('displayRecordId').textContent = `ID: ${session.id.substring(0, 8)}...`;
      }
      if (aiImgStoryboard && res.storyboard_url) aiImgStoryboard.src = res.storyboard_url;
      if (aiImgCover && res.cover_url) aiImgCover.src = res.cover_url;
      if (document.getElementById('aiProductTitle')) document.getElementById('aiProductTitle').textContent = res.title || '-';
      if (document.getElementById('aiCaption')) document.getElementById('aiCaption').textContent = res.caption || '-';
      if (document.getElementById('aiHashtags')) document.getElementById('aiHashtags').textContent = res.hashtags || '-';
      if (document.getElementById('aiGoogleFlowPrompt')) document.getElementById('aiGoogleFlowPrompt').textContent = res.google_flow_prompt || '-';

      if (resultsSection) {
        resultsSection.style.display = 'block';
      }
    } else {
      if (resultsSection) resultsSection.style.display = 'none';
    }

    renderSessionsUI();
    if (!isNew) {
      showToast(`สลับมาที่แชท: "${session.title}"`, 'info');
    }
  }

  // Delete a specific session
  function deleteChatSession(sessionId) {
    let sessions = getSavedSessions();
    sessions = sessions.filter(s => s.id !== sessionId);
    saveSessionsToStorage(sessions);

    if (currentActiveSessionId === sessionId) {
      if (sessions.length > 0) {
        loadSession(sessions[0].id);
      } else {
        createNewChatSession('แชทสินค้าเริ่มต้น');
      }
    } else {
      renderSessionsUI();
    }
    showToast('ลบแชทสินค้าแล้ว', 'info');
  }

  // Rename current active chat
  function renameActiveChat() {
    const sessions = getSavedSessions();
    const session = sessions.find(s => s.id === currentActiveSessionId);
    if (!session) return;

    const newTitle = prompt('ตั้งชื่อแชทสินค้านี้ใหม่:', session.title);
    if (newTitle && newTitle.trim()) {
      session.title = newTitle.trim();
      session.updated_at = new Date().toISOString();
      saveSessionsToStorage(sessions);
      if (currentChatNameDisplay) currentChatNameDisplay.textContent = session.title;
      if (activeBarTitle) activeBarTitle.textContent = session.title;
      renderSessionsUI();
      showToast(`เปลี่ยนชื่อเป็น "${session.title}" เรียบร้อย`);
    }
  }

  // Render the sessions in the sidebar
  function renderSessionsUI() {
    const sessions = getSavedSessions();

    if (chatCountBadge) chatCountBadge.textContent = sessions.length;
    if (chatBadgePill) chatBadgePill.textContent = sessions.length;
    if (chatTotalCountText) chatTotalCountText.textContent = `ทั้งหมด ${sessions.length} แชท`;

    if (!chatSessionsList) return;
    chatSessionsList.innerHTML = '';

    if (sessions.length === 0) {
      if (chatSessionsEmpty) chatSessionsEmpty.style.display = 'block';
      return;
    }
    if (chatSessionsEmpty) chatSessionsEmpty.style.display = 'none';

    sessions.forEach(sess => {
      const itemEl = document.createElement('div');
      itemEl.className = `chat-session-item ${sess.id === currentActiveSessionId ? 'active' : ''}`;

      // Thumbnail
      let thumbHtml = '<div class="chat-session-thumb">📦</div>';
      if (sess.files && sess.files[0] && sess.files[0].dataUrl) {
        thumbHtml = `<img src="${sess.files[0].dataUrl}" class="chat-session-thumb" alt="Product">`;
      } else if (sess.resultData && sess.resultData.cover_url) {
        thumbHtml = `<img src="${sess.resultData.cover_url}" class="chat-session-thumb" alt="Cover">`;
      }

      const dateStr = sess.created_at ? formatDate(sess.created_at) : 'ล่าสุด';
      const fileCountText = sess.files && sess.files.length > 0 ? `${sess.files.length} รูป` : 'ไม่มีรูป';

      itemEl.innerHTML = `
        ${thumbHtml}
        <div class="chat-session-content">
          <div class="chat-session-title" title="${sess.title}">${sess.title}</div>
          <div class="chat-session-meta">
            <span>${dateStr}</span>
            <span>•</span>
            <span>${fileCountText}</span>
          </div>
        </div>
        <button type="button" class="chat-session-delete" title="ลบแชทนี้">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      `;

      itemEl.addEventListener('click', (e) => {
        if (e.target.closest('.chat-session-delete')) return;
        snapshotActiveSession();
        loadSession(sess.id);
        if (window.innerWidth < 768) closeChatSidebar();
      });

      const delBtn = itemEl.querySelector('.chat-session-delete');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteChatSession(sess.id);
        });
      }

      chatSessionsList.appendChild(itemEl);
    });
  }

  // Sync result with active session
  function syncResultWithActiveSession(resultItem) {
    if (!currentActiveSessionId) return;
    const sessions = getSavedSessions();
    const sIdx = sessions.findIndex(s => s.id === currentActiveSessionId);
    if (sIdx !== -1) {
      if (resultItem.title && resultItem.title !== '-') {
        sessions[sIdx].title = resultItem.title;
      }
      sessions[sIdx].resultData = resultItem;
      sessions[sIdx].updated_at = new Date().toISOString();
      saveSessionsToStorage(sessions);
      if (currentChatNameDisplay) currentChatNameDisplay.textContent = sessions[sIdx].title;
      if (activeBarTitle) activeBarTitle.textContent = sessions[sIdx].title;
      renderSessionsUI();
    }
  }

  // Initialize Sessions on startup
  function initChatSessions() {
    let sessions = getSavedSessions();
    if (sessions.length === 0) {
      const defaultSession = {
        id: 'session_' + Date.now(),
        title: 'แชทสินค้าใหม่',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        files: [],
        promptText: '',
        resultData: null
      };
      sessions.push(defaultSession);
      saveSessionsToStorage(sessions);
    }

    const savedActiveId = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    const targetSession = sessions.find(s => s.id === savedActiveId) || sessions[0];
    loadSession(targetSession.id, true);
  }

  // Event Listeners for Sidebar
  if (btnToggleChatSidebar) {
    btnToggleChatSidebar.addEventListener('click', () => {
      if (chatSidebar.classList.contains('open')) {
        closeChatSidebar();
      } else {
        openChatSidebar();
      }
    });
  }
  if (btnCloseSidebar) btnCloseSidebar.addEventListener('click', closeChatSidebar);
  if (chatSidebarBackdrop) chatSidebarBackdrop.addEventListener('click', closeChatSidebar);

  if (btnNewChat) {
    btnNewChat.addEventListener('click', () => {
      createNewChatSession();
      if (window.innerWidth < 768) closeChatSidebar();
    });
  }
  if (btnInlineNewChat) {
    btnInlineNewChat.addEventListener('click', () => {
      createNewChatSession();
    });
  }
  if (btnRenameCurrentChat) {
    btnRenameCurrentChat.addEventListener('click', renameActiveChat);
  }
  if (btnClearAllChats) {
    btnClearAllChats.addEventListener('click', () => {
      if (confirm('คุณต้องการลบประวัติแชทสินค้าทั้งหมดใช่หรือไม่?')) {
        localStorage.removeItem(SESSIONS_STORAGE_KEY);
        localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
        initChatSessions();
        showToast('ล้างประวัติแชททั้งหมดแล้ว', 'info');
      }
    });
  }

  // Auto-snapshot when typing in prompt
  if (promptInput) {
    promptInput.addEventListener('input', () => {
      clearTimeout(window._promptSaveTimeout);
      window._promptSaveTimeout = setTimeout(snapshotActiveSession, 1200);
    });
  }

  // Start Sessions Manager
  initChatSessions();
});

