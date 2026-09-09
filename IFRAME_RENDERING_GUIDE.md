# Aqutewave Iframe & Live Preview Rendering Guide

This guide documents how live interactive demo iframes are configured, hosted, uploaded, and rendered within the Aqutewave platform.

---

## 1. Overview & System Architecture

The Aqutewave web application uses an embedded interactive modal (`TemplateIframeModal.tsx`) to showcase live demos of:
- **ERP & Enterprise Solutions** (Retail POS, Warehouse WMS, School Management, Fleet Logistics, Accounting).
- **Portfolio Case Studies** (Client websites, web apps, SaaS dashboards).
- **Interactive UI Templates & Demos**.

Instead of requiring potential clients to navigate away from the website or log in to a separate staging server, clicking **"Live Preview"** or **"Launch Interactive Demo"** opens a sandboxed iframe modal directly over the page.

---

## 2. Setting Up an Iframe Demo in the Admin Dashboard

### A. For Software & ERP Solutions
1. Log in to the **Admin Dashboard** (`/admin` or via the Navbar Admin badge).
2. Navigate to the **ERP & Software Solutions** module (`AdminContentSoftwareModule`).
3. In the creation/edit form, locate:
   - **"Live Template Iframe / App Interactive Preview URL"** (`templateUrl` field).
4. Enter the public demo URL (e.g., `https://pos-demo.aqutewave.co.zw` or `https://my-app.vercel.app`).
5. Optionally add:
   - **Demo Credentials Note** (e.g., `User: demo@aqutewave.com | Pass: demo123`).
   - **Documentation / Manual URL** (for external user manuals or Swagger API docs).
6. Click **Save / Update Software Solution**.

### B. For Portfolio Projects
1. In the **Admin Dashboard**, select **Portfolio & Case Studies** (`AdminContentPortfolioModule`).
2. In the project form, enter your hosted web application address into the **"Project Live URL"** field.
3. Save the project.

---

## 3. Two Hosting & Uploading Methods

### Method 1: Externally Hosted Web App / Staging URL (Recommended)
This is the most common approach for dynamic full-stack applications (PHP, Node.js, Python, Laravel, React, Vue, Next.js):
- Deploy your staging demo to Vercel, Netlify, Cloudflare Pages, AWS, or an Aqutewave subdomain (e.g., `https://demo.aqutewave.co.zw`).
- Paste the URL directly into the `templateUrl` input.

### Method 2: Self-Contained Static HTML Bundle (Self-Hosted on Express)
If you have a compiled single-page bundle or a standalone HTML/CSS/JS export (e.g., an HTML5 dashboard template, interactive canvas, or static presentation):
1. **Upload or place the folder on the server**:
   - The Express backend serves static assets from `/uploads` and `/public`.
   - You can upload files via the backend `/api/upload` endpoint or place a folder such as `public/demos/pos-system/index.html`.
2. **Reference the local path**:
   - In the **Live Preview URL** field, enter the relative URL:
     ```
     /demos/pos-system/index.html
     ```
     or
     ```
     /uploads/pos-demo/index.html
     ```
3. Because the demo is hosted on the same origin as the Aqutewave app, there are **no cross-origin restrictions** and the iframe loads instantly.

---

## 4. Browser Security & Configuration Requirements

When embedding an external website in an iframe, modern web browsers enforce strict security policies. Ensure your demo server meets the following criteria:

### 1. Mandatory HTTPS (SSL)
- The Aqutewave platform runs securely over `https://`.
- **Rule**: An HTTPS website cannot embed an unencrypted `http://` iframe (Browsers will throw a **Mixed Content Error** and block the frame from loading).
- **Fix**: Ensure your demo URL begins with `https://`. Free SSL certificates can be provisioned via Let's Encrypt, Cloudflare, or your hosting provider.

### 2. Allow Framing (`X-Frame-Options` & CSP)
By default, some web servers, CMSs (WordPress, Shopify), or web frameworks send security headers that block iframe embedding.

