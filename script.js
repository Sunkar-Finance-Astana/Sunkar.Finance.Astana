// script.js — Sunkar Finance
// Настройка — поменяй номер здесь если нужно
const DEFAULT_PHONE = '+77052606667'; // <-- легко заменить

document.addEventListener('DOMContentLoaded', ()=>{

  // set whatsapp links
  function setWhatsAppLinks(phone){
    const href = `https://wa.me/${phone.replace(/\D/g,'')}`;
    const w = document.getElementById('whatsapp-link');
    const wf = document.getElementById('footer-whatsapp');
    const wb = document.getElementById('whatsapp-bubble');
    if(w) { w.href = href; w.textContent = phone; w.target='_blank' }
    if(wf){ wf.href = href; wf.textContent = phone; wf.target='_blank' }
    if(wb){ wb.href = href; wb.target='_blank' }
  }
  setWhatsAppLinks(DEFAULT_PHONE);

  // hero buttons open calculator
  const openCalcBtns = [document.getElementById('btn-calc'), document.getElementById('hero-calc')];
  openCalcBtns.forEach(b => { if(b) b.addEventListener('click', ()=>{ location.hash = '#calculator'; window.scrollTo({top: document.getElementById('calculator').offsetTop-20, behavior:'smooth'}) }) });

  // Map 2GIS link — if you have link, set here
  document.getElementById('open-2gis')?.addEventListener('click', (e)=>{
    e.preventDefault();
    window.open('https://2gis.kz/astana/search/sunkar%20finance', '_blank');
  });

  // show/hide mortgage block
  const serviceSelect = document.getElementById('service-select');
  const mortgageBlock = document.getElementById('mortgage-block');
  serviceSelect?.addEventListener('change', (e)=>{
    if(e.target.value === 'mortgage'){
      mortgageBlock.style.display = 'block';
    } else mortgageBlock.style.display = 'none';
  });

  // FORM: probability calculation
  const form = document.getElementById('prob-form');
  form?.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const resultEl = document.getElementById('calc-result');

    // Parse numeric fields
    const amount = Number(data.amount || 0);
    const income = Number(data.income || 0);
    const payments = Number(data.payments || 0);
    const downPercent = Number(data.mortgage_down || 0);
    const service = data.service || 'consumer';
    const pastDue90 = Number(data.past_due_90 || 0);
    const pastDue90plus = Number(data.past_due_90plus || 0);

    // Base score 70 (out of 100)
    let score = 70;

    // DTI (debt-to-income)
    const monthlyPaymentEstimate = estimateMonthlyPayment(amount, service, downPercent);
    const totalMonthlyObligations = payments + monthlyPaymentEstimate;
    const dti = income>0 ? totalMonthlyObligations / income : 1;
    // DTI effect
    if(dti < 0.3) score += 10;
    else if(dti < 0.45) score += 4;
    else if(dti < 0.6) score -= 6;
    else score -= 18;

    // overdue adjustments (90 days recent)
    score -= pastDue90 * 6; // each short overdue -6
    score -= pastDue90plus * 20; // each long overdue -20

    // service-specific adjustments
    if(service === 'mortgage'){
      // mortgage stricter: initial downpayment helps
      if(downPercent >= 30) score += 8;
      else if(downPercent >= 20) score += 4;
      else if(downPercent >= 10) score += 0;
      else score -= 6;
      // additional check: mortgage monthly payment calc
      if(monthlyPaymentEstimate > income*0.6) score -= 12;
    } else if(service === 'consumer'){
      // consumer loans more forgiving
      if(dti < 0.4) score += 6;
      if(amount < income*6) score += 4;
    } else if(service === 'secured'){
      score += 6; // collateral reduces risk
    } else if(service === 'refinance'){
      // refinance depends on credit history
      if(pastDue90 + pastDue90plus === 0) score += 6;
      else score -= 8;
    } else if(service === 'ip_too'){
      // businesses: need docs — slightly lower base
      score -= 4;
      if(income>300000) score += 6;
    } else if(service === 'auto'){
      score += 2;
      if(amount < income*8) score += 4;
    }

    // min/max clamp
    if(score > 95) score = 95;
    if(score < 6) score = 6;

    // Convert to percent and message
    const percent = Math.round(score);
    // advice composition
    let advice = [];
    if(percent >= 75) advice.push("Высокие шансы одобрения. Рекомендуем подготовить документы и подавать заявку.");
    else if(percent >= 50) advice.push("Средний шанс. Устраните просрочки и уменьшите DTI: снизьте текущие платежи или увеличьте доход.");
    else advice.push("Низкий шанс. Рекомендуем взять поручителя, внести больший первоначальный взнос или отложить заявку.");

    // mortgage special note
    if(service === 'mortgage'){
      advice.push("Ипотека: укажите точную информацию о взносе и рынке (первичный/вторичный) — это сильно влияет на условия.");
    }

    resultEl.style.display = 'block';
    resultEl.innerHTML = `<strong>Вероятность одобрения: ${percent}%</strong><br><small>Оценка основана на DTI (${Math.round(dti*100)}%), истории просрочек и типе услуги.</small><div style="margin-top:8px">${advice.join(' ')}</div>`;

    // optional: build whatsapp message
    const msg = encodeURIComponent(`Заявка Sunkar Finance\nИмя: ${data.name}\nТелефон: ${data.phone}\nГород: ${data.city}\nУслуга: ${service}\nСумма: ${amount}\nДоход: ${income}\nВероятность: ${percent}%\nПримечание: ${data.note||'-'}`);
    const waURL = `https://wa.me/${DEFAULT_PHONE.replace(/\D/g,'')}?text=${msg}`;
    // show quick link
    resultEl.innerHTML += `<div style="margin-top:12px"><a class="btn primary" href="${waURL}" target="_blank">Отправить заявку в WhatsApp</a></div>`;
  });

  // agent form handling
  document.getElementById('agent-form')?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    // create WA message for agent registration
    const msg = encodeURIComponent(`Регистрация агента\nИмя: ${data.name}\nГород: ${data.city}\nТел: ${data.phone}\nПрим: ${data.note||'-'}`);
    const wa = `https://wa.me/${DEFAULT_PHONE.replace(/\D/g,'')}?text=${msg}`;
    window.open(wa, '_blank');
    document.getElementById('agent-result').style.display='block';
    document.getElementById('agent-result').textContent='Спасибо — открывается WhatsApp для отправки заявки. Мы свяжемся с вами.';
  });

  // helper: estimate monthly payment (very rough) — for scoring, not banking-accurate
  function estimateMonthlyPayment(sum, service, downPercent){
    // conservative estimate using 12% annual for consumer, 10% for mortgage secured, 14% for ip etc.
    let apr=0.12;
    if(service==='mortgage') apr = 0.10;
    if(service==='secured') apr = 0.11;
    if(service==='refinance') apr = 0.115;
    if(service==='ip_too') apr = 0.14;
    if(service==='auto') apr = 0.125;
    const months = (service==='mortgage') ? 240 : 60;
    // reduce principal by down payment
    const principal = sum * (1 - (downPercent || 0)/100);
    const monthlyRate = apr/12;
    // annuity formula
    if(principal<=0) return 0;
    const payment = principal * (monthlyRate / (1 - Math.pow(1+monthlyRate, -months)));
    return Math.round(payment);
  }

  // ensure footer social links open
  document.getElementById('2gis-footer')?.addEventListener('click', (e)=>{ e.preventDefault(); window.open('https://2gis.kz/astana/search/sunkar%20finance', '_blank'); });

});
