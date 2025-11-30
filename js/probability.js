// Probability Calculator Logic
document.addEventListener('DOMContentLoaded', function() {
    // Russian version
    const probForm = document.getElementById('probForm');
    const probFormKZ = document.getElementById('probFormKZ');
    
    if (probForm) {
        initializeCalculator(probForm, 'resultCard', 'resultPercent', 'resultText', 'toWhatsBtn');
    }
    
    if (probFormKZ) {
        initializeCalculator(probFormKZ, 'resultCardKZ', 'resultPercentKZ', 'resultTextKZ', 'toWhatsBtnKZ', true);
    }
    
    function initializeCalculator(form, resultCardId, percentId, textId, whatsappId, isKZ = false) {
        const serviceSelect = form.querySelector('#service') || form.querySelector('#service_kz');
        const mortgageBlock = form.querySelector('#mortgageBlock') || form.querySelector('#mortgageBlockKZ');
        const calcBtn = form.querySelector('#calcBtn') || form.querySelector('#calcBtnKZ');
        const resetBtn = form.querySelector('#resetBtn') || form.querySelector('#resetBtnKZ');
        const resultCard = document.getElementById(resultCardId);
        const resultPercent = document.getElementById(percentId);
        const resultText = document.getElementById(textId);
        const toWhatsBtn = document.getElementById(whatsappId);
        
        // Show/hide mortgage block based on service selection
        if (serviceSelect && mortgageBlock) {
            serviceSelect.addEventListener('change', function() {
                if (this.value === 'mortgage') {
                    mortgageBlock.style.display = 'block';
                } else {
                    mortgageBlock.style.display = 'none';
                }
            });
        }
        
        // Calculate probability
        if (calcBtn) {
            calcBtn.addEventListener('click', function() {
                const probability = calculateProbability(form, isKZ);
                showResult(probability, resultCard, resultPercent, resultText, toWhatsBtn, form, isKZ);
            });
        }
        
        // Reset form
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                form.reset();
                resultCard.style.display = 'none';
            });
        }
    }
    
    function calculateProbability(form, isKZ) {
        // Get form values
        const service = (form.querySelector('#service') || form.querySelector('#service_kz')).value;
        const amount = parseInt((form.querySelector('#amount') || form.querySelector('#amount_kz')).value) || 0;
        const income = parseInt((form.querySelector('#income') || form.querySelector('#income_kz')).value) || 0;
        const payments = parseInt((form.querySelector('#payments') || form.querySelector('#payments_kz')).value) || 0;
        const currentLate = (form.querySelector('#currentLate') || form.querySelector('#currentLate_kz')).value;
        const pastLate = (form.querySelector('#pastLate') || form.querySelector('#pastLate_kz')).value;
        const taxDebt = (form.querySelector('#taxDebt') || form.querySelector('#taxDebt_kz')).value;
        
        let probability = 80; // Base probability
        
        // Adjust based on service type
        switch(service) {
            case 'unsecured_no_income':
                probability += 5;
                break;
            case 'unsecured_with_income':
                probability += 10;
                break;
            case 'secured':
                probability += 15;
                break;
            case 'mortgage':
                probability += 12;
                break;
            case 'business':
                probability += 8;
                break;
            case 'auto':
                probability += 10;
                break;
            case 'refinance':
                probability += 5;
                break;
        }
        
        // Adjust based on amount
        if (amount <= 5000000) probability += 10;
        else if (amount <= 10000000) probability += 5;
        else if (amount <= 20000000) probability += 0;
        else probability -= 5;
        
        // Adjust based on income
        const debtToIncome = payments / income;
        if (debtToIncome < 0.3) probability += 15;
        else if (debtToIncome < 0.5) probability += 10;
        else if (debtToIncome < 0.7) probability += 5;
        else probability -= 10;
        
        // Adjust based on current late payments
        if (currentLate === 'no') probability += 15;
        else if (currentLate === 'closed') probability += 5;
        else if (currentLate === '30') probability -= 10;
        else if (currentLate === '90') probability -= 20;
        
        // Adjust based on past late payments
        if (pastLate === 'no') probability += 10;
        else if (pastLate === '90') probability -= 5;
        else if (pastLate === 'more') probability -= 15;
        
        // Adjust based on tax debt
        if (taxDebt === 'no') probability += 10;
        else probability -= 15;
        
        // Ensure probability is between 5 and 95
        probability = Math.max(5, Math.min(95, probability));
        
        return Math.round(probability);
    }
    
    function showResult(probability, resultCard, resultPercent, resultText, toWhatsBtn, form, isKZ) {
        resultPercent.textContent = probability + '%';
        
        let text = '';
        let whatsappText = '';
        
        const fio = (form.querySelector('#fio') || form.querySelector('#fio_kz')).value;
        const phone = (form.querySelector('#phone') || form.querySelector('#phone_kz')).value;
        const city = (form.querySelector('#city') || form.querySelector('#city_kz')).value;
        const service = (form.querySelector('#service') || form.querySelector('#service_kz'));
        const serviceText = service.options[service.selectedIndex].text;
        const amount = (form.querySelector('#amount') || form.querySelector('#amount_kz')).value;
        
        if (isKZ) {
            if (probability >= 90) {
                text = 'Тамаша! Бекіту мүмкіндігі өте жоғары';
            } else if (probability >= 70) {
                text = 'Жоғары бекіту мүмкіндігі';
            } else if (probability >= 50) {
                text = 'Орташа бекіту мүмкіндігі, қосымша консультация қажет';
            } else {
                text = 'Консультацияға баруға кеңес береміз';
            }
            
            whatsappText = `Сәлеметсіз бе! Несие өтінішімі бар. Бекіту ықтималдығы: ${probability}%\nАты-жөні: ${fio}\nТелефон: ${phone}\nҚала: ${city}\nҚызмет түрі: ${serviceText}\nСома: ${amount} ₸`;
        } else {
            if (probability >= 90) {
                text = 'Отлично! Вероятность одобрения очень высокая';
            } else if (probability >= 70) {
                text = 'Высокая вероятность одобрения';
            } else if (probability >= 50) {
                text = 'Средняя вероятность, требуется дополнительная консультация';
            } else {
                text = 'Рекомендуем обратиться за консультацией';
            }
            
            whatsappText = `Здравствуйте! У меня заявка на кредит. Вероятность одобрения: ${probability}%\nФИО: ${fio}\nТелефон: ${phone}\nГород: ${city}\nВид услуги: ${serviceText}\nСумма: ${amount} ₸`;
        }
        
        resultText.textContent = text;
        toWhatsBtn.href = `https://wa.me/77052606667?text=${encodeURIComponent(whatsappText)}`;
        resultCard.style.display = 'block';
        
        // Scroll to result
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
