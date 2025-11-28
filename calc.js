// calc.js
document.addEventListener('DOMContentLoaded', () => {
  const service = document.getElementById('service');
  const mortgageFields = document.getElementById('mortgageFields');
  if (service) {
    service.addEventListener('change', (e) => {
      if (e.target.value === 'mortgage') mortgageFields.style.display = 'block';
      else mortgageFields.style.display = 'none';
    });
  }

  // Probability calculation logic
  function computeProbability(data) {
    // Base score from income vs requested payment
    // monthly payment approximation: for consumer / car assume 5-year loan at 14% yearly => monthly rate approx
    // But we use simple heuristic score out of 100.

    let score = 50; // base

    // affordability ratio: desired monthly payment estimate
    const desiredSum = Number(data.sum) || 0;
    let estTermMonths = 60;
    if (data.service === 'mortgage') estTermMonths = 240; // 20 years
    if (data.service === 'car') estTermMonths = 60;
    if (data.service === 'refinance') estTermMonths = 60;
    if (data.service === 'consumer') estTermMonths = 60;

    // approximate monthly payment (simple): sum / months * (1 + 0.02 monthly interest)
    const monthlyEstimate = desiredSum / Math.max(1, estTermMonths) * 1.02;
    const income = Number(data.income) || 1;
    const payments = Number(data.payments) || 0;

    const dti = (monthlyEstimate + payments) / Math.max(1, income); // debt-to-income
    if (dti < 0.25) score += 25;
    else if (dti < 0.35) score += 10;
    else if (dti < 0.45) score += 0;
    else score -= 15;

    // income proof
    if (data.income_proof === 'yes') score += 10;
    else score -= 10;

    // delinquencies
    if (data.delinq === 'no') score += 10;
    else if (data.delinq === 'yes_small') score -= 5;
    else score -= 20;

    // employment
    if (data.employment === 'salaried') score += 8;
    else if (data.employment === 'self') score += 0;

    // mortgage-specific: first payment and market
    if (data.service === 'mortgage') {
      const down = Number(data.down) || 0;
      if (down >= 30) score += 10;
      else if (down >= 20) score += 5;
      else score -= 5;
      if (data.mortgage_type === 'primary') score += 5;
    }

    // clamp
    if (score > 98) score = 98;
    if (score < 2) score = 2;
    return Math.round(score);
  }

  // handle calc button
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const form = document.getElementById('probForm');
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      const percent = computeProbability(data);

      const result = document.getElementById('result');
      result.style.display = 'block';
      result.innerHTML = `Примерный шанс одобрения: <strong>${percent}%</strong>.<br>Рекомендуем: ${percent >= 60 ? 'Высокая вероятность' : (percent >= 35 ? 'Средняя' : 'Низкая')}.`;
      window.scrollTo({top: result.offsetTop - 80, behavior:'smooth'});
    });
  }

  // handle form submission to WhatsApp (probability form)
  const probForm = document.getElementById('probForm');
  if (probForm) {
    probForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(probForm);
      const data = Object.fromEntries(fd.entries());
      const percent = computeProbability(data);

      // build message
      let msg = `Заявка%20на%20оценку%20(%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%B8%D1%82%D0%B5%20%D0%B2%D0%B5%D1%80%D0%BE%D1%8F%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C%20%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B5%D0%BD%D0%B8%D1%8F)%0A`;
      msg += `ФИО: ${encodeURIComponent(data.name)}%0A`;
      msg += `Телефон: ${encodeURIComponent(data.phone)}%0A`;
      msg += `Город: ${encodeURIComponent(data.city)}%0A`;
      msg += `Услуга: ${encodeURIComponent(data.service)}%0A`;
      msg += `Сумма: ${encodeURIComponent(data.sum)}%0A`;
      msg += `Доход: ${encodeURIComponent(data.income)}%0A`;
      msg += `Текущие платежи: ${encodeURIComponent(data.payments)}%0A`;
      msg += `Предварительный шанс: ${percent}%25%0A`;

      const wa = `https://wa.me/77052606667?text=${msg}`;
      window.open(wa, '_blank');
    });
  }

  // agent form -> whatsapp message
  const agentForm = document.getElementById('agentForm');
  if (agentForm) {
    agentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(agentForm);
      const data = Object.fromEntries(fd.entries());
      let msg = `Заявка%20агента%0AФИО:%20${encodeURIComponent(data.name)}%0AГород:%20${encodeURIComponent(data.city)}%0AТелефон:%20${encodeURIComponent(data.phone)}`;
      window.open(`https://wa.me/77052606667?text=${msg}`, '_blank');
    });
  }

});
