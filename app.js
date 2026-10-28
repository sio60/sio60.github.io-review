'use strict';

(() => {
  const PAGE_SIZE = 9;
  const $ = selector => document.querySelector(selector);
  const grid = $('#review-grid');
  const search = $('#search-input');
  const sort = $('#sort-select');
  const dialog = $('#review-dialog');
  const more = $('#load-more');
  const reviews = (window.HIMEDIA_REVIEWS?.reviews || []).map((review, index) => ({...review, index}));
  const state = { query: '', topic: 'all', sort: 'newest', visible: PAGE_SIZE };
  let lastFocused = null;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function showReview(review, updateUrl = true) {
    if (!review) return;
    const content = el('div', 'dialog-content-inner');
    content.append(el('div', 'dialog-course', review.course));
    const title = el('h2', '', review.title);
    title.id = 'dialog-title';
    content.append(title);
    content.append(el('div', 'dialog-meta', [review.author, review.cohort, review.publishedAt?.replaceAll('-', '.')].filter(Boolean).join(' · ')));
    const body = el('div', 'dialog-body');
    review.body.split(/\n\s*\n/).forEach(paragraph => body.append(el('p', '', paragraph)));
    content.append(body);
    const tags = el('div', 'dialog-tags');
    (review.tags || []).forEach(tag => tags.append(el('span', '', tag)));
    content.append(tags);
    $('#dialog-content').replaceChildren(content);
    lastFocused = document.activeElement;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
    $('#close-dialog').focus();
    if (updateUrl) history.replaceState(null, '', `#review=${encodeURIComponent(review.id)}`);
  }

  function card(review) {
    const button = el('button', 'review-card');
    button.type = 'button';
    button.setAttribute('aria-label', `${review.title} — 후기 전체 읽기`);
    const topline = el('span', 'card-topline');
    const leadTopic = review.tags.includes('프로젝트') ? '프로젝트 · 성장 이야기' : '성장 이야기';
    topline.append(el('span', 'card-topic', leadTopic), el('span', 'card-number', String(review.index + 1).padStart(2, '0')));
    button.append(topline, el('h3', '', review.title), el('p', 'excerpt', review.body));
    const footer = el('span', 'card-footer');
    const author = el('span', 'author');
    author.append(el('span', '', review.author), el('span', '', review.course));
    const arrow = el('span', 'arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    footer.append(author, arrow);
    button.append(footer);
    button.addEventListener('click', () => showReview(review));
    return button;
  }

  function render() {
    const words = state.query.toLocaleLowerCase('ko').trim().split(/\s+/).filter(Boolean);
    const filtered = reviews.filter(review => {
      if (state.topic !== 'all' && !review.tags.includes(state.topic)) return false;
      const text = [review.title, review.body, review.course, review.author, review.cohort, ...review.tags].join(' ').toLocaleLowerCase('ko');
      return words.every(word => text.includes(word));
    }).sort((a, b) => {
      const comparison = (a.publishedAt || '').localeCompare(b.publishedAt || '');
      return (state.sort === 'oldest' ? comparison : -comparison) || a.index - b.index;
    });
    const active = !!state.query.trim() || state.topic !== 'all';
    $('#total-count').textContent = reviews.length;
    $('#result-count').textContent = active ? `검색 결과 ${filtered.length}개 · 전체 ${reviews.length}개` : `전체 ${reviews.length}개의 이야기`;
    $('#reset-filters').hidden = !active;
    grid.replaceChildren(...filtered.slice(0, state.visible).map(card));
    $('#empty-state').hidden = filtered.length > 0;
    more.hidden = filtered.length <= state.visible;
    more.textContent = `후기 더 보기 (${Math.min(state.visible, filtered.length)} / ${filtered.length}) ↓`;
    document.querySelectorAll('[data-topic]').forEach(button => {
      const selected = button.dataset.topic === state.topic;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function resetFilters() {
    state.query = '';
    state.topic = 'all';
    state.visible = PAGE_SIZE;
    search.value = '';
    render();
  }

  function openHash() {
    if (!location.hash.startsWith('#review=')) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(8)); } catch { return; }
    showReview(reviews.find(review => review.id === id), false);
  }

  $('#search-form').addEventListener('submit', event => event.preventDefault());
  search.addEventListener('input', () => { state.query = search.value; state.visible = PAGE_SIZE; render(); });
  sort.addEventListener('change', () => { state.sort = sort.value; state.visible = PAGE_SIZE; render(); });
  document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => { state.topic = button.dataset.topic; state.visible = PAGE_SIZE; render(); }));
  document.querySelectorAll('[data-review]').forEach(button => button.addEventListener('click', () => showReview(reviews.find(review => review.id === button.dataset.review))));
  $('#reset-filters').addEventListener('click', resetFilters);
  $('#empty-action').addEventListener('click', resetFilters);
  more.addEventListener('click', () => { state.visible += PAGE_SIZE; render(); });
  $('#close-dialog').addEventListener('click', () => dialog.close());
  $('#back-to-list').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (location.hash.startsWith('#review=')) history.replaceState(null, '', '#reviews');
    if (lastFocused?.isConnected) lastFocused.focus();
  });
  window.addEventListener('hashchange', () => {
    if (!location.hash.startsWith('#review=') && dialog.open) dialog.close();
    else openHash();
  });
  render();
  openHash();
})();
