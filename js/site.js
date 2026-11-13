(function () {
  var header = document.querySelector(".site-header");
  if (header && document.body.classList.contains("home")) {
    var paintHeader = function () {
      header.classList.toggle("is-solid", window.scrollY > 20);
    };
    paintHeader();
    window.addEventListener("scroll", paintHeader, { passive: true });
  }

  var quick = document.querySelector("#quick-form");
  if (quick) {
    quick.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = quick.elements.name.value.trim();
      var phone = quick.elements.phone.value.trim();
      var notes = quick.elements.notes.value.trim();
      var error = document.querySelector("#quick-error");
      var digits = phone.replace(/\D/g, "");
      if (!name || digits.length < 10) {
        if (error) error.textContent = "Add your name and a WhatsApp number we can reply to.";
        return;
      }
      if (error) error.textContent = "";
      var lines = [
        "Hello MODA Furniture, I would like a quote.",
        "Name: " + name,
        "WhatsApp: " + phone
      ];
      if (notes) lines.push("Project: " + notes);
      window.location.href = "https://wa.me/233558845690?text=" + encodeURIComponent(lines.join("\n"));
    });
  }

  var form = document.querySelector("#visit-form");
  if (!form) return;

  var preview = document.querySelector("#preview");
  var feeOut = document.querySelector("#fee-now");
  var payOut = document.querySelector("#pay-now");
  var timeOut = document.querySelector("#time-now");
  var error = document.querySelector("#form-error");

  var params = new URLSearchParams(window.location.search);
  var requested = params.get("piece");
  if (requested && form.elements.piece) {
    var options = Array.prototype.map.call(form.elements.piece.options, function (option) {
      return option.value;
    });
    if (options.indexOf(requested) !== -1) {
      form.elements.piece.value = requested;
    } else if (form.elements.notes && !form.elements.notes.value) {
      form.elements.piece.value = "Something else";
      form.elements.notes.value = requested;
    }
  }

  function selectedWhere() {
    return form.querySelector('input[name="where"]:checked');
  }

  function messageLines() {
    var where = selectedWhere();
    var fee = where ? where.getAttribute("data-fee") : "";
    var place = where ? where.value : "";
    var install = form.elements.installation;
    var size = form.elements.size;
    var pay = install.selectedOptions[0] ? install.selectedOptions[0].getAttribute("data-pay") : "";
    var time = size.selectedOptions[0] ? size.selectedOptions[0].getAttribute("data-time") : "";
    var name = form.elements.name.value.trim();
    var phone = form.elements.phone.value.trim();
    var piece = form.elements.piece.value;
    var notes = form.elements.notes.value.trim();

    if (feeOut) feeOut.textContent = fee;
    if (payOut) payOut.textContent = pay;
    if (timeOut) timeOut.textContent = time;

    form.querySelectorAll(".choice").forEach(function (label) {
      var input = label.querySelector("input");
      label.classList.toggle("is-on", Boolean(input && input.checked));
    });

    var lines = [
      "Hello MODA Furniture, I would like to book a site visit.",
      "Name: " + (name || ""),
      "WhatsApp: " + (phone || ""),
      "Location: " + place,
      "Visit fee: " + fee + " (non-refundable, and charged separately from the job)",
      "Piece: " + piece,
      "Installation: " + install.value,
      "Timing guide: " + time
    ];
    if (notes) lines.push("Notes: " + notes);
    return lines;
  }

  function sync() {
    var lines = messageLines();
    if (preview) preview.textContent = lines.join("\n");
    return lines.join("\n");
  }

  function refresh() {
    if (error) error.textContent = "";
    sync();
  }

  form.addEventListener("input", refresh);
  form.addEventListener("change", refresh);
  sync();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = form.elements.name.value.trim();
    var phone = form.elements.phone.value.trim();
    var digits = phone.replace(/\D/g, "");

    if (!name || !phone || !form.elements.agree.checked) {
      if (error) error.textContent = "Add your name, your WhatsApp number, and confirm the visit fee.";
      return;
    }
    if (digits.length < 10) {
      if (error) error.textContent = "Enter a WhatsApp number we can reply to.";
      form.elements.phone.focus();
      return;
    }
    if (error) error.textContent = "";
    var text = sync();
    window.location.href = "https://wa.me/233558845690?text=" + encodeURIComponent(text);
  });
})();
