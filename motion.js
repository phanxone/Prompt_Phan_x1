// ==========================================================================
// VisionPrompt Studio - 3D Soda-Style Motion & Interaction Engine
// ==========================================================================

const ASSET_BASE_URL = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d';
const GREEN_TEXTURE_URL = `${ASSET_BASE_URL}/green%20base%20color.jpg`;
const BLUE_TEXTURE_URL = `${ASSET_BASE_URL}/blue%20base%20color.jpg`;
const CHERRY_GLB_URL = `${ASSET_BASE_URL}/cherry.glb`;
const BLUEBERRY_GLB_URL = `${ASSET_BASE_URL}/blueberry.glb`;
const BUBBLE_PNG_URL = `${ASSET_BASE_URL}/bubble.png`;

document.addEventListener('DOMContentLoaded', () => {
    initSodaMotion();
    initCommandPanel3DTilt();
    initBubblesGenerator();
    initCardQuickSync();
});

function initSodaMotion() {
    const modelViewer = document.querySelector('#product-model');
    const berriesFG = document.querySelector('.stage-berries-fg');
    const berriesBG = document.querySelector('.stage-berries-bg');
    const leavesBG = document.querySelector('.stage-leaves');
    const allBerries = document.querySelectorAll('.stage-berry');
    const cards = document.querySelectorAll('.stage-card');
    const heroStage = document.querySelector('.hero-3d-stage');

    if (!modelViewer) return;

    let isSwitching = false;
    let switchSpin = 0;
    let blueTexture = null;
    let greenTexture = null;

    // 1. Preload textures & Warm up shaders
    modelViewer.addEventListener('load', async () => {
        try {
            blueTexture = await modelViewer.createTexture(BLUE_TEXTURE_URL);
            greenTexture = await modelViewer.createTexture(GREEN_TEXTURE_URL);

            if (modelViewer.model) {
                const material = modelViewer.model.materials[0];
                if (material && material.pbrMetallicRoughness.baseColorTexture) {
                    material.pbrMetallicRoughness.baseColorTexture.setTexture(blueTexture);
                    await new Promise(r => requestAnimationFrame(r));
                    material.pbrMetallicRoughness.baseColorTexture.setTexture(greenTexture);
                }
            }
        } catch (e) {
            console.warn("3D Texture warm-up skipped:", e);
        }
    });

    // 2. Carousel Click Handling
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (isSwitching) return;
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const flavor = card.dataset.flavor;
            switchFlavor(flavor);
        });
    });

    // Arrow Nav buttons
    const btnPrev = document.getElementById('carouselPrev');
    const btnNext = document.getElementById('carouselNext');
    if (btnPrev && btnNext) {
        const toggleCards = () => {
            const activeCard = document.querySelector('.stage-card.active');
            const otherCard = document.querySelector('.stage-card:not(.active)');
            if (otherCard && !isSwitching) {
                activeCard.classList.remove('active');
                otherCard.classList.add('active');
                switchFlavor(otherCard.dataset.flavor);
            }
        };
        btnPrev.addEventListener('click', toggleCards);
        btnNext.addEventListener('click', toggleCards);
    }

    // 3. Choreographed Flavor Switch Animation
    async function switchFlavor(flavor) {
        if (isSwitching) return;
        isSwitching = true;
        const body = document.body;
        const berries = document.querySelectorAll('.stage-berry');
        const stageCenter = document.querySelector('.stage-center');

        // Dynamic Glow / Background Morphs
        const glowTop = document.querySelector('.glow-top-left');
        const glowBottom = document.querySelector('.glow-bottom-right');

        if (flavor === 'blue') {
            body.classList.add('theme-blue-mode');
            if (glowTop) {
                gsap.to(glowTop, {
                    background: 'radial-gradient(circle, rgba(14, 116, 218, 0.5) 0%, rgba(30, 58, 138, 0.25) 60%, transparent 80%)',
                    duration: 1.5,
                    ease: 'power2.inOut'
                });
            }
            if (glowBottom) {
                gsap.to(glowBottom, {
                    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, rgba(2, 132, 199, 0.15) 60%, transparent 80%)',
                    duration: 1.5,
                    ease: 'power2.inOut'
                });
            }
        } else {
            body.classList.remove('theme-blue-mode');
            if (glowTop) {
                gsap.to(glowTop, {
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(4, 78, 59, 0.25) 60%, transparent 80%)',
                    duration: 1.5,
                    ease: 'power2.inOut'
                });
            }
            if (glowBottom) {
                gsap.to(glowBottom, {
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.35) 0%, rgba(13, 148, 136, 0.15) 60%, transparent 80%)',
                    duration: 1.5,
                    ease: 'power2.inOut'
                });
            }
        }

        // Can 720 Spin Animation + Blur
        const spinObj = { val: 0, blur: 0 };
        gsap.to(spinObj, {
            val: 360,
            blur: 15,
            duration: 0.6,
            ease: "power2.in",
            onUpdate: () => {
                switchSpin = spinObj.val;
                modelViewer.style.filter = `blur(${spinObj.blur}px)`;
            },
            onComplete: async () => {
                // Swap Texture at Peak
                if (flavor === 'blue') {
                    if (modelViewer.model && blueTexture) {
                        modelViewer.model.materials.forEach(material => {
                            if (material.pbrMetallicRoughness.baseColorTexture) {
                                material.pbrMetallicRoughness.baseColorTexture.setTexture(blueTexture);
                            }
                        });
                    }
                } else {
                    if (modelViewer.model && greenTexture) {
                        modelViewer.model.materials.forEach(material => {
                            if (material.pbrMetallicRoughness.baseColorTexture) {
                                material.pbrMetallicRoughness.baseColorTexture.setTexture(greenTexture);
                            }
                        });
                    }
                }

                // Spin Second Half to 720 deg
                gsap.to(spinObj, {
                    val: 720,
                    blur: 0,
                    duration: 1.5,
                    ease: "back.out(0.7)",
                    onUpdate: () => {
                        switchSpin = spinObj.val;
                        modelViewer.style.filter = `blur(${spinObj.blur}px)`;
                    },
                    onComplete: () => {
                        switchSpin = 0;
                        modelViewer.style.filter = 'none';
                    }
                });
            }
        });

        // Berries Implode & Explode
        let completedBerries = 0;
        const stageRect = heroStage ? heroStage.getBoundingClientRect() : { width: window.innerWidth, height: 600, left: 0, top: 0 };
        const stageCenterX = stageRect.width / 2;
        const stageCenterY = stageRect.height / 2;

        berries.forEach((berry) => {
            const bW = berry.offsetWidth / 2;
            const bH = berry.offsetHeight / 2;
            const bRect = berry.getBoundingClientRect();
            const centerX = (stageRect.left + stageCenterX) - bRect.left - bW;
            const centerY = (stageRect.top + stageCenterY) - bRect.top - bH;

            const startAngle = parseFloat(berry.dataset.angle) || 0;
            const currentBaseX = parseFloat(berry.dataset.baseX) || 0;
            const currentBaseY = parseFloat(berry.dataset.baseY) || 0;

            const nextBaseX = (Math.random() - 0.5) * 180;
            const nextBaseY = (Math.random() - 0.5) * 180;

            gsap.set(berry, {
                rotation: startAngle,
                x: currentBaseX,
                y: currentBaseY
            });

            const berryTl = gsap.timeline();
            berryTl.to(berry, {
                x: centerX,
                y: centerY,
                rotation: startAngle + 45,
                scale: 0.1,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    berry.src = flavor === 'blue' ? BLUEBERRY_GLB_URL : CHERRY_GLB_URL;
                    if (stageCenter) stageCenter.style.zIndex = 40;
                }
            })
            .to(berry, { duration: 0.25 })
            .to(berry, {
                onStart: () => {
                    if (stageCenter) stageCenter.style.zIndex = 2;
                },
                x: nextBaseX,
                y: nextBaseY,
                rotation: startAngle + 90,
                scale: 1,
                opacity: 1,
                duration: 0.9,
                ease: "back.out(1.5)",
                onComplete: () => {
                    berry.dataset.angle = startAngle + 90;
                    berry.dataset.baseX = nextBaseX;
                    berry.dataset.baseY = nextBaseY;
                    berry.dataset.rx = 0;
                    berry.dataset.ry = 0;

                    completedBerries++;
                    if (completedBerries === berries.length) {
                        isSwitching = false;
                    }
                }
            });
        });
    }

    // 4. Mouse Tracking & Force Field Physics
    allBerries.forEach(b => {
        b.dataset.rx = 0;
        b.dataset.ry = 0;
        b.dataset.angle = Math.random() * 360;
        b.dataset.baseX = 0;
        b.dataset.baseY = 0;
    });

    let mouse = { x: 0, y: 0, px: 0, py: 0 };
    let currentMouse = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) - 0.5;
        mouse.y = (e.clientY / window.innerHeight) - 0.5;
        mouse.px = e.clientX;
        mouse.py = e.clientY;
    });

    function animateFrame() {
        const time = Date.now() * 0.001;

        // Mouse lerping
        currentMouse.x += (mouse.x - currentMouse.x) * 0.05;
        currentMouse.y += (mouse.y - currentMouse.y) * 0.05;

        // Model Viewer 3D Tilt
        modelViewer.cameraOrbit = `${(currentMouse.x * 40) + switchSpin}deg ${90 + (currentMouse.y * 20)}deg 380%`;

        // Parallax drift
        if (berriesFG) berriesFG.style.transform = `translate(${currentMouse.x * 45}px, ${currentMouse.y * 45}px)`;
        if (berriesBG) berriesBG.style.transform = `translate(${currentMouse.x * -25}px, ${currentMouse.y * -25}px)`;
        if (leavesBG) leavesBG.style.transform = `translate(${currentMouse.x * -15}px, ${currentMouse.y * -15}px)`;

        // Force Field Repulsion & Floating on Berries
        if (!isSwitching) {
            allBerries.forEach((berry, i) => {
                const berryRect = berry.getBoundingClientRect();
                const berryX = berryRect.left + berryRect.width / 2;
                const berryY = berryRect.top + berryRect.height / 2;

                const diffX = mouse.px - berryX;
                const diffY = mouse.py - berryY;
                const distance = Math.sqrt(diffX * diffX + diffY * diffY);

                let targetRx = 0, targetRy = 0, speedMult = 1;

                if (distance < 380) {
                    const force = (380 - distance) / 380;
                    targetRx = (diffX / distance) * force * -75;
                    targetRy = (diffY / distance) * force * -75;
                    speedMult = 1 + force * 5;
                }

                let rx = parseFloat(berry.dataset.rx) || 0;
                let ry = parseFloat(berry.dataset.ry) || 0;
                let angle = parseFloat(berry.dataset.angle) || 0;
                let baseX = parseFloat(berry.dataset.baseX) || 0;
                let baseY = parseFloat(berry.dataset.baseY) || 0;

                rx += (targetRx - rx) * 0.1;
                ry += (targetRy - ry) * 0.1;
                angle += 0.22 * speedMult;

                berry.dataset.rx = rx;
                berry.dataset.ry = ry;
                berry.dataset.angle = angle;

                // Sine Float
                const dur = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10][i % 9];
                const phase = (time + i * 0.7) * (Math.PI * 2 / dur);
                const floatY = Math.sin(phase) * 14;
                const floatAngle = Math.cos(phase) * 6;

                berry.style.transform = `translate(calc(${rx + baseX}px), calc(${ry + baseY}px + ${floatY}px)) rotate(calc(${angle}deg + ${floatAngle}deg))`;
            });
        }

        // Float Leaves
        document.querySelectorAll('.stage-leaf').forEach((leaf, i) => {
            const dur = 10 + i * 2;
            const phase = (time + i * 1.2) * (Math.PI * 2 / dur);
            const floatY = Math.sin(phase) * 18;
            const floatX = Math.cos(phase * 0.5) * 12;
            const floatAngle = Math.sin(phase * 0.3) * 14;
            leaf.style.transform = `translate(${floatX}px, ${floatY}px) rotate(${floatAngle}deg)`;
        });

        requestAnimationFrame(animateFrame);
    }

    animateFrame();
}

