// Agent Form Logic
document.addEventListener('DOMContentLoaded', function() {
    // Russian version
    const agentForm = document.getElementById('agentForm');
    const agentFormKZ = document.getElementById('agentFormKZ');
    
    if (agentForm) {
        initializeAgentForm(agentForm, false);
    }
    
    if (agentFormKZ) {
        initializeAgentForm(agentFormKZ, true);
    }
    
    function initializeAgentForm(form, isKZ) {
        const submitBtn = form.querySelector('#agentSubmit') || form.querySelector('#agentSubmitKZ');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                submitAgentForm(form, isKZ);
            });
        }
    }
    
    function submitAgentForm(form, isKZ) {
        const name = (form.querySelector('#agentName') || form.querySelector('#agentNameKZ')).value;
        const city = (form.querySelector('#agentCity') || form.querySelector('#agentCityKZ')).value;
        const phone = (form.querySelector('#agentPhone') || form.querySelector('#agentPhoneKZ')).value;
        const experience = (form.querySelector('#agentExperience') || form.querySelector('#agentExperienceKZ'));
        const experienceText = experience ? experience.options[experience.selectedIndex].text : '';
        
        if (!name || !phone) {
            alert(isKZ ? 'Аты-жөні мен телефонды толтырыңыз' : 'Заполните ФИО и телефон');
            return;
        }
        
        let whatsappText = '';
        
        if (isKZ) {
            whatsappText = `Сәлеметсіз бе! Агент болуға өтініш\nАты-жөні: ${name}\nТелефон: ${phone}\nҚала: ${city}\nТәжірибе: ${experienceText}`;
        } else {
            whatsappText = `Здравствуйте! Заявка на becoming агентом\nФИО: ${name}\nТелефон: ${phone}\nГород: ${city}\nОпыт: ${experienceText}`;
        }
        
        const whatsappUrl = `https://wa.me/77052606667?text=${encodeURIComponent(whatsappText)}`;
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        alert(isKZ ? 'Өтініш жіберілді! WhatsApp арқылы сізбен хабарласамыз' : 'Заявка отправлена! Мы свяжемся с вами через WhatsApp');
        form.reset();
    }
});
