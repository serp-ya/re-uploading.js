const preloader = document.getElementById('loader');

preloader.show = () => preloader.style.display = 'inline';
preloader.hide = () => preloader.style.display = 'none';

export { preloader };