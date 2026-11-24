// Contact popup
var hireMeModal = document.getElementById("hireMeModal");
var hireMeForm = document.getElementById("hireMeForm");
var contactCard = hireMeModal.querySelector(".contact-card");
var contactSend = document.getElementById("contactSend");
var contactSent = document.getElementById("contactSent");
var contactFailure = document.getElementById("contactFailure");
var contactFields = ["contactName", "contactEmail", "contactMessage"].map((id) => document.getElementById(id));

function isContactFieldComplete(field) {
  return field.value.trim().length > 0 && field.validity.valid;
}

function setContactFieldError(field, hasError) {
  if (hasError) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

function updateContactCharge() {
  var complete = contactFields.filter(isContactFieldComplete).length;
  hireMeModal.style.setProperty("--charge", complete / contactFields.length);
  contactCard.classList.toggle("contact-card--charged", complete === contactFields.length);
}

function openHireMeModal() {
  if (hireMeModal.open) {
    return;
  }

  if (!contactSent.hidden) {
    // The previous message was sent. Start a new one.
    contactSent.hidden = true;
    hireMeForm.hidden = false;
    hireMeForm.reset();
  }
  contactFailure.hidden = true;
  contactFields.forEach((field) => setContactFieldError(field, false));
  updateContactCharge();

  hireMeModal.showModal();

  // Start in the first field, except on touch devices, where that would cover
  // the popup with a keyboard.
  if (matchMedia("(hover: hover)").matches) {
    contactFields[0].focus();
  } else {
    document.getElementById("contactHeading").focus();
  }
}

// Anything that's been typed is kept for the next time the popup opens.
function closeHireMeModal() {
  hireMeModal.close();
}

async function submitHireMeModal() {
  if (contactSend.disabled) {
    return;
  }

  contactFields.forEach((field) => setContactFieldError(field, !isContactFieldComplete(field)));
  var firstIncomplete = contactFields.find((field) => !isContactFieldComplete(field));
  if (firstIncomplete) {
    firstIncomplete.focus();
    return;
  }

  var [name, email, message] = contactFields.map((field) => field.value.trim());

  contactFailure.hidden = true;
  contactSend.disabled = true;
  contactSend.textContent = "Sending…";
  try {
    await emailjs.send(
      "service_vcpx8t4",
      "template_t0cvywd",
      {
        "reply_to": email,
        "from_name": name,
        "message": message,
      }
    );

    document.getElementById("contactSentName").textContent = name;
    document.getElementById("contactSentEmail").textContent = email;
    hireMeForm.hidden = true;
    contactSent.hidden = false;
    document.getElementById("contactSentHeading").focus();
  } catch (error) {
    contactFailure.hidden = false;
  } finally {
    contactSend.disabled = false;
    contactSend.textContent = "Send message";
  }
}

hireMeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitHireMeModal();
});

contactFields.forEach((field) => {
  field.addEventListener("input", () => {
    if (isContactFieldComplete(field)) {
      setContactFieldError(field, false);
    }
    updateContactCharge();
  });
});

document.getElementById("contactClose").addEventListener("click", closeHireMeModal);
document.getElementById("contactDone").addEventListener("click", closeHireMeModal);

// Close on a press outside of the card, but not on a text selection that ends there.
hireMeModal.addEventListener("mousedown", (e) => {
  if (!contactCard.contains(e.target) && e.offsetX < hireMeModal.clientWidth) {
    closeHireMeModal();
  }
});
