/* ===================================================
   時空資源管理與監控局 ── 互動腳本
   =================================================== */

// ── 頁面切換 ──
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  const link = document.querySelector(`[data-page="${pageId}"]`);
  if (link) link.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 切換到首頁時重繪儀表板
  if (pageId === 'home') drawGauges();
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// ── 時鐘 ──
function updateClock() {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourDeg   = (h * 30) + (m * 0.5);
  const minuteDeg = (m * 6) + (s * 0.1);
  const secondDeg = s * 6;

  const hourHand   = document.getElementById('hourHand');
  const minuteHand = document.getElementById('minuteHand');
  const secondHand = document.getElementById('secondHand');

  if (hourHand)   hourHand.style.transform   = `rotate(${hourDeg}deg)`;
  if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  if (secondHand) secondHand.style.transform = `rotate(${secondDeg}deg)`;
}
updateClock();
setInterval(updateClock, 1000);

// ── 儀表板弧形 ──
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end   = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

function drawGauges() {
  const ids = ['arc1', 'arc2', 'arc3', 'arc4'];
  const vals = [73, 91, 58, 85];
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const endAngle = -135 + (vals[i] / 100) * 270;
    el.setAttribute('d', describeArc(50, 50, 40, -135, endAngle));
  });
}
drawGauges();

// ── 蒸氣粒子 ──
function createSteamParticles() {
  const container = document.getElementById('steamParticles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'steam-particle';
    p.style.left     = Math.random() * 100 + 'vw';
    p.style.animationDuration  = (8 + Math.random() * 14) + 's';
    p.style.animationDelay     = (Math.random() * 10) + 's';
    p.style.width  = (4 + Math.random() * 8) + 'px';
    p.style.height = p.style.width;
    p.style.opacity = (0.05 + Math.random() * 0.2).toString();
    container.appendChild(p);
  }
}
createSteamParticles();

// ── 部門展開 ──
function toggleDept(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('open');
}

// ── FAQ 展開 ──
function toggleFaq(questionEl) {
  const item   = questionEl.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isOpen = answer.classList.contains('open');

  // 關閉所有
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('open'));

  if (!isOpen) {
    answer.classList.add('open');
    questionEl.classList.add('open');
  }
}

// ── 申請 Modal ──
function openApply(jobTitle) {
  const modal = document.getElementById('applyModal');
  const title = document.getElementById('modalJobTitle');
  if (modal && title) {
    title.textContent = jobTitle;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeApply() {
  const modal = document.getElementById('applyModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// 點擊遮罩關閉
document.getElementById('applyModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeApply();
});

function submitApply(e) {
  e.preventDefault();
  closeApply();
  showToast('申請已成功提交！本局將於 30 個工作日內以電報回覆。');
  e.target.reset();
}

// ── 聯絡表單 ──
function submitContact(e) {
  e.preventDefault();
  showToast('電報已發送！感謝您的來函，本局將盡速回覆。');
  e.target.reset();
}

// ── Toast 通知 ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── 時域地圖 Tooltip ──
document.querySelectorAll('.map-node').forEach(node => {
  node.addEventListener('mouseenter', function() {
    showToast(this.title);
  });
});

// ── 齒輪裝飾旋轉方向 ──
const gearL = document.getElementById('gearL');
const gearR = document.getElementById('gearR');
if (gearL) gearL.querySelector('*') || (gearL.style.animationDirection = 'normal');
if (gearR) {
  const pseudo = gearR;
  pseudo.classList.add('spin-reverse');
}

// ── 頁面載入動畫 ──
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.panel, .job-card, .announcement-card, .faq-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
});

// ── 跑馬燈暫停 ──
const ticker = document.getElementById('ticker');
if (ticker) {
  ticker.addEventListener('mouseenter', () => {
    ticker.style.animationPlayState = 'paused';
  });
  ticker.addEventListener('mouseleave', () => {
    ticker.style.animationPlayState = 'running';
  });
}


/* ===================================================
   開頭載入動畫 (Splash Screen)
   =================================================== */
function initSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');

    if (!splashScreen) return;

    // 避免背景可以捲動
    document.body.style.overflow = "hidden";

    function enterSite() {

        splashScreen.classList.add("fade-out");

        setTimeout(() => {
            splashScreen.style.display = "none";
            document.body.style.overflow = "";
        }, 800);

        splashScreen.removeEventListener("click", enterSite);
    }

    splashScreen.addEventListener("click", enterSite);
}

// 頁面載入完成後執行開頭動畫
document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
});

// 如果 DOM 已經載入，直接執行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSplashScreen);
} else {
  initSplashScreen();
}
