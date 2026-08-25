import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Smartphone,
  Store,
  ArrowLeft,
  Lock,
  Clock,
  Sparkles,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";
import { EcoCashOneMoneyGateway } from "./payment/EcoCashOneMoneyGateway";
import { BankNostroGateway } from "./payment/BankNostroGateway";
import { InnBucksMukuruGateway } from "./payment/InnBucksMukuruGateway";
import { VisaMastercardGateway } from "./payment/VisaMastercardGateway";
import { PaymentMethodType } from "../types";

export const PaymentGatewayPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    discountPercentage,
    formatPrice,
    currency,
    playSfx,
    showToast,
    setActivePage,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    checkoutBilling,
    customCheckoutAmount,
    customCheckoutPurpose,
    setLastTransaction,
  } = useApp();

  const [paymentRef, setPaymentRef] = useState<string>("");
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  // Determine effective total
  const isCartCheckout = cart.length > 0 && !customCheckoutAmount;
  const effectiveSubtotal = isCartCheckout
    ? cartSubtotal
    : customCheckoutAmount || 150;
  const discountVal = discountPercentage > 0 ? effectiveSubtotal * 0.1 : 0;
  const effectiveTotal = effectiveSubtotal - discountVal;

  // Convert amount for local gateways
  const amountConverted =
    currency === "ZWL" ? Math.round(effectiveTotal * 30) : effectiveTotal;

  useEffect(() => {
    // Generate distinct reference based on method
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    let prefix = "AQW";
    if (selectedPaymentMethod === "ecocash") prefix = "ECO";
    if (selectedPaymentMethod === "bank") prefix = "AQW-BNK";
    if (selectedPaymentMethod === "innbucks") prefix = "INB";
    if (selectedPaymentMethod === "card") prefix = "CRD";

    setPaymentRef(checkoutBilling.invoiceOrRef || `${prefix}-${randomDigits}`);
  }, [selectedPaymentMethod, checkoutBilling.invoiceOrRef]);

  const handlePaymentSuccess = (txData: any) => {
    const finalRecord = {
      id: txData.id || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      reference: paymentRef,
      method: selectedPaymentMethod,
      providerName:
        selectedPaymentMethod === "ecocash"
          ? "EcoCash Express"
          : selectedPaymentMethod === "bank"
          ? "Stanbic Bank Nostro"
          : selectedPaymentMethod === "innbucks"
          ? "InnBucks Zimbabwe"
          : "Visa / Mastercard",
      amountUSD: effectiveTotal,
      amountConverted,
      currency,
      customerName: checkoutBilling.fullName || "Valued Client",
      customerPhone: checkoutBilling.phone || "+263 78 544 5162",
      customerEmail: checkoutBilling.email || "client@aqutewave.co.zw",
      status: txData.status || (selectedPaymentMethod === "bank" ? "Pending" : "Completed"),
      timestamp: new Date().toISOString(),
      purpose: customCheckoutPurpose || "Aqutewave Services & Merchandise",
      receiptHash: `AQW-SHA256-${Math.random().toString(36).substring(2, 12)}`,
      items: isCartCheckout
        ? cart.map((c) => ({
            name: c.product.name,
            quantity: c.quantity,
            price: c.product.price,
          }))
        : [
            {
              name: customCheckoutPurpose || "Custom Service Deliverables",
              quantity: 1,
              price: effectiveTotal,
            },
          ],
    };

    setLastTransaction(finalRecord as any);
    playSfx("success");
    showToast("Redirecting to verification & tax invoice receipt...", "gold");
    setTimeout(() => {
      setActivePage("payment-verify");
    }, 600);
  };

  const copyRefToClipboard = () => {
    navigator.clipboard.writeText(paymentRef);
    setCopiedRef(true);
    playSfx("sparkle");
    showToast("Reference copied to clipboard!");
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const gatewayTabs: Array<{
    id: PaymentMethodType;
    name: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: "ecocash",
      name: "EcoCash / OneMoney",
      icon: <Smartphone className="w-4 h-4" />,
      color: "text-blue-400",
    },
    {
      id: "bank",
      name: "Bank / Nostro",
      icon: <Building2 className="w-4 h-4" />,
      color: "text-amber-400",
    },
    {
      id: "innbucks",
      name: "InnBucks / Mukuru",
      icon: <Store className="w-4 h-4" />,
      color: "text-emerald-400",
    },
    {
      id: "card",
      name: "Visa / Mastercard",
      icon: <CreditCard className="w-4 h-4" />,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 diamond-mesh relative min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Link & Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
          <button
            type="button"
            onClick={() => {
              playSfx("click");
              setActivePage("checkout");
            }}
            className="inline-flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-gray-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO CHECKOUT DETAILS</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-['Cinzel'] text-gray-400 block uppercase">
                ACTIVE TRANSACTION REFERENCE:
              </span>
              <span className="font-mono font-bold text-sm text-amber-300">
                {paymentRef}
              </span>
            </div>
            <button
              type="button"
              onClick={copyRefToClipboard}
              className="p-2 rounded-xl bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-black transition-all cursor-pointer"
              title="Copy Reference"
            >
              {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Gateway Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-black/60 border border-amber-500/20">
          {gatewayTabs.map((tab) => {
            const isActive = selectedPaymentMethod === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playSfx("click");
                  setSelectedPaymentMethod(tab.id);
                }}
                className={`p-3 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Gateway Execution Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left / Main Gateway Component (8 cols) */}
          <div className="lg:col-span-8">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
              {selectedPaymentMethod === "ecocash" && (
                <EcoCashOneMoneyGateway
                  amountUSD={effectiveTotal}
                  amountConverted={amountConverted}
                  reference={paymentRef}
                  customerPhone={checkoutBilling.phone}
                  customerName={checkoutBilling.fullName}
                  purpose={customCheckoutPurpose || "Aqutewave Deliverables"}
                  onSuccess={handlePaymentSuccess}
                />
              )}

              {selectedPaymentMethod === "bank" && (
                <BankNostroGateway
                  amountUSD={effectiveTotal}
                  amountConverted={amountConverted}
                  reference={paymentRef}
                  customerName={checkoutBilling.fullName}
                  customerPhone={checkoutBilling.phone}
                  customerEmail={checkoutBilling.email}
                  purpose={customCheckoutPurpose || "Aqutewave Deliverables"}
                  onSuccess={handlePaymentSuccess}
                />
              )}

              {selectedPaymentMethod === "innbucks" && (
                <InnBucksMukuruGateway
                  amountUSD={effectiveTotal}
                  amountConverted={amountConverted}
                  reference={paymentRef}
                  customerName={checkoutBilling.fullName}
                  customerPhone={checkoutBilling.phone}
                  purpose={customCheckoutPurpose || "Aqutewave Deliverables"}
                  onSuccess={handlePaymentSuccess}
                />
              )}

              {selectedPaymentMethod === "card" && (
                <VisaMastercardGateway
                  amountUSD={effectiveTotal}
                  amountConverted={amountConverted}
                  reference={paymentRef}
                  customerName={checkoutBilling.fullName}
                  customerPhone={checkoutBilling.phone}
                  customerEmail={checkoutBilling.email}
                  purpose={customCheckoutPurpose || "Aqutewave Deliverables"}
                  onSuccess={handlePaymentSuccess}
                />
              )}
            </div>
          </div>

          {/* Right Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-5">
              <h4 className="font-['Cinzel'] font-bold text-sm text-white flex items-center gap-2 border-b border-amber-500/15 pb-3">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Transaction Metadata</span>
              </h4>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Payee:</span>
                  <span className="text-white font-sans font-bold">Aqutewave Tech</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Client:</span>
                  <span className="text-white truncate max-w-[140px]">
                    {checkoutBilling.fullName || "Tatenda Moyo"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Phone:</span>
                  <span className="text-white">{checkoutBilling.phone || "+263 78 544 5162"}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Currency:</span>
                  <span className="text-amber-400 font-bold">{currency}</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-gray-300 font-['Cinzel']">Amount Due:</span>
                  <span className="text-xl font-['Cinzel_Decorative'] font-bold text-amber-300">
                    {formatPrice(effectiveTotal)}
                  </span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="pt-2 p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center gap-2 text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real-time Webhook & Push Polling</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400 font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Encrypted Cryptographic Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
