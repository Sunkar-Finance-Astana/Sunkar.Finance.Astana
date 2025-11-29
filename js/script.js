// script.js — общие интерактивы (не трогает расчёты)
document.addEventListener('DOMContentLoaded', function(){
  // плавные ссылки
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const tgt = document.querySelector(a.getAttribute('href'));
      if(tgt) tgt.scrollIntoView({behavior:'smooth'});
    });
  });

  // визуальная лёгкая анимация логотипа (subtle)
  const logo = document.getElementById('visualLogo') || document.getElementById('visualLogoKZ');
  if(logo){
    let dir = 1;
    setInterval(()=> {
      logo.style.transform = `translateY(${dir * 2}px)`;
      dir = -dir;
    }, 2000);
  }

  // переключение видимости блока ипотеки на probability pages
  const service = document.getElementById('service');
  const mortgageBlock = document.getElementById('mortgageBlock');
  if(service && mortgageBlock){
    service.addEventListener('change', ()=> {
      mortgageBlock.style.display = service.value === 'mortgage' ? 'block' : 'none';
    });
  }

  const serviceKZ = document.getElementById('service_kz');
  const mortgageBlockKZ = document.getElementById('mortgageBlockKZ');
  if(serviceKZ && mortgageBlockKZ){
    serviceKZ.addEventListener('change', ()=> {
      mortgageBlockKZ.style.display = serviceKZ.value === 'mortgage' ? 'block' : 'none';
    });
  }
});
