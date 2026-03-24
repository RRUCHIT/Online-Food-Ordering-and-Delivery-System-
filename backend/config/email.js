const nodemailer = require("nodemailer");
const dns = require('dns');

// Force Node.js to prefer IPv4 over IPv6 to prevent ENETUNREACH errors on cloud platforms like Render
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const sendEmail = async (options) => {
  // Use port 587 with STARTTLS for better compatibility in cloud environments like Render
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: True, // false for 587, true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Force IPv4 at the connection level
    family: 4,
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
    // Verify connection configuration
    await transporter.verify();
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Detailed Email Error:", error);
    throw error;
  }
};

module.exports = sendEmail;
