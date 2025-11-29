// agent-form.js
(function(){
  function $id(id){ return document.getElementById(id); }

  // RU
  const agentSubmit = $id('agentSubmit');
  if(agentSubmit){
    agentSubmit.addEventListener('click', function(){
      const name = encodeURIComponent($id('agentName').value || 'Агент');
      const city = encodeURIComponent($id('agentCity').value || '');
      const phone = encodeURIComponent($id('agentPhone').value || '');
      if(!phone){ alert('Укажите телефон'); return; }
      const text = `Заявка агент.%0AИмя:%20${name}%0AГород:%20${city}%0AТел:%20${phone}`;
      window.open(`https://wa.me/77052606667?text=${text}`, '_blank');
    });
  }

  // KZ
  const agentSubmitKZ = $id('agentSubmitKZ');
  if(agentSubmitKZ){
    agentSubmitKZ.addEventListener('click', function(){
      const name = encodeURIComponent($id('agentName_kz').value || 'Агент');
      const city = encodeURIComponent($id('agentCity_kz').value || '');
      const phone = encodeURIComponent($id('agentPhone_kz').value || '');
      if(!phone){ alert('Телефон көрсетіңіз'); return; }
      const text = `Агент өтініші.%0AАты:%20${name}%0AҚала:%20${city}%0AТел:%20${phone}`;
      window.open(`https://wa.me/77052606667?text=${text}`, '_blank');
    });
  }
})();
