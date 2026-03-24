const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // ✅ Force IPv4 (bypass DNS completely)
    host: "142.250.152.108", // Gmail IPv4
    port: 465,
    secure: true,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    // ✅ VERY IMPORTANT (SSL fix when using IP)
    tls: {
      servername: "smtp.gmail.com",
    },

    connectionTimeout: 20000,
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
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;