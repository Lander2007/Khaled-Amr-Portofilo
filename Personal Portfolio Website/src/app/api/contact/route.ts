import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Basic in-memory rate limiter: max 5 submissions per 10 minutes per client
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

function sanitizeText(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP identification for rate limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait a few minutes before trying again, or email directly.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { name, email, projectType, message, _gotcha } = body;

    // 2. Anti-spam honeypot detection
    if (_gotcha && String(_gotcha).trim().length > 0) {
      // Silently discard spam bots with 200 OK
      return NextResponse.json(
        { success: true, message: "Your message has been sent successfully. I'll get back to you soon." },
        { status: 200 }
      );
    }

    // 3. Server-side validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Please enter your name (minimum 2 characters).";
    } else if (name.trim().length > 100) {
      errors.name = "Name must not exceed 100 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      errors.email = "Please provide a valid email address.";
    } else if (email.trim().length > 150) {
      errors.email = "Email must not exceed 150 characters.";
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      errors.message = "Please share a brief description (minimum 10 characters).";
    } else if (message.trim().length > 3000) {
      errors.message = "Message must not exceed 3000 characters.";
    }

    const validProjectTypes = [
      "Website Development",
      "Frontend Development",
      "UI/UX Design",
      "Collaboration",
      "Other",
    ];
    const sanitizedProjectType =
      typeof projectType === "string" && validProjectTypes.includes(projectType.trim())
        ? projectType.trim()
        : "General Inquiry";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const cleanName = sanitizeText(name.trim());
    const cleanEmail = sanitizeText(email.trim());
    const cleanMessage = sanitizeText(message.trim());
    const receivingEmail = process.env.CONTACT_RECEIVING_EMAIL || "kaled.amr0210@gmail.com";

    // 4. Email delivery via Resend (if RESEND_API_KEY is configured)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const emailResult = await resend.emails.send({
        from: "Khaled Amr Portfolio <onboarding@resend.dev>",
        to: receivingEmail,
        replyTo: cleanEmail,
        subject: `[Portfolio Inquiry] ${cleanName} — ${sanitizedProjectType}`,
        text: `New project inquiry received from ${cleanName} (${cleanEmail}):\n\nProject Type: ${sanitizedProjectType}\n\nMessage:\n${cleanMessage}\n\n--\nDelivered via Khaled Amr Portfolio Engine`,
        html: `
          <div style="font-family: sans-serif; background-color: #381932; color: #FFF3E6; padding: 32px; border-radius: 8px;">
            <div style="font-size: 11px; letter-spacing: 0.2em; color: #C6F277; text-transform: uppercase; margin-bottom: 8px;">
              // NEW PORTFOLIO INQUIRY
            </div>
            <h2 style="margin: 0 0 24px 0; font-size: 24px; color: #FFF3E6;">${cleanName}</h2>
            <div style="background-color: #240f20; padding: 20px; border: 1px solid rgba(255, 243, 230, 0.2); margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #C6F277;"><strong>Reply Email:</strong> <a href="mailto:${cleanEmail}" style="color: #FFF3E6;">${cleanEmail}</a></p>
              <p style="margin: 0; font-size: 13px; color: #C6F277;"><strong>Project Type:</strong> <span style="color: #FFF3E6;">${sanitizedProjectType}</span></p>
            </div>
            <div style="font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #FFF3E6; padding-bottom: 24px;">
              ${cleanMessage}
            </div>
            <div style="border-top: 1px solid rgba(255, 243, 230, 0.15); padding-top: 16px; font-size: 11px; color: rgba(255, 243, 230, 0.5);">
              Dispatched via Khaled Amr Portfolio Engine &bull; Alexandria, Egypt (31.2001&deg; N)
            </div>
          </div>
        `,
      });

      if (emailResult.error) {
        console.error("Resend API Error:", emailResult.error);
        return NextResponse.json(
          {
            success: false,
            error: "Email delivery failed. Please email me directly at " + receivingEmail,
          },
          { status: 502 }
        );
      }
    } else {
      // Development or unconfigured fallback: log cleanly and return success with status
      console.log(
        `\n[PORTFOLIO CONTACT INQUIRY - LOCAL/DEV]\nFrom: ${cleanName} <${cleanEmail}>\nType: ${sanitizedProjectType}\nMessage:\n${cleanMessage}\n(To send live emails, configure RESEND_API_KEY in .env.local)\n`
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully. I'll get back to you soon.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact Form Server Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again or contact me directly by email.",
      },
      { status: 500 }
    );
  }
}
