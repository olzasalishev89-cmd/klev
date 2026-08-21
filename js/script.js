(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    primaryNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Booking form validation (F-08, F-09, F-10) ---------- */
  var form = document.getElementById("bookingForm");
  if (!form) return;

  var status = document.getElementById("formStatus");

  var fields = {
    name: {
      input: document.getElementById("name"),
      row: document.getElementById("name").closest(".form-row"),
      error: document.getElementById("nameError"),
      validate: function (value) {
        return value.trim().length >= 2 ? "" : "Укажите имя (минимум 2 символа).";
      }
    },
    phone: {
      input: document.getElementById("phone"),
      row: document.getElementById("phone").closest(".form-row"),
      error: document.getElementById("phoneError"),
      validate: function (value) {
        var digits = value.replace(/\D/g, "");
        return digits.length >= 10 ? "" : "Укажите телефон в формате +7 (___) ___-__-__.";
      }
    }
  };

  function validateField(field) {
    var message = field.validate(field.input.value);
    if (message) {
      field.row.classList.add("has-error");
      field.error.textContent = message;
      return false;
    }
    field.row.classList.remove("has-error");
    field.error.textContent = "";
    return true;
  }

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    field.input.addEventListener("blur", function () { validateField(field); });
    field.input.addEventListener("input", function () {
      if (field.row.classList.contains("has-error")) validateField(field);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isValid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(fields[key])) isValid = false;
    });

    if (!isValid) {
      status.textContent = "Проверьте, пожалуйста, поля формы: есть ошибки.";
      status.className = "form-status error";
      var firstError = form.querySelector(".has-error input, .has-error select");
      if (firstError) firstError.focus();
      return;
    }

    // NOTE: no backend on MVP (see PRD 3.2 / F-11). This simulates submission.
    var submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем…";

    window.setTimeout(function () {
      status.textContent = "Заявка отправлена! Мы свяжемся с вами в ближайшее время для подтверждения даты.";
      status.className = "form-status success";
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить заявку";
    }, 500);
  });
})();
