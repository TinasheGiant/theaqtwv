# Aqutewave Technologies — Master System Credentials & Access Directory

> **Confidential & Operational Reference**  
> *Last Updated: September 2026*  
> *Platform: Aqutewave Technologies Zimbabwe — Enterprise Portal & ERP Suite*

---

## 1. Executive Leadership & Administrative Staff (RBAC Gateway)

Access via URL: **`https://fullstackphp.aqutewave.co.zw/#admin`** or navigation menu **Admin Gateway** (`#admin`).

| Role / Rank | Full Name | Email Address / Login | Primary Password | Alternative Password | Permissions Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CEO & Founder** *(Executive)* | **Tinashe R. Tinarwo** | `ceo@aqutewave.co.zw`<br>`regimsontina@gmail.com`<br>`tinashe@aqutewave.co.zw` | `ceo@aqutewave2026` | `aqutewave2026` | **Level 3 (Super Admin)**<br>Full access across all 20 modules |
| **Operations Director** | **Kudzai Marufu** | `manager@aqutewave.co.zw`<br>`kudzai@aqutewave.co.zw` | `manager@aqutewave2026` | `aqutewave2026` | **Level 2 (Manager)**<br>Operations, Sales, Invoices, Billing, Logs |
| **Lead Content Editor** | **Rumbidzai Moyo** | `editor@aqutewave.co.zw`<br>`rumbidzai@aqutewave.co.zw` | `editor@aqutewave2026` | `aqutewave2026` | **Level 1 (Editor)**<br>Services, Shop, Blogs, Portfolio, Software ERP |

> **Note on Quick Sandbox Access:**  
> On the Admin Gateway login screen (`#admin`), there is also a **1-Click Sandbox Login** button for instant testing across all three tiers without manual password typing.

---

## 2. Administrative Role Matrix & Module Privileges

| Administrative Module | CEO (Level 3) | Manager (Level 2) | Editor (Level 1) | Notes |
| :--- | :---: | :---: | :---: | :--- |
| **Executive Analytics & KPI Dashboard** | ✅ | ✅ | ✅ | Financial totals, visitor stats, recent activity |
| **Services Management** | ✅ | ✅ | ✅ | Add, edit, delete digital & technical services |
| **Shop & Merchandise Catalog** | ✅ | ✅ | ✅ | Inventory, pricing, e-commerce listings |
| **Knowledge Base & Blog Publisher** | ✅ | ✅ | ✅ | Articles, publishing, media embeds |
| **Portfolio Showcase** | ✅ | ✅ | ✅ | Client case studies, testimonials |
| **Software & OmniERP Hub** | ✅ | ✅ | ✅ | Software demos, deployment links |
| **Client Bookings & Consultations** | ✅ | ✅ | ❌ | Appointment schedules & confirmations |
| **Customer Orders** | ✅ | ✅ | ❌ | Order fulfillment & tracking |
| **Promotions & Discount Coupons** | ✅ | ✅ | ❌ | Coupon code generation & limits |
| **VIP Membership Plans** | ✅ | ✅ | ❌ | Retainers & tier subscriptions |
| **Payment Gateway & Transactions** | ✅ | ✅ | ❌ | EcoCash, Paynow, InnBucks, Nostro logs |
| **Invoices (ZIMRA Compliant)** | ✅ | ✅ | ❌ | Tax invoices generation & dispatch |
| **Payment Receipts** | ✅ | ✅ | ❌ | Verified fiscal receipt records |
| **Custom Quotations** | ✅ | ✅ | ❌ | Corporate price estimates |
| **Client Directory** | ✅ | ✅ | ❌ | Client accounts & enterprise details |
| **Role & Permission Management** | ✅ | ❌ | ❌ | *Strict RBAC: Only CEO can promote to CEO* |
| **User Access Accounts** | ✅ | ❌ | ❌ | Create, suspend, or remove admin users |
| **Client Support Desk** | ✅ | ✅ | ❌ | Ticket resolution & thread replies |
| **Direct Contact Inquiries** | ✅ | ✅ | ❌ | Public contact form messages |
| **System Settings & Integrations** | ✅ | ❌ | ❌ | *Exclusive to CEO* (maintenance, currencies, APIs) |
| **Audit Security Logs** | ✅ | ✅ | ❌ | IP, timestamp, and unauthorized attempt logs |

---

## 3. Client Portal & Enterprise Customer Accounts

