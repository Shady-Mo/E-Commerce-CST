import { renderNavbar } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";

const CONTACT_EMAIL = "shady.mohamed789999@gmail.com";

renderNavbar();
renderFooter();

const contactForm = document.querySelector("[data-contact-form]");
const statusElement = document.querySelector("[data-contact-status]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.classList.add("was-validated");
      if (statusElement) {
        statusElement.textContent = "Please complete the required fields before sending.";
      }
      return;
    }

    const formData = new FormData(contactForm);
    const fullName = (formData.get("fullName") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const subject = (formData.get("subject") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const emailBody = [
      `Name: ${fullName}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    if (statusElement) {
      statusElement.textContent = "Opening Gmail to send the message...";
    }

    window.open(gmailUrl, '_blank');
    
    contactForm.reset();
    contactForm.classList.remove("was-validated");
  });
}