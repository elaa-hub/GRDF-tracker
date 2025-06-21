const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '../mochawesome-report/mochawesome.html');

let reportHTML;
try {
  reportHTML = fs.readFileSync(reportPath, 'utf8');
} catch (err) {
  console.error('❌ Erreur lors de la lecture du fichier HTML :', err.message);
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'elaabhh32@gmail.com',
    pass: 'rp yk pq dt kg bz xl wo'.replace(/ /g, '')
  }
});

const mailOptions = {
  from: '"Rapport Selenium - GRDF Tracker 🧪" <elaabhh32@gmail.com>',
  to: 'benhamidaella@gmail.com',
  subject: '🧪 Rapport des tests Selenium - GRDF Tracker',
  html: `
    <p>Bonjour,</p>
    <p>Veuillez trouver ci-joint le rapport des tests Selenium généré automatiquement.</p>
    <p>Cordialement,<br>Votre bot de test automatique 🤖</p>
  `,
  attachments: [
    {
      filename: 'rapport-tests.html',
      content: reportHTML,
      contentType: 'text/html'
    }
  ]
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Erreur lors de l’envoi :', error);
  } else {
    console.log('✅ Rapport envoyé avec succès : %s', info.response);
  }
});
