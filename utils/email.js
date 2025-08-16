import nodemailer from 'nodemailer';

// Email sending utility
export const sendNotification = (to, subject, text) => {
  console.log(`Sending email to ${to}: ${subject} - ${text}`);
  // Actual implementation would use Nodemailer or similar
  return true;
};

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: 'false',
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
    // For better security
    tls: {
      rejectUnauthorized: true
    },
    pool: true // Use connection pooling
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Marriage Bureau" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a4a4a;">Welcome to Marriage Bureau!</h2>
        <p>Please verify your email address to complete your registration:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; 
                    background-color: #4CAF50; color: white; 
                    text-decoration: none; border-radius: 4px;
                    font-weight: bold;">
            Verify Email Address
          </a>
        </p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
        <p style="font-size: 0.9em; color: #666;">
          Or copy and paste this link into your browser:<br>
          ${verificationUrl}
        </p>
      </div>
    `,
    headers: {
      'Priority': 'high',
      'X-Priority': '1',
      'X-MSMail-Priority': 'High'
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send password reset email
// export const sendPasswordResetEmail = async (email, token) => {
//   const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  
//   const mailOptions = {
//     from: `"Marriage Bureau" <${process.env.SENDER_EMAIL}>`,
//     to: email,
//     subject: 'Password Reset Request',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #4a4a4a;">Password Reset Request</h2>
//         <p>We received a request to reset your password. Click the button below to reset it:</p>
//         <p style="text-align: center; margin: 30px 0;">
//           <a href="${resetUrl}" 
//              style="display: inline-block; padding: 12px 24px; 
//                     background-color: #3498db; color: white; 
//                     text-decoration: none; border-radius: 4px;
//                     font-weight: bold;">
//             Reset Password
//           </a>
//         </p>
//         <p>This link will expire in 15 minutes.</p>
//         <p>If you didn't request a password reset, please ignore this email.</p>
//         <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
//         <p style="font-size: 0.9em; color: #666;">
//           Or copy and paste this link into your browser:<br>
//           ${resetUrl}
//         </p>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Password reset email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending password reset email:', error);
//     return false;
//   }
// };

// Send OTP for login (optional)
// export const sendOTP = async (email, otp) => {
//   const mailOptions = {
//     from: `"Marriage Bureau" <${process.env.SENDER_EMAIL}>`,
//     to: email,
//     subject: 'Your Login OTP',
//     text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #4a4a4a;">Your Login OTP</h2>
//         <p>Your One-Time Password (OTP) is:</p>
//         <p style="font-size: 24px; font-weight: bold; text-align: center; 
//                   padding: 20px; background-color: #f0f0f0; 
//                   border-radius: 5px; margin: 20px 0;">
//           ${otp}
//         </p>
//         <p>This OTP will expire in 10 minutes.</p>
//         <p>If you didn't request this, please ignore this email.</p>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`OTP email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending OTP email:', error);
//     return false;
//   }
// };