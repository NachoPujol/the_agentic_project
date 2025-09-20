// Mobile drawer
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');

if (menuBtn && drawer) {
  menuBtn.addEventListener('click', () => {
    const open = drawer.style.display === 'flex';
    drawer.style.display = open ? 'none' : 'flex';
  });
  // Close drawer on nav click (mobile)
  drawer.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => drawer.style.display = 'none')
  );
}

// Optional: enable click-drag on horizontal episodes rail for mouse users
const rail = document.querySelector('.cards__rail');
if (rail){
  let isDown = false, startX = 0, scrollLeft = 0;
  rail.addEventListener('mousedown', e => {
    isDown = true; rail.classList.add('grabbing');
    startX = e.pageX - rail.offsetLeft; scrollLeft = rail.scrollLeft;
  });
  ['mouseleave','mouseup'].forEach(evt => rail.addEventListener(evt, () => {
    isDown = false; rail.classList.remove('grabbing');
  }));
  rail.addEventListener('mousemove', e => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - rail.offsetLeft;
    const walk = (x - startX) * 1.1;
    rail.scrollLeft = scrollLeft - walk;
  });
}

// Make logo marquee seamless by duplicating one full set
const marquee = document.querySelector('.logos__track');
if (marquee && !marquee.dataset.cloned) {
  marquee.innerHTML += marquee.innerHTML;  // now the track has 2 identical sets
  marquee.dataset.cloned = 'true';
}

// Auto-close drawer on desktop
window.addEventListener('resize', () => {
  if (window.innerWidth >= 900 && drawer) {
    drawer.style.display = 'none';
  }
});
// --- YouTube modal open/close ---
const modal = document.getElementById('videoModal');
const playerHost = modal?.querySelector('.modal__player');

function openVideo(id){
  if (!modal || !playerHost) return;
  const src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  playerHost.innerHTML = `<iframe src="${src}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  modal.hidden = false;
}

function closeVideo(){
  if (!modal || !playerHost) return;
  modal.hidden = true;
  playerHost.innerHTML = ""; // remove iframe to stop playback
}

// Click thumbnail or play button
document.querySelectorAll('.episode__media').forEach(el => {
  el.addEventListener('click', () => {
    const id = el.getAttribute('data-video-id');
    if (id) openVideo(id);
  });
});

// Close on backdrop or X
modal?.addEventListener('click', (e) => {
  if (e.target.matches('[data-close-modal], .modal__backdrop')) closeVideo();
});

// Close on ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeVideo();
});

// --- Guest application form -> Formspree ---
(function(){
  const form = document.getElementById('guestForm');
  if (!form) return;

  const btn = document.getElementById('applyBtn');
  const msg = document.getElementById('applyMsg');
  const endpoint = 'https://formspree.io/f/xblanpvl'; // ← replace

  function setState(state, text){
    btn.disabled = state !== 'idle';
    btn.textContent = text;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // basic client validation
    if (!form.reportValidity()) return;

    setState('loading', 'Submitting…');

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      job: form.job.value.trim(),
      website: form.website.value.trim(),
      _subject: 'New Guest Application — The Agentic Project',
      // Optional metadata for your inbox filtering:
      _template: 'table'
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setState('idle', 'Application submitted ✔');
        msg.textContent = "Thanks! We'll get back to you soon.";
        form.reset();
        // style success
        btn.classList.remove('btn--error');
      } else {
        throw new Error('Network response not ok');
      }
    } catch (err) {
      setState('idle', 'Try again');
      msg.textContent = "Application failed. Please try again.";
      btn.classList.add('btn--error');
    }
  });
})();



