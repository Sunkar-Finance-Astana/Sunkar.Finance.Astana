// probability.js
// Взвешенная модель для оценки вероятности одобрения.
// Выдает процент (0-100) и простые рекомендации.

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}

document.addEventListener('DOMContentLoaded',()=>{
  const form = document.querySelector('#prob-form') || document.querySelector('#prob-form-kz');
  if(!form) return;

  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    calculateProbability(form);
  });

  // enable mortgage fields toggle when page loads
  const sel = form.querySelector('#service');
  if(sel) sel.addEventListener('change', ()=> {
    const evt = new Event('change');
    sel.dispatchEvent(evt);
  });
});

function calculateProbability(form){
  // read fields (both RU & KZ forms use same ids)
  const name = form.querySelector('#name').value.trim();
  const phone = form.querySelector('#phone').value.trim();
  const city = form.querySelector('#city').value.trim();
  const service = form.querySelector('#service').value;
  const amount = Number(form.querySelector('#amount').value) || 0;
  const income = Number(form.querySelector('#income').value) || 0;
  const currentPayments = Number(form.querySelector('#currentPayments').value) || 0;
  const delays = form.querySelector('#delays').value;
  const collateral = form.querySelector('#collateral').value;
  const mortgageTypeEl = form.querySelector('#mortgage-type');
  const mortgageType = mortgageTypeEl ? mortgageTypeEl.value : null;
  const downpayment = Number(form.querySelector('#downpayment') ? form.querySelector('#downpayment').value : 0);

  // Scoring weights (sum = 100)
  //  - income ratio: 30
  //  - existing payments burden: 20
  //  - credit history delays: 20
  //  - collateral / LTV: 10
  //  - service-specific modifier: 10
  //  - completeness / contact presence: 10
  let score = 0;

  // 1) income ratio (ability to pay)
  // monthly payment estimate (rough) — simple annuity approximation:
  // assume term & rate based on service: (consumer ~24m@18%; mortgage ~240m@12%; auto ~60m@16%)
  let estMonthly = 0;
  if(service === 'mortgage'){
    const rate = 0.12/12;
    const n = 240; // months
    estMonthly = estimatePayment(amount, rate, n);
  } else if(service === 'auto'){
    const rate = 0.16/12;
    const n = 60;
    estMonthly = estimatePayment(amount, rate, n);
  } else {
    // consumer/refinance/business
    const rate = 0.18/12;
    const n = 24;
    estMonthly = estimatePayment(amount, rate, n);
  }

  // Income ratio = (income - currentPayments) / (estMonthly + small buffer)
  const available = Math.max(0, income - currentPayments);
  const ratio = estMonthly > 0 ? available / (estMonthly + 1) : 0;
  // ratio threshold: >=2 is great, >=1 is ok, <1 is weak
  let incomeScore = 0;
  if(ratio >= 2) incomeScore = 30;
  else if(ratio >= 1.2) incomeScore = 20;
  else if(ratio >= 0.8) incomeScore = 10;
  else incomeScore = 3;
  score += incomeScore;

  // 2) burden of existing payments
  const burden = (currentPayments / Math.max(1, income));
  let burdenScore = 0;
  if(burden <= 0.2) burdenScore = 20;
  else if(burden <= 0.35) burdenScore = 12;
  else if(burden <= 0.5) burdenScore = 6;
  else burdenScore = 2;
  score += burdenScore;

  // 3) credit history delays
  let delayScore = 0;
  if(delays === 'no') delayScore = 20;
  else if(delays === 'small') delayScore = 6;
  else if(delays === 'large') delayScore = 0;
  score += delayScore;

  // 4) collateral
  let collScore = 0;
  if(collateral === 'realty') collScore = 10;
  else if(collateral === 'auto') collScore = 8;
  else collScore = 2;
  score += collScore;

  // 5) service modifiers
  let serviceMod = 0;
  if(service === 'mortgage'){
    // mortgage requires LTV check via downpayment
    let dp = Math.max(0, Math.min(100, downpayment));
    if(dp >= 30) serviceMod = 10;
    else if(dp >= 20) serviceMod = 6;
    else serviceMod = 2;
    // secondary market slightly stricter
    if(mortgageType === 'secondary') serviceMod -= 1;
  } else if(service === 'consumer'){
    serviceMod = 10;
  } else if(service === 'refinance'){
    serviceMod = 8;
  } else if(service === 'business'){
    serviceMod = 6;
  } else if(service === 'auto'){
    serviceMod = 8;
  }
  score += serviceMod;

  // 6) completeness/contact — if name/phone present
  let contactScore = 0;
  if(name && phone) contactScore = 10;
  else if(name || phone) contactScore = 5;
  score += contactScore;

  // final clamp and categories
  score = Math.round(clamp(score, 0, 100));
  const resultEl = document.getElementById('prob-result') || form.querySelector('#prob-result');
  const scoreEl = document.getElementById('score') || resultEl.querySelector('#score');
  const adviceEl = document.getElementById('advice') || resultEl.querySelector('#advice');

  // Advice logic
  let advice = '';
  if(score >= 75){
    advice = 'Высокая вероятность одобрения — подготовьте документы. Рекомендуем: отправить заявку и договориться о встрече.';
  } else if(score >= 50){
    advice = 'Средняя вероятность. Улучшите соотношение дохода/платежа или предоставьте подтверждение доходов и/или залог.';
  } else {
    advice = 'Низкая вероятность — рассмотрите рефинансирование, снижение суммы, или добавление залога / подтверждение дохода.';
  }

  // Show result
  if(resultEl) resultEl.classList.remove('hidden');
  if(scoreEl) {
    scoreEl.textContent = score + '%';
    scoreEl.className = '';
    if(score >= 75) scoreEl.classList.add('score-high');
    else if(score >= 50) scoreEl.classList.add('score-medium');
    else scoreEl.classList.add('score-low');
  }
  if(adviceEl) adviceEl.textContent = advice;

  // For now: console log (replace with actual submit via fetch when backend available)
  console.log({name, phone, city, service, amount, income, currentPayments, delays, collateral, mortgageType, downpayment, score});
  // optionally show alert
  // alert("Вероятность: " + score + "%");
}

// simple annuity payment estimator
function estimatePayment(P, monthlyRate, n){
  if(P <= 0 || n <= 0) return 0;
  if(monthlyRate <= 0) return P / n;
  const r = monthlyRate;
  const payment = P * (r / (1 - Math.pow(1 + r, -n)));
  return Math.max(0, payment);
}
