/**
 * TLS Connect LP - Script
 * script.js
 * スクロールアニメーション・タイプライター・ハンバーガーメニュー
 */

'use strict';

/* ============================================================
   1. DOM Ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTypewriter();
  initScrollAnimations();
  initSmoothScroll();
  initHamburger();
});

/* ============================================================
   2. Navigation: スクロールで背景強調
   ============================================================ */
function initNav() {
  const nav = document.getElementById('globalNav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   3. Typewriter Animation（ヒーローサブタイトル）
   ============================================================ */
function initTypewriter() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const lines = [
    'SSL/TLS証明書の一元管理・自動更新・自動デプロイを実現。',
    '中小企業のIT担当者が本当に求めるソリューション。',
    '専門知識不要。1〜100枚の証明書管理に最適化。',
    'GMO GlobalSignの信頼性で、失効ゼロへ。',
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 60;
  let pauseAfterType = 2200;
  let pauseAfterDelete = 300;

  function type() {
    const currentLine = lines[lineIndex];

    if (!isDeleting) {
      // タイピング
      el.textContent = currentLine.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentLine.length) {
        // 全文タイプ完了 → 待機後に削除開始
        setTimeout(() => {
          isDeleting = true;
          type();
        }, pauseAfterType);
        return;
      }

      setTimeout(type, typingSpeed);
    } else {
      // 削除
      el.textContent = currentLine.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // 削除完了 → 次の行へ
        isDeleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
        setTimeout(type, pauseAfterDelete);
        return;
      }

      setTimeout(type, typingSpeed / 2);
    }
  }

  // 少し遅延してから開始（ページ読み込み直後の重さを避ける）
  setTimeout(type, 800);
}

/* ============================================================
   4. Scroll Animations（IntersectionObserver）
   ============================================================ */
function initScrollAnimations() {
  // ---- 4-1: 通常フェードイン ----
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) * 120 : 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        fadeObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // ---- 4-2: 漫画パネルの順次フェードイン ----
  const panels = document.querySelectorAll('.fade-in-panel');

  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const panel = entry.target;
        // data-delay は 0〜5 の値（コマ番号）
        const delayIndex = parseInt(panel.dataset.delay || 0);
        const delayMs = delayIndex * 200; // 0.2秒ずつ遅延

        setTimeout(() => {
          panel.classList.add('visible');
        }, delayMs);

        panelObserver.unobserve(panel);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px',
  });

  panels.forEach(panel => panelObserver.observe(panel));

  // ---- 4-3: Feature カードの遅延フェードイン ----
  const featureCards = document.querySelectorAll('.feature-card');

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseInt(card.dataset.delay || 0) * 120;
        setTimeout(() => {
          card.classList.add('visible');
        }, delay);
        cardObserver.unobserve(card);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px',
  });

  featureCards.forEach(card => {
    // feature-card も fade-in を付与して同じスタイルを適用
    card.classList.add('fade-in');
    cardObserver.observe(card);
  });
}

/* ============================================================
   5. Smooth Scroll（アンカーリンク）
   ============================================================ */
function initSmoothScroll() {
  const navHeight = 64; // ナビの高さ（px）

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });

      // モバイルでメニューが開いている場合は閉じる
      const navLinks = document.querySelector('.nav-links');
      const hamburger = document.getElementById('hamburger');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  });
}

/* ============================================================
   6. Hamburger Menu
   ============================================================ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    // aria-expanded 更新
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // 外側クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   7. Counter Animation（数字が増えるアニメーション）
   ============================================================ */
function animateCounter(el, target, duration = 1500) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

/* ============================================================
   8. Manga Panel: ホバーで吹き出しを強調
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.manga-panel').forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      const bubble = panel.querySelector('.speech-bubble');
      if (bubble) {
        bubble.style.transform = 'scale(1.03)';
        bubble.style.transition = 'transform 0.2s ease';
        bubble.style.zIndex = '20';
      }
    });

    panel.addEventListener('mouseleave', () => {
      const bubble = panel.querySelector('.speech-bubble');
      if (bubble) {
        bubble.style.transform = 'scale(1)';
        bubble.style.zIndex = '10';
      }
    });
  });
});

/* ============================================================
   9. Scroll Progress Indicator（オプション：ページ上部に細いバー）
   ============================================================ */
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, #0070C0, #00B894);
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
}

// スクロールプログレスバーを初期化
document.addEventListener('DOMContentLoaded', initScrollProgress);

/* ============================================================
   10. Back to Top Button
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.createElement('button');
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.setAttribute('aria-label', 'ページトップへ戻る');
  btn.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #003366, #0070C0);
    color: #FFFFFF;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    box-shadow: 0 4px 16px rgba(0,51,102,0.3);
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(16px)';
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-3px)';
    btn.style.boxShadow = '0 8px 24px rgba(0,51,102,0.4)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 4px 16px rgba(0,51,102,0.3)';
  });
});
