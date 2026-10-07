/* Progressive enhancement: the page stays readable without this module. */
export function initScrollMotion() {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.querySelector('.scroll-progress');
  if (!progress) return;
  const cue = document.querySelector('.scroll-cue');
  const pending = new Set(), running = new Map();
  const groups = '.section-heading, .solution, .sectors, .planner-heading, .service-intro, .services-list article, .process-grid li, .consultation-grid > div, .consultation-form, .faq-grid > div:first-child, .faq-list details, .final-cta-inner';
  let frame = 0;

  function finish(element) {
    pending.delete(element); observer.unobserve(element);
    const animation = running.get(element);
    running.delete(element); animation?.cancel();
    element.style.removeProperty('opacity');
    element.style.removeProperty('transform');
    element.removeAttribute('data-scroll-pending');
  }
  const observer = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting && pending.has(entry.target));
    entering.forEach((entry, i) => {
      const element = entry.target;
      observer.unobserve(element); pending.delete(element);
      if (reduced.matches) { finish(element); return; }
      const animation = element.animate([
        { opacity: 0, transform: 'translateY(22px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 620, delay: Math.min(i * 70, 210), easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' });
      running.set(element, animation);
      animation.finished.then(() => finish(element), () => {});
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });

  function prepare() {
    if (reduced.matches) return;
    document.querySelectorAll(groups).forEach(element => {
      // Keep the current viewport and already passed content immediately readable.
      if (element.getBoundingClientRect().top < innerHeight * .94) return;
      element.style.opacity = '0'; element.style.transform = 'translateY(22px)';
      element.setAttribute('data-scroll-pending', ''); pending.add(element); observer.observe(element);
    });
  }
  function updateProgress() {
    frame = 0;
    const range = document.documentElement.scrollHeight - innerHeight;
    const fraction = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
  }
  function scheduleProgress() { if (!frame) frame = requestAnimationFrame(updateProgress); }
  function removeMotion() {
    if (reduced.matches) [...pending, ...running.keys()].forEach(finish);
    if (cue) cue.classList.toggle('cue-in-view', !reduced.matches && cue.getBoundingClientRect().bottom > 0);
  }
  const cueObserver = new IntersectionObserver(entries => {
    if (cue) cue.classList.toggle('cue-in-view', entries[0].isIntersecting && !reduced.matches);
  });
  if (cue) cueObserver.observe(cue);
  // Keyboard users never have to wait for a control to become visible.
  document.addEventListener('focusin', event => {
    [...pending, ...running.keys()].forEach(element => { if (element.contains(event.target)) finish(element); });
  });
  reduced.addEventListener('change', removeMotion);
  addEventListener('scroll', scheduleProgress, { passive: true });
  addEventListener('resize', scheduleProgress, { passive: true });
  if ('ResizeObserver' in window) {
    const layoutObserver = new ResizeObserver(scheduleProgress);
    layoutObserver.observe(document.body);
  }
  document.addEventListener('toggle', scheduleProgress, true);
  progress.hidden = false; prepare(); updateProgress();
}
