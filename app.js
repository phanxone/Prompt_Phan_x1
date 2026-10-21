/**
 * VisionPrompt Studio - TikTok Affiliate Manual Data Entry & Supabase Hub
 * Manages entering, uploading, and persisting the 7 core content fields into Supabase `chatgpt_logs`
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
    if (preloaderStatusText) preloaderStatusText.textContent = '⚡ เชื่อมต่อระบบ Supabase สำเร็จ ยินดีต้อนรับ!';

    setTimeout(() => {
      appPreloader.classList.add('preloader-hidden');
      setTimeout(() => {
        appPreloader.style.display = 'none';
      }, 450);
    }, 300);
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
      currentProgress += Math.floor(Math.random() * 16) + 12;
      if (currentProgress > 98) currentProgress = 100;

      if (preloaderBarFill) preloaderBarFill.style.width = `${currentProgress}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${currentProgress}%`;

      if (currentProgress >= 25 && currentProgress < 60) {
        if (preloaderStepText) preloaderStepText.textContent = 'INITIALIZING SUPABASE';
        if (preloaderStatusText) preloaderStatusText.textContent = 'เชื่อมโยงฐานข้อมูล Cloud Storage & chatgpt_logs...';
      } else if (currentProgress >= 60 && currentProgress < 100) {
        if (preloaderStepText) preloaderStepText.textContent = 'READY TO ENTER DATA';
        if (preloaderStatusText) preloaderStatusText.textContent = 'ระบบพร้อมบันทึกข้อมูลและอัปโหลดรูปภาพ...';
      }

      if (currentProgress >= 100) {
        clearInterval(preloaderInterval);
        finishPreloader();
      }
    }, 80);
  }

  // --- Helper: Toast Notification ---
  function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `<span style="font-weight:bold; font-size:1.1rem;">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- Lightbox Modal Elements ---
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const btnModalClose = document.getElementById('btnModalClose');

  function openLightbox(src) {
    if (!imageModal || !modalImg || !src) return;
    modalImg.src = src;
    imageModal.style.display = 'flex';
  }

  if (btnModalClose) {
    btnModalClose.addEventListener('click', () => {
      if (imageModal) imageModal.style.display = 'none';
    });
  }

  if (imageModal) {
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        imageModal.style.display = 'none';
      }
    });
  }

  // --- DOM Elements: Manual Form ---
  const inputProductName = document.getElementById('inputProductName');
  const inputCaption = document.getElementById('inputCaption');
  const captionCounter = document.getElementById('captionCounter');
  const inputHashtags = document.getElementById('inputHashtags');

  // Cover Image Elements
  const coverUploadCard = document.getElementById('coverUploadCard');
  const coverPreviewBox = document.getElementById('coverPreviewBox');
  const coverPreviewImg = document.getElementById('coverPreviewImg');
  const coverEmptyState = document.getElementById('coverEmptyState');
  const coverFileInput = document.getElementById('coverFileInput');
  const inputCoverUrl = document.getElementById('inputCoverUrl');
  const coverUploadStatus = document.getElementById('coverUploadStatus');

  // Storyboard Image Elements
  const storyUploadCard = document.getElementById('storyUploadCard');
  const storyPreviewBox = document.getElementById('storyPreviewBox');
  const storyPreviewImg = document.getElementById('storyPreviewImg');
  const storyEmptyState = document.getElementById('storyEmptyState');
  const storyFileInput = document.getElementById('storyFileInput');
  const inputStoryUrl = document.getElementById('inputStoryUrl');
  const storyUploadStatus = document.getElementById('storyUploadStatus');

  // Prompt Elements
  const inputVideoPrompt = document.getElementById('inputVideoPrompt');
  const videoPromptCounter = document.getElementById('videoPromptCounter');
  const inputImagePrompt = document.getElementById('inputImagePrompt');
  const imagePromptCounter = document.getElementById('imagePromptCounter');

  // Action Buttons
  const btnFillSample = document.getElementById('btnFillSample');
  const btnClearForm = document.getElementById('btnClearForm');
  const btnSaveData = document.getElementById('btnSaveData');
  const btnSaveSpinner = document.getElementById('btnSaveSpinner');
  const btnSaveIcon = document.getElementById('btnSaveIcon');
  const btnSaveText = document.getElementById('btnSaveText');

  // Records Section Elements
  const recordsSection = document.getElementById('recordsSection');
  const recordsList = document.getElementById('recordsList');
  const recordsLoading = document.getElementById('recordsLoading');
  const recordsEmpty = document.getElementById('recordsEmpty');
  const recordsCountBadge = document.getElementById('recordsCountBadge');
  const btnRefreshRecords = document.getElementById('btnRefreshRecords');

  // Vault Drawer Elements
  const btnOpenVault = document.getElementById('btnOpenVault');
  const vaultModal = document.getElementById('vaultModal');
  const btnCloseVault = document.getElementById('btnCloseVault');
  const btnRefreshVault = document.getElementById('btnRefreshVault');
  const vaultLoading = document.getElementById('vaultLoading');
  const vaultEmpty = document.getElementById('vaultEmpty');
  const vaultList = document.getElementById('vaultList');
  const vaultCountBadge = document.getElementById('vaultCountBadge');

  // Add Content Modal Elements
  const addContentModal = document.getElementById('addContentModal');
  const btnAddModalClose = document.getElementById('btnAddModalClose');
  const btnHeaderAdd = document.getElementById('btnHeaderAdd');
  const btnHeroAdd = document.getElementById('btnHeroAdd');
  const btnEmptyAdd = document.getElementById('btnEmptyAdd');
  const btnFabAdd = document.getElementById('btnFabAdd');
  const addModalTitle = document.getElementById('addModalTitle');
  const addModalSubtitle = document.getElementById('addModalSubtitle');
  const addModalIconBubble = document.getElementById('addModalIconBubble');

  // Track if we are editing an existing record
  let editingRecordId = null;

  function openAddModal(isEdit = false, recordData = null) {
    if (!addContentModal) return;

    if (isEdit && recordData) {
      editingRecordId = recordData.id;
      if (addModalTitle) addModalTitle.textContent = `แก้ไขข้อมูลสินค้า (ID: ${recordData.id})`;
      if (addModalSubtitle) addModalSubtitle.textContent = 'แก้ไขรายละเอียดคอนเทนต์และบันทึกอัปเดตลงใน Supabase';
      if (addModalIconBubble) addModalIconBubble.textContent = '✏️';
      if (btnSaveText) btnSaveText.textContent = '💾 บันทึกการแก้ไข (Update)';

      // Fill existing values into inputs
      if (inputProductName) inputProductName.value = recordData.product_name || '';
      if (inputCaption) inputCaption.value = recordData.caption || '';
      if (inputHashtags) inputHashtags.value = recordData.hashtags || '';
      if (inputCoverUrl) inputCoverUrl.value = recordData.cover_image_url || '';
      if (inputStoryUrl) inputStoryUrl.value = recordData.story_image_url || '';
      if (inputVideoPrompt) inputVideoPrompt.value = recordData.video_prompt || '';
      if (inputImagePrompt) inputImagePrompt.value = recordData.image_prompt || '';

      selectedCoverFile = null;
      selectedStoryFile = null;
      if (coverFileInput) coverFileInput.value = '';
      if (storyFileInput) storyFileInput.value = '';

      updateCoverPreview(recordData.cover_image_url || '');
      updateStoryPreview(recordData.story_image_url || '');
      updateCounters();
    } else {
      editingRecordId = null;
      if (addModalTitle) addModalTitle.textContent = 'กรอกข้อมูลชุดคอนเทนต์ใหม่';
      if (addModalSubtitle) addModalSubtitle.textContent = 'บันทึกข้อมูล 7 ฟิลด์ลงใน Supabase (ตาราง chatgpt_logs)';
      if (addModalIconBubble) addModalIconBubble.textContent = '＋';
      if (btnSaveText) btnSaveText.textContent = '💾 บันทึกข้อมูลลง Supabase';
    }

    addContentModal.classList.add('active');
    if (inputProductName) {
      setTimeout(() => inputProductName.focus(), 150);
    }
  }

  function closeAddModal() {
    if (addContentModal) {
      addContentModal.classList.remove('active');
    }
    setTimeout(() => {
      editingRecordId = null;
    }, 200);
  }

  [btnHeaderAdd, btnHeroAdd, btnEmptyAdd, btnFabAdd].forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
      clearManualForm();
      openAddModal(false);
    });
  });

  if (btnAddModalClose) {
    btnAddModalClose.addEventListener('click', closeAddModal);
  }

  if (addContentModal) {
    addContentModal.addEventListener('click', (e) => {
      if (e.target === addContentModal) closeAddModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addContentModal && addContentModal.classList.contains('active')) {
      closeAddModal();
    }
  });

  // Local state for files
  let selectedCoverFile = null;
  let selectedStoryFile = null;

  // --- Character Counters ---
  function updateCounters() {
    if (inputCaption && captionCounter) {
      captionCounter.textContent = `${inputCaption.value.length.toLocaleString()} / 2,000`;
    }
    if (inputVideoPrompt && videoPromptCounter) {
      videoPromptCounter.textContent = `${inputVideoPrompt.value.length.toLocaleString()} / 4,000`;
    }
    if (inputImagePrompt && imagePromptCounter) {
      imagePromptCounter.textContent = `${inputImagePrompt.value.length.toLocaleString()} / 4,000`;
    }
  }

  if (inputCaption) inputCaption.addEventListener('input', updateCounters);
  if (inputVideoPrompt) inputVideoPrompt.addEventListener('input', updateCounters);
  if (inputImagePrompt) inputImagePrompt.addEventListener('input', updateCounters);

  // --- Cover Image Interactions ---
  function updateCoverPreview(src, filename = '') {
    if (!coverPreviewImg || !coverEmptyState || !coverUploadStatus) return;
    if (src) {
      coverPreviewImg.src = src;
      coverPreviewImg.style.display = 'block';
      coverEmptyState.style.display = 'none';
      coverUploadStatus.textContent = filename ? `พร้อมอัปโหลด: ${filename.substring(0, 15)}...` : 'มีรูปปกแล้ว';
      coverUploadStatus.classList.add('status-ready');
    } else {
      coverPreviewImg.src = '';
      coverPreviewImg.style.display = 'none';
      coverEmptyState.style.display = 'block';
      coverUploadStatus.textContent = 'รอเลือกรูป';
      coverUploadStatus.classList.remove('status-ready');
    }
  }

  if (coverPreviewBox) {
    coverPreviewBox.addEventListener('click', () => {
      if (coverFileInput) coverFileInput.click();
    });
  }

  if (coverFileInput) {
    coverFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        selectedCoverFile = file;
        const objectUrl = URL.createObjectURL(file);
        updateCoverPreview(objectUrl, file.name);
        showToast(`เลือกรูปปก "${file.name}" เรียบร้อย`, 'info');
      }
    });
  }

  if (inputCoverUrl) {
    inputCoverUrl.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val && !selectedCoverFile) {
        updateCoverPreview(val);
      } else if (!val && !selectedCoverFile) {
        updateCoverPreview('');
      }
    });
  }

  // --- Storyboard Image Interactions ---
  function updateStoryPreview(src, filename = '') {
    if (!storyPreviewImg || !storyEmptyState || !storyUploadStatus) return;
    if (src) {
      storyPreviewImg.src = src;
      storyPreviewImg.style.display = 'block';
      storyEmptyState.style.display = 'none';
      storyUploadStatus.textContent = filename ? `พร้อมอัปโหลด: ${filename.substring(0, 15)}...` : 'มีสตอรีบอร์ดแล้ว';
      storyUploadStatus.classList.add('status-ready');
    } else {
      storyPreviewImg.src = '';
      storyPreviewImg.style.display = 'none';
      storyEmptyState.style.display = 'block';
      storyUploadStatus.textContent = 'รอเลือกรูป';
      storyUploadStatus.classList.remove('status-ready');
    }
  }

  if (storyPreviewBox) {
    storyPreviewBox.addEventListener('click', () => {
      if (storyFileInput) storyFileInput.click();
    });
  }

  if (storyFileInput) {
    storyFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        selectedStoryFile = file;
        const objectUrl = URL.createObjectURL(file);
        updateStoryPreview(objectUrl, file.name);
        showToast(`เลือกรูปสตอรีบอร์ด "${file.name}" เรียบร้อย`, 'info');
      }
    });
  }

  if (inputStoryUrl) {
    inputStoryUrl.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val && !selectedStoryFile) {
        updateStoryPreview(val);
      } else if (!val && !selectedStoryFile) {
        updateStoryPreview('');
      }
    });
  }

  // --- Fill Sample Data ---
  if (btnFillSample) {
    btnFillSample.addEventListener('click', () => {
      if (inputProductName) {
        inputProductName.value = 'ชุดเซ็ตเสื้อยืดกางเกงขาสั้น สไตล์มินิมอล ผ้านุ่มใส่สบาย';
      }
      if (inputCaption) {
        inputCaption.value = 'รีวิวชุดเซ็ตที่ใส่สบายที่สุดแห่งปี! เนื้อผ้านุ่มระบายอากาศดีมาก ไม่ร้อน ไม่ยับง่าย ทรงสวยแมตช์ง่ายได้ทุกวัน พิกัดอยู่ในตะกร้าส้มมุมล่างซ้ายเลยครับ ✨';
      }
      if (inputHashtags) {
        inputHashtags.value = '#รีวิวเสื้อผ้า #TikTokป้ายยา #พิกัดในตะกร้า #แต่งตัวมินิมอล #ของดีบอกต่อ';
      }
      if (inputCoverUrl) {
        inputCoverUrl.value = 'https://taytdxazdippihjpdroi.supabase.co/storage/v1/object/public/command-images/ai_cover_sample.jpg';
        selectedCoverFile = null;
        updateCoverPreview(inputCoverUrl.value);
      }
      if (inputStoryUrl) {
        inputStoryUrl.value = 'https://taytdxazdippihjpdroi.supabase.co/storage/v1/object/public/command-images/ai_storyboard_sample.jpg';
        selectedStoryFile = null;
        updateStoryPreview(inputStoryUrl.value);
      }
      if (inputVideoPrompt) {
        inputVideoPrompt.value = `[Scene 1] Camera unboxes parcel package on clean desk, showing fabric tag and folded outfit. SFX: paper rustling.
[Scene 2] Macro close-up shot panning across soft cotton fabric texture, seam stitching, and collar. SFX: fabric swoosh.
[Scene 3] Demonstrating stretchability and soft movement with hand pulling gently.
[Scene 4] Showing pocket details and elastic waistband with high-end finish.
[Scene 5] Styling demonstration showing outfit paired with sneakers and canvas bag.
[Scene 6] Final hero flat-lay shoot under clean aesthetic commercial studio lights. TikTok vertical 9:16, no human faces.`;
      }
      if (inputImagePrompt) {
        inputImagePrompt.value = 'Commercial e-commerce review 6-panel storyboard photo collage of exact minimalist t-shirt and shorts set, showing unboxing, macro cotton texture, styling, elastic waistband, pocket details, and hero flat-lay display under clean studio lighting. Sharp 8k focus, vibrant natural tones, no human faces.';
      }

      updateCounters();
      showToast('✨ เติมข้อมูลตัวอย่างเรียบร้อย พร้อมกดบันทึกได้เลย!', 'success');
    });
  }

  // --- Clear Form ---
  function clearManualForm() {
    if (inputProductName) inputProductName.value = '';
    if (inputCaption) inputCaption.value = '';
    if (inputHashtags) inputHashtags.value = '';
    if (inputCoverUrl) inputCoverUrl.value = '';
    if (inputStoryUrl) inputStoryUrl.value = '';
    if (inputVideoPrompt) inputVideoPrompt.value = '';
    if (inputImagePrompt) inputImagePrompt.value = '';

    selectedCoverFile = null;
    selectedStoryFile = null;
    if (coverFileInput) coverFileInput.value = '';
    if (storyFileInput) storyFileInput.value = '';

    updateCoverPreview('');
    updateStoryPreview('');
    updateCounters();
  }

  if (btnClearForm) {
    btnClearForm.addEventListener('click', () => {
      clearManualForm();
      showToast('ล้างข้อมูลในฟอร์มเรียบร้อย', 'info');
    });
  }

  // --- Save Data into Supabase `chatgpt_logs` ---
  let isSaving = false;

  function setSaveLoading(loading) {
    isSaving = loading;
    if (btnSaveData) btnSaveData.disabled = loading;
    if (btnSaveSpinner) btnSaveSpinner.style.display = loading ? 'inline-block' : 'none';
    if (btnSaveIcon) btnSaveIcon.style.display = loading ? 'none' : 'inline-flex';
    if (btnSaveText) {
      if (loading) {
        btnSaveText.textContent = editingRecordId ? 'กำลังอัปเดตข้อมูล...' : 'กำลังบันทึกลง Supabase...';
      } else {
        btnSaveText.textContent = editingRecordId ? '💾 บันทึกการแก้ไข (Update)' : '💾 บันทึกข้อมูลลง Supabase';
      }
    }
  }

  async function handleSaveData() {
    if (isSaving) return;

    const productName = inputProductName ? inputProductName.value.trim() : '';
    const caption = inputCaption ? inputCaption.value.trim() : '';
    const hashtags = inputHashtags ? inputHashtags.value.trim() : '';
    let coverUrl = inputCoverUrl ? inputCoverUrl.value.trim() : '';
    let storyUrl = inputStoryUrl ? inputStoryUrl.value.trim() : '';
    const videoPrompt = inputVideoPrompt ? inputVideoPrompt.value.trim() : '';
    const imagePrompt = inputImagePrompt ? inputImagePrompt.value.trim() : '';

    if (!productName) {
      showToast('กรุณากรอกชื่อสินค้า', 'error');
      if (inputProductName) inputProductName.focus();
      return;
    }

    if (!caption) {
      showToast('กรุณากรอกคำอธิบาย / แคปชัน TikTok', 'error');
      if (inputCaption) inputCaption.focus();
      return;
    }

    setSaveLoading(true);

    try {
      const bucketName = (typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_BUCKET) ? CONFIG.SUPABASE_BUCKET : 'command-images';

      // 1. Upload Cover Image to Supabase Storage if file selected
      if (selectedCoverFile && supabase) {
        if (coverUploadStatus) coverUploadStatus.textContent = 'กำลังอัปโหลดรูปปก...';
        const ext = selectedCoverFile.name.split('.').pop() || 'jpg';
        const coverFilename = `cover_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        
        const { error: upErr } = await supabase.storage
          .from(bucketName)
          .upload(coverFilename, selectedCoverFile, { cacheControl: '3600', upsert: false });

        if (upErr) throw new Error(`อัปโหลดรูปปกไม่สำเร็จ: ${upErr.message}`);

        const { data: pData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(coverFilename);
        coverUrl = pData.publicUrl;
        console.log('✓ รูปปกอัปโหลดเข้า Storage สำเร็จ:', coverUrl);
      }

      // 2. Upload Storyboard Image to Supabase Storage if file selected
      if (selectedStoryFile && supabase) {
        if (storyUploadStatus) storyUploadStatus.textContent = 'กำลังอัปโหลดรูปสตอรี่...';
        const ext = selectedStoryFile.name.split('.').pop() || 'jpg';
        const storyFilename = `story_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from(bucketName)
          .upload(storyFilename, selectedStoryFile, { cacheControl: '3600', upsert: false });

        if (upErr) throw new Error(`อัปโหลดรูปสตอรีบอร์ดไม่สำเร็จ: ${upErr.message}`);

        const { data: pData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(storyFilename);
        storyUrl = pData.publicUrl;
        console.log('✓ รูปสตอรีบอร์ดอัปโหลดเข้า Storage สำเร็จ:', storyUrl);
      }

      // 3. Insert Record into Supabase `chatgpt_logs` Table
      const recordPayload = {
        product_name: productName,
        caption: caption,
        hashtags: hashtags,
        cover_image_url: coverUrl || null,
        story_image_url: storyUrl || null,
        video_prompt: videoPrompt || null,
        image_prompt: imagePrompt || null,
        prompt: `บันทึกข้อมูลสินค้า: ${productName}`,
        response: JSON.stringify({
          product_name: productName,
          caption,
          hashtags,
          cover_image_url: coverUrl,
          story_image_url: storyUrl,
          video_prompt: videoPrompt,
          image_prompt: imagePrompt
        })
      };

      if (!supabase) {
        throw new Error('Supabase Client ไม่ได้เชื่อมต่อ กรุณาตรวจสอบ config.js');
      }

      if (editingRecordId) {
        // Update existing record in Supabase
        const { error: updErr } = await supabase
          .from('chatgpt_logs')
          .update(recordPayload)
          .eq('id', editingRecordId);

        if (updErr) {
          throw new Error(`อัปเดตข้อมูลไม่สำเร็จ: ${updErr.message}`);
        }

        showToast(`🎉 อัปเดตข้อมูลสำเร็จ (ID: ${editingRecordId})`, 'success');
      } else {
        // Insert new record in Supabase
        const { data: insData, error: insErr } = await supabase
          .from('chatgpt_logs')
          .insert([recordPayload])
          .select();

        if (insErr) {
          throw new Error(`บันทึกลงตาราง chatgpt_logs ไม่สำเร็จ: ${insErr.message}`);
        }

        const newId = insData && insData[0] ? insData[0].id : 'ใหม่';
        showToast(`🎉 บันทึกข้อมูลเข้า Supabase สำเร็จ (ID: ${newId})`, 'success');
      }

      // Clear Form, Close Modal, and Refresh Records List
      clearManualForm();
      closeAddModal();
      await loadSupabaseRecords();

      // Scroll to newly added records list smoothly
      if (recordsSection) {
        recordsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast(`ข้อผิดพลาด: ${err.message}`, 'error');
    } finally {
      setSaveLoading(false);
    }
  }

  if (btnSaveData) {
    btnSaveData.addEventListener('click', handleSaveData);
  }

  // --- Format Date Helper ---
  function formatDate(isoStr) {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }

  // --- Copy Text to Clipboard Helper ---
  function copyTextToClipboard(text, successMsg) {
    if (!text) {
      showToast('ไม่มีข้อความให้คัดลอก', 'info');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || 'คัดลอกข้อความสำเร็จ!', 'success');
    }).catch(() => {
      showToast('ไม่สามารถคัดลอกได้', 'error');
    });
  }

  // --- Create Record Card HTML Element ---
  // --- Record Detail Modal Elements & Handlers ---
  const recordDetailModal = document.getElementById('recordDetailModal');
  const btnDetailModalClose = document.getElementById('btnDetailModalClose');
  const btnDetailCloseFooter = document.getElementById('btnDetailCloseFooter');
  const detailModalTitle = document.getElementById('detailModalTitle');
  const detailModalId = document.getElementById('detailModalId');
  const detailModalDate = document.getElementById('detailModalDate');
  const detailCoverCard = document.getElementById('detailCoverCard');
  const detailCoverImg = document.getElementById('detailCoverImg');
  const detailCoverBox = document.getElementById('detailCoverBox');
  const detailStoryCard = document.getElementById('detailStoryCard');
  const detailStoryImg = document.getElementById('detailStoryImg');
  const detailStoryBox = document.getElementById('detailStoryBox');
  const detailCaptionText = document.getElementById('detailCaptionText');
  const btnDetailCopyCaption = document.getElementById('btnDetailCopyCaption');
  const detailHashtagsCard = document.getElementById('detailHashtagsCard');
  const detailHashtagsText = document.getElementById('detailHashtagsText');
  const btnDetailCopyTags = document.getElementById('btnDetailCopyTags');
  const detailVideoPromptCard = document.getElementById('detailVideoPromptCard');
  const detailVideoPromptText = document.getElementById('detailVideoPromptText');
  const btnDetailCopyVideoPrompt = document.getElementById('btnDetailCopyVideoPrompt');
  const detailImagePromptCard = document.getElementById('detailImagePromptCard');
  const detailImagePromptText = document.getElementById('detailImagePromptText');
  const btnDetailCopyImagePrompt = document.getElementById('btnDetailCopyImagePrompt');
  const btnDetailCopyAll = document.getElementById('btnDetailCopyAll');
  const btnDetailEdit = document.getElementById('btnDetailEdit');
  const btnDetailDelete = document.getElementById('btnDetailDelete');

  let activeDetailItem = null;

  function openRecordDetail(item) {
    if (!recordDetailModal || !item) return;
    activeDetailItem = item;

    if (detailModalTitle) detailModalTitle.textContent = item.product_name || 'ไม่มีชื่อสินค้า';
    if (detailModalId) detailModalId.textContent = `ID: ${item.id}`;
    if (detailModalDate) detailModalDate.textContent = `บันทึกเมื่อ: ${formatDate(item.created_at) || 'วันนี้'}`;

    // Images
    const coverSrc = item.cover_image_url || '';
    const storySrc = item.story_image_url || '';

    if (detailCoverCard && detailCoverImg) {
      if (coverSrc) {
        detailCoverImg.src = coverSrc;
        detailCoverCard.style.display = 'block';
      } else {
        detailCoverImg.src = '';
        detailCoverCard.style.display = 'none';
      }
    }

    if (detailStoryCard && detailStoryImg) {
      if (storySrc) {
        detailStoryImg.src = storySrc;
        detailStoryCard.style.display = 'block';
      } else {
        detailStoryImg.src = '';
        detailStoryCard.style.display = 'none';
      }
    }

    // Texts
    if (detailCaptionText) detailCaptionText.textContent = item.caption || '-';

    if (detailHashtagsCard && detailHashtagsText) {
      if (item.hashtags) {
        detailHashtagsText.textContent = item.hashtags;
        detailHashtagsCard.style.display = 'flex';
      } else {
        detailHashtagsCard.style.display = 'none';
      }
    }

    if (detailVideoPromptCard && detailVideoPromptText) {
      if (item.video_prompt) {
        detailVideoPromptText.textContent = item.video_prompt;
        detailVideoPromptCard.style.display = 'flex';
      } else {
        detailVideoPromptCard.style.display = 'none';
      }
    }

    if (detailImagePromptCard && detailImagePromptText) {
      if (item.image_prompt) {
        detailImagePromptText.textContent = item.image_prompt;
        detailImagePromptCard.style.display = 'flex';
      } else {
        detailImagePromptCard.style.display = 'none';
      }
    }

    recordDetailModal.classList.add('active');
  }

  function closeRecordDetail() {
    if (recordDetailModal) recordDetailModal.classList.remove('active');
  }

  if (btnDetailModalClose) btnDetailModalClose.addEventListener('click', closeRecordDetail);
  if (btnDetailCloseFooter) btnDetailCloseFooter.addEventListener('click', closeRecordDetail);
  if (recordDetailModal) {
    recordDetailModal.addEventListener('click', (e) => {
      if (e.target === recordDetailModal) closeRecordDetail();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && recordDetailModal && recordDetailModal.classList.contains('active')) {
      closeRecordDetail();
    }
  });

  // Lightbox from detail modal
  if (detailCoverBox) {
    detailCoverBox.addEventListener('click', () => {
      if (detailCoverImg && detailCoverImg.src) openLightbox(detailCoverImg.src);
    });
  }
  if (detailStoryBox) {
    detailStoryBox.addEventListener('click', () => {
      if (detailStoryImg && detailStoryImg.src) openLightbox(detailStoryImg.src);
    });
  }

  // Detail Modal Copy Handlers
  if (btnDetailCopyCaption) {
    btnDetailCopyCaption.addEventListener('click', () => {
      if (activeDetailItem) copyTextToClipboard(activeDetailItem.caption, 'คัดลอกแคปชันเรียบร้อยแล้ว!');
    });
  }
  if (btnDetailCopyTags) {
    btnDetailCopyTags.addEventListener('click', () => {
      if (activeDetailItem) copyTextToClipboard(activeDetailItem.hashtags, 'คัดลอกแฮชแท็กเรียบร้อยแล้ว!');
    });
  }
  if (btnDetailCopyVideoPrompt) {
    btnDetailCopyVideoPrompt.addEventListener('click', () => {
      if (activeDetailItem) copyTextToClipboard(activeDetailItem.video_prompt, 'คัดลอกพรอมต์ Google Flow เรียบร้อยแล้ว!');
    });
  }
  if (btnDetailCopyImagePrompt) {
    btnDetailCopyImagePrompt.addEventListener('click', () => {
      if (activeDetailItem) copyTextToClipboard(activeDetailItem.image_prompt, 'คัดลอกพรอมต์รูปภาพเรียบร้อยแล้ว!');
    });
  }
  if (btnDetailCopyAll) {
    btnDetailCopyAll.addEventListener('click', () => {
      if (!activeDetailItem) return;
      const fullContent = `${activeDetailItem.product_name || ''}\n\n${activeDetailItem.caption || ''}\n\n${activeDetailItem.hashtags || ''}\n\n[Google Flow Prompt]\n${activeDetailItem.video_prompt || ''}`;
      copyTextToClipboard(fullContent, 'คัดลอกข้อมูลทั้งหมดเรียบร้อยแล้ว!');
    });
  }

  // Detail Modal Edit & Delete Handlers
  if (btnDetailEdit) {
    btnDetailEdit.addEventListener('click', () => {
      if (!activeDetailItem) return;
      const itemToEdit = activeDetailItem;
      closeRecordDetail();
      openAddModal(true, itemToEdit);
    });
  }

  if (btnDetailDelete) {
    btnDetailDelete.addEventListener('click', async () => {
      if (!activeDetailItem) return;
      const itemToDelete = activeDetailItem;
      if (!confirm(`คุณต้องการลบข้อมูล "${itemToDelete.product_name || 'รายการนี้'}" (ID: ${itemToDelete.id}) ออกจาก Supabase ใช่หรือไม่?`)) {
        return;
      }

      try {
        btnDetailDelete.textContent = 'กำลังลบ...';
        btnDetailDelete.disabled = true;

        const { error: delErr } = await supabase
          .from('chatgpt_logs')
          .delete()
          .eq('id', itemToDelete.id);

        if (delErr) throw delErr;

        closeRecordDetail();
        showToast('✓ ลบข้อมูลออกจาก Supabase เรียบร้อยแล้ว', 'success');
        await loadSupabaseRecords();
      } catch (err) {
        console.error('Delete error:', err);
        showToast(`ลบไม่สำเร็จ: ${err.message}`, 'error');
      } finally {
        btnDetailDelete.textContent = '🗑️ ลบ';
        btnDetailDelete.disabled = false;
      }
    });
  }

  // --- Create Compact Record Card HTML Element ---
  function createRecordCard(item) {
    const card = document.createElement('div');
    card.className = 'record-compact-card';
    card.id = `recordCard_${item.id}`;

    const thumbSrc = item.cover_image_url || item.story_image_url || '';

    card.innerHTML = `
      <div class="compact-card-media">
        <span class="compact-id-pill">ID: ${item.id}</span>
        <div class="compact-quick-actions">
          <button type="button" class="compact-action-btn btn-edit-quick" title="แก้ไขข้อมูลสินค้านี้">✏️</button>
          <button type="button" class="compact-action-btn btn-del btn-del-quick" title="ลบรายการนี้">🗑️</button>
        </div>
        ${thumbSrc ? `
          <img src="${thumbSrc}" alt="${item.product_name || 'รูปสินค้า'}" loading="lazy">
        ` : `
          <div class="compact-media-placeholder">
            <span style="font-size: 2.2rem;">🛍️</span>
            <span>ไม่มีรูปภาพ</span>
          </div>
        `}
      </div>
      <div class="compact-card-body">
        <h4 class="compact-card-title">${item.product_name || 'ไม่มีชื่อสินค้า'}</h4>
        <div class="compact-card-footer">
          <span>${formatDate(item.created_at) || 'วันนี้'}</span>
          <span class="compact-view-hint">ดูรายละเอียด ➔</span>
        </div>
      </div>
    `;

    // Click card -> Open full detail modal
    card.addEventListener('click', () => {
      openRecordDetail(item);
    });

    // Quick Edit button
    const btnEditQuick = card.querySelector('.btn-edit-quick');
    if (btnEditQuick) {
      btnEditQuick.addEventListener('click', (e) => {
        e.stopPropagation();
        openAddModal(true, item);
      });
    }

    // Quick Delete button
    const btnDelQuick = card.querySelector('.btn-del-quick');
    if (btnDelQuick) {
      btnDelQuick.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(`คุณต้องการลบข้อมูล "${item.product_name || 'รายการนี้'}" (ID: ${item.id}) ออกจาก Supabase ใช่หรือไม่?`)) {
          return;
        }

        try {
          btnDelQuick.textContent = '⏳';
          btnDelQuick.disabled = true;

          const { error: delErr } = await supabase
            .from('chatgpt_logs')
            .delete()
            .eq('id', item.id);

          if (delErr) throw delErr;

          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          card.style.transition = 'all 0.3s ease';
          setTimeout(() => {
            card.remove();
            showToast('✓ ลบข้อมูลออกจาก Supabase เรียบร้อยแล้ว', 'success');
            loadSupabaseRecords();
          }, 300);
        } catch (err) {
          console.error('Delete error:', err);
          showToast(`ลบไม่สำเร็จ: ${err.message}`, 'error');
          btnDelQuick.textContent = '🗑️';
          btnDelQuick.disabled = false;
        }
      });
    }

    return card;
  }

  // --- Load Supabase Records into Page ---
  async function loadSupabaseRecords() {
    if (!supabase || !recordsList) return;

    if (recordsLoading) recordsLoading.style.display = 'block';
    if (recordsEmpty) recordsEmpty.style.display = 'none';

    try {
      const { data: rows, error } = await supabase
        .from('chatgpt_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalCount = rows ? rows.length : 0;
      if (recordsCountBadge) recordsCountBadge.textContent = `${totalCount} รายการ`;
      if (vaultCountBadge) vaultCountBadge.textContent = totalCount;

      // Remove existing cards
      const existingCards = recordsList.querySelectorAll('.record-item-card');
      existingCards.forEach(c => c.remove());

      if (!rows || rows.length === 0) {
        if (recordsEmpty) recordsEmpty.style.display = 'block';
        return;
      }

      rows.forEach(row => {
        const card = createRecordCard(row);
        recordsList.appendChild(card);
      });
    } catch (err) {
      console.error('Error loading chatgpt_logs:', err);
      showToast(`โหลดรายการจาก Supabase ไม่สำเร็จ: ${err.message}`, 'error');
    } finally {
      if (recordsLoading) recordsLoading.style.display = 'none';
    }
  }

  if (btnRefreshRecords) {
    btnRefreshRecords.addEventListener('click', () => {
      loadSupabaseRecords();
      showToast('รีเฟรชข้อมูลจาก Supabase เรียบร้อยแล้ว', 'info');
    });
  }

  // --- Vault Drawer Modal Handlers ---
  function openVault() {
    if (vaultModal) {
      vaultModal.style.display = 'flex';
      fetchVaultItems();
    }
  }

  function closeVault() {
    if (vaultModal) vaultModal.style.display = 'none';
  }

  if (btnOpenVault) btnOpenVault.addEventListener('click', openVault);
  if (btnCloseVault) btnCloseVault.addEventListener('click', closeVault);
  if (btnRefreshVault) btnRefreshVault.addEventListener('click', fetchVaultItems);

  if (vaultModal) {
    vaultModal.addEventListener('click', (e) => {
      if (e.target === vaultModal) closeVault();
    });
  }

  // Fetch Items for Vault Drawer
  async function fetchVaultItems() {
    if (!supabase || !vaultList) return;

    if (vaultLoading) vaultLoading.style.display = 'block';
    if (vaultEmpty) vaultEmpty.style.display = 'none';
    vaultList.innerHTML = '';

    try {
      const { data: rows, error } = await supabase
        .from('chatgpt_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!rows || rows.length === 0) {
        if (vaultEmpty) vaultEmpty.style.display = 'block';
        return;
      }

      rows.forEach(item => {
        const card = document.createElement('div');
        card.className = 'vault-item-card';

        const thumbHtml = `
          <div class="vault-item-thumbs">
            ${item.cover_image_url ? `<div class="vault-thumb-wrap" title="รูปปก"><img src="${item.cover_image_url}" alt="รูปปก"></div>` : ''}
            ${item.story_image_url ? `<div class="vault-thumb-wrap" title="สตอรีบอร์ด"><img src="${item.story_image_url}" alt="สตอรีบอร์ด"></div>` : ''}
          </div>
        `;

        card.innerHTML = `
          ${thumbHtml}
          <div class="vault-item-body">
            <h4 class="vault-item-title">${item.product_name || 'ชุดคอนเทนต์'}</h4>
            <p class="vault-item-caption">${item.caption || '-'}</p>
            <div class="vault-item-footer">
              <span class="vault-item-date">${formatDate(item.created_at)}</span>
              <span class="vault-badge-tag">ID: ${item.id}</span>
            </div>
          </div>
        `;

        card.addEventListener('click', () => {
          closeVault();
          const targetCard = document.getElementById(`recordCard_${item.id}`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.style.outline = '2px solid #f43f5e';
            setTimeout(() => { targetCard.style.outline = 'none'; }, 2000);
          }
        });

        vaultList.appendChild(card);
      });
    } catch (err) {
      console.error('Vault fetch error:', err);
    } finally {
      if (vaultLoading) vaultLoading.style.display = 'none';
    }
  }

  // --- Initial Data Load on Page Ready ---
  setTimeout(() => {
    loadSupabaseRecords();
    updateCounters();
  }, 200);
});
