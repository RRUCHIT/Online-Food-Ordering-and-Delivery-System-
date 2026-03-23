const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Use port 587 with STARTTLS for better compatibility in cloud environments like Render
  // Also force IPv4 to avoid ENETUNREACH errors with IPv6
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // false for 587, true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
      // Force IPv4
      family: 4,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
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
