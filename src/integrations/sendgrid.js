const sgMail = require("@sendgrid/mail");
const { sendgridSenderEmail, sendgridTemplateMailVerification, sendgridApiKey, clientUrl } = require("../config");

const sendEmailVerification = async (userData, token) => {
  sgMail.setApiKey(sendgridApiKey);

  const link = `${clientUrl}/#/mail-verification/auth?token=${token}`;

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

module.exports = {
  sendEmailVerification,
};