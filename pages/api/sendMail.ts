import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // console.log(req.body);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    let html = `
    <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 0.25rem; padding: 1rem;">
  <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Contact Form Submission</h2>
  <div>
    <div style="display: flex; flex-direction: row; margin-bottom: 0.5rem;">
      <div style="flex: 1; font-weight: bold; margin-right: 1rem;">First Name:</div>
      <div style="flex: 2;">#firstName#</div>
    </div>
    <div style="display: flex; flex-direction: row; margin-bottom: 0.5rem;">
      <div style="flex: 1; font-weight: bold; margin-right: 1rem;">Last Name:</div>
      <div style="flex: 2;">#lastName#</div>
    </div>
    <div style="display: flex; flex-direction: row; margin-bottom: 0.5rem;">
      <div style="flex: 1; font-weight: bold; margin-right: 1rem;">Email:</div>
      <div style="flex: 2;">#email#</div>
    </div>
    <div style="display: flex; flex-direction: row; margin-bottom: 0.5rem;">
      <div style="flex: 1; font-weight: bold; margin-right: 1rem;">Phone:</div>
      <div style="flex: 2;">#phone#</div>
    </div>
    <div style="display: flex; flex-direction: row; margin-bottom: 0.5rem;">
      <div style="flex: 1; font-weight: bold; margin-right: 1rem;">Message:</div>
      <div style="flex: 2;">#message#</div>
    </div>
  </div>
</div>

    `;

    Object.keys(req.body).forEach((key) => {
      html = html.replace(`#${key}#`, req.body[key]);
    });

    const mailOptions = {
      from: "mail@example.com",
      to: process.env.EMAIL_CONTACT_TO,
      subject: "Contact Form Submission",
      html: html,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending email" });
  }
}
