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

  // --- Prompt Input & Char Counter ---
  promptInput.addEventListener('input', () => {
    const count = promptInput.value.length;
    charCounter.textContent = `${count.toLocaleString()} / 2,000`;
    btnClearPrompt.style.display = count > 0 ? 'inline-block' : 'none';
    updatePayloadSummary();
  });

  btnClearPrompt.addEventListener('click', () => {
    promptInput.value = '';
    charCounter.textContent = '0 / 2,000';
    btnClearPrompt.style.display = 'none';
    promptInput.focus();
    updatePayloadSummary();
  });

  // --- Suggestion Chips ---
  suggestionChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-btn');
    if (!chip) return;
    const text = chip.getAttribute('data-prompt');
    promptInput.value = text;
    promptInput.dispatchEvent(new Event('input'));
    promptInput.focus();
    showToast('แทรกคำสั่งตัวอย่างแล้ว');
  });

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
    charCounter.textContent = '0 / 2,000';
    btnClearPrompt.style.display = 'none';
    resultsSection.style.display = 'none';
    updatePayloadSummary();
    showToast('รีเซ็ตแบบฟอร์มทั้งหมดเรียบร้อย');
  });

  // --- Submit Command: Upload to Supabase Storage & Insert Table ---
  btnSubmitCommand.addEventListener('click', executeCommand);

  async function executeCommand() {
    const promptText = promptInput.value.trim();
    if (selectedFiles.length === 0 && !promptText) {
      showToast('กรุณาอัปโหลดรูปภาพ หรือพิมพ์ข้อความคำสั่งก่อนส่ง', 'error');
      promptInput.focus();
      return;
    }

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
        }, 650);
      }

    } catch (err) {
      console.error(err);
      hideLoadingScreen();
      showToast(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล', 'error');
    } finally {
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
          .limit(1);

        if (!resError && resDataList && resDataList.length > 0) {
          const row = resDataList[0];
          recordId = row.command_id || row.id;
          resultItem = {
            title: row.title,
            caption: row.caption,
            hashtags: row.hashtags,
            google_flow_prompt: row.google_flow_prompt,
            images: {
              storyboard_url: row.storyboard_url,
              cover_url: row.cover_url
            }
          };
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

  function openVault() {
    vaultModal.style.display = 'flex';
    fetchVaultItems();
  }

  function closeVault() {
    vaultModal.style.display = 'none';
  }

  function openVaultDetailModal(item) {
    if (!vaultDetailModal) return;

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
      try {
        const { data: genData } = await supabase
          .from('generation_results')
          .select('*')
          .order('created_at', { ascending: false });

        if (genData && genData.length > 0) {
          genData.forEach(row => {
            allItems.push({
              id: row.id,
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
            const res = row.result_data;
            if (res && res.title) {
              // เช็คไม่ให้ซ้ำ ID
              const exists = allItems.some(item => item.id === row.id);
              if (!exists) {
                allItems.push({
                  id: row.id,
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
              <button type="button" class="btn-open-record">เปิดดูผลงานนี้ →</button>
            </div>
          </div>
        `;

        // เมื่อคลิกที่การ์ดในคลัง หรือปุ่ม 'เปิดดูผลงานนี้' -> เปิดหน้าต่างป๊อปอัปแยกเฉพาะทันที
        const btnOpen = card.querySelector('.btn-open-record');
        if (btnOpen) {
          btnOpen.addEventListener('click', (e) => {
            e.stopPropagation();
            openVaultDetailModal(item);
          });
        }
        card.addEventListener('click', () => {
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
      try {
        const { count: c1 } = await supabase.from('generation_results').select('*', { count: 'exact', head: true });
        if (c1) count += c1;
      } catch {}

      try {
        const { count: c2 } = await supabase.from('commands').select('*', { count: 'exact', head: true }).eq('status', 'completed');
        if (c2 && count === 0) count = c2;
      } catch {}

      if (vaultCountBadge) {
        vaultCountBadge.textContent = count;
      }
    } catch (err) {
      console.log('Quiet count error:', err);
    }
  }

  // อัปเดตจำนวนในคลังเงียบๆ ตอนเปิดเว็บ (หน้าเว็บยังคงสะอาด ไม่มีผลลัพธ์เก่าค้าง)
  setTimeout(updateVaultCountBadge, 800);

  // --- Theme Toggle Logic ---
  let isLight = false;
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      isLight = !isLight;
      document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
      showToast(`สลับเป็นธีม${isLight ? 'สว่าง (Light)' : 'มืด (Dark)'}`);
    });
  }
});

