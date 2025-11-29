// script.js — простая логика, не ломает навигацию.
// Показываем/скрываем mortgage-extra если выбрано mortgage
document.addEventListener('DOMContentLoaded', function(){
  const serviceSelects = document.querySelectorAll('#service');
  serviceSelects.forEach(sel=>{
    sel && sel.addEventListener('change', onServiceChange);
  });

  function onServiceChange(e){
    const val = e.target.value;
    const form = e.target.closest('form');
    if(!form) return;
    const mortgageExtra = form.querySelector('#mortgage-extra');
    if(mortgageExtra){
      if(val === 'mortgage'){
        mortgageExtra.classList.remove('hidden');
      } else {
        mortgageExtra.classList.add('hidden');
      }
    }
  }

  // for pages loaded with the select already set
  document.querySelectorAll('form').forEach(form => {
    const sel = form.querySelector('#service');
    if(sel) sel.dispatchEvent(new Event('change'));
  });
});
