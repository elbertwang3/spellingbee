let els = document.querySelectorAll("a[href='/user-agreement']");
console.log('el', els);
if (els.length > 0) {
  els[0].setAttribute('href', '/bee-user-agreement');
}