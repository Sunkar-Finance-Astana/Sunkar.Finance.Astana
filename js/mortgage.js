// mortgage.js (необязательно, но подключил для отдельных страниц)
(function(){
  // Здесь можно расширить ипотечную логику: расчёт ежемесячного платежа по аннуитету, влияние первоначального взноса и т.д.
  function monthlyPayment(amount, years, annualRate){
    const monthlyRate = annualRate / 12 / 100;
    const n = years * 12;
    if(monthlyRate === 0) return Math.round(amount / n);
    const p = (amount * (monthlyRate)) / (1 - Math.pow(1 + monthlyRate, -n));
    return Math.round(p);
  }
  // пример использования: monthlyPayment(10000000,20,12)
  window.mortgageCalc = { monthlyPayment };
})();
