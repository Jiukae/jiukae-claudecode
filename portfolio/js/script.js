/* =========================================================
   JIUKAE — Personal Portfolio
   Vanilla JavaScript · 프레임워크/라이브러리/빌드 과정 없음
   ========================================================= */

/* ---------------------------------------------------------
   ✏️ 사이트 설정 — 이 부분만 수정하면 됩니다.
   --------------------------------------------------------- */
const SITE_CONFIG = {
  /**
   * 연락받을 이메일 주소
   * 예) email: 'yourname@example.com'
   * 비워 두면 Contact 섹션의 이메일 버튼이 '준비 중' 상태로 표시됩니다.
   */
  email: '',

  /**
   * 프로젝트 링크 (배포 주소, GitHub 저장소 등)
   * 키 이름은 index.html 프로젝트 카드의 data-project-link 값과 같습니다.
   * 비워 두면 카드에 '링크 준비 중'으로 표시됩니다.
   */
  projectLinks: {
    dorantalk: '',
    'snake-game': '',
    'ai-experiments': '',
    'game-development': '',
  },
};

(() => {
  'use strict';

  const root = document.documentElement;

  // JS가 동작할 때만 등장 애니메이션용 숨김 스타일을 적용합니다.
  // (이 파일은 <head>에서 바로 실행되므로 첫 화면에 깜빡임이 없습니다.)
  root.classList.remove('no-js');
  root.classList.add('js');

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const supportsObserver = 'IntersectionObserver' in window;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------------------------------------------------------
     1. 스크롤 등장 애니메이션 (IntersectionObserver)
     --------------------------------------------------------- */
  function initReveal() {
    const items = $$('[data-reveal]');

    // 그룹 안의 요소는 순서대로 조금씩 늦게 나타나도록
    $$('[data-reveal-group]').forEach((group) => {
      $$(':scope > [data-reveal]', group).forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${index * 100}ms`);
      });
    });

    $$('[data-delay]').forEach((item) => {
      item.style.setProperty('--reveal-delay', `${Number(item.dataset.delay) || 0}ms`);
    });

    const show = (item) => item.classList.add('is-visible');

    if (reducedMotion.matches || !supportsObserver) {
      items.forEach(show);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach((item) => observer.observe(item));
  }

  /* ---------------------------------------------------------
     2. 헤더: 스크롤 시 글래스 배경 + 진행 표시줄
     --------------------------------------------------------- */
  function initHeader() {
    const header = $('[data-header]');
    if (!header) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const { scrollY, innerHeight } = window;
      const maxScroll = root.scrollHeight - innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

      header.classList.toggle('is-scrolled', scrollY > 16);
      header.style.setProperty('--scroll-progress', progress.toFixed(4));
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  }

  /* ---------------------------------------------------------
     3. 모바일 햄버거 메뉴
     --------------------------------------------------------- */
  function initMobileMenu() {
    const header = $('[data-header]');
    const nav = $('[data-nav]');
    const toggle = $('[data-nav-toggle]');
    if (!header || !nav || !toggle) return;

    const mobileQuery = window.matchMedia('(max-width: 860px)');

    $$('.nav__item', nav).forEach((item, index) => item.style.setProperty('--i', index));

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
    };

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    // 메뉴 안의 링크(또는 로고)를 누르면 닫고 해당 섹션으로 이동
    header.addEventListener('click', (event) => {
      if (isOpen() && event.target.closest('a[href^="#"]')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // 메뉴가 열려 있는 동안 포커스가 메뉴 밖으로 나가지 않도록
    document.addEventListener('focusin', (event) => {
      if (isOpen() && !header.contains(event.target)) toggle.focus();
    });

    // 데스크톱 크기로 바뀌면 자동으로 닫기
    mobileQuery.addEventListener('change', (event) => {
      if (!event.matches && isOpen()) setOpen(false);
    });
  }

  /* ---------------------------------------------------------
     4. 현재 섹션에 맞춰 내비게이션 활성화 (Scrollspy)
     --------------------------------------------------------- */
  function initScrollSpy() {
    const links = $$('.nav__link[href^="#"]');
    const sections = $$('main section[id]');
    if (!supportsObserver || !links.length) return;

    const setActive = (id) => {
      links.forEach((link) => {
        const active = link.hash === `#${id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    // 화면 중앙의 얇은 띠를 지나는 섹션을 현재 섹션으로 판단
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -54% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------------------------------------------------------
     5. 카드 위 마우스를 따라다니는 빛
     --------------------------------------------------------- */
  function initSpotlight() {
    if (!finePointer.matches) return;

    $$('[data-spotlight]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });
  }

  /* ---------------------------------------------------------
     6. 히어로 구체: 마우스 위치에 따른 은은한 3D 기울기
     --------------------------------------------------------- */
  function initOrbTilt() {
    const hero = $('.hero');
    const stage = $('[data-orb-stage]');
    if (!hero || !stage || !finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      stage.style.setProperty('--tilt-x', `${(-y * 10).toFixed(2)}deg`);
      stage.style.setProperty('--tilt-y', `${(x * 14).toFixed(2)}deg`);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      x = (event.clientX - rect.left) / rect.width - 0.5;
      y = (event.clientY - rect.top) / rect.height - 0.5;
      schedule();
    });

    hero.addEventListener('pointerleave', () => {
      x = 0;
      y = 0;
      schedule();
    });
  }

  /* ---------------------------------------------------------
     7. 히어로가 화면 밖이면 장식 애니메이션 일시정지 (성능)
     --------------------------------------------------------- */
  function initHeroPause() {
    const hero = $('.hero');
    if (!hero || !supportsObserver) return;

    new IntersectionObserver(([entry]) => {
      hero.classList.toggle('is-paused', !entry.isIntersecting);
    }).observe(hero);
  }

  /* ---------------------------------------------------------
     8. 프로젝트 링크 (SITE_CONFIG.projectLinks)
     --------------------------------------------------------- */
  function initProjectLinks() {
    $$('[data-project-link]').forEach((link) => {
      const url = String(SITE_CONFIG.projectLinks[link.dataset.projectLink] || '').trim();
      if (!url) return; // 비어 있으면 '링크 준비 중' 상태 유지

      const card = link.closest('.project');
      const title = card ? $('.project__title', card).textContent.trim() : '프로젝트';
      const label = $('[data-link-label]', link);

      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${title} 프로젝트 보기 (새 창)`);
      if (label) label.textContent = '프로젝트 보기';
    });
  }

  /* ---------------------------------------------------------
     9. Contact 이메일 버튼 (SITE_CONFIG.email)
     --------------------------------------------------------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // file:// 등 Clipboard API를 쓸 수 없는 환경을 위한 대체 방법
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(field);
      field.select();
      let copied = false;
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      field.remove();
      return copied;
    }
  }

  function initContact() {
    const button = $('[data-email-link]');
    if (!button) return;

    const email = String(SITE_CONFIG.email || '').trim();
    if (!EMAIL_PATTERN.test(email)) {
      console.info('[JIUKAE] js/script.js 상단의 SITE_CONFIG.email 에 이메일 주소를 입력하면 연락 버튼이 활성화됩니다.');
      return;
    }

    const text = $('[data-email-text]');
    const copyButton = $('[data-email-copy]');

    button.href = `mailto:${email}`;
    if (text) text.textContent = email;
    if (!copyButton) return;

    const defaultLabel = copyButton.textContent;
    let resetTimer = 0;

    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      const copied = await copyText(email);
      copyButton.textContent = copied ? '복사됨 ✓' : '복사 실패';
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        copyButton.textContent = defaultLabel;
      }, 2000);
    });
  }

  /* ---------------------------------------------------------
     10. 푸터 연도
     --------------------------------------------------------- */
  function initYear() {
    const year = String(new Date().getFullYear());
    $$('[data-year]').forEach((item) => {
      item.textContent = year;
    });
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  function init() {
    try {
      initReveal();
    } catch (error) {
      // 등장 애니메이션에 문제가 생기면 숨김 스타일을 해제해 콘텐츠를 항상 보여 줍니다.
      root.classList.remove('js');
      console.error('[JIUKAE] reveal 초기화 실패', error);
    }

    [
      initHeader,
      initMobileMenu,
      initScrollSpy,
      initSpotlight,
      initOrbTilt,
      initHeroPause,
      initProjectLinks,
      initContact,
      initYear,
    ].forEach((setup) => {
      try {
        setup();
      } catch (error) {
        console.error(`[JIUKAE] ${setup.name} 초기화 실패`, error);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
