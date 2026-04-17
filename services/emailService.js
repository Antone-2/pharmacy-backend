import SibApi from 'sib-api-v3-sdk';

let apiInstance = null;

const getApiInstance = () => {
  if (!apiInstance) {
    const defaultClient = SibApi.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
    apiInstance = new SibApi.TransactionalEmailsApi();
  }
  return apiInstance;
};

export const sendEmail = async (toEmail, toName, subject, htmlContent) => {
  try {
    const instance = getApiInstance();
    const sendSmtpEmail = new SibApi.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: toEmail, name: toName }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: 'Gamsel Pharmacy', email: process.env.BREVO_FROM_EMAIL || 'godfreyamalia@gmail.com' };

    console.log(`Sending email to ${toEmail}...`);
    const response = await instance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Email send error:', error.message || error);
    throw error;
  }
};

export const notifyAdmin = async (contact) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'godfreyamalia@gmail.com';
  const htmlContent = `
    <h2>New Callback Request</h2>
    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Phone:</strong> ${contact.phone}</p>
    <p><strong>Message:</strong></p>
    <p>${contact.message}</p>
  `;
  return sendEmail(adminEmail, 'Admin', 'New Callback Request - Gamsel Pharmacy', htmlContent);
};

export const sendConfirmation = async (email, name) => {
  const htmlContent = `
    <h2>Thank You, ${name}!</h2>
    <p>We have received your callback request.</p>
    <p>One of our pharmacists will call you back shortly.</p>
    <hr>
    <p><strong>Gamsel Pharmacy</strong><br>Your trusted community pharmacy</p>
  `;
  return sendEmail(email, name, 'Callback Request Received', htmlContent);
};