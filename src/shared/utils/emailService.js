const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendSupplierCredentials = async ({ name, email, companyName, supplierCode, password }) => {
  const mailOptions = {
    from: `"Inventory ERP System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Your Supplier Account Has Been Created',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to the ERP System</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Your supplier account is ready</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #333;">Hello <strong>${name}</strong>,</p>
          <p style="color: #555;">Your supplier account for <strong>${companyName}</strong> has been created by the Admin. Below are your login credentials:</p>
          
          <div style="background: #f0f0f0; border-left: 4px solid #667eea; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #666; width: 140px;">Supplier Code:</td><td style="padding: 6px 0; font-weight: bold; color: #333;">${supplierCode}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Login Email:</td><td style="padding: 6px 0; font-weight: bold; color: #333;">${email}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Temporary Password:</td><td style="padding: 6px 0; font-weight: bold; color: #e74c3c; font-size: 18px; letter-spacing: 2px;">${password}</td></tr>
            </table>
          </div>

          <p style="color: #e74c3c; font-weight: bold;">⚠️ Please log in and change your password immediately.</p>
          <p style="color: #555;">If you have any questions, please contact the administrator.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #aaa; font-size: 12px;">
            This is an automated email. Please do not reply directly.
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Supplier credentials email sent to ${email}`);
  } catch (error) {
    // Non-blocking: log error but don't crash supplier creation
    console.error(`Failed to send credentials email to ${email}:`, error.message);
  }
};

module.exports = { sendSupplierCredentials };