Access via URL: **`https://fullstackphp.aqutewave.co.zw/#portal`** or click **Client Portal / Sign In** in the header.

| Client Profile Name | Contact Email / Username | Company / Organization | Tier Status | Phone Number | ZIMRA TIN |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tinashe R Tinarwo** | `tinashe@apexretail.co.zw`<br>*(ID: `usr-apex-01`)* | **Apex Retailers Zimbabwe Ltd** | Enterprise VIP Partner *(40h/mo)* | `+263 77 234 5678` | `ZIMRA-TIN-89410294-ZW` |
| **Solomon Chitepo** | `solomon.chitepo@zimsyndicate.co.zw`<br>*(ID: `usr-corp-02`)* | **Chitepo Financial Holdings** | Corporate Syndicate *(80h/mo)* | `+263 71 892 4110` | `ZIMRA-TIN-77192033-ZW` |
| **Rumbidzai Moyo** | `rumbi@zimboutique.co.zw`<br>*(ID: `usr-growth-03`)* | **ZimBoutique Fashion Group** | Growth Retainer *(15h/mo)* | `+263 78 544 5162` | `ZIMRA-TIN-66281900-ZW` |

### Client Sign-In Methods Available:
1. **Email / Account ID Quick Access**: Enter any of the above emails or IDs in the portal prompt.
2. **1-Click Demo Profile Switcher**: Switch instantly to any client profile from the modal tabs.
3. **New Client Self-Registration**: Any customer can register using their email and any 6+ character password.
4. **Google Single Sign-On (GSI)**: Supports Google account authentication.

---

## 4. Firebase Cloud & External Service Configuration

| Service Parameter | Production Value | Description |
| :--- | :--- | :--- |
| **Firebase Project ID** | `aqutewave` | Google Cloud & Firebase project ID |
| **Firestore Database ID** | `ai-studio-aqutewavedigital-b9874126-d788-4c2e-b69d-f1b303b0befc` | Cloud Firestore primary instance |
| **Fallback Database ID** | `(default)` | Secondary automated fallback instance |
| **Web App ID** | `1:235026112524:web:b560a469cd51c97219ce29` | Firebase Web App credential |
| **Auth Domain** | `aqutewave.firebaseapp.com` | Google Identity & Firebase Auth domain |
| **Storage Bucket** | `aqutewave.firebasestorage.app` | Media and asset cloud storage |
| **Executive OAuth Link** | `regimsontina@gmail.com` | Automatically gains full Level 3 CEO access |

---

## 5. Direct Page Navigation Routes (Hash Links)

| Portal Section | Route | Description |
| :--- | :--- | :--- |
| **Public Homepage** | `/#home` | Landing page, luxury showcase, interactive widgets |
| **Administrative Gateway** | `/#admin` | Protected staff login & 20-module management dashboard |
| **Client Portal** | `/#portal` | Invoices, receipts, live projects, bookings & support |
| **Services Catalog** | `/#services` | Digital architecture, software engineering, branding |
| **E-Commerce Shop** | `/#shop` | Hardware, software licenses, merchandise |
| **Software ERP Suite** | `/#software` | OmniERP, POS, school management demos & specs |
| **Portfolio Showcase** | `/#portfolio` | Verified Zimbabwean & African corporate projects |
| **Direct Booking** | `/#booking` | Schedule physical or virtual consultations |
| **Project Estimator** | `/#estimator` | Live interactive quote and project calculator |
| **Payment Gateway** | `/#payment-gateway` | Multi-currency checkout (EcoCash, Nostro, InnBucks, Card) |
| **Transaction Verifier** | `/#payment-verify` | Instant receipt & reference verification engine |
| **Contact & Inquiries** | `/#contact` | Direct communication desk with Harare HQ |

---

## 6. Security Enforcement Guidelines

1. **Manager Protection Rule**: Operations Managers cannot promote themselves or anyone else to CEO. Only an existing CEO can grant Level 3 CEO access.
2. **Demotion Protection**: The system disallows demoting or deleting the last remaining CEO account.
3. **Editor Confinement**: Editors are restricted to creative catalog content (Services, Shop, Blogs, Portfolio) and cannot view client financial data or invoice balances.
4. **Audit Trail**: Every authorization attempt (successful or denied) logs the IP address, timestamp (CAT), module targeted, and admin ID to the immutable `access_logs` collection.
