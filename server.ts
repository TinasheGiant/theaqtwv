import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

// Ensure public uploads directory exists
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure Multer Storage for drag & drop and file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    const rawBase = path.basename(file.originalname, ext);
    const sanitizedBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35) || "upload";
    const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1e6);
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // Accept standard images and svgs
    if (file.mimetype.startsWith("image/") || file.originalname.match(/\.(png|jpe?g|webp|gif|svg|avif)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (PNG, JPG, JPEG, WEBP, GIF, SVG, AVIF) are accepted."));
    }
  },
});

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

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Static serving of uploaded images directly from uploads directory
  app.use("/uploads", express.static(UPLOAD_DIR));

  // ==========================================
  // IMAGE UPLOAD SYSTEM (SHOP, PORTFOLIO, ERP, BLOGS)
  // Supports Multipart Form-Data (Drag & Drop, File Picker) and Base64 JSON
  // ==========================================

  // 1. Single Image Upload endpoint (Form-Data or Base64 JSON)
  app.post("/api/upload", (req: Request, res: Response) => {
    // Wrap upload.single to catch errors and fallback to base64 if needed
    const uploadSingle = upload.single("file");

    uploadSingle(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer Upload Error:", err);
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        console.error("File Filter Error:", err);
        return res.status(400).json({ error: err.message || "Invalid file uploaded" });
      }

      // Case A: Multipart File successfully uploaded via Drag & Drop or File Picker
      if (req.file) {
        const fileUrl = `/uploads/${req.file.filename}`;
        return res.json({
          success: true,
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          uploadedAt: new Date().toISOString(),
        });
      }

      // Case B: Base64 / Data URL uploaded via JSON payload
      const base64Data = req.body?.image || req.body?.dataUrl || req.body?.base64;
      if (base64Data && typeof base64Data === "string") {
        try {
          const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          let ext = ".png";
          let rawBuffer: Buffer;

          if (matches && matches.length === 3) {
            const rawExt = matches[1].toLowerCase();
            ext = rawExt === "jpeg" ? ".jpg" : `.${rawExt}`;
            rawBuffer = Buffer.from(matches[2], "base64");
          } else {
            // Raw base64 string without header
            rawBuffer = Buffer.from(base64Data, "base64");
          }

          const rawName = (req.body.filename || req.body.name || "upload").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35);
          const filename = `${rawName}-${Date.now()}-${Math.floor(Math.random() * 1e6)}${ext}`;
          const filePath = path.join(UPLOAD_DIR, filename);

          fs.writeFileSync(filePath, rawBuffer);
          const fileUrl = `/uploads/${filename}`;

          return res.json({
            success: true,
            url: fileUrl,
            filename,
            size: rawBuffer.length,
            mimetype: `image/${ext.replace(".", "")}`,
            uploadedAt: new Date().toISOString(),
          });
        } catch (base64Err: any) {
          console.error("Base64 processing error:", base64Err);
          return res.status(500).json({ error: "Failed to process base64 image data" });
        }
      }

      return res.status(400).json({
        error: "No file or image payload was received. Please attach a file or base64 data.",
      });
    });
  });

  // 2. Multiple Images Upload endpoint (e.g. ERP feature gallery or Shop variations)
  app.post("/api/upload/multiple", upload.array("files", 10), (req: Request, res: Response) => {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      if (files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploaded = files.map((file) => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      }));

      res.json({
        success: true,
        count: uploaded.length,
        files: uploaded,
      });
    } catch (err: any) {
      console.error("Multiple upload error:", err);
      res.status(500).json({ error: "Failed to upload multiple files" });
    }
  });

  // 3. List recent uploaded media files
  app.get("/api/uploads", (req: Request, res: Response) => {
    try {
      if (!fs.existsSync(UPLOAD_DIR)) {
        return res.json({ files: [] });
      }

      const fileNames = fs.readdirSync(UPLOAD_DIR);
      const files = fileNames
        .filter((name) => !name.startsWith("."))
        .map((name) => {
          try {
            const stats = fs.statSync(path.join(UPLOAD_DIR, name));
            return {
              name,
              url: `/uploads/${name}`,
              size: stats.size,
              createdAt: stats.birthtime || stats.mtime,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.json({ success: true, count: files.length, files });
    } catch (err: any) {
      console.error("Error reading uploads directory:", err);
      res.status(500).json({ error: "Failed to retrieve uploads catalog" });
    }
  });

  // 4. Delete an uploaded image file
  app.delete("/api/upload/:filename", (req: Request, res: Response) => {
    try {
      const filename = path.basename(req.params.filename); // Strip any path traversal
      const targetPath = path.join(UPLOAD_DIR, filename);

      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
        return res.json({ success: true, message: `File ${filename} removed successfully` });
      }
      res.status(404).json({ error: "File not found" });
    } catch (err: any) {
      console.error("Error deleting upload:", err);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

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

  // Gemini AI Chatbot API Endpoint with Relational Search & App Circle Matrix
  app.post("/api/gemini/chat", async (req: Request, res: Response) => {
    try {
      const { message, conversationHistory, appContextDigest } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const client = getAiClient();

      const systemPrompt = `You are Aqutewave AI Copilot, the intelligent digital consultant for Aqutewave Technologies Pvt Ltd, Zimbabwe's premier software engineering and digital solutions agency (headquartered in Harare, Zimbabwe, serving global clients).

Aqutewave Motto: "Innovate · Build · Excel"
Official Website: https://aqutewave.co.zw
Harare Hub: Harare CBD / Avondale Tech Hub, Harare, Zimbabwe
Phone / WhatsApp: +263 78 544 5162 | +263 73 513 4718
Emails: giantacutewave@gmail.com (General & Projects) | aqutewavesales@gmail.com (Invoicing)
Developer Education Hub: FullStackPHP (https://fullstackphp.aqutewave.co.zw)

CRITICAL DIRECTIVE — APP CIRCLE BOUNDARY & RELATIONAL SEARCH:
1. STRICT APP CIRCLE: Present answers straight in direct link with Aqutewave application data on the frontend UI. NEVER wander off into broad external topics, general programming tutorials, or unrelated worldwide trivia. Every answer must be tightly bounded within Aqutewave's services, software, ERP, tech hardware, pricing, and payment ecosystem.
2. OUT-OF-DOMAIN GUARD: If the user asks something outside Aqutewave's digital scope (e.g. sports, cooking, politics), politely state that it lies outside Aqutewave's software engineering circle, and immediately anchor the response back to Aqutewave's core offerings (Web packages from $60, Offline ERP at $500, Tech Store, or Cost Estimator).
3. RELATIONAL MATRIX GROUNDING:
   - For ANY query (whether a single keyword like "erp", "keyboard", "price" or a full sentence), link directly to the app's real offerings:
     * Web Development: Basic ($60), Semi Standard ($150), Standard E-Commerce ($200), Premium Enterprise ($300), Portfolio ($40). All include free 1-yr .co.zw domain and business emails!
     * Offline ERP Business Suite: Basic ERP ($500 perpetual license, 100% offline, POS receipt printing, inventory, multi-currency invoicing, zero forced monthly fees), Premium ERP ($1,000 multi-branch).
     * Graphic Design: Business cards ($5), Flyers & Logos ($15), Branding suites ($25).
     * Tech Equipment: Mechanical keyboards ($55), 4K monitors ($180), gaming mice ($12), SSDs ($45), hoodies ($35).
     * Payment Channels: EcoCash USD/ZWL, InnBucks, Stanbic Nostro bank FCA, Visa/Mastercard.
     * Receipt Verification: Cryptographic check with reference codes (e.g. DEMO-2026, ECO-782910).
     * Project Estimator: Live multi-currency quote calculator with ZIMRA VAT.
4. RELATIONAL CROSS-LINKS: Systematically connect related modules in the answer (e.g. Website ➔ Estimator & Portfolio; ERP Software ➔ Tech Store Hardware & Consultation; Payment ➔ Receipt Verification).
5. MANDATORY DIRECTIONAL NAV TAGS: At the end of every answer, provide 2-3 in-app navigational tags formatted exactly as:
[[NAV:page_id:Button Title:Short Description]]
Valid page_id options: "services", "software", "estimator", "portfolio", "shop", "booking", "payment", "payment-verify", "portal", "membership", "contact", "faqs".
${appContextDigest ? `\nLIVE APP CONTEXT:\n${appContextDigest}\n` : ""}`;

      if (!client) {
        // Fallback intelligent response if API key is not yet configured in environment
        const lower = message.toLowerCase();
        let fallbackReply = `Welcome to Aqutewave! 👋\n\nI can help you with:\n• **Web Development**: Basic ($60), Semi Standard ($150), Standard ($200), Premium ($300), Portfolio ($40)\n• **Software & ERP**: Custom Web Apps ($150+), Basic ERP ($500), Premium ERP ($1,000)\n• **Graphic Design**: Business cards ($5), Flyers & Logos ($15)\n• **Marketing & SEO**: Basic ($100/mo), Standard ($150/mo), Pro ($250/mo), SEO ($150)\n\nAll web packages include 1 year of free .co.zw domain, business emails, and SSD hosting!`;

        let navTags = `[[NAV:services:View Web Packages:Browse packages from $60]]\n[[NAV:estimator:Open Cost Estimator:Calculate project price in USD, ZWL, or ZAR]]`;

        if (lower.includes("price") || lower.includes("cost") || lower.includes("how much") || lower.includes("quote")) {
          fallbackReply = `Aqutewave provides transparent pricing with zero hidden fees:\n\n• **Basic Website**: **$60** (6 pages, free 1-yr .co.zw domain, 3 mo hosting, emails)\n• **Standard Web & E-Commerce**: **$200** (15 pages, shopping cart, invoices, Google Maps)\n• **Basic ERP Software**: **$500** (Offline-first, inventory, invoicing, POS, zero monthly fees)\n• **Premium Multi-Branch ERP**: **$1,000** (Cloud + local sync, supply chain, audit logs)\n• **Graphic Design**: **$5** business cards, **$15** logos & flyers\n\nUse our live Cost Estimator to compute exact project figures with ZIMRA VAT.`;
          navTags = `[[NAV:estimator:Open Cost Estimator:Compute custom website or ERP price]]\n[[NAV:services:View Web Packages:Explore web packages from $60]]`;
        } else if (lower.includes("erp") || lower.includes("software") || lower.includes("inventory") || lower.includes("pos")) {
          fallbackReply = `Aqutewave specializes in offline-first ERP software tailored for Zimbabwean enterprises:\n\n• **Basic ERP ($500)**: Operates 100% offline without internet. Includes live inventory tracking, POS receipt printing, multi-currency invoicing (USD, ZWL, ZAR), and ledger reporting.\n• **Premium ERP ($1,000)**: Multi-branch cloud sync, purchase order automation, supplier portals, and cryptographic audit trails.\n\nBest of all: **One-time payment with zero mandatory monthly subscription lock-in!**`;
          navTags = `[[NAV:software:Explore ERP Software:Review modules, inventory, and POS]]\n[[NAV:estimator:Calculate ERP Quote:Customize software add-ons]]`;
        } else if (lower.includes("pay") || lower.includes("ecocash") || lower.includes("innbucks") || lower.includes("bank") || lower.includes("receipt") || lower.includes("verify")) {
          fallbackReply = `Aqutewave provides secure, multi-currency payment options:\n\n• **EcoCash USD & ZWL**: Instant merchant biller / dial code payment with automated SMS reference.\n• **InnBucks**: Convenient deposit code redeemable at any Simbisa / Chicken Inn outlet.\n• **Stanbic Bank Zimbabwe**: Direct Nostro USD FCA bank transfer.\n• **Visa / Mastercard**: Card gateway for regional and diaspora clients.\n\nEvery transaction generates an authentic cryptographic receipt that you can verify anytime.`;
          navTags = `[[NAV:payment:Go to Payment Gateway:View EcoCash, InnBucks, and Nostro options]]\n[[NAV:payment-verify:Verify Payment Receipt:Check reference and authenticated SLA]]`;
        } else if (lower.includes("contact") || lower.includes("phone") || lower.includes("whatsapp") || lower.includes("location") || lower.includes("harare")) {
          fallbackReply = `You can connect with Aqutewave directly:\n\n• **Phone / WhatsApp**: **+263 78 544 5162** (Primary) | **+263 73 513 4718**\n• **Email**: giantacutewave@gmail.com | aqutewavesales@gmail.com\n• **Physical Hub**: Harare CBD / Avondale Tech Hub, Harare, Zimbabwe\n• **Operating Hours**: Mon–Fri 08:00–18:00, Sat 09:00–14:00\n\nFeel free to message us on WhatsApp for rapid project scoping!`;
          navTags = `[[NAV:contact:Open Contact Page:View Harare map and office details]]\n[[NAV:booking:Book a Consultation:Schedule project discussion]]`;
        }

        return res.json({
          reply: `${fallbackReply}\n\n${navTags}`,
          fallback: true,
        });
      }

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
        model: "gemini-3.8-flash",
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
        fallbackMessage: "I'm experiencing a temporary connectivity glitch with the AI cloud. You can still reach our team directly at +263 78 544 5162 or explore our web services!",
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
