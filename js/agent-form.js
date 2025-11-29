// agent-form.js
document.addEventListener('DOMContentLoaded', ()=>{
  const forms = document.querySelectorAll('#agent-form, #agent-form-kz');
  forms.forEach(f=>{
    f.addEventListener('submit', function(ev){
      ev.preventDefault();
      const name = f.querySelector('#agent-name').value.trim();
      const phone = f.querySelector('#agent-phone').value.trim();
      const city = f.querySelector('#agent-city').value.trim();
      const exp = f.querySelector('#agent-experience').value;
      const note = f.querySelector('#agent-note').value;

      // basic validation
      if(!name || !phone){
        alert('Пожалуйста, заполните имя и телефон.');
        return;
      }

      // Simulate send
      console.log('Agent registration', {name, phone, city, exp, note});
      const result = f.nextElementSibling || document.getElementById('agent-result');
      if(result){
        result.classList.remove('hidden');
        result.textContent = 'Заявка отправлена. Наш менеджер свяжется с вами в течение часа.';
      }
      // Reset form
      f.reset();
    });
  });
});
