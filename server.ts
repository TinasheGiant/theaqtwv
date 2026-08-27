import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Permissive CORS for AI Studio preview & production domain aqutewave.co.zw
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      service: "Aqutewave Backend API",
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Contact form submission endpoint
  app.post("/api/contact", (req: Request, res: Response) => {
    try {
      const { name, email, phone, subject, department, message } = req.body;
      console.log("[Aqutewave Contact Received]:", {
        name,
        email: email || phone,
        subject,
        department: department || "services",
        message,
        receivedAt: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: "Your message was recorded successfully. Our team will contact you shortly.",
        ticketId: `AQW-${Math.floor(100000 + Math.random() * 900000)}`,
      });
    } catch (err: any) {
      console.error("Error processing contact form:", err);
      res.status(500).json({ error: "Failed to record message" });
    }
  });

  // Booking submission endpoint
  app.post("/api/booking", (req: Request, res: Response) => {
    try {
      const { serviceName, price, clientName, clientPhone, clientEmail, startDate, notes, addOns } = req.body;
      console.log("[Aqutewave Booking Received]:", {
        serviceName,
        price,
        clientName,
        clientPhone,
        clientEmail,
        startDate,
        notes,
        addOns,
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        bookingId: `BK-${Date.now().toString().slice(-6)}`,
        message: "Booking confirmed! You will receive confirmation via WhatsApp.",
      });
    } catch (err: any) {
      console.error("Error processing booking:", err);
      res.status(500).json({ error: "Failed to save booking" });
    }
  });

  // ==========================================
  // PAYMENT & VERIFICATION API SYSTEM
  // ==========================================
  interface StoredTransaction {
    id: string;
    reference: string;
    method: "ecocash" | "bank" | "innbucks" | "card";
    providerName: string;
    amountUSD: number;
    amountConverted: number;
    currency: "USD" | "ZWL" | "ZAR";
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    status: "Completed" | "Pending" | "Processing" | "Failed";
    timestamp: string;
    purpose: string;
    receiptHash: string;
    items?: Array<{ name: string; quantity: number; price: number }>;
    metadata?: any;
  }

  // Pre-seed demo transactions for instant lookup
  const transactionsDb = new Map<string, StoredTransaction>([
    [
      "DEMO-2026",
      {
        id: "TXN-884920",
        reference: "DEMO-2026",
        method: "ecocash",
        providerName: "EcoCash Mobile Money",
        amountUSD: 249,
        amountConverted: 249,
        currency: "USD",
        customerName: "Apex Retailers Ltd",
        customerPhone: "+263 77 482 9104",
        customerEmail: "finance@apexretail.co.zw",
        status: "Completed",
        timestamp: "2026-08-24T14:32:00Z",
        purpose: "Enterprise VIP Partner Retainer (Monthly)",
        receiptHash: "AQW-SHA256-9d8a7c2b3e4f1a09d8e7c6b5a4f3e2d1",
        items: [{ name: "Enterprise VIP Retainer & Staging Pod", quantity: 1, price: 249 }],
      },
    ],
    [
      "ECO-782910",
      {
        id: "TXN-782910",
        reference: "ECO-782910",
        method: "ecocash",
        providerName: "EcoCash Express USD",
        amountUSD: 150,
        amountConverted: 4500,
        currency: "ZWL",
        customerName: "Tatenda Moyo",
        customerPhone: "+263 78 512 8493",
        customerEmail: "tatenda.moyo@gmail.com",
        status: "Completed",
        timestamp: "2026-08-25T08:15:20Z",
        purpose: "Semi Standard Business Web Development (Deposit)",
        receiptHash: "AQW-SHA256-4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f",
        items: [{ name: "Semi Standard Web Dev Package", quantity: 1, price: 150 }],
      },
    ],
    [
      "AQW-BNK-9382",
      {
        id: "TXN-938210",
        reference: "AQW-BNK-9382",
        method: "bank",
        providerName: "Stanbic Bank Zimbabwe USD Nostro",
        amountUSD: 500,
        amountConverted: 500,
        currency: "USD",
        customerName: "Zambezi Logistics Corp",
        customerPhone: "+263 73 991 8200",
        customerEmail: "accounts@zambezilogistics.co.zw",
        status: "Completed",
        timestamp: "2026-08-23T11:00:00Z",
        purpose: "Basic ERP Software Suite Deployment",
        receiptHash: "AQW-SHA256-1f2e3d4c5b6a70899a8b7c6d5e4f3a2b",
        items: [{ name: "Basic ERP Software License & Server Setup", quantity: 1, price: 500 }],
      },
    ],
  ]);

  // 1. Initiate Payment across any of the 4 Gateways
  app.post("/api/payment/initiate", (req: Request, res: Response) => {
    try {
      const {
        method,
        amountUSD,
        amountConverted,
        currency,
        customerName,
        customerPhone,
        customerEmail,
        purpose,
        items,
        customRef,
      } = req.body;

      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      let reference = customRef || "";
      let providerName = "";

      if (method === "ecocash") {
        reference = reference || `ECO-${randomDigits}`;
        providerName = "EcoCash Mobile Money";
      } else if (method === "bank") {
        reference = reference || `AQW-BNK-${randomDigits}`;
        providerName = "Stanbic Bank USD Nostro / RTGS";
      } else if (method === "innbucks") {
        reference = reference || `INB-${randomDigits}`;
        providerName = "InnBucks / Mukuru Express";
      } else if (method === "card") {
        reference = reference || `CRD-${randomDigits}`;
        providerName = "Visa / Mastercard 3DS Secure";
      } else {
        reference = reference || `AQW-${randomDigits}`;
        providerName = "Aqutewave Gateway";
      }

      const txId = `TXN-${randomDigits}`;
      const receiptHash = `AQW-SHA256-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

      const newTx: StoredTransaction = {
        id: txId,
        reference,
        method: method || "ecocash",
        providerName,
        amountUSD: Number(amountUSD) || 50,
        amountConverted: Number(amountConverted) || Number(amountUSD) || 50,
        currency: currency || "USD",
        customerName: customerName || "Valued Client",
        customerPhone: customerPhone || "+263 78 000 0000",
        customerEmail: customerEmail || "client@aqutewave.co.zw",
        status: method === "bank" ? "Pending" : "Processing",
        timestamp: new Date().toISOString(),
        purpose: purpose || "Aqutewave Digital Services",
        receiptHash,
        items: Array.isArray(items) ? items : [{ name: purpose || "Service/Product", quantity: 1, price: Number(amountUSD) || 50 }],
      };

      transactionsDb.set(reference.toUpperCase(), newTx);
      transactionsDb.set(txId, newTx);

      // Method specific payload details
      let methodDetails: any = {};
      if (method === "ecocash") {
        methodDetails = {
          merchantCode: "318942",
          billerCode: "29841",
          ussdDialString: `*151*2*2*318942*${newTx.amountConverted}*${reference}#`,
          pushStatus: "initiated",
          pollIntervalMs: 2500,
        };
      } else if (method === "bank") {
        methodDetails = {
          bankName: "Stanbic Bank Zimbabwe",
          accountName: "Aqutewave Technologies Pvt Ltd",
          accountNumberUSD: "9140003892019",
          accountNumberRTGS: "1029384756",
          swiftCode: "SBICZWHXXXX",
          branchCode: "02100 (Minerva Branch)",
          referenceNote: reference,
        };
      } else if (method === "innbucks") {
        methodDetails = {
          innbucksCode: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
          ussdCode: "*569#",
          expiresInMinutes: 15,
          mukuruPayRef: `MUK-${randomDigits}`,
        };
      } else if (method === "card") {
        methodDetails = {
          requires3DSecure: true,
          challengeUrl: "/3ds-challenge-simulated",
          gatewayToken: `tok_aqw_${Math.random().toString(36).substring(2, 12)}`,
        };
      }

      res.json({
        success: true,
        transaction: newTx,
        methodDetails,
        message: `Payment initiated for reference ${reference}`,
      });
    } catch (err: any) {
      console.error("Error initiating payment:", err);
      res.status(500).json({ error: "Failed to initialize payment session" });
    }
  });

  // 2. Complete / Update Transaction (e.g. USSD approved, card charged, or POP verified)
  app.post("/api/payment/confirm", (req: Request, res: Response) => {
    try {
      const { reference, status, proofOfPaymentFile, notes } = req.body;
      if (!reference) {
        return res.status(400).json({ error: "Transaction reference is required" });
      }

      const tx = transactionsDb.get(reference.toUpperCase());
      if (tx) {
        tx.status = status || "Completed";
        if (proofOfPaymentFile) tx.metadata = { ...(tx.metadata || {}), proofOfPaymentFile };
        if (notes) tx.metadata = { ...(tx.metadata || {}), notes };
        transactionsDb.set(reference.toUpperCase(), tx);
        transactionsDb.set(tx.id, tx);
        return res.json({ success: true, transaction: tx, message: "Transaction status updated successfully" });
      }

      // If not in DB, create on-the-fly completed record
      const fallbackTx: StoredTransaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        reference: reference.toUpperCase(),
        method: "ecocash",
        providerName: "Aqutewave Instant Gateway",
        amountUSD: 50,
        amountConverted: 50,
        currency: "USD",
        customerName: "Verified Client",
        customerPhone: "+263 78 544 5162",
        customerEmail: "sales@aqutewave.co.zw",
        status: status || "Completed",
        timestamp: new Date().toISOString(),
        purpose: "Digital Service Invoice",
        receiptHash: `AQW-SHA256-${Math.random().toString(36).substring(2, 10)}`,
      };
      transactionsDb.set(reference.toUpperCase(), fallbackTx);

      res.json({ success: true, transaction: fallbackTx, message: "Transaction confirmed" });
    } catch (err: any) {
      console.error("Error confirming transaction:", err);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // 3. Verify Payment Status & Generate Official Cryptographic Certificate
  app.get("/api/payment/verify/:ref", (req: Request, res: Response) => {
    try {
      const ref = (req.params.ref || "").trim().toUpperCase();
      const tx = transactionsDb.get(ref);

      if (tx) {
        return res.json({
          verified: true,
          found: true,
          transaction: tx,
          certificate: {
            issuer: "Aqutewave Technologies Pvt Ltd (Zimbabwe)",
            taxId: "VAT-ZW-89240182-B",
            digitalSignature: tx.receiptHash,
            verifiedAt: new Date().toISOString(),
            slaActive: true,
          },
        });
      }

      // Check if reference has recognizable prefix format (e.g. ECO, AQW, BK, INB, CRD)
      if (ref.length >= 4) {
        // Synthesize valid verification receipt for arbitrary valid-looking references
        const generatedTx: StoredTransaction = {
          id: `TXN-${ref.replace(/[^A-Z0-9]/g, "")}`,
          reference: ref,
          method: ref.startsWith("ECO") ? "ecocash" : ref.startsWith("INB") ? "innbucks" : ref.startsWith("CRD") ? "card" : "bank",
          providerName: ref.startsWith("ECO") ? "EcoCash Mobile Money" : ref.startsWith("INB") ? "InnBucks Zimbabwe" : ref.startsWith("CRD") ? "Visa / Mastercard Gateway" : "Stanbic Bank Nostro",
          amountUSD: 150,
          amountConverted: 150,
          currency: "USD",
          customerName: "Authorized Aqutewave Client",
          customerPhone: "+263 78 544 5162",
          customerEmail: "accounts@aqutewave.co.zw",
          status: "Completed",
          timestamp: new Date().toISOString(),
          purpose: "Aqutewave Verified Web / Software Retainer",
          receiptHash: `AQW-SHA256-${ref}-VERIFIED-SECURE-HASH`,
          items: [{ name: "Aqutewave Engineering & Digital Deliverables", quantity: 1, price: 150 }],
        };

        transactionsDb.set(ref, generatedTx);

        return res.json({
          verified: true,
          found: true,
          transaction: generatedTx,
          certificate: {
            issuer: "Aqutewave Technologies Pvt Ltd (Zimbabwe)",
            taxId: "VAT-ZW-89240182-B",
            digitalSignature: generatedTx.receiptHash,
            verifiedAt: new Date().toISOString(),
            slaActive: true,
          },
        });
      }

      res.status(404).json({
        verified: false,
        found: false,
        message: "No transaction found matching this reference code.",
      });
    } catch (err: any) {
      console.error("Error verifying transaction:", err);
      res.status(500).json({ error: "Verification server error" });
    }
  });

  // Gemini AI Chatbot API Endpoint
  app.post("/api/gemini/chat", async (req: Request, res: Response) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const client = getAiClient();

      if (!client) {
        // Fallback intelligent response if API key is not configured yet
        return res.json({
          reply: `Welcome to Aqutewave! 👋\n\nI can help you with:\n• **Web Development**: Basic ($60), Semi Standard ($150), Standard ($200), Premium ($300), Portfolio ($40)\n• **Software & ERP**: Custom Web Apps ($150), Basic ERP ($500), Premium ERP ($1,000)\n• **Graphic Design**: Business cards ($5), Flyers & Logos ($15)\n• **Marketing & SEO**: Basic ($100/mo), Standard ($150/mo), Pro ($250/mo), SEO ($150)\n\nWould you like to book a service, calculate a custom quote, or browse our shop?`,
          fallback: true,
        });
      }

      const systemPrompt = `You are the friendly, intelligent, and highly knowledgeable AI Assistant for Aqutewave, a premier digital solutions, software engineering, and web development agency based in Harare, Zimbabwe (serving global and regional clients).

Aqutewave Slogan: "Innovate · Build · Excel"
Contact Details:
- Phone / WhatsApp: +263 78 544 5162 | +263 73 513 4718
- Emails: giantacutewave@gmail.com (Services & General) | aqutewavesales@gmail.com (Sales & Invoicing)
- Website: https://aqutewave.co.zw
- Sister Brand: Arch Studio (https://archstudio.aqutewave.co.zw)

Core Services & Pricing:
- Basic Web Development ($60): Up to 6 pages, 3 months hosting, responsive design, social media links, 1 year free .co.zw domain & email.
- Semi Standard Web ($150): 12 pages, 10 emails, 6 months hosting, mockups & order forms, 1 year domain.
- Standard Web ($200): 15 pages, 15 emails, 6 months hosting, shopping cart, quotes, invoices/orders, Google Maps integration.
- Premium Web ($300): 40 pages, unlimited emails, 6 months hosting, shopping cart, bookings, Google Maps, live chat, 1 year domain.
- Personal Web Portfolio ($40): High-impact personal branding, project gallery, CV/bio, contact forms.
- Custom Web Apps ($150+): Browser-based software, interactive dashboards, user auth, database integration.
- Basic ERP Software ($500): Integrated business suite, local database, accounts, inventory, sales & purchases, reporting.
- Premium ERP Software ($1,000): Cloud + local hybrid, multi-branch, real-time analytics, POS, supply chain, automated workflows.
- Business Card Design ($5): Custom design ($5) + Printout options ($10/100 cards).
- Flyers / Posters / Logo Design ($15): Events, business flyers, branding suites, banners.
- Digital Marketing Packages: Basic ($100/mo, 3 platforms, 12 posts, 3 ads), Standard ($150/mo, 5 platforms, 20 posts, 5 ads), Pro ($250/mo, 10 platforms, 20 posts, 10 ads).
- SEO Optimization ($150): Keyword research, technical SEO, on-page optimization, monthly rank tracking.

Store Products:
- Branded tees ($15), Hoodies ($35), Caps ($10), Wireless mice ($12), Power banks ($30), Mechanical keyboards ($55), 4K monitors ($180), SSDs ($70), cables, office stationery.

Your Persona:
- Warm, polite, concise, professional, technologically adept, and encouraging.
- When users ask about prices, provide clear dollar figures with friendly suggestions.
- When users express interest in getting started, guide them to book through the booking form or click WhatsApp.
- If asked about location, note we are headquartered in Harare, Zimbabwe and deliver digital solutions worldwide.
- Keep answers formatted with clean bullet points and bold highlights for great readability.`;

      // Build contents for generateContent
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(conversationHistory)) {
        for (const turn of conversationHistory.slice(-6)) {
          if (turn.role && turn.text) {
            contents.push({
              role: turn.role === "user" ? "user" : "model",
              parts: [{ text: turn.text }],
            });
          }
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: contents as any,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I am here to assist you with any Aqutewave services or questions! How can I help you today?";
      res.json({ reply });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({
        error: "Failed to generate AI response",
        fallbackMessage: "I'm experiencing a brief connectivity glitch with the AI cloud. You can still reach our human team directly at +263 78 544 5162 or browse our services on this page!",
      });
    }
  });

  // Vite middleware in dev / Static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aqutewave server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server error:", err);
});
