const sgMail = require("@sendgrid/mail");
const { 
  clientUrl, 
  sendgridApiKey, 
  sendgridSenderEmail, 
  sendgridTemplateContactMessage, 
  sendgridTemplateMailVerification, 
} = require("../config");

const sendEmailVerification = async (userData, token) => {
  sgMail.setApiKey(sendgridApiKey);

  const link = `${clientUrl}/mail-verification/auth?token=${token}`;

  const msg = {
    to: userData.email,
    from: sendgridSenderEmail,
    templateId: sendgridTemplateMailVerification,
    dynamic_template_data: {
      username: userData.username,
      subject: 'Verifica tu correo electrónico',
      link: link
    }
  };
  sgMail.send(msg);
  return { msg };
};

const sendContactMessage = async (contactMessage) => {
  sgMail.setApiKey(sendgridApiKey);

  const msg = {
    to: sendgridSenderEmail,
    from: sendgridSenderEmail,
    templateId: sendgridTemplateContactMessage,
    dynamic_template_data: {
      email: contactMessage.email,
      subject: contactMessage.subject,
      message: contactMessage.message,
    }
  };
  sgMail.send(msg);
};

module.exports = {
  sendEmailVerification,
  sendContactMessage
};