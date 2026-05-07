document.addEventListener('DOMContentLoaded', () => {

  // ===== TABLE SORTING =====
  document.querySelectorAll('table.sortable').forEach(table => {
    const headers = table.querySelectorAll('thead th');
    headers.forEach((th, colIdx) => {
      const icon = document.createElement('span');
      icon.className = 'sort-icon';
      icon.textContent = '\u21C5';
      th.appendChild(icon);

      th.addEventListener('click', () => {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAsc = th.classList.contains('sort-asc');

        headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
        th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');

        rows.sort((a, b) => {
          const aVal = a.children[colIdx]?.textContent.trim() || '';
          const bVal = b.children[colIdx]?.textContent.trim() || '';
          const aNum = parseFloat(aVal.replace(/[^\d.\-]/g, ''));
          const bNum = parseFloat(bVal.replace(/[^\d.\-]/g, ''));
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? bNum - aNum : aNum - bNum;
          }
          return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        });

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  });

  // ===== FILTER BUTTONS =====
  document.querySelectorAll('.filter-bar').forEach(bar => {
    const btns = bar.querySelectorAll('.filter-btn');
    const table = bar.closest('.section-inner').querySelector('table');
    if (!table) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        table.querySelectorAll('tbody tr').forEach(row => {
          if (filter === 'all') {
            row.style.display = '';
          } else {
            row.style.display = row.dataset.type === filter ? '' : 'none';
          }
        });
      });
    });
  });

  // ===== CONTENT TABS =====
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // ===== COPY BIBTEX =====
  const copyBtn = document.getElementById('copy-bibtex');
  const bibtexCode = document.getElementById('bibtex-code');
  if (copyBtn && bibtexCode) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(bibtexCode.textContent).then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy BibTeX';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  // ===== VERSION TOGGLE =====
  const versionBtns = document.querySelectorAll('[data-version]:not(tr)');
  const infoBox = document.getElementById('leaderboard-info');
  const mainTable = document.getElementById('main-table');
  if (versionBtns.length && mainTable) {
    versionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const ver = btn.dataset.version;
        // Update active button
        versionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Update info box
        if (infoBox) {
          infoBox.innerHTML = infoBox.innerHTML.replace(/v20260[23]/g, ver);
        }
        // Show/hide rows; also respect category filter
        const catFilter = document.querySelector('.filter-btn[data-filter].active');
        const cat = catFilter ? catFilter.dataset.filter : 'all';
        mainTable.querySelectorAll('tbody tr').forEach(row => {
          const rowVer = row.dataset.version;
          const rowType = row.dataset.type;
          const verMatch = rowVer === ver;
          const catMatch = cat === 'all' || rowType === cat;
          row.style.display = (verMatch && catMatch) ? '' : 'none';
        });
      });
    });
    // Also update category filter to respect version
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
      const origHandler = btn.onclick;
      btn.addEventListener('click', () => {
        const activeVer = document.querySelector('[data-version].active:not(tr)');
        const ver = activeVer ? activeVer.dataset.version : 'v202602';
        const cat = btn.dataset.filter;
        mainTable.querySelectorAll('tbody tr').forEach(row => {
          const rowVer = row.dataset.version;
          const rowType = row.dataset.type;
          const verMatch = rowVer === ver;
          const catMatch = cat === 'all' || rowType === cat;
          row.style.display = (verMatch && catMatch) ? '' : 'none';
        });
      });
    });
  }

  // ===== MORE RESEARCH DROPDOWN =====
  const moreToggle = document.getElementById('more-research-toggle');
  const moreWrap = moreToggle?.closest('.more-research-wrap');
  if (moreToggle && moreWrap) {
    moreToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      moreWrap.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!moreWrap.contains(e.target)) {
        moreWrap.classList.remove('open');
      }
    });
  }

  // ===== MOBILE NAV =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ===== NAV HIGHLIGHT ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -70% 0px' });

  sections.forEach(sec => observer.observe(sec));

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.section-inner');
  reveals.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));
});
