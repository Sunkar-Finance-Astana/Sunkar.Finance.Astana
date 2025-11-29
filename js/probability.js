// js/probability.js
document.getElementById('calcBtn').addEventListener('click', () => {
  const inputs = document.querySelectorAll('#calcForm input, #calcForm select');
  let valid = true;
  inputs.forEach(el => { if (!el.value && el.hasAttribute('required')) valid = false; });

  if (!valid) return alert('Заполните все обязательные поля');

  // простая логика оценки (можно потом усложнить)
  let score = 85 + Math.floor(Math.random() * 15); // 85–99% для демо

  document.getElementById('percent').textContent = score + '%';
  document.getElementById('text').textContent = score > 80 ? 'Жоғары ықтималдық!' : 'Орташа, бірақ мүмкін';

  const fio = inputs[0].value;
  const phone = inputs[1].value;
  const service = inputs[3].options[inputs[3].selectedIndex].text;

  const msg = encodeURIComponent(`Салем! Хочу кредит\nФИО: \( {fio}\nТел: \){phone}\nУслуга: \( {service}\nРасчёт показал \){score}%`);
  document.getElementById('whatsappLink').href = `https://wa.me/77052606667?text=${msg}`;

  document.getElementById('result').style.display = 'block';
  document.getElementById('result').scrollIntoView({behavior: "smooth"});
});
