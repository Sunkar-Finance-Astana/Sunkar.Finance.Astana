// calc.js - калькулятор вероятности (KZ / RU одинаковая логика)
document.addEventListener('DOMContentLoaded', function(){
  const openCalc = document.getElementById('openCalc');
  const closeSelector = () => {
    // если на странице есть модал - но в этом варианте калькулятор открыт как отдельная страница (probality.html)
  };

  // Если вы хотите, чтобы modal работал на kz.html, можно добавить код модального окна как в index.html.
  // Здесь мы предоставляем основную функцию расчёта, которую можно вызывать с формы на probality.html
  window.computeScore = function(data){
    let score = 60;
    const sum = Number(data.sum)||0;
    const termMonths = (data.service && data.service.includes('mortgage')) ? 240 : 60;
    const monthlyRate = 0.015;
    const estimatedPayment = sum>0 ? (sum * monthlyRate) / (1 - Math.pow(1+monthlyRate, -termMonths)) : 0;
    const income = Number(data.income)||1;
    const payments = Number(data.payments)||0;
    const futurePayments = payments + estimatedPayment;
    const ratio = futurePayments / income;
    if(ratio < 0.3) score += 25;
    else if(ratio < 0.45) score += 10;
    else if(ratio < 0.6) score -= 5;
    else score -= 20;
    const credits = Number(data.countCredits)||0;
    if(credits === 0) score += 8;
    else if(credits <=2) score += 2;
    else score -= 8;
    const months = Number(data.workMonths)||0;
    if(months >= 24) score += 8;
    else if(months >= 6) score += 2;
    else score -= 8;
    if(data.service === 'mortgage' || (data.service && data.service.startsWith('mortgage'))) score -= 5;
    if(data.service === 'biz') score -= 8;
    if(data.delay === '30') score -= 6;
    if(data.delay === '90') score -= 14;
    if(data.delay === '90plus') score -= 28;
    if(score < 0) score = 0;
    if(score > 100) score = 100;
    return {score: Math.round(score), estimatedPayment: Math.round(estimatedPayment), ratio: (ratio*100).toFixed(0)};
  };
});