// 5. Ambient Rising Bubbles Generator
function initBubblesGenerator() {
    const bubblesContainer = document.getElementById('bubbles-container');
    if (!bubblesContainer) return;

    function createBubble() {
        const bubble = document.createElement('img');
        bubble.src = BUBBLE_PNG_URL;
        bubble.className = 'bubble-img';
        const size = Math.random() * 22 + 10 + 'px';
        bubble.style.width = size;
        bubble.style.height = 'auto';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = '-60px';
        bubble.style.opacity = (Math.random() * 0.4 + 0.18).toFixed(2);

        const duration = Math.random() * 6 + 4.5;
        bubble.style.animation = `floatUpImg ${duration}s linear forwards`;

        bubblesContainer.appendChild(bubble);
        setTimeout(() => bubble.remove(), duration * 1000);
    }

    setInterval(createBubble, 450);
}

// 6. Interactive 3D Perspective Tilt on Command Panel
function initCommandPanel3DTilt() {
    const panel = document.getElementById('commandPanel');
    if (!panel) return;

    let panelRect = panel.getBoundingClientRect();
    window.addEventListener('resize', () => {
        panelRect = panel.getBoundingClientRect();
    });

    panel.addEventListener('mousemove', (e) => {
        const x = e.clientX - panelRect.left;
        const y = e.clientY - panelRect.top;
        const centerX = panelRect.width / 2;
        const centerY = panelRect.height / 2;

        const tiltX = ((y - centerY) / centerY) * -3.5;
        const tiltY = ((x - centerX) / centerX) * 3.5;

        gsap.to(panel, {
            transform: `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(8px)`,
            duration: 0.3,
            ease: "power1.out"
        });
    });

    panel.addEventListener('mouseleave', () => {
        gsap.to(panel, {
            transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
            duration: 0.6,
            ease: "power2.out"
        });
    });
}

