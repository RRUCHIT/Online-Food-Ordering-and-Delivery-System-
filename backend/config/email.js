const nodemailer = require("nodemailer");
const dns = require('dns');

// Force Node.js to prefer IPv4 over IPv6 globally
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const sendEmail = async (options) => {
  // Use manual configuration to strictly control Port and IP Family
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Must be false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // STRICTLY FORCE IPv4
    family: 4,
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });

  const mailOptions = {
    from: `"FoodHub Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };  

  try {
    // Send email directly
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Detailed Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
