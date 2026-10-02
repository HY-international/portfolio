// ===== ダークモード切り替え =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function currentTheme() {
  const set = root.getAttribute('data-theme');
  if (set) return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) { /* 保存できなくても動作に影響なし */ }
});

// ===== スマホ用メニュー =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
}

menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ===== スクロールしたらヘッダーに背景をつける =====
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== スクロールで要素をふわっと表示 =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ===== 表示中のセクションをメニューで強調 =====
const navLinks = [...nav.querySelectorAll('a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => {
      a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

// ===== 制作実績のカテゴリ絞り込み =====
const filters = document.querySelectorAll('.filter');
const works = document.querySelectorAll('.work');

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach((b) => b.classList.toggle('is-active', b === btn));
    const target = btn.dataset.filter;
    works.forEach((work) => {
      const show = target === 'all' || work.dataset.category === target;
      work.classList.toggle('is-hidden', !show);
      if (show) work.classList.add('is-visible');
    });
  });
});

// ===== フッターの年を自動更新 =====
document.getElementById('year').textContent = new Date().getFullYear();
