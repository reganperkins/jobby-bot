const mailgun = require('mailgun-js')({ apiKey: process.env.apiKey, domain: process.env.domain });

const createMailOptions = content => ({
  from: `Recruiter Bot <${ process.env.email }>`,
  to: process.env.emailRecipient,
  subject: 'Email from recruiter bot',
  html: content
});

const createTableStringFromObject = (contentObject) => {
  const keyArray = Object.keys(contentObject);
  const tableRows = keyArray.map((key) => `<tr style="text-align: left;"><th style="width: 100px; padding: 10px 0;">${ key }:</th><td style="padding: 10px 0;">${ contentObject[key] }</td></tr>`);
  return (
    `<table style="width: 100%;"><tbody>${ tableRows.join('') }</tbody></table>`
  );
};

const sendMail = (mailOptions) => {
  mailgun.messages().send(mailOptions, (error, body) => {
    if (error) console.log(error);
    console.log(body);
  });
};

module.exports = {
  sendMail,
  createMailOptions,
  createTableStringFromObject
};
