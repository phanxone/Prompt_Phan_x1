// ==========================================================================
// VisionPrompt Studio - Floating 3D Ambient Motion & Physics Engine
// (Berries & Leaves Side Flanks + Ambient Bubbles + 3D Tilt)
// ==========================================================================

const ASSET_BASE_URL = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d';
const BUBBLE_PNG_URL = `${ASSET_BASE_URL}/bubble.png`;

document.addEventListener('DOMContentLoaded', () => {
    initSideDecorationsMotion();
    initCommandPanel3DTilt();
    initBubblesGenerator();
});

// 1. Floating 3D Berries & Leaves on the Sides (with Force Field Repulsion)
function initSideDecorationsMotion() {
    const allDecorations = document.querySelectorAll('.side-decor');
    if (!allDecorations.length) return;

    allDecorations.forEach((item, i) => {
        item.dataset.rx = 0;
        item.dataset.ry = 0;
        item.dataset.angle = Math.random() * 360;
        item.dataset.baseX = 0;
        item.dataset.baseY = 0;
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

        // Smooth mouse lerping
        currentMouse.x += (mouse.x - currentMouse.x) * 0.05;
        currentMouse.y += (mouse.y - currentMouse.y) * 0.05;

        // Animate each decoration with individual float & force-field repulsion
        allDecorations.forEach((item, i) => {
            const rect = item.getBoundingClientRect();
            const itemX = rect.left + rect.width / 2;
            const itemY = rect.top + rect.height / 2;

            const diffX = mouse.px - itemX;
            const diffY = mouse.py - itemY;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);

            let targetRx = 0, targetRy = 0, speedMult = 1;

            // Repelled by cursor force-field if closer than 360px
            if (distance < 360) {
                const force = (360 - distance) / 360;
                targetRx = (diffX / distance) * force * -75;
                targetRy = (diffY / distance) * force * -75;
                speedMult = 1 + force * 4.5;
            }

            let rx = parseFloat(item.dataset.rx) || 0;
            let ry = parseFloat(item.dataset.ry) || 0;
            let angle = parseFloat(item.dataset.angle) || 0;

            // Smooth damping
            rx += (targetRx - rx) * 0.1;
            ry += (targetRy - ry) * 0.1;
            angle += (i % 2 === 0 ? 0.2 : -0.18) * speedMult;

            item.dataset.rx = rx;
            item.dataset.ry = ry;
            item.dataset.angle = angle;

            // Sine wave floating effect
            const dur = [6, 8, 7, 9, 5.5, 7.5, 8.5, 10][i % 8];
            const phase = (time + i * 1.1) * (Math.PI * 2 / dur);
            const floatY = Math.sin(phase) * 16;
            const floatX = Math.cos(phase * 0.7) * 10;
            const floatAngle = Math.cos(phase) * 8;

            // Apply parallax + repulsion + float
            const parallaxX = currentMouse.x * (i % 2 === 0 ? 30 : -25);
            const parallaxY = currentMouse.y * (i % 2 === 0 ? 30 : -25);

            item.style.transform = `translate(calc(${rx + floatX + parallaxX}px), calc(${ry + floatY + parallaxY}px)) rotate(calc(${angle}deg + ${floatAngle}deg))`;
        });

        requestAnimationFrame(animateFrame);
    }

    animateFrame();
}

// 2. Ambient Rising Bubbles Generator
function initBubblesGenerator() {
    const bubblesContainer = document.getElementById('bubbles-container');
    if (!bubblesContainer) return;

    function createBubble() {
        const bubble = document.createElement('img');
        bubble.src = BUBBLE_PNG_URL;
        bubble.className = 'bubble-img';
        const size = Math.random() * 20 + 10 + 'px';
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

// 3. Interactive 3D Perspective Tilt on Command Panel
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
            transform: `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(6px)`,
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
