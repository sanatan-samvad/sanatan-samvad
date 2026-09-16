const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      links.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
      link?.classList.add('active');
    }
  });
}, {rootMargin:'-40% 0px -50% 0px'});
sections.forEach(s => observer.observe(s));
