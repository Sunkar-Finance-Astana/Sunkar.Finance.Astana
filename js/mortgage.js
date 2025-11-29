// mortgage.js
// Если пользователь на странице probability выбрал mortgage, мы учитываем downpayment отдельно.
// Здесь можно вынести дополнительные вычисления (LTV, рекомендованная ставка/срок).
// Пока — вспомогательная функция, которую probability.js использует через поля.
(function(){
  // expose a helper to compute LTV and recommended decision
  window.mortgageHelper = {
    computeLTV: function(amount, downPercent){
      const dp = Number(downPercent) || 0;
      const ltv = clamp(100 - dp, 0, 100);
      return Math.round(ltv);
    },
    recommend: function(ltv){
      // conservative: ltv <=80 => ok; <=60 excellent
      if(ltv <= 60) return {level:'excellent', note:'Низкий LTV — высокий шанс одобрения'};
      if(ltv <= 80) return {level:'good', note:'LTV приемлемый'};
      return {level:'weak', note:'Высокий LTV — нужен дополнительный залог или первоначальный взнос'};
    }
  };

  function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
})();
