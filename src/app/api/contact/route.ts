import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Create transporter - using Gmail SMTP
    // Note: For production, use environment variables for credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App-specific password for Gmail
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "daniel.theil.g@gmail.com",
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0d0b08 100%); padding: 30px; border-radius: 12px; color: #fff;">
            <h2 style="margin: 0 0 20px; color: #A69F8D; font-size: 24px; border-bottom: 1px solid #333; padding-bottom: 15px;">
              New Contact Message
            </h2>
            
            <div style="margin-bottom: 20px;">
              <p style="color: #888; margin: 0 0 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">From</p>
              <p style="color: #fff; margin: 0; font-size: 16px;">${name}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="color: #888; margin: 0 0 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
              <p style="color: #A69F8D; margin: 0; font-size: 16px;">
                <a href="mailto:${email}" style="color: #A69F8D; text-decoration: none;">${email}</a>
              </p>
            </div>
            
            <div style="margin-bottom: 0;">
              <p style="color: #888; margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
              <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-left: 3px solid #A69F8D;">
                <p style="color: #fff; margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
            Sent from your portfolio contact form
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
