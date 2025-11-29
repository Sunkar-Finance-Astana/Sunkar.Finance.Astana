// probability.js
// Универсальная логика расчёта вероятности
(function(){
  // helper to get element by id safe
  function $id(id){ return document.getElementById(id); }

  // common function: compute percent based on inputs (returns {percent, message})
  function computeProbability(params){
    // params: {service, amount, income, payments, currentLate, pastLate, deposit, mortgageType}
    // базовый алгоритм — взят базовый рейтинг 50 и применены штрафы/бонусы
    let score = 50;

    const amount = Number(params.amount) || 0;
    const income = Number(params.income) || 0;
    const payments = Number(params.payments) || 0;
    const service = params.service || '';
    const currentLate = params.currentLate || 'no';
    const pastLate = params.pastLate || 'no';
    const deposit = Number(params.deposit) || 0;
    const mortgageType = params.mortgageType || 'primary';

    // 1) monthly estimate: years depend on service
    let years = 5;
    if(service === 'mortgage') years = 20;
    if(service === 'auto') years = 5;
    if(service === 'business') years = 3;
    if(service === 'refinance') years = 5;

    // monthly estimate (approx)
    const monthlyEstimate = amount > 0 ? Math.round((amount / (years * 12)) * 1.02) : 0;

    // income coverage
    if(income <= 0){
      score -= 30;
    } else {
      const ratio = monthlyEstimate / income; // lower better
      if(ratio < 0.18) score += 20;
      else if(ratio < 0.33) score += 8;
      else if(ratio < 0.5) score += 0;
      else score -= Math.round((ratio - 0.5) * 60);
    }

    // debt burden (DTI)
    if(income > 0){
      const debtLoad = payments / income;
      if(debtLoad < 0.2) score += 8;
      else if(debtLoad < 0.35) score += 0;
      else score -= Math.round((debtLoad - 0.35) * 100);
    }

    // service weights
    const weights = {
      'unsecured_no_income': -7,
      'unsecured_with_income': 4,
      'secured': 6,
      'mortgage': 2,
      'business': -2,
      'auto': 2,
      'refinance': 6,
      '': 0
    };
    score += (weights[service] || 0);

    // late payments penalties
    if(currentLate === '30') score -= 18;
    if(currentLate === '90') score -= 28;
    if(currentLate === 'closed') score -= 8;
    if(pastLate === '90') score -= 8;
    if(pastLate === 'more') score -= 16;

    // loan > many times income penalty
    if(income > 0 && amount > income * 60) score -= 8;

    // mortgage deposit bonus
    if(service === 'mortgage'){
      const depRatio = deposit > 0 ? deposit / amount : 0;
      if(depRatio >= 0.2) score += 10;
      else if(depRatio >= 0.1) score += 4;
      else score -= 4;
      if(mortgageType === 'primary') score += 3;
    }

    // clamp and random small noise
    let percent = Math.round(Math.max(3, Math.min(98, score)));
    // message
    let msg = '';
    if(percent >= 80) msg = 'Очень высокая вероятность одобрения. Рекомендуем отправить заявку менеджеру.';
    else if(percent >= 60) msg = 'Хорошая вероятность. Возможны небольшие условия.';
    else if(percent >= 40) msg = 'Средняя вероятность — могут потребоваться дополнительные документы.';
    else msg = 'Низкая вероятность. Советуем улучшить параметры (увеличить доход/первоначальный взнос или уменьшить сумму).';

    return {percent, msg, monthlyEstimate};
  }

  // RU form
  const calcBtn = $id('calcBtn');
  if(calcBtn){
    calcBtn.addEventListener('click', ()=> {
      const params = {
        service: $id('service').value,
        amount: $id('amount').value,
        income: $id('income').value,
        payments: $id('payments').value,
        currentLate: $id('currentLate').value,
        pastLate: $id('pastLate').value,
        deposit: $id('deposit') ? $id('deposit').value : 0,
        mortgageType: $id('mortgageType') ? $id('mortgageType').value : 'primary'
      };
      const fio = encodeURIComponent($id('fio').value || 'Клиент');
      const phone = encodeURIComponent($id('phone').value || '');
      const city = encodeURIComponent($id('city').value || '');
      const result = computeProbability(params);
      // render
      $id('resultPercent').innerText = result.percent + '%';
      $id('resultText').innerText = result.msg + ' Рекомендованная примерная месячная выплата: ' + result.monthlyEstimate + ' ₸.';
      $id('resultCard').style.display = 'block';
      // prepare WhatsApp link (your manager number)
      const serviceLabel = encodeURIComponent(document.querySelector('#service option:checked').textContent);
      const waText = `Заявка Sunkar Finance.%0AИмя:%20${fio}%0AТел:%20${phone}%0AГород:%20${city}%0AУслуга:%20${serviceLabel}%0AСумма:%20${params.amount}%20₸%0AВероятность:%20${result.percent}%25`;
      $id('toWhatsBtn').href = `https://wa.me/77052606667?text=${waText}`;
    });
  }

  const resetBtn = $id('resetBtn');
  if(resetBtn) resetBtn.addEventListener('click', ()=> location.reload());

  // KZ form (reuse computeProbability)
  const calcBtnKZ = $id('calcBtnKZ');
  if(calcBtnKZ){
    calcBtnKZ.addEventListener('click', ()=>{
      const params = {
        service: $id('service_kz').value,
        amount: $id('amount_kz').value,
        income: $id('income_kz').value,
        payments: $id('payments_kz').value,
        currentLate: $id('currentLate_kz').value,
        pastLate: $id('pastLate_kz').value,
        deposit: $id('deposit_kz') ? $id('deposit_kz').value : 0,
        mortgageType: $id('mortgageType_kz') ? $id('mortgageType_kz').value : 'primary'
      };
      const fio = encodeURIComponent($id('fio_kz').value || 'Клиент');
      const phone = encodeURIComponent($id('phone_kz').value || '');
      const city = encodeURIComponent($id('city_kz').value || '');
      const result = computeProbability(params);
      $id('resultPercentKZ').innerText = result.percent + '%';
      $id('resultTextKZ').innerText = (function(){
        if(result.percent >= 80) return 'Өте жоғары ықтималдық. Өтінішті жіберіңіз.';
        if(result.percent >= 60) return 'Жақсы ықтималдық. Аздаған шарттар болуы мүмкін.';
        if(result.percent >= 40) return 'Орташа ықтималдық — қосымша құжаттар қажет болуы мүмкін.';
        return 'Төмен ықтималдық. Параметрлерді жақсарту ұсынылады.';
      })() + ' ' + 'Шамалаған ай сайынғы төлем: ' + result.monthlyEstimate + ' ₸.';
      $id('resultCardKZ').style.display = 'block';
      const serviceLabel = encodeURIComponent(document.querySelector('#service_kz option:checked').textContent);
      const waText = `Sunkar Finance өтініші.%0AАты:%20${fio}%0AТел:%20${phone}%0AҚала:%20${city}%0AҚызмет:%20${serviceLabel}%0AСома:%20${params.amount}%20₸%0AЫқтималдық:%20${result.percent}%25`;
      $id('toWhatsBtnKZ').href = `https://wa.me/77052606667?text=${waText}`;
    });
  }

})();
