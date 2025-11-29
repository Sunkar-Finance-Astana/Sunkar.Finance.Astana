document.getElementById('calcBtn').onclick = () => {
  const service = document.getElementById('service').value;
  const amount = +document.getElementById('amount').value;
  const income = +document.getElementById('income').value;
  const payments = +document.getElementById('payments').value;
  const currentLate = document.getElementById('currentLate').value;
  const pastLate = document.getElementById('pastLate').value;
  const taxDebt = document.getElementById('taxDebt').value;

  let score = 100;

  // простая логика (можно усложнить)
  if (income < amount * 0.4) score -= 40;
  if (payments > income * 0.4) score -= 30;
  if (currentLate === '90') score -= 60;
  if (currentLate === '30') score -= 30;
  if (pastLate === 'more') score -= 30;
  if (taxDebt === 'yes') score -= 40;

  if (service.includes('mortgage')) {
    const deposit = +document.getElementById('deposit').value;
    if (deposit < amount * 0.2) score -= 20;
  }

  score = Math.max(0, Math.min(100, score));
  const percent = score + '%';

  document.getElementById('resultPercent').textContent = percent;
  document.getElementById('resultText').textContent = score > 70 ? 'Жоғары ықтималдық!' : score > 40 ? 'Орташа, бірақ мүмкін' : 'Төмен, бірақ біз көмектесеміз';
  
  const text = encodeURIComponent(`Салем! Мен ықтималдықты есептедім: \( {percent}\nФИО: \){document.getElementById('fio').value}\nТел: \( {document.getElementById('phone').value}\nҚызмет: \){document.getElementById('service').options[document.getElementById('service').selectedIndex].text}\nСома: ${amount} ₸`);
  document.getElementById('toWhatsBtn').href = `https://wa.me/77052606667?text=${text}`;

  document.getElementById('resultCard').style.display = 'block';
};
