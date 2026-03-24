const nodemailer = require("nodemailer");
const dns = require('dns');

// Force Node.js to prefer IPv4 over IPv6 to prevent ENETUNREACH errors on cloud platforms like Render
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const sendEmail = async (options) => {
  // Use port 587 with STARTTLS for best compatibility on Render/Cloud
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Must be false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Force IPv4 by providing a custom lookup function
    lookup: (hostname, opts, callback) => {
      dns.lookup(hostname, { family: 4 }, (err, address, family) => {
        callback(err, address, family);
      });
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
      // Some servers require this for STARTTLS
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 25000,
  });

  const mailOptions = {
    from: `"FoodHub Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };  

  try {
    // Verify connection configuration
    await transporter.verify();
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Detailed Email Error:", error.message);
    // If it still fails, try a fallback to service: 'gmail' logic but with IPv4 forced
    throw error;
  }
};

module.exports = sendEmail;