If the browser displays:
> *"Refused to display in a frame because it set 'X-Frame-Options' to 'deny' or 'sameorigin'"*

Configure your demo web server to allow framing:

#### A. Nginx Configuration
```nginx
# Remove strict deny header
fastcgi_hide_header X-Frame-Options;
proxy_hide_header X-Frame-Options;

# Allow embedding from Aqutewave domain (or all domains for public demos):
add_header Content-Security-Policy "frame-ancestors 'self' https://*.aqutewave.co.zw https://*.run.app;" always;
```

#### B. Apache Configuration (`.htaccess` or `httpd.conf`)
```apache
# Remove DENY or SAMEORIGIN
Header unset X-Frame-Options

# Or allow frame ancestors
Header set Content-Security-Policy "frame-ancestors 'self' https://*.aqutewave.co.zw https://*.run.app"
```

#### C. Express / Node.js Backend
If using Helmet middleware on your demo server:
```typescript
import helmet from "helmet";

app.use(
  helmet({
    frameguard: false, // Disables X-Frame-Options: SAMEORIGIN
    contentSecurityPolicy: {
      directives: {
        frameAncestors: ["'self'", "https://*.aqutewave.co.zw", "https://*.run.app"],
      },
    },
  })
);
```

#### D. Vercel (`vercel.json`)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://*;"
        }
      ]
    }
  ]
}
```

---

## 5. How the Aqutewave Player Renders the Iframe

Inside `/src/components/TemplateIframeModal.tsx`, the iframe is rendered with robust sandboxing and responsive device toggles:

```tsx
<iframe
  src={activeTemplate.templateUrl}
  title={activeTemplate.title}
  className="w-full h-full border-0 bg-white"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  loading="lazy"
/>
```

### Sandbox Permissions Explained
- `allow-scripts`: Permits JavaScript execution (required for React, Vue, jQuery, POS calculations).
- `allow-same-origin`: Allows the embedded demo to manage its own session cookies, `localStorage`, and client-side database.
- `allow-forms`: Enables login inputs, checkout forms, and search filters.
- `allow-popups`: Allows demo buttons to open external tabs when needed (e.g., payment gateways or receipt printers).

### Device Breakpoint Switcher
The modal provides one-click responsive previews:
- **Desktop View**: `w-full` (100% viewport width).
- **Tablet View**: `max-w-[768px]` (emulates iPad/tablet POS screens).
- **Mobile View**: `max-w-[390px]` (emulates mobile retail and responsive UI).
- **Full Screen / New Tab**: Includes a direct button allowing users to open the demo in a full browser tab if preferred.

---

## 6. Troubleshooting Checklist

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Blank white box or "Refused to connect"** | Target server has `X-Frame-Options: DENY` or `SAMEORIGIN`. | Remove `X-Frame-Options` on the demo server or configure `Content-Security-Policy: frame-ancestors`. |
| **Shield icon / "Insecure content blocked"** | Demo URL uses `http://` instead of `https://`. | Change the URL in Admin Portal to `https://`. Ensure target site has an active SSL certificate. |
| **Demo cookies/login reset on refresh** | Browser third-party cookie restrictions (Safari/Brave). | Use token-based authorization (JWT / `localStorage`) rather than third-party session cookies for iframe demos. |
| **Cannot find iframe URL input** | Field is blank in Firestore/local state. | Go to **Admin Portal → ERP & Software Solutions**, edit the item, fill the "Interactive Preview URL" field, and save. |

---

## 7. Quick Reference: Recommended Preset Testing URLs

You can test the iframe player with these known embed-friendly URLs:
- Wikipedia: `https://en.m.wikipedia.org`
- OpenStreetMap: `https://www.openstreetmap.org/export/embed.html`
- Aqutewave Staging Subdomain: `https://demo.aqutewave.co.zw`