// 7. Sync Stage Buttons & Carousel with Prompt Studio
function initCardQuickSync() {
    const promptInput = document.getElementById('promptInput');
    const btnPresetStoryboard = document.getElementById('btnPresetStoryboard');
    const btnPresetCover = document.getElementById('btnPresetCover');
    const cards = document.querySelectorAll('.stage-card');

    function applyPreset(type) {
        if (!promptInput) return;
        if (type === 'storyboard') {
            promptInput.value = "ช่วยวิเคราะห์สินค้าในภาพนี้ และสร้าง Storyboard คอนเทนต์ 6 ซีน สำหรับทำคลิป TikTok ไวรัล พร้อมสคริปต์พูดและเทคนิคถ่ายทำ";
        } else if (type === 'cover') {
            promptInput.value = "สร้างภาพหน้าปกคลิป TikTok ขนาด 9:16 สไตล์ E-Commerce ระดับพรีเมียม ตัวหนังสือพาดหัวเด่นสะดุดตา ปักตะกร้าแตก";
        }
        promptInput.dispatchEvent(new Event('input', { bubbles: true }));
        promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        promptInput.focus();
    }

    if (btnPresetStoryboard) {
        btnPresetStoryboard.addEventListener('click', () => applyPreset('storyboard'));
    }
    if (btnPresetCover) {
        btnPresetCover.addEventListener('click', () => applyPreset('cover'));
    }

    const btnQuickStart = document.getElementById('btnQuickStart');
    if (btnQuickStart) {
        btnQuickStart.addEventListener('click', (e) => {
            e.preventDefault();
            const panel = document.getElementById('commandPanel');
            if (panel) {
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const flavor = card.dataset.flavor;
            if (flavor === 'classic') {
                applyPreset('storyboard');
            } else {
                applyPreset('cover');
            }
        });
    });
}

