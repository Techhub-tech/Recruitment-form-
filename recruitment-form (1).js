/*
 * WebSprout Hub — Recruitment Partner Application form logic.
 * Submits via fetch() to the Formspree endpoint set in the form's `action`
 * attribute, so applicants stay on this page and see the success view
 * in place. No backend of our own is required.
 *
 * The form's `action` in recruitment-application.html points to the live
 * Formspree endpoint (https://formspree.io/f/mrpbordb), which delivers
 * submissions to websprouthub.team@gmail.com.
 */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("recruitmentForm");
    var errorBox = document.getElementById("formError");
    var submitBtn = document.getElementById("submitBtn");

    // Show a free-text field when "Other" is chosen
    bindOtherToggle("describeOther", "describeOtherText");
    bindOtherToggle("hearOther", "hearOtherText");
    bindOtherToggle("promoteOther", "promoteOtherText");

    function bindOtherToggle(triggerId, textId) {
      var trigger = document.getElementById(triggerId);
      var textField = document.getElementById(textId);
      if (!trigger || !textField) return;
      var name = trigger.name;
      document.getElementsByName(name).forEach(function (input) {
        input.addEventListener("change", function () {
          var showText = trigger.checked;
          textField.hidden = !showText;
          if (!showText) textField.value = "";
        });
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errorBox.hidden = true;

      if (!form.checkValidity()) {
        form.reportValidity();
        errorBox.hidden = false;
        errorBox.textContent = "Please fill in all required fields before submitting.";
        return;
      }

      var endpoint = form.getAttribute("action");
      if (!endpoint || endpoint.indexOf("YOUR_FORM_ID") !== -1) {
        errorBox.hidden = false;
        errorBox.textContent = "This form isn't connected to an email endpoint yet. Please contact WebSprout Hub directly at websprouthub.team@gmail.com for now.";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            document.getElementById("formView").hidden = true;
            document.getElementById("successView").hidden = false;
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            throw new Error("Submission failed");
          }
        })
        .catch(function () {
          errorBox.hidden = false;
          errorBox.textContent = "Something went wrong sending your application. Please try again, or email us directly at websprouthub.team@gmail.com.";
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Application";
        });
    });
  });
})();
