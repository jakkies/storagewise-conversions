(function(){
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/ops@storagewise.co.za';

  var forms = document.querySelectorAll('.quote-form');

  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function clearInvalid(el){ el.classList.remove('invalid'); }

  function field(form, name){ return form.querySelector('[name="' + name + '"]'); }

  forms.forEach(function(form){
    var formCard = form.closest('.form-card');
    var formNotice = formCard ? formCard.querySelector('.form-notice') : null;
    var submitBtn = form.querySelector('button[type="submit"]');

    function showNotice(message){
      if(!formNotice){ return; }
      formNotice.textContent = message;
      formNotice.style.display = 'block';
    }

    function hideNotice(){
      if(!formNotice){ return; }
      formNotice.style.display = 'none';
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      hideNotice();

      var valid = true;
      var name = field(form, 'fullName');
      var phone = field(form, 'phone');
      var email = field(form, 'email');

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
        company: field(form, 'company').value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        conversionType: field(form, 'conversionType').value,
        containerSize: field(form, 'containerSize').value,
        location: field(form, 'location').value.trim()
      };

      if(submitBtn){
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

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
          window.location.href = '/thank-you';
        })
        .catch(function(err){
          console.error('Quote request failed to send:', err);
          showNotice('Something went wrong sending your request. Please try again, or call us on 064 233 2096.');
        })
        .finally(function(){
          if(submitBtn){
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send My Quote Request';
          }
        });
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
