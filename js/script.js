(function(){
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/jakkies@gmail.com';

  var form = document.getElementById('quoteForm');
  var successPanel = document.getElementById('successPanel');
  var formNotice = document.getElementById('formNotice');
  var submitBtn = document.getElementById('quoteSubmitBtn');

  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function clearInvalid(el){ el.classList.remove('invalid'); }

  function showNotice(message){
    formNotice.textContent = message;
    formNotice.style.display = 'block';
  }

  function hideNotice(){
    formNotice.style.display = 'none';
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    hideNotice();

    var valid = true;
    var name = document.getElementById('fullName');
    var phone = document.getElementById('phone');
    var email = document.getElementById('email');

    [name, phone, email].forEach(clearInvalid);

    if(!name.value.trim()){ name.classList.add('invalid'); valid = false; }
    if(!phone.value.trim()){ phone.classList.add('invalid'); valid = false; }
    if(!email.value.trim() || !validEmail(email.value.trim())){ email.classList.add('invalid'); valid = false; }

    if(!valid){
      var firstInvalid = form.querySelector('.invalid');
      if(firstInvalid){ firstInvalid.focus(); }
      return;
    }

    var payload = {
      _subject: 'New container conversion quote request',
      fullName: name.value.trim(),
      company: document.getElementById('company').value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      conversionType: document.getElementById('conversionType').value,
      containerSize: document.getElementById('containerSize').value,
      location: document.getElementById('location').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function(response){
        if(!response.ok){ throw new Error('Request failed with status ' + response.status); }
        return response.json();
      })
      .then(function(){
        fireConversion(payload);
        form.style.display = 'none';
        successPanel.style.display = 'block';
        successPanel.setAttribute('tabindex', '-1');
        successPanel.focus();
      })
      .catch(function(err){
        console.error('Quote request failed to send:', err);
        showNotice('Something went wrong sending your request. Please try again, or call us on 012 030 0204.');
      })
      .finally(function(){
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send My Quote Request';
      });
  });

  function fireConversion(payload){
    // Google Ads / GA4 conversion + dataLayer event.
    // Uncomment the gtag calls once the Google Ads tag near the top
    // of index.html is wired up with your real conversion IDs.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'generate_lead', form: 'container_conversions_quote', lead: payload.conversionType || 'unspecified' });

    // if (typeof gtag === 'function') {
    //   gtag('event', 'conversion', { send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL' });
    // }
  }
})();
