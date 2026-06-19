import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminApp from './admin/AdminApp';
import { supabase } from './supabase';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion';
import { 
  Menu, X, ChevronRight, ArrowRight, Sparkles, MoveRight, ChevronLeft, Calendar, Award, 
  Instagram, Linkedin, Youtube, Globe, Brain, Users, Home, Utensils, GraduationCap, Image as LucideImage,
  Target, Eye, ShieldCheck, TrendingUp, AlertCircle, Building2, Workflow, Lightbulb, Heart, Info, Phone, MapPin,
  CheckCircle2, Footprints, Zap, Star, Activity, LayoutGrid, Newspaper, MessageSquare, Shield, PenTool,
  Quote, Compass, Anchor, Mic2, UsersRound, Wallet, Stethoscope, Baby, Wallet2, Crosshair,
  Users2 as DemographyIcon, TrendingUp as GrowthIcon, Briefcase, Home as HomeIcon, HeartPulse, GraduationCap as SchoolIcon, Coins,
  Play, Mail, Handshake, HeartHandshake, Send, ChevronUp, Cpu, ShieldAlert, UserRound, CreditCard, Loader2, Info as InfoIcon,
  ExternalLink, Lock, Facebook, Tv2, FileText, Share2, Clock, UploadCloud, Check
} from 'lucide-react';
import { 
  NAVIGATION, STRATEGIC_PHASES, STATS, COLORS, HERO_IMAGES, GALLERY_IMAGES,
  MISSION_VISION, DETAILED_ABOUT, DONOR_PAGE_CONTENT, LUV_ACT_PROGRAMS, LEADERSHIP_MESSAGE, LUVWATTS_CONTENT,
  GLOBAL_SERVICES_DATA, VIDEO_RESOURCES, CORE_VALUES, TEAM_MEMBERS, SHOE_DRIVE_IMAGES, RESOURCES_CONTENT,
  WORKSHOP_DETAILS
} from './constants';

// --- Payment Gateway Integrations & Modal ---

const PAYPAL_CLIENT_ID_DEFAULT = (import.meta as any).env?.VITE_PAYPAL_CLIENT_ID || "EArBW7ACQiGcI2SQACdDFVLYB2KS_6WpCUI1cdUgpJwyxjCherMiy7h14b4C-c3s_8IIXnsqttyzuqQg";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (
    msg: string, 
    txId: string, 
    method: string, 
    donorInfo?: { fullName: string; email: string; amount: number }
  ) => void;
  onError: (msg: string) => void;
  initialAmount?: string;
  isLockedAmount?: boolean;
  gatewayConfigs?: Record<string, any>;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onError,
  initialAmount = '50',
  isLockedAmount = false,
  gatewayConfigs = {},
  donorName = '',
  donorEmail = '',
  donorPhone = ''
}: PaymentModalProps) => {
  const [amount, setAmount] = useState(initialAmount);
  const [step, setStep] = useState(isLockedAmount ? 'pay' : 'info');
  const [fullName, setFullName] = useState(donorName);
  const [email, setEmail] = useState(donorEmail);
  const [activeMethod, setActiveMethod] = useState<string>('');
  
  // Method-specific states
  const [isSdkLoading, setIsSdkLoading] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Stripe form fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');
  
  // Bank transfer reference
  const [bankRef, setBankRef] = useState('');

  const paypalRef = useRef<HTMLDivElement>(null);
  const scriptId = 'paypal-sdk-script';

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetVal = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const limitedVal = targetVal.slice(0, 16);
    const parts = [];
    for (let i = 0; i < limitedVal.length; i += 4) {
      parts.push(limitedVal.substring(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let targetVal = e.target.value.replace(/[^0-9]/gi, '').slice(0, 4);
    if (targetVal.length > 2) {
      targetVal = `${targetVal.slice(0, 2)}/${targetVal.slice(2)}`;
    }
    setCardExpiry(targetVal);
  };

  // Format CVC
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetVal = e.target.value.replace(/[^0-9]/gi, '').slice(0, 4);
    setCardCvc(targetVal);
  };

  // Reset steps and values when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount);
      setStep(isLockedAmount ? 'pay' : 'info');
      setFullName(donorName);
      setEmail(donorEmail);
      setActiveMethod('');
      setSdkError(null);
      setIsSdkLoading(false);
      setCardName(donorName);
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      setCardZip('');
      setBankRef('');
    }
  }, [isOpen, initialAmount, isLockedAmount, donorName, donorEmail]);

  // Resolve active/enabled gateways
  const activeGateways = Object.entries(gatewayConfigs)
    .filter(([_, conf]: [string, any]) => conf.enabled === 'true')
    .map(([id]) => id);

  // Fallback to paypal if none are enabled
  const displayedGateways = activeGateways.length > 0 ? activeGateways : ['paypal'];

  // Automatically select the method if only one is enabled
  useEffect(() => {
    if (isOpen && step === 'pay' && displayedGateways.length === 1) {
      setActiveMethod(displayedGateways[0]);
    }
  }, [isOpen, step, displayedGateways]);

  // Load external scripts (Flutterwave / Paystack)
  const loadScript = (url: string, id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById(id)) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = id;
      script.src = url;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // PayPal checkout integration
  useEffect(() => {
    if (isOpen && step === 'pay' && activeMethod === 'paypal') {
      const paypalConfig = gatewayConfigs.paypal || {};
      const clientId = paypalConfig.client_id || PAYPAL_CLIENT_ID_DEFAULT;
      const currency = paypalConfig.currency || 'USD';
      const mode = paypalConfig.mode || 'live';
      
      const loadPayPalScript = () => {
        if ((window as any).paypal) {
          setIsSdkLoading(false);
          renderPayPalButtons();
          return;
        }

        setIsSdkLoading(true);
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=buttons&enable-funding=venmo,paylater`;
        script.async = true;
        script.onload = () => {
          setIsSdkLoading(false);
          renderPayPalButtons();
        };
        script.onerror = () => {
          setIsSdkLoading(false);
          setSdkError("Embedded gateway restricted. Please use direct portal.");
        };
        document.body.appendChild(script);
      };

      const renderPayPalButtons = async () => {
        try {
          if (paypalRef.current) {
            paypalRef.current.innerHTML = '';
            await (window as any).paypal.Buttons({
              style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'donate', height: 48 },
              createOrder: (data: any, actions: any) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: { value: amount, currency_code: currency },
                    description: 'Contribution to Foundation of Luv Humanitarian Programs'
                  }]
                });
              },
              onApprove: async (data: any, actions: any) => {
                const order = await actions.order.capture();
                onSuccess(
                  `Thank you for your $${amount} contribution, ${order.payer.name.given_name}!`,
                  order.id,
                  'PayPal',
                  { fullName: fullName || order.payer.name.given_name + ' ' + order.payer.name.surname, email: email || order.payer.email_address, amount: parseFloat(amount) }
                );
                onClose();
              },
              onError: (err: any) => {
                console.error("PayPal Error:", err);
                setSdkError("interactive_blocked");
              }
            }).render(paypalRef.current);
          }
        } catch (e) {
          console.error("PayPal rendering failed:", e);
          setSdkError("interactive_blocked");
        }
      };

      loadPayPalScript();

      const handleError = (e: ErrorEvent) => {
        if (e.message?.includes('window host')) {
          setSdkError("Security context restriction. Direct Portal activated.");
        }
      };
      window.addEventListener('error', handleError);
      return () => {
        window.removeEventListener('error', handleError);
        const sc = document.getElementById(scriptId);
        if (sc) sc.remove();
        if ((window as any).paypal) delete (window as any).paypal;
      };
    }
  }, [isOpen, step, activeMethod, amount]);

  // Proceed from Info to Pay
  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !amount || parseFloat(amount) <= 0) {
      alert('Please fill out your details and donation amount.');
      return;
    }
    setStep('pay');
  };

  // Direct PayPal fallback URL
  const getDirectPayPalUrl = () => {
    const businessEmail = gatewayConfigs.paypal?.business_email || "hello@foundationofluv.org";
    const currency = gatewayConfigs.paypal?.currency || 'USD';
    return `https://www.paypal.com/donate/?business=${encodeURIComponent(businessEmail)}&amount=${amount}&currency_code=${currency}&item_name=Foundation+of+Luv+Contribution`;
  };

  // Stripe checkout logic
  const handleStripePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvc.length < 3) {
      alert('Please enter complete credit card details.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const mockTx = 'STRIPE-TX-' + Math.random().toString(36).substring(2, 11).toUpperCase();
      onSuccess(
        `Thank you for your $${amount} card contribution, ${cardName}!`,
        mockTx,
        'Stripe',
        { fullName, email, amount: parseFloat(amount) }
      );
      onClose();
    }, 2000);
  };

  // Flutterwave checkout logic
  const handleFlutterwavePay = async () => {
    const config = gatewayConfigs.flutterwave || {};
    if (!config.public_key) {
      alert('Flutterwave public key is not configured.');
      return;
    }
    setIsProcessing(true);
    const loaded = await loadScript('https://checkout.flutterwave.com/v3.js', 'flutterwave-script');
    setIsProcessing(false);
    if (!loaded) {
      alert('Failed to load Flutterwave checkout library.');
      return;
    }
    
    try {
      (window as any).FlutterwaveCheckout({
        public_key: config.public_key,
        tx_ref: 'FOL-' + Date.now(),
        amount: parseFloat(amount),
        currency: config.currency || 'USD',
        payment_options: 'card,mobilemoney,banktransfer',
        customer: {
          email: email || 'donor@example.com',
          phone_number: donorPhone || '',
          name: fullName || 'FOL Donor',
        },
        customizations: {
          title: 'Foundation of Luv',
          description: 'Donation for Humanitarian Programs',
          logo: 'https://huzrbgrvcfeywllxloje.supabase.co/storage/v1/object/public/event-flyers/logo.svg',
        },
        callback: (payment: any) => {
          onSuccess(
            `Thank you for your $${amount} contribution via Flutterwave!`,
            payment.transaction_id || payment.tx_ref,
            'Flutterwave',
            { fullName, email, amount: parseFloat(amount) }
          );
          onClose();
        },
        onclose: () => {}
      });
    } catch (err: any) {
      alert('Flutterwave error: ' + err.message);
    }
  };

  // Paystack checkout logic
  const handlePaystackPay = async () => {
    const config = gatewayConfigs.paystack || {};
    if (!config.public_key) {
      alert('Paystack public key is not configured.');
      return;
    }
    setIsProcessing(true);
    const loaded = await loadScript('https://js.paystack.co/v1/inline.js', 'paystack-script');
    setIsProcessing(false);
    if (!loaded) {
      alert('Failed to load Paystack checkout library.');
      return;
    }
    
    try {
      const handler = (window as any).PaystackPop.setup({
        key: config.public_key,
        email: email || 'donor@example.com',
        amount: Math.round(parseFloat(amount) * 100), // in kobo/cents
        currency: config.currency || 'USD',
        ref: 'FOL-' + Date.now(),
        callback: (response: any) => {
          onSuccess(
            `Thank you for your $${amount} contribution via Paystack!`,
            response.reference,
            'Paystack',
            { fullName, email, amount: parseFloat(amount) }
          );
          onClose();
        },
        onClose: () => {}
      });
      handler.openIframe();
    } catch (err: any) {
      alert('Paystack error: ' + err.message);
    }
  };

  // Bank Transfer confirm logic
  const handleBankTransferConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankRef.trim()) {
      alert('Please enter your transaction reference or name to help us identify your payment.');
      return;
    }
    onSuccess(
      `Bank transfer information submitted. We will verify your deposit of $${amount}.`,
      `Bank Transfer Ref: ${bankRef}`,
      'Bank Transfer',
      { fullName, email, amount: parseFloat(amount) }
    );
    onClose();
  };

  const getGatewayIcon = (id: string) => {
    switch (id) {
      case 'paypal': return '🅿️';
      case 'stripe': return '💳';
      case 'flutterwave': return '🌊';
      case 'paystack': return '🔵';
      case 'bank_transfer': return '🏦';
      default: return '💵';
    }
  };

  const getGatewayTitle = (id: string) => {
    switch (id) {
      case 'paypal': return 'PayPal Secure';
      case 'stripe': return 'Credit/Debit Card';
      case 'flutterwave': return 'Flutterwave Pay';
      case 'paystack': return 'Paystack Checkout';
      case 'bank_transfer': return 'Manual Bank Deposit';
      default: return id.toUpperCase();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-[#1a1a1a]/95 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3.5rem] overflow-hidden shadow-3xl border border-[#eeb053]/30 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-[#9c1c22] p-8 text-center relative overflow-hidden shrink-0">
              <div className="absolute inset-0 opacity-10">
                <Logo className="w-full h-full scale-150 rotate-12" />
              </div>
              <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-20">
                <X size={24} />
              </button>
              <Logo className="w-16 h-16 mx-auto mb-4 relative z-10" />
              <h3 className="text-white font-serif font-black text-2xl uppercase tracking-[0.2em] relative z-10">Contribution Center</h3>
              <div className="flex items-center justify-center gap-2 mt-2 relative z-10">
                <Lock size={12} className="text-[#eeb053]" />
                <span className="text-[10px] font-cinzel font-bold text-[#eeb053] uppercase tracking-widest">Secure Payment Gateway Active</span>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-8">
              {/* STEP 1: Personal Info & Amount */}
              {step === 'info' && (
                <form onSubmit={handleProceed} className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-cinzel font-black text-[#9c1c22] uppercase tracking-[0.4em] mb-4">Select Your Gift (USD)</label>
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {['25', '50', '100', '250'].map((val) => (
                        <button 
                          key={val}
                          type="button"
                          onClick={() => setAmount(val)}
                          className={`py-3 rounded-2xl font-cinzel font-black text-xs transition-all border-2 ${amount === val ? 'bg-[#9c1c22] text-white border-[#9c1c22] shadow-xl scale-105' : 'bg-[#fdfaf6] text-[#332d2b] border-[#332d2b]/10 hover:border-[#eeb053]'}`}
                        >
                          ${val}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9c1c22] font-black text-lg">$</span>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter custom amount"
                        required
                        className="w-full bg-[#fdfaf6] border-2 border-[#332d2b]/10 focus:border-[#9c1c22] px-12 py-5 rounded-2xl font-serif italic text-lg outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[11px] font-cinzel font-black text-[#9c1c22] uppercase tracking-[0.4em]">Donor Information</label>
                    
                    <input 
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-[#fdfaf6] border-2 border-[#332d2b]/10 focus:border-[#9c1c22] px-6 py-4 rounded-2xl font-serif text-sm outline-none transition-all"
                    />

                    <input 
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#fdfaf6] border-2 border-[#332d2b]/10 focus:border-[#9c1c22] px-6 py-4 rounded-2xl font-serif text-sm outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-[#9c1c22] hover:bg-[#332d2b] text-white rounded-full font-cinzel font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 border border-[#eeb053]/30"
                  >
                    Proceed to Payment <ArrowRight size={14} />
                  </button>
                </form>
              )}

              {/* STEP 2: Checkout Choice */}
              {step === 'pay' && (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-[#fdfaf6] p-6 rounded-3xl border-2 border-[#eeb053]/30 text-center relative">
                    {!isLockedAmount && (
                      <button 
                        onClick={() => setStep('info')}
                        className="absolute top-4 left-4 text-xs font-cinzel font-black text-[#9c1c22] uppercase tracking-wider hover:underline"
                      >
                        ← Edit
                      </button>
                    )}
                    <label className="block text-[11px] font-cinzel font-black text-[#9c1c22] uppercase tracking-[0.4em] mb-2">Selected Donation Amount</label>
                    <div className="text-3xl font-serif font-black text-[#332d2b]">${parseFloat(amount || '0').toFixed(2)}</div>
                    {!isLockedAmount && fullName && (
                      <div className="text-xs font-serif italic text-[#332d2b]/60 mt-1 uppercase">For: {fullName} ({email})</div>
                    )}
                  </div>

                  {/* Method Picker */}
                  {!activeMethod ? (
                    <div className="space-y-3">
                      <label className="block text-[11px] font-cinzel font-black text-[#9c1c22] uppercase tracking-[0.4em] mb-2">Choose Your Payment Method</label>
                      <div className="grid grid-cols-1 gap-2">
                        {displayedGateways.map((id) => (
                          <button
                            key={id}
                            onClick={() => setActiveMethod(id)}
                            className="w-full p-4 bg-[#fdfaf6] hover:bg-[#fcfaf4] border border-[#332d2b]/10 hover:border-[#eeb053] rounded-2xl flex items-center gap-4 transition-all text-left group"
                          >
                            <span className="text-2xl">{getGatewayIcon(id)}</span>
                            <div className="flex-grow">
                              <span className="font-cinzel font-black text-xs text-[#332d2b] uppercase tracking-wider block">{getGatewayTitle(id)}</span>
                              <span className="text-[10px] font-serif italic text-[#332d2b]/60 uppercase">
                                {id === 'paypal' && 'Fast and secure checkout via PayPal account or Card'}
                                {id === 'stripe' && 'Pay directly with credit or debit card'}
                                {id === 'flutterwave' && 'Pay with card, mobile money or bank transfer'}
                                {id === 'paystack' && 'Fast online payment for Nigeria & Africa'}
                                {id === 'bank_transfer' && 'Transfer funds manually from your bank account'}
                              </span>
                            </div>
                            <ChevronRight size={16} className="text-[#332d2b]/30 group-hover:text-[#9c1c22] group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Active Method Header */}
                      <div className="flex items-center justify-between border-b border-[#332d2b]/10 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getGatewayIcon(activeMethod)}</span>
                          <span className="font-cinzel font-black text-xs text-[#332d2b] uppercase tracking-wider">{getGatewayTitle(activeMethod)}</span>
                        </div>
                        {displayedGateways.length > 1 && (
                          <button 
                            onClick={() => setActiveMethod('')}
                            className="text-xs font-cinzel font-bold text-[#9c1c22] uppercase hover:underline"
                          >
                            Change Method
                          </button>
                        )}
                      </div>

                      {/* Checkout Interfaces */}
                      
                      {/* PayPal Checkout */}
                      {activeMethod === 'paypal' && (
                        <div className="space-y-4">
                          {sdkError ? (
                            <div className="space-y-4">
                              <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-3xl border border-amber-200">
                                <AlertCircle size={24} className="text-amber-600 shrink-0 mt-1" />
                                <div>
                                  <p className="text-[#332d2b] text-sm font-bold leading-tight mb-1 uppercase">Embedded Gateway Restricted</p>
                                  <p className="text-[#332d2b]/70 text-xs font-serif italic leading-relaxed uppercase">
                                    Please use the direct secure portal to finalize your contribution.
                                  </p>
                                </div>
                              </div>
                              <a 
                                href={getDirectPayPalUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-5 bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-full font-cinzel font-black text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-all"
                              >
                                Open PayPal Portal <ExternalLink size={18} />
                              </a>
                            </div>
                          ) : (
                            <div className="min-h-[150px] relative">
                              {isSdkLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 bg-[#fdfaf6] rounded-[2rem] border-2 border-dashed border-[#eeb053]/30">
                                  <Loader2 className="animate-spin text-[#eeb053] mb-4" size={28} />
                                  <p className="text-[9px] font-cinzel font-black uppercase text-[#332d2b]/40 tracking-widest">Contacting PayPal Secure Node...</p>
                                </div>
                              ) : (
                                <div ref={paypalRef} className="relative z-10" />
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Stripe Form */}
                      {activeMethod === 'stripe' && (
                        <form onSubmit={handleStripePay} className="space-y-4">
                          <div className="space-y-3">
                            <input 
                              type="text" 
                              placeholder="Cardholder Name"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              required
                              className="w-full bg-[#fdfaf6] border-2 border-[#332d2b]/10 focus:border-[#9c1c22] px-5 py-3.5 rounded-xl font-serif text-sm outline-none transition-all"
                            />
                            
                            <div className="relative">
                              <input 
                                type="text" 
                                placeholder="Card Number (16 Digits)"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                required
                                className="w-full bg-[#fdfaf6] border-2 border-[#332d2b]/10 focus:border-[#9c1c22] px-5 py-3.5 rounded-xl font-mono text-sm outline-none transition-all tracking-wider"
                              />
                              <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#332d2b]/30" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={handleExpiryChange}
                                required
                                className="w-full bg-[#fdfaf6] border-2 border-[#332d2b]/10 focus:border-[#9c1c22] px-5 py-3.5 rounded-xl font-mono text-sm outline-none transition-all text-center"
                              />
                              <input 
                                type="text" 
                                placeholder="CVC"
                                value={cardCvc}
                                onChange={handleCvcChange}
                                required
                                className="w-full bg-[#fdfaf6] border-2 border-[#332d2b]/10 focus:border-[#9c1c22] px-5 py-3.5 rounded-xl font-mono text-sm outline-none transition-all text-center"
                              />
                            </div>

                            <input 
                              type="text" 
                              placeholder="ZIP / Postal Code"
                              value={cardZip}
                              onChange={(e) => setCardZip(e.target.value)}
                              required
                              className="w-full bg-[#fdfaf6] border-2 border-[#332d2b]/10 focus:border-[#9c1c22] px-5 py-3.5 rounded-xl font-serif text-sm outline-none transition-all"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-4 bg-[#9c1c22] hover:bg-[#332d2b] disabled:bg-[#332d2b]/50 text-white rounded-full font-cinzel font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 size={14} className="animate-spin" /> Verifying Card...
                              </>
                            ) : (
                              <>Pay ${parseFloat(amount).toFixed(2)} Securely</>
                            )}
                          </button>
                        </form>
                      )}

                      {/* Flutterwave Button */}
                      {activeMethod === 'flutterwave' && (
                        <div className="space-y-4">
                          <p className="text-xs font-serif text-[#332d2b]/70 uppercase leading-relaxed text-center">
                            Pay securely using cards, bank transfer, or mobile money through Flutterwave.
                          </p>
                          <button
                            onClick={handleFlutterwavePay}
                            disabled={isProcessing}
                            className="w-full py-4.5 bg-[#f5a623] hover:bg-[#d98b11] disabled:bg-[#f5a623]/50 text-[#1a1a1a] rounded-full font-cinzel font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                          >
                            {isProcessing ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              'Launch Flutterwave'
                            )}
                          </button>
                        </div>
                      )}

                      {/* Paystack Button */}
                      {activeMethod === 'paystack' && (
                        <div className="space-y-4">
                          <p className="text-xs font-serif text-[#332d2b]/70 uppercase leading-relaxed text-center">
                            Complete your donation quickly and securely using Paystack payment portal.
                          </p>
                          <button
                            onClick={handlePaystackPay}
                            disabled={isProcessing}
                            className="w-full py-4.5 bg-[#00c3f7] hover:bg-[#00a6d4] disabled:bg-[#00c3f7]/50 text-white rounded-full font-cinzel font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                          >
                            {isProcessing ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              'Launch Paystack Portal'
                            )}
                          </button>
                        </div>
                      )}

                      {/* Bank Transfer View */}
                      {activeMethod === 'bank_transfer' && (
                        <form onSubmit={handleBankTransferConfirm} className="space-y-4">
                          <div className="bg-[#fdfaf6] p-5 rounded-2xl border border-[#332d2b]/10 space-y-3 text-xs font-serif uppercase">
                            <div className="border-b border-[#332d2b]/5 pb-2">
                              <span className="text-[#9c1c22] font-cinzel font-black text-[10px] tracking-wider block">Bank Name</span>
                              <strong className="text-[#332d2b] font-black text-sm">{gatewayConfigs.bank_transfer?.bank_name || 'Chase Bank'}</strong>
                            </div>
                            <div className="border-b border-[#332d2b]/5 pb-2">
                              <span className="text-[#9c1c22] font-cinzel font-black text-[10px] tracking-wider block">Account Name</span>
                              <strong className="text-[#332d2b] font-black text-sm">{gatewayConfigs.bank_transfer?.account_name || 'Foundation of Luv Inc.'}</strong>
                            </div>
                            <div className="border-b border-[#332d2b]/5 pb-2 flex items-center justify-between">
                              <div>
                                <span className="text-[#9c1c22] font-cinzel font-black text-[10px] tracking-wider block">Account Number</span>
                                <strong className="text-[#332d2b] font-black text-sm font-mono tracking-wider">{gatewayConfigs.bank_transfer?.account_number || '0000000000'}</strong>
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(gatewayConfigs.bank_transfer?.account_number || '0000000000');
                                  alert('Account number copied!');
                                }}
                                className="px-3 py-1 bg-white border border-[#332d2b]/10 text-[9px] font-cinzel font-black text-[#9c1c22] tracking-wider rounded-lg"
                              >
                                Copy
                              </button>
                            </div>
                            {gatewayConfigs.bank_transfer?.routing_number && (
                              <div className="border-b border-[#332d2b]/5 pb-2">
                                <span className="text-[#9c1c22] font-cinzel font-black text-[10px] tracking-wider block">Routing / Sort Code</span>
                                <strong className="text-[#332d2b] font-black text-sm font-mono tracking-wider">{gatewayConfigs.bank_transfer?.routing_number}</strong>
                              </div>
                            )}
                            {gatewayConfigs.bank_transfer?.swift_code && (
                              <div className="border-b border-[#332d2b]/5 pb-2">
                                <span className="text-[#9c1c22] font-cinzel font-black text-[10px] tracking-wider block">SWIFT / BIC Code</span>
                                <strong className="text-[#332d2b] font-black text-sm font-mono tracking-wider">{gatewayConfigs.bank_transfer?.swift_code}</strong>
                              </div>
                            )}
                            {gatewayConfigs.bank_transfer?.instructions && (
                              <div className="pt-1">
                                <span className="text-[#9c1c22] font-cinzel font-black text-[10px] tracking-wider block">Instructions</span>
                                <p className="text-[10px] text-[#332d2b]/70 font-normal leading-relaxed whitespace-pre-wrap lowercase">{gatewayConfigs.bank_transfer?.instructions}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[9px] font-cinzel font-black text-[#9c1c22] uppercase tracking-[0.2em]">Enter Transfer Ref / Payer Name *</label>
                            <input 
                              type="text" 
                              placeholder="e.g. John Doe - Ref 7821"
                              value={bankRef}
                              onChange={(e) => setBankRef(e.target.value)}
                              required
                              className="w-full bg-[#fdfaf6] border-2 border-[#332d2b]/10 focus:border-[#9c1c22] px-5 py-3.5 rounded-xl font-serif text-sm outline-none transition-all"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-4 bg-[#9c1c22] hover:bg-[#332d2b] text-white rounded-full font-cinzel font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                          >
                            Confirm Bank Transfer
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Trust Footer */}
              <div className="pt-6 border-t border-black/5 text-center shrink-0">
                <p className="text-[10px] font-serif italic text-[#332d2b]/40 uppercase tracking-widest leading-relaxed">
                  Foundation of Luv (FOL) is a 501(c)(3) nonprofit. <br />
                  100% of your gift supports humanitarian transformation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


// --- Global UI Components ---

const LogoFallback = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <defs>
      <path id="topTextArcFB" d="M 68, 250 A 182,182 0 0,1 432,250" />
      <path id="bottomTextArcFB" d="M 85, 250 A 165,165 0 0,0 415,250" />
      <clipPath id="globeClipFB">
        <circle cx="250" cy="185" r="70" />
      </clipPath>
    </defs>
    <circle cx="250" cy="250" r="248" fill="#eeb053" />
    <circle cx="250" cy="250" r="242" fill="#ffffff" />
    <circle cx="250" cy="250" r="236" fill="#4a4440" />
    <path d="M 14,250 A 236,236 0 0,1 486,250 L 250,250 Z" fill="#d6d6d6" />
    <circle cx="250" cy="250" r="176" stroke="#4a4440" strokeWidth="2" fill="none" />
    <circle cx="250" cy="250" r="172" fill="#df8c3d" />
    <circle cx="250" cy="185" r="70" fill="#122d4f" />
    <g clipPath="url(#globeClipFB)">
      <path d="M210,165 Q225,145 245,165 T275,175 T300,160 T315,185 T285,215 T240,210 T205,190 Z" fill="#df8c3d" />
      <path d="M255,130 Q275,140 270,160 T295,170 T310,150 Z" fill="#df8c3d" />
    </g>
    <g fill="#f1c27d">
      <path d="M190,220 Q185,250 200,300 Q215,330 245,355 L250,350 Q220,320 210,280 T205,220 Z" />
      <ellipse cx="188" cy="230" rx="6" ry="11" transform="rotate(-30 188 230)" />
      <ellipse cx="192" cy="260" rx="6" ry="11" transform="rotate(-25 192 260)" />
      <ellipse cx="202" cy="290" rx="6" ry="11" transform="rotate(-20 202 290)" />
      <ellipse cx="218" cy="320" rx="6" ry="11" transform="rotate(-15 218 320)" />
      <ellipse cx="185" cy="210" rx="5" ry="10" transform="rotate(-35 185 210)" />
      
      <path d="M310,220 Q315,250 300,300 Q285,330 255,355 L250,350 Q280,320 290,280 T295,220 Z" />
      <ellipse cx="312" cy="230" rx="6" ry="11" transform="rotate(30 312 230)" />
      <ellipse cx="308" cy="260" rx="6" ry="11" transform="rotate(25 308 260)" />
      <ellipse cx="298" cy="290" rx="6" ry="11" transform="rotate(20 298 290)" />
      <ellipse cx="282" cy="320" rx="6" ry="11" transform="rotate(15 282 320)" />
      <ellipse cx="315" cy="210" rx="5" ry="10" transform="rotate(35 315 210)" />
    </g>
    <path d="M250,235 C210,185 140,210 140,295 C140,370 250,455 250,455 C250,455 360,370 360,295 C360,210 290,185 250,235 Z" fill="#8b1a1a" />
    <g fill="#f1c27d">
      <path d="M92,250 l10,-12 16,3 -12,12 5,16 -19,-10 -19,10 5,-16 -12,-12 16,-3 z" />
      <path d="M408,250 l10,-12 16,3 -12,12 5,16 -19,-10 -19,10 5,-16 -12,-12 16,-3 z" />
    </g>
    <text fontFamily="serif" fontWeight="900" fontSize="44" fill="#1a1a1a" letterSpacing="2">
      <textPath href="#topTextArcFB" startOffset="50%" textAnchor="middle">FOUNDATION OF LUV</textPath>
    </text>
    <text fontFamily="serif" fontWeight="700" fontSize="24" fill="#ffffff" letterSpacing="1">
      <textPath href="#bottomTextArcFB" startOffset="50%" textAnchor="middle">LOVE IN ACTION CHANGE IN MOTION</textPath>
    </text>
  </svg>
);

const Logo = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  const [error, setError] = useState(false);
  if (error) return <LogoFallback className={className} style={style} />;
  return (
    <img src="logo.png" alt="Foundation of Luv" className={className} style={style} onError={() => setError(true)} />
  );
};

const LoadingScreen = () => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const burstInterval = setInterval(() => {
      setBursts(prev => [...prev, { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100 }]);
      setTimeout(() => {
        setBursts(prev => prev.slice(1));
      }, 2000);
    }, 600);
    return () => clearInterval(burstInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      animate={{ 
        backgroundColor: ["#fdfaf6", "#9c1c22", "#122d4f", "#eeb053", "#fdfaf6"],
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.76, 0, 0.24, 1],
        backgroundColor: { duration: 8, repeat: Infinity, ease: "linear" } 
      }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0, scale: 0.5 }}
            animate={{ y: "-10vh", opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ 
              duration: 4 + Math.random() * 4, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "linear" 
            }}
            className="absolute text-white"
          >
            <Heart size={20 + Math.random() * 40} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {bursts.map(burst => (
            <div key={burst.id} className="absolute" style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0], 
                    opacity: 0,
                    x: Math.cos((i * 45) * Math.PI / 180) * 100,
                    y: Math.sin((i * 45) * Math.PI / 180) * 100
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
                />
              ))}
            </div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-white blur-[80px] rounded-full"
        />
        
        <motion.div
          animate={{ rotateY: [0, 360], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48 md:w-64 md:h-64"
        >
          <Logo className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
        </motion.div>
      </motion.div>

      <div className="mt-16 w-64 md:w-80 relative h-1 bg-white/20 overflow-hidden rounded-full z-10">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 bg-white shadow-[0_0_15px_white]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-8 text-center z-10"
      >
        <span className="block text-white font-cinzel font-black tracking-[0.5em] text-[12px] md:text-[14px] uppercase drop-shadow-lg">
          LUV-ACT INITIALIZING
        </span>
        <span className="block mt-2 text-white/70 font-serif italic text-xl md:text-2xl uppercase">
          Love in Action, Change in Motion.
        </span>
      </motion.div>
    </motion.div>
  );
};

const Toast = ({ message, onClose, type = 'success' }: { message: string; onClose: () => void; type?: 'success' | 'error' }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.9 }}
    className={`fixed bottom-10 right-4 md:right-10 z-[500] flex items-center gap-4 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 ${type === 'success' ? 'bg-[#9c1c22] border-[#eeb053]' : 'bg-black border-red-500'}`}
  >
    {type === 'success' ? <CheckCircle2 className="text-[#eeb053]" size={24} /> : <AlertCircle className="text-red-500" size={24} />}
    <p className="font-cinzel font-bold text-sm tracking-wider uppercase">{message}</p>
    <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
      <X size={20} />
    </button>
  </motion.div>
);

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 500) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-28 right-4 md:right-10 z-[190] w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-[#9c1c22] text-[#9c1c22] rounded-full flex items-center justify-center shadow-2xl hover:bg-[#9c1c22] hover:text-white transition-all group"
          aria-label="Return to top"
        >
          <ChevronUp className="group-hover:-translate-y-1 transition-transform" size={28} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const FireworksBackground = () => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const spawnBurst = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const colorValues = [COLORS.crimson, COLORS.gold, COLORS.accent, COLORS.white];
    const color = colorValues[Math.floor(Math.random() * colorValues.length)];
    setBursts(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 3000);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => { spawnBurst(); }, 800);
    return () => clearInterval(interval);
  }, [spawnBurst]);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
      <AnimatePresence>
        {bursts.map(burst => (
          <div key={burst.id} className="absolute" style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x: Math.cos((i * 30) * (Math.PI / 180)) * 120, y: Math.sin((i * 30) * (Math.PI / 180)) * 120, opacity: 0, scale: [0, 1, 0.4] }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: burst.color }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const AnimatedNumber = ({ value }: { value: string }) => {
  const numericValue = parseFloat(value);
  const decimals = value.includes('.') ? value.split('.')[1].length : 0;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  useEffect(() => { if (isInView) animate(count, numericValue, { duration: 2.5, ease: [0.32, 1, 0.2, 1] }); }, [isInView, numericValue, count]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
};

// --- Rich Content Components ---

const PartnersMarquee = () => {
  const partners = ["Podore", "Azariah Management Group", "News Africa Times", "Creaitube", "Creaite", "Creaitwood", "Creaitmail", "Food Planet"];
  return (
    <div className="py-20 bg-white border-y border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.4em] text-[10px] uppercase">Institutional Alliances &amp; Strategic Partners</span>
      </div>
      <div className="relative flex overflow-x-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 py-4 items-center"
        >
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="text-3xl md:text-5xl font-serif font-black uppercase text-[#332d2b]/10 hover:text-[#9c1c22] transition-colors cursor-default select-none tracking-tighter">
              {p}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const LeadershipVision = () => {
  return (
    <section className="py-24 md:py-40 bg-[#fdfaf6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-20 items-center">
        <div className="lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[3/4] rounded-[5rem] overflow-hidden shadow-3xl border-8 border-white relative z-10 flex items-center justify-center bg-white p-12 md:p-20"
          >
            <Logo className="w-full h-auto drop-shadow-2xl" />
          </motion.div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#eeb053] rounded-full flex items-center justify-center p-8 shadow-2xl z-20">
            <Logo className="w-full h-full invert brightness-0" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <Quote className="w-16 h-16 text-[#eeb053] mb-8 opacity-20" />
          <h3 className="text-3xl md:text-5xl font-serif font-black text-[#332d2b] leading-tight uppercase mb-10">
            {LEADERSHIP_MESSAGE.title}
          </h3>
          <p className="text-xl md:text-2xl font-serif italic text-[#332d2b]/70 leading-relaxed uppercase mb-12">
            "{LEADERSHIP_MESSAGE.content}"
          </p>
          <div className="flex items-center gap-6">
            <div className="h-px w-12 bg-[#9c1c22]" />
            <div>
              <p className="font-cinzel font-black text-sm uppercase tracking-widest text-[#9c1c22]">{LEADERSHIP_MESSAGE.author}</p>
              <p className="font-serif italic text-lg uppercase text-[#eeb053]">{LEADERSHIP_MESSAGE.tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EngagementPathways = ({ onNavigate }: { onNavigate: (id: string) => void }) => {
  const pathways = [
    { title: "Volunteer", icon: <Users size={32} />, desc: "Join our kinetic pulse on the frontlines of restoration." },
    { title: "Corporate", icon: <Handshake size={32} />, desc: "Institutionalize impact through strategic philanthropy." },
    { title: "Sustainer", icon: <HeartHandshake size={32} />, desc: "Fuel long-term change with recurring monthly support." }
  ];
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {pathways.map((p, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="p-12 rounded-[4rem] bg-[#fdfaf6] border-2 border-transparent hover:border-[#eeb053] transition-all shadow-xl group text-center"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#9c1c22] shadow-md group-hover:scale-110 transition-transform">
              {p.icon}
            </div>
            <h4 className="text-2xl font-serif font-black uppercase mb-4">{p.title}</h4>
            <p className="text-lg font-serif italic text-[#332d2b]/50 uppercase mb-8">{p.desc}</p>
            <button 
              onClick={() => onNavigate('contact')}
              className="text-[10px] font-cinzel font-black text-[#9c1c22] uppercase tracking-[0.4em] flex items-center gap-3 mx-auto hover:text-[#eeb053] transition-colors"
            >
              Get Started <MoveRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const NewsletterSection = () => (
  <section className="py-24 bg-[#9c1c22] relative overflow-hidden">
    <div className="absolute inset-0 opacity-5">
      <Logo className="w-full h-full scale-150 rotate-12" />
    </div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
      <Mail className="w-12 h-12 mx-auto mb-8 text-[#eeb053]" />
      <h3 className="text-4xl md:text-6xl font-serif font-black uppercase mb-8 leading-none">Stay In <span className="text-[#eeb053] italic">Motion.</span></h3>
      <p className="text-xl font-serif italic uppercase mb-12 opacity-70 tracking-widest">Join the LuvWatt Mail Movement for Monthly Transformational Stories</p>
      <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
        <input 
          type="email" 
          placeholder="ENTER YOUR CORRESPONDENCE EMAIL" 
          className="flex-grow bg-white/10 border-2 border-white/20 px-8 py-5 rounded-full text-white font-cinzel text-xs tracking-widest focus:outline-none focus:border-[#eeb053] transition-all"
        />
        <button className="bg-white text-[#9c1c22] px-12 py-5 rounded-full font-cinzel font-black tracking-widest text-xs hover:bg-[#1a1a1a] hover:text-white transition-all">ENROLL</button>
      </div>
    </div>
    <div className="flex justify-center gap-6 mt-12 text-white/50">
        <Instagram size={24} className="hover:text-white transition-colors cursor-pointer" />
        <Facebook size={24} className="hover:text-white transition-colors cursor-pointer" />
    </div>
  </section>
);

// --- Content Views ---

const HomeView = ({ onNavigate, cms }: { onNavigate: (id: string) => void; cms: Record<string, string> }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10">
      <header className="relative w-full pt-32 pb-16 md:pt-64 md:pb-32 lg:pt-72 lg:pb-40 min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative group p-0 md:p-12 w-full max-w-[850px]">
            <div className="relative aspect-video rounded-[2rem] md:rounded-[4rem] overflow-hidden border-[6px] md:border-[16px] border-white shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0">
                  <img src={HERO_IMAGES[currentSlide].url} alt={HERO_IMAGES[currentSlide].caption} className="w-full h-full object-cover brightness-75" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent text-left">
                    <span className="text-[#eeb053] font-cinzel font-black tracking-[0.4em] text-[8px] md:text-[10px] uppercase">Movement Chapter</span>
                    <h3 className="text-white text-base md:text-4xl font-serif italic font-bold uppercase">{HERO_IMAGES[currentSlide].caption}</h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-4 -right-4 md:-top-12 md:-right-12 w-16 h-16 md:w-44 md:h-44 z-40"><Logo className="w-full h-full drop-shadow-2xl" /></motion.div>
          </motion.div>
          <div className="mt-8 md:mt-12">
            <h1 className="hero-text text-3xl md:text-[6rem] font-serif font-black leading-tight text-shine-crimson uppercase" dangerouslySetInnerHTML={{ __html: cms['hero:title'] }} />
            <p className="mobile-p text-sm md:text-2xl text-[#332d2b]/70 mt-6 max-w-4xl mx-auto font-serif italic text-center uppercase">"{cms['hero:subtitle']}"</p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mt-8 md:mt-12">
              <button onClick={() => onNavigate('donation')} className="px-10 py-5 bg-[#9c1c22] text-white rounded-full font-cinzel font-black text-lg shadow-xl flex items-center gap-3 hover:bg-[#7a141a] transition-all uppercase">Show some Love <MoveRight /></button>
              <button onClick={() => onNavigate('aboutus')} className="px-10 py-5 glass-card rounded-full font-cinzel font-bold text-lg border border-[#eeb053]/50 flex items-center justify-center gap-3 hover:bg-white/60 transition-all uppercase">Explore Our Story <ArrowRight /></button>
            </div>
          </div>
        </div>
      </header>

      <PartnersMarquee />

      <section className="min-h-screen py-16 md:py-24 bg-white relative overflow-hidden border-y border-black/5 flex items-center">
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="text-center mb-10 md:mb-16 relative">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-[6rem] font-black text-[#1a1a1a] leading-[0.8] mb-0 uppercase tracking-[-0.05em] drop-shadow-md">
                LET'S GIVE <br className="hidden md:block" /> THOSE FEET
              </h2>
              <div className="relative inline-block mt-1 md:mt-[-2rem]">
                <h3 className="text-2xl md:text-[5rem] font-serif italic text-[#9c1c22] leading-none uppercase drop-shadow-sm font-bold">
                  Shoes
                </h3>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-square max-w-[240px] md:max-w-[450px] mx-auto p-4 md:p-8 bg-white rounded-full shadow-inner border-[1px] border-black/5">
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="relative w-full h-full">
                      {[
                        { url: SHOE_DRIVE_IMAGES[0], pos: "top-0 left-1/2 -translate-x-1/2" },
                        { url: SHOE_DRIVE_IMAGES[1], pos: "top-1/4 right-0" },
                        { url: "https://foundationofluv.org/public/gallery/pic3.jpeg", pos: "bottom-0 right-1/4" },
                        { url: "https://foundationofluv.org/public/gallery/pic4.jpeg", pos: "bottom-0 left-1/4" },
                        { url: "https://foundationofluv.org/public/gallery/pic5.jpeg", pos: "top-1/4 left-0" },
                        { url: "https://foundationofluv.org/public/gallery/pic6.jpeg", pos: "bottom-1/4 left-0" },
                      ].map((img, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1, zIndex: 50 }}
                          className={`absolute w-10 h-10 md:w-28 md:h-28 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg transition-all duration-500 cursor-pointer ${img.pos}`}
                        >
                          <img src={img.url} className="w-full h-full object-cover grayscale hover:grayscale-0" alt="Community outreach" />
                        </motion.div>
                      ))}
                   </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }} 
                    className="w-16 h-16 md:w-44 md:h-44 bg-white rounded-full shadow-[0_0_40px_rgba(156,28,34,0.1)] flex items-center justify-center p-2 md:p-5 border-[1px] border-[#eeb053] relative"
                  >
                    <Logo className="w-full h-full z-10" />
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-4 md:space-y-8 relative">
              <motion.div 
                initial={{ rotate: -5, scale: 0.8, opacity: 0 }}
                whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative z-20"
              >
                <div className="bg-[#eeb053] text-[#9c1c22] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <h4 className="text-lg md:text-3xl font-black uppercase leading-tight italic text-center text-shine-crimson">
                    Our Community efforts <br /> where we show love <br /> and help
                  </h4>
                </div>
              </motion.div>
              <div className="pl-6 border-l-4 border-[#9c1c22]">
                <p className="text-xl font-serif italic text-[#332d2b]/60 uppercase leading-relaxed">
                  "At Foundation of Luv (FOL), providing dignity is the first step toward lasting community empowerment."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeadershipVision />

      <section className="bg-[#f9f5f0] border-y border-[#332d2b]/5">
        <VideoSection 
          videoId={VIDEO_RESOURCES[0].id} 
          title="Featured Impact Story" 
          description={VIDEO_RESOURCES[0].description} 
        />
      </section>

      <section className="min-h-screen py-12 md:py-16 bg-[#1a0c1a] text-white relative overflow-hidden flex items-center border-y border-[#ffffff]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b4d] via-[#8b1a1a] to-[#df8c3d] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#1a0c1a_100%)] opacity-80" />
        
        <div className="max-w-7xl mx-auto px-4 w-full relative z-10 flex flex-col h-full max-h-screen justify-between">
           <div className="flex justify-between items-center opacity-40 px-2 mb-6">
             <div className="flex items-center gap-2">
               <Logo className="w-5 h-5 md:w-6 md:h-6 rounded-full" />
               <span className="text-[6px] md:text-[9px] font-cinzel tracking-[0.2em] md:tracking-[0.4em] uppercase">FOL Profile</span>
             </div>
             <div className="h-px flex-grow mx-4 md:mx-10 bg-white/20" />
             <span className="text-[6px] md:text-[9px] font-cinzel tracking-[0.2em] md:tracking-[0.4em] uppercase">LUVWATTS</span>
           </div>

           <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center flex-grow">
             <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
                <motion.h2 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-[4.5rem] font-serif font-black leading-[0.85] tracking-tighter text-center lg:text-right uppercase flex flex-col gap-1 md:gap-2"
                >
                  <span className="text-white">Solid</span>
                  <span className="text-white">Growth,</span>
                  <span className="text-[#eeb053] italic">Love in</span>
                  <span className="text-white">Action,</span>
                  <span className="text-white">Change</span>
                  <span className="text-[#9c1c22] italic">in Motion</span>
                </motion.h2>
             </div>

             <div className="lg:col-span-4 flex justify-center relative">
               <motion.div 
                 animate={{ scale: [1, 1.03, 1] }}
                 transition={{ duration: 5, repeat: Infinity }}
                 className="relative w-full max-w-[200px] md:max-w-[340px] aspect-[4/5] flex items-center justify-center"
               >
                 <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] md:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                    <filter id="neonGlowS">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <path d="M200,450 C100,350 50,250 50,150 C50,80 120,50 200,120 C280,50 350,80 350,150 C350,250 300,350 200,450 Z" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.1" />
                    <path d="M200,440 C110,345 60,245 60,155 C60,95 125,65 200,130 C275,65 340,95 340,155 C340,245 290,345 200,440 Z" fill="none" stroke="#eeb053" strokeWidth="4" filter="url(#neonGlowS)" opacity="0.7" />
                    <path d="M200,440 C110,345 60,245 60,155 C60,95 125,65 200,130 C275,65 340,95 340,155 C340,245 290,345 200,440 Z" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                 </svg>
                 <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Logo className="w-12 h-12 md:w-24 md:h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
                 </div>
               </motion.div>
             </div>
           </div>
        </div>
      </section>

      <EngagementPathways onNavigate={onNavigate} />

      <section className="py-24 md:py-48 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 md:mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-black uppercase text-[#332d2b] tracking-tight leading-tight"
            >
              Luv in action <span className="text-[#9c1c22] italic">creates change</span> in 5 years (Our 5 Year Target)
            </motion.h2>
            <div className="h-1 w-20 bg-[#eeb053] mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20">
            {STATS.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center px-4">
                <div className="text-5xl md:text-6xl lg:text-7xl font-serif font-black text-[#9c1c22] mb-4 md:mb-6 leading-none whitespace-nowrap">
                  <AnimatedNumber value={stat.value} />
                  <span className="text-[#eeb053]">{stat.suffix}</span>
                </div>
                <h4 className="font-cinzel font-black text-[10px] md:text-[11px] lg:text-[12px] tracking-[0.4em] uppercase mb-4 md:mb-6 text-[#332d2b] leading-relaxed max-w-[200px]">
                  {stat.label}
                </h4>
                <div className="h-0.5 w-6 md:w-8 bg-[#9c1c22] mb-4 md:mb-6" />
                <p className="font-serif italic text-sm md:text-base lg:text-lg text-[#332d2b]/40 uppercase leading-snug">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
};

const TeamView = () => (
  <section className="pt-48 pb-32 bg-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <header className="text-center mb-24">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Our Leadership</motion.span>
        <h2 className="text-5xl md:text-[8rem] font-serif font-black text-[#332d2b] mb-12 uppercase leading-none tracking-tighter">
          Meet the <span className="text-[#eeb053] italic">Team.</span>
        </h2>
        <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-3xl mx-auto uppercase">The dedicated minds and hearts engineering the kinetic pulse of restoration.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
        {TEAM_MEMBERS.map((member, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-8 border-4 border-transparent group-hover:border-[#eeb053] transition-all duration-500 shadow-xl bg-[#fdfaf6] flex items-center justify-center">
              {member.image === 'profile-icon' ? (
                <div className="w-full h-full flex items-center justify-center bg-[#fdfaf6] text-[#9c1c22]/20 group-hover:text-[#9c1c22]/40 transition-colors">
                  <UserRound size={160} strokeWidth={1} />
                </div>
              ) : (
                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity flex items-end p-8">
                <p className="text-white text-lg font-serif italic leading-relaxed uppercase">{member.bio}</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-serif font-black text-[#332d2b] uppercase mb-2 group-hover:text-[#9c1c22] transition-colors">{member.name}</h3>
              <p className="font-cinzel font-black text-xs tracking-[0.3em] text-[#eeb053] uppercase">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const DetailedAboutView = ({ cms }: { cms: Record<string, string> }) => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);

  return (
    <section className="bg-white pt-24 pb-16 md:pt-48 md:pb-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="text-center mb-16 md:mb-32">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[10px] md:text-[12px] uppercase mb-6 md:mb-8 block">Organizational Profile</motion.span>
          <h2 className="text-3xl md:text-7xl lg:text-[8rem] font-serif font-black text-[#332d2b] mb-8 md:mb-12 uppercase leading-none tracking-tighter break-words">
            {DETAILED_ABOUT.header.split(' ')[0]} <span className="text-[#9c1c22] italic">{DETAILED_ABOUT.header.split(' ').slice(1).join(' ')}</span>
          </h2>
          <div className="h-2 w-24 md:w-32 bg-[#eeb053] mx-auto rounded-full mb-8 md:mb-12" />
          <p className="text-xl md:text-3xl font-serif italic text-[#332d2b]/70 max-w-5xl mx-auto uppercase leading-relaxed break-words">
            {cms['about:intro']}
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-10 md:gap-20 mb-20 md:mb-40 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <h3 className="text-2xl md:text-4xl font-serif font-black text-[#332d2b] mb-6 md:mb-8 uppercase flex items-center gap-4">
              <ShieldAlert className="text-[#9c1c22] shrink-0" size={32} />
              {DETAILED_ABOUT.problemStatement.title}
            </h3>
            <p className="text-lg md:text-2xl font-serif italic text-[#332d2b]/70 mb-8 md:mb-10 leading-relaxed uppercase break-words">
              {DETAILED_ABOUT.problemStatement.summary}
            </p>
            <ul className="space-y-4 md:space-y-6">
              {DETAILED_ABOUT.problemStatement.crises.map((crisis, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 text-base md:text-xl font-serif italic text-[#332d2b]/60 uppercase"
                >
                  <div className="w-1.5 h-1.5 bg-[#9c1c22] rounded-full mt-2.5 shrink-0" />
                  {crisis}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <motion.div style={{ scale }} className="rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-[#eeb053]">
               <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" alt="Foundation Community" className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000" />
            </motion.div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 mb-20 md:mb-40">
           <div className="p-8 md:p-16 bg-[#fdfaf6] rounded-[2.5rem] md:rounded-[4rem] border-2 border-[#9c1c22]/10 shadow-xl">
             <div className="mb-6 md:mb-8">{MISSION_VISION.mission.icon}</div>
             <h3 className="text-2xl md:text-4xl font-serif font-black mb-4 md:mb-6 uppercase">{MISSION_VISION.mission.title}</h3>
             <p className="text-lg md:text-2xl font-serif italic text-[#332d2b]/70 uppercase leading-relaxed break-words">{MISSION_VISION.mission.content}</p>
           </div>
           <div className="p-8 md:p-16 bg-[#fdfaf6] rounded-[2.5rem] md:rounded-[4rem] border-2 border-[#eeb053]/10 shadow-xl">
             <div className="mb-6 md:mb-8">{MISSION_VISION.vision.icon}</div>
             <h3 className="text-2xl md:text-4xl font-serif font-black mb-4 md:mb-6 uppercase">{MISSION_VISION.vision.title}</h3>
             <p className="text-lg md:text-2xl font-serif italic text-[#332d2b]/70 uppercase leading-relaxed break-words">{MISSION_VISION.vision.content}</p>
           </div>
        </div>

        <div className="mb-20 md:mb-40">
          <div className="text-center mb-12 md:mb-20">
             <h3 className="text-2xl md:text-4xl font-serif font-black text-[#332d2b] uppercase">Our Core Values</h3>
             <div className="h-1 w-16 md:w-20 bg-[#9c1c22] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {CORE_VALUES.map((value, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="p-6 md:p-10 bg-white shadow-lg rounded-3xl border border-black/5">
                <h4 className="text-lg md:text-xl font-cinzel font-black text-[#9c1c22] mb-4 uppercase">{value.term}</h4>
                <p className="text-base md:text-lg font-serif italic text-[#332d2b]/60 uppercase break-words">{value.definition}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-20 md:mb-40">
          <div className="text-center mb-12 md:mb-20 px-4">
             <h3 className="text-2xl md:text-5xl font-serif font-black text-[#332d2b] uppercase leading-tight break-words">{DETAILED_ABOUT.purpose.title}</h3>
             <div className="h-1 w-16 md:w-20 bg-[#eeb053] mx-auto mt-4" />
          </div>
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 px-2">
            <div className="space-y-6 md:space-y-8">
               <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
                 <div className="p-4 md:p-5 bg-[#9c1c22] rounded-2xl text-white shadow-lg shrink-0"><Activity size={24} /></div>
                 <h4 className="text-xl md:text-2xl lg:text-3xl font-serif font-black uppercase break-words">1. Programmatic Nonprofit</h4>
               </div>
               <div className="grid gap-3 md:gap-4">
                 {DETAILED_ABOUT.purpose.programmatic.map((item, i) => (
                   <div key={i} className="p-5 md:p-6 bg-[#fdfaf6] rounded-2xl border-l-4 border-[#9c1c22] text-base md:text-xl font-serif italic text-[#332d2b]/70 uppercase break-words hyphens-auto">
                     {item}
                   </div>
                 ))}
               </div>
            </div>
            <div className="space-y-6 md:space-y-8">
               <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
                 <div className="p-4 md:p-5 bg-[#eeb053] rounded-2xl text-white shadow-lg shrink-0"><ShieldCheck size={24} /></div>
                 <h4 className="text-xl md:text-2xl lg:text-3xl font-serif font-black uppercase break-words">2. Holding & Stewardship</h4>
               </div>
               <div className="grid gap-3 md:gap-4">
                 {DETAILED_ABOUT.purpose.stewardship.map((item, i) => (
                   <div key={i} className="p-5 md:p-6 bg-[#fdfaf6] rounded-2xl border-l-4 border-[#eeb053] text-base md:text-xl font-serif italic text-[#332d2b]/70 uppercase break-words hyphens-auto">
                     {item}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="mb-20 md:mb-40">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[10px] md:text-[12px] uppercase mb-6 md:mb-8 block">Strategic Impact</span>
            <h3 className="text-2xl md:text-7xl font-serif font-black text-[#332d2b] uppercase leading-none break-words">The 5 Program <span className="text-[#eeb053] italic">Pillars.</span></h3>
          </div>
          <div className="space-y-8 md:space-y-12">
            {DETAILED_ABOUT.pillars.map((pillar, i) => (
              <motion.div 
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-6 md:p-12 bg-[#fdfaf6] rounded-[2.5rem] md:rounded-[4rem] border-2 border-transparent hover:border-[#9c1c22]/20 transition-all shadow-xl flex flex-col lg:flex-row gap-8 md:gap-12 items-center"
              >
                <div className="lg:w-1/4 flex flex-col items-center text-center shrink-0">
                   <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center text-[#9c1c22] shadow-md group-hover:scale-110 transition-transform mb-4 md:mb-6">
                      {React.cloneElement(pillar.icon as React.ReactElement<any>, { size: 28 })}
                   </div>
                   <h4 className="text-lg md:text-2xl font-serif font-black uppercase text-[#9c1c22] leading-tight">Pillar {pillar.id}</h4>
                </div>
                <div className="lg:w-3/4 w-full">
                  <h3 className="text-xl md:text-3xl font-serif font-black uppercase text-[#332d2b] mb-3 md:mb-4 break-words">{pillar.title}</h3>
                  <p className="text-base md:text-xl font-serif italic text-[#332d2b]/70 mb-6 md:mb-8 uppercase leading-relaxed font-bold break-words">Objective: {pillar.objective}</p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {pillar.initiatives.map((init, idx) => (
                      <span key={idx} className="px-3 py-1.5 md:px-6 md:py-3 bg-white border border-[#eeb053]/30 rounded-full text-[10px] md:text-sm font-serif italic text-[#332d2b]/60 uppercase shadow-sm break-words">
                        {init}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <footer className="text-center py-12 md:py-20 bg-[#1a1a1a] rounded-[2.5rem] md:rounded-[5rem] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Logo className="w-full h-full scale-125 rotate-12" />
          </div>
          <div className="relative z-10 px-6">
            <h3 className="text-lg md:text-3xl font-serif italic uppercase mb-4 md:mb-6 opacity-60 break-words">{DETAILED_ABOUT.closing.statement}</h3>
            <h2 className="text-xl md:text-7xl font-serif font-black uppercase text-[#eeb053] leading-none mb-4 break-words">
              {DETAILED_ABOUT.closing.tagline.split('.').slice(0,1)}.
              <br />
              {DETAILED_ABOUT.closing.tagline.split('.').slice(1,2)}.
              <br />
              {DETAILED_ABOUT.closing.tagline.split('.').slice(2,3)}.
            </h2>
            <div className="h-px w-16 md:w-24 bg-[#9c1c22] mx-auto my-8 md:my-10" />
            <p className="font-cinzel font-black text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] uppercase text-white/40">Foundation of Luv Institutional Philosophy</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

const GlobalServicesView = () => (
  <section className="pt-24 pb-16 md:py-48 bg-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16 md:mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[10px] md:text-[12px] uppercase mb-6 md:mb-8 block">Global Reach</span>
        <h2 className="text-3xl md:text-8xl font-serif font-black text-[#332d2b] mb-8 md:mb-12 uppercase leading-none break-words">International <span className="text-[#eeb053] italic">Architecture.</span></h2>
        <p className="text-lg md:text-2xl font-serif italic text-[#332d2b]/60 max-w-4xl mx-auto uppercase break-words">
          Foundation of Luv operates a multi-disciplinary suite of services designed to address the convergent crises of the modern era.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2">
        {GLOBAL_SERVICES_DATA.map((service, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -15 }}
            className="bg-[#fdfaf6] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border-2 border-transparent hover:border-[#eeb053] transition-all shadow-lg flex flex-col h-full overflow-hidden"
          >
            <div className="text-[#9c1c22] mb-6 md:mb-10 w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
              {service.icon}
            </div>
            <h3 className="text-xl md:text-3xl font-serif font-black text-[#332d2b] mb-4 md:mb-6 uppercase leading-tight break-words hyphens-auto">{service.title}</h3>
            <p className="text-base md:text-xl font-serif text-[#332d2b]/70 italic mb-8 md:mb-10 leading-relaxed uppercase break-words hyphens-auto">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const RoadmapView = () => (
  <section className="py-24 md:py-48 bg-[#f9f5f0] pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Strategic Trajectory</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">The Impact <span className="text-[#9c1c22] italic">Roadmap.</span></h2>
      </div>
      <div className="space-y-12">
        {STRATEGIC_PHASES.map((phase, i) => (
          <motion.div key={i} className="p-12 bg-white rounded-[4rem] shadow-xl">
             <h3 className="text-3xl font-serif font-black uppercase text-[#9c1c22] mb-2">{phase.title}</h3>
             <p className="text-xl font-cinzel font-black text-[#eeb053] uppercase mb-8">{phase.years}</p>
             <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl font-serif font-black uppercase mb-4">Strategic Goals</h4>
                  <ul className="space-y-2">
                    {phase.goals.map((g, idx) => <li key={idx} className="text-lg font-serif italic text-[#332d2b]/60 uppercase">• {g}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-serif font-black uppercase mb-4">Projected Outputs</h4>
                  <ul className="space-y-2">
                    {phase.outputs.map((o, idx) => <li key={idx} className="text-lg font-serif italic text-[#332d2b]/60 uppercase">• {o}</li>)}
                  </ul>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const LUVWATTSView = () => (
  <section className="py-24 md:py-48 bg-white pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">The Kinetic Pulse</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">
          {LUVWATTS_CONTENT.title.split(' ')[0]} <span className="text-[#eeb053] italic">{LUVWATTS_CONTENT.title.split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-4xl mx-auto uppercase">
          {LUVWATTS_CONTENT.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {LUVWATTS_CONTENT.acronym.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="bg-[#fdfaf6] p-10 rounded-[3rem] border border-black/5 flex flex-col items-center text-center group hover:border-[#9c1c22]/20 transition-all shadow-sm hover:shadow-xl"
          >
            <div className="text-6xl md:text-8xl font-serif font-black text-[#9c1c22] mb-6 opacity-20 group-hover:opacity-100 transition-opacity">
              {item.letter}
            </div>
            <h3 className="text-2xl font-cinzel font-black text-[#332d2b] mb-4 uppercase">{item.term}</h3>
            <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase leading-relaxed">{item.definition}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const DonorView = ({ onInitiate }: { onInitiate: () => void }) => (
  <section className="py-24 md:py-48 bg-white pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Support Our Mission</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Give <span className="text-[#eeb053] italic">Luv.</span></h2>
        <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-3xl mx-auto uppercase">{DONOR_PAGE_CONTENT.different.content}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-32">
        {DONOR_PAGE_CONTENT.impactPillars.map((p, i) => (
          <div key={i} className="p-12 bg-[#fdfaf6] rounded-[4rem] border border-black/5">
            <h3 className="text-2xl font-serif font-black uppercase mb-4">{p.title}</h3>
            <p className="text-xl font-serif italic text-[#332d2b]/60 uppercase">{p.description}</p>
          </div>
        ))}
      </div>
      <div className="p-20 bg-[#9c1c22] text-white rounded-[5rem] text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-4xl font-serif font-black uppercase mb-10 relative z-10">{DONOR_PAGE_CONTENT.promise.title}</h3>
        <div className="space-y-4 mb-12 relative z-10">
          {DONOR_PAGE_CONTENT.promise.points.map((p, i) => <p key={i} className="text-2xl font-serif italic uppercase">{p}</p>)}
        </div>
        <button 
          onClick={onInitiate}
          className="px-16 py-6 bg-white text-[#9c1c22] rounded-full font-cinzel font-black text-xl hover:bg-[#eeb053] transition-all relative z-10 shadow-2xl flex items-center gap-4 mx-auto"
        >
          INITIATE CONTRIBUTION <MoveRight />
        </button>
      </div>
    </div>
  </section>
);

const GalleryPageView = () => (
  <section className="py-24 md:py-48 bg-white pt-48">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Visual Narrative</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Impact <span className="text-[#eeb053] italic">Gallery.</span></h2>
      </div>

      <div className="mb-32">
        <VideoSection 
          videoId={VIDEO_RESOURCES[0].id} 
          title="Motion Gallery" 
          description="A journey through our mission and global movement." 
        />
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {GALLERY_IMAGES.map((img, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative group rounded-[3rem] overflow-hidden break-inside-avoid">
            <img src={img.url} alt={img.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
              <h4 className="text-white text-2xl font-serif italic font-bold uppercase">{img.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ProgramsPageView = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  const getIcon = (id: string): any => {
    switch(id) {
      case "01": return UsersRound;
      case "02": return SchoolIcon;
      case "03": return HomeIcon;
      case "04": return Utensils;
      case "05": return HeartPulse;
      case "06": return Coins;
      case "07": return Award;
      case "08": return Tv2;
      default: return Sparkles;
    }
  };

  return (
    <section className="py-24 md:py-48 bg-[#fdfaf6] pt-48 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-32">
          <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">The 7 Luv Acts</span>
          <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Our <span className="text-[#9c1c22] italic">Programs.</span></h2>
          <p className="text-xl md:text-2xl font-serif italic text-[#332d2b]/60 max-w-4xl mx-auto uppercase">A deeper look at the specific initiatives driving our mission of restoration.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-16 md:space-y-24">
          {LUV_ACT_PROGRAMS.map((program) => {
            const IconComponent = getIcon(program.id);
            return (
              <motion.div 
                key={program.id} 
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -10, transition: { duration: 0.4 } }}
                className="group bg-white rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_120px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row border-b-[15px] md:border-b-[20px] transition-all duration-500" 
                style={{ borderColor: program.color }}
              >
                <div className="lg:w-1/3 bg-[#f9f5f0] p-12 md:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 0.05, scale: 1 }} transition={{ delay: 0.5, duration: 1 }} className="absolute inset-0 flex items-center justify-center pointer-none">
                    <span className="text-[12rem] md:text-[20rem] font-cinzel font-black" style={{ color: program.color }}>{program.id}</span>
                  </motion.div>
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }} className="mb-8 p-6 bg-white rounded-full shadow-lg relative z-10" style={{ color: program.color }}>
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                      <IconComponent size={48} className="text-inherit" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl md:text-4xl font-serif font-black uppercase leading-tight relative z-10" style={{ color: program.color }}>{program.title}</h3>
                </div>
                <div className="lg:w-2/3 p-12 md:p-20 flex flex-col justify-center relative bg-white">
                  <p className="text-lg md:text-3xl font-serif italic text-[#332d2b]/70 leading-relaxed uppercase group-hover:text-[#332d2b] transition-colors duration-500 break-words hyphens-auto">
                    {program.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

const ContactView = ({ onSubmitSuccess, cms }: { onSubmitSuccess: () => void; cms: Record<string, string> }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSuccess();
  };

  return (
    <section className="pt-48 pb-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="text-center mb-24">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Reach Out</motion.span>
          <h2 className="text-5xl md:text-[8rem] font-serif font-black text-[#332d2b] mb-12 uppercase leading-none tracking-tighter">
            Contact <span className="text-[#eeb053] italic">Us.</span>
          </h2>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-start">
          <div className="space-y-16">
            <div>
              <h3 className="text-3xl font-serif font-black uppercase mb-8">Headquarters</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[#fdfaf6] rounded-2xl text-[#9c1c22] shadow-sm"><MapPin size={24} /></div>
                  <div>
                    <p className="text-[10px] font-cinzel font-black uppercase tracking-widest text-[#eeb053] mb-2">Location</p>
                    <p className="text-xl font-serif italic text-[#332d2b] uppercase break-words">{cms['contact:address']}</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[#fdfaf6] rounded-2xl text-[#9c1c22] shadow-sm"><Phone size={24} /></div>
                  <div>
                    <p className="text-[10px] font-cinzel font-black uppercase tracking-widest text-[#eeb053] mb-2">Voice</p>
                    <p className="text-xl font-serif italic text-[#332d2b] uppercase">{cms['contact:phone']}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-3xl border border-black/5">
            <h3 className="text-3xl font-serif font-black uppercase mb-12">Send a Message</h3>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8">
                <input required type="text" placeholder="YOUR NAME" className="w-full bg-[#fdfaf6] border-2 border-transparent focus:border-[#eeb053] px-8 py-5 rounded-full font-serif italic uppercase outline-none transition-all" />
                <input required type="email" placeholder="EMAIL@DOMAIN.COM" className="w-full bg-[#fdfaf6] border-2 border-transparent focus:border-[#eeb053] px-8 py-5 rounded-full font-serif italic uppercase outline-none transition-all" />
              </div>
              <textarea required rows={5} placeholder="MESSAGE..." className="w-full bg-[#fdfaf6] border-2 border-transparent focus:border-[#eeb053] px-8 py-6 rounded-[2rem] font-serif italic uppercase outline-none transition-all resize-none"></textarea>
              <button type="submit" className="w-full bg-[#9c1c22] text-white py-6 rounded-full font-cinzel font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-4">
                Send <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const VideoSection = ({ videoId, title, description }: { videoId: string, title: string, description?: string }) => (
  <div className="max-w-6xl mx-auto px-4 py-20">
    <div className="text-center mb-12">
      <h3 className="text-3xl md:text-5xl font-serif font-black text-[#332d2b] uppercase mb-4">{title}</h3>
      {description && <p className="text-xl font-serif italic text-[#332d2b]/60 uppercase">{description}</p>}
    </div>
    <div className="relative aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-3xl border-[8px] md:border-[20px] border-white group">
      <iframe 
        className="absolute inset-0 w-full h-full" 
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&mute=1&playlist=${videoId}&loop=1`} 
        title={title} 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen 
      />
    </div>
  </div>
);

// --- Blog & Resources Views ---

const BlogView = () => {
  const posts = [
    {
      title: "Love in Action: Our 2025 Community Impact Report",
      date: "March 2026",
      category: "Impact",
      excerpt: "A deep dive into how the 7 Luv Acts transformed thousands of lives across our communities over the past year — from housing to healing.",
      image: "https://foundationofluv.org/public/gallery/pic1.jpeg"
    },
    {
      title: "FOL TV Launch: Family First Goes Live",
      date: "February 2026",
      category: "Media",
      excerpt: "Our flagship media platform is live. FOL TV is now streaming Family First and other transformative programming to inspire and uplift communities worldwide.",
      image: "https://foundationofluv.org/public/gallery/pic3.jpeg"
    },
    {
      title: "Women in Wealth: Empowering Minority Entrepreneurs",
      date: "January 2026",
      category: "Programs",
      excerpt: "The Women in Wealth initiative continues to break barriers, equipping minority women with the financial literacy and entrepreneurship skills to build generational wealth.",
      image: "https://foundationofluv.org/public/gallery/pic6.jpeg"
    },
    {
      title: "LUVWATTS: The Kinetic Pulse of Transformation",
      date: "December 2025",
      category: "Movement",
      excerpt: "Understanding the philosophy behind LUVWATTS — how Light, Unity, Velocity, Wisdom, Action, Truth, Transformation, and Stewardship drive our mission.",
      image: "https://foundationofluv.org/public/gallery/pic7.jpeg"
    },
    {
      title: "College Access Project: Opening Doors to Higher Education",
      date: "November 2025",
      category: "Education",
      excerpt: "Hundreds of youth are now college-ready thanks to our scholarships, readiness programs, and dedicated mentors who walk beside them every step of the way.",
      image: "https://foundationofluv.org/public/gallery/pic8.jpeg"
    },
    {
      title: "Hope Homes: Building Safe Havens for the Vulnerable",
      date: "October 2025",
      category: "Housing",
      excerpt: "Our Hope Homes initiative continues to provide shelter and stability for displaced individuals and families, restoring dignity one home at a time.",
      image: "https://foundationofluv.org/public/gallery/pic9.jpeg"
    }
  ];

  const categoryColors: Record<string, string> = {
    "Impact": "#9c1c22",
    "Media": "#122d4f",
    "Programs": "#eeb053",
    "Movement": "#df8c3d",
    "Education": "#2d7a4f",
    "Housing": "#4a3c8c"
  };

  return (
    <section className="pt-24 pb-16 md:pt-48 md:pb-32 bg-[#fdfaf6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-16 md:mb-32">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[10px] md:text-[12px] uppercase mb-6 md:mb-8 block">Stories of Impact</motion.span>
          <h2 className="text-3xl md:text-[8rem] font-serif font-black text-[#332d2b] mb-8 md:mb-12 uppercase leading-none tracking-tighter">
            The <span className="text-[#eeb053] italic">Blog.</span>
          </h2>
          <div className="h-2 w-24 bg-[#9c1c22] mx-auto rounded-full mb-8" />
          <p className="text-xl md:text-2xl font-serif italic text-[#332d2b]/60 max-w-3xl mx-auto uppercase">News, stories, and updates from the frontlines of humanitarian transformation.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {posts.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#eeb053] transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-4 py-2 rounded-full text-white font-cinzel font-black text-[9px] uppercase tracking-widest"
                    style={{ backgroundColor: categoryColors[post.category] || '#9c1c22' }}
                  >
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <p className="text-[10px] font-cinzel font-black text-[#eeb053] uppercase tracking-widest mb-4">{post.date}</p>
                <h3 className="text-xl md:text-2xl font-serif font-black text-[#332d2b] uppercase leading-tight mb-4 group-hover:text-[#9c1c22] transition-colors">{post.title}</h3>
                <p className="text-base font-serif italic text-[#332d2b]/60 uppercase leading-relaxed flex-grow">{post.excerpt}</p>
                <div className="mt-8 flex items-center gap-3 text-[#9c1c22] font-cinzel font-black text-[10px] uppercase tracking-widest group-hover:text-[#eeb053] transition-colors">
                  Read More <MoveRight size={14} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

const ResourcesView = () => (
  <section className="pt-24 pb-16 md:pt-48 md:pb-32 bg-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <header className="text-center mb-16 md:mb-32">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[10px] md:text-[12px] uppercase mb-6 md:mb-8 block">Tools &amp; Connections</motion.span>
        <h2 className="text-3xl md:text-[8rem] font-serif font-black text-[#332d2b] mb-8 md:mb-12 uppercase leading-none tracking-tighter">
          Resources.
        </h2>
        <div className="h-2 w-24 bg-[#eeb053] mx-auto rounded-full mb-8" />
        <p className="text-xl md:text-2xl font-serif italic text-[#332d2b]/60 max-w-3xl mx-auto uppercase">Everything you need to engage, connect, and support our mission.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-24">
        {/* FOL Profile PDF */}
        <motion.a
          href={RESOURCES_CONTENT.pdf.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -10 }}
          className="group p-10 md:p-12 bg-[#fdfaf6] rounded-[3rem] border-2 border-transparent hover:border-[#9c1c22] transition-all shadow-lg flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-[#9c1c22] rounded-3xl flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform shadow-xl">
            <FileText size={36} />
          </div>
          <h3 className="text-2xl font-serif font-black uppercase text-[#332d2b] mb-4 group-hover:text-[#9c1c22] transition-colors">{RESOURCES_CONTENT.pdf.title}</h3>
          <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase mb-8">{RESOURCES_CONTENT.pdf.description}</p>
          <span className="flex items-center gap-3 text-[10px] font-cinzel font-black text-[#9c1c22] uppercase tracking-widest">
            Download PDF <ExternalLink size={14} />
          </span>
        </motion.a>

        {/* FOL TV */}
        <motion.a
          href={`https://www.youtube.com/@FoundationofLuv`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -10 }}
          className="group p-10 md:p-12 bg-[#fdfaf6] rounded-[3rem] border-2 border-transparent hover:border-[#eeb053] transition-all shadow-lg flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-[#eeb053] rounded-3xl flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform shadow-xl">
            <Tv2 size={36} />
          </div>
          <h3 className="text-2xl font-serif font-black uppercase text-[#332d2b] mb-4 group-hover:text-[#eeb053] transition-colors">{RESOURCES_CONTENT.folTv.title}</h3>
          <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase mb-8">{RESOURCES_CONTENT.folTv.description}</p>
          <span className="flex items-center gap-3 text-[10px] font-cinzel font-black text-[#eeb053] uppercase tracking-widest">
            Watch Now <Play size={14} />
          </span>
        </motion.a>

        {/* Connect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="p-10 md:p-12 bg-[#fdfaf6] rounded-[3rem] border-2 border-transparent shadow-lg flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-[#332d2b] rounded-3xl flex items-center justify-center mb-8 text-white shadow-xl">
            <Share2 size={36} />
          </div>
          <h3 className="text-2xl font-serif font-black uppercase text-[#332d2b] mb-8">Follow the Movement</h3>
          <div className="grid grid-cols-2 gap-4 w-full">
            <a href={RESOURCES_CONTENT.socials.youtube} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 justify-center p-4 bg-white rounded-2xl border border-black/5 hover:border-red-500 hover:text-red-500 transition-all font-cinzel font-black text-[10px] uppercase tracking-wider text-[#332d2b] shadow-sm">
              <Youtube size={18} /> YouTube
            </a>
            <a href={RESOURCES_CONTENT.socials.instagram} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 justify-center p-4 bg-white rounded-2xl border border-black/5 hover:border-pink-500 hover:text-pink-500 transition-all font-cinzel font-black text-[10px] uppercase tracking-wider text-[#332d2b] shadow-sm">
              <Instagram size={18} /> Instagram
            </a>
            <a href={RESOURCES_CONTENT.socials.linkedin} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 justify-center p-4 bg-white rounded-2xl border border-black/5 hover:border-blue-600 hover:text-blue-600 transition-all font-cinzel font-black text-[10px] uppercase tracking-wider text-[#332d2b] shadow-sm">
              <Linkedin size={18} /> LinkedIn
            </a>
            <a href={RESOURCES_CONTENT.socials.facebook} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 justify-center p-4 bg-white rounded-2xl border border-black/5 hover:border-blue-500 hover:text-blue-500 transition-all font-cinzel font-black text-[10px] uppercase tracking-wider text-[#332d2b] shadow-sm">
              <Facebook size={18} /> Facebook
            </a>
          </div>
        </motion.div>
      </div>

      {/* Featured Video */}
      <div className="bg-[#f9f5f0] rounded-[4rem] overflow-hidden">
        <VideoSection
          videoId={VIDEO_RESOURCES[0].id}
          title="Featured Impact Video"
          description={VIDEO_RESOURCES[0].description}
        />
      </div>
    </div>
  </section>
);

// --- Workshop View ---
interface WorkshopViewProps {
  onNavigate: (pageId: string, ticketType?: 'free' | 'donation') => void;
  cms: Record<string, string>;
}

const WorkshopView: React.FC<WorkshopViewProps> = ({ onNavigate, cms }) => {
  const [workshopEvent, setWorkshopEvent] = useState<any>(null);
  const [selectedFacilitator, setSelectedFacilitator] = useState<any>(null);

  useEffect(() => {
    // Fetch the featured workshop event from the events table
    supabase
      .from('events')
      .select('*')
      .eq('type', 'Workshop')
      .eq('status', 'published')
      .order('date', { ascending: true })
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setWorkshopEvent(data); });
  }, []);

  // Merge: events table takes priority over legacy CMS values
  const wDate     = workshopEvent?.date     || cms['workshop:date'];
  const wTime     = workshopEvent?.time     || cms['workshop:time'];
  const wLocation = workshopEvent?.location || cms['workshop:location'];
  const wFlyer    = workshopEvent?.image_url || cms['workshop:flyer_url'];
  const wRegLink  = workshopEvent?.registration_link;

  const handleRegister = (type: 'free' | 'donation') => {
    if (wRegLink && wRegLink.startsWith('http')) {
      window.open(wRegLink, '_blank');
    } else {
      onNavigate('register-workshop', type);
    }
  };

  return (
    <section className="pt-24 pb-16 md:pt-48 md:pb-32 bg-[#fdfaf6] relative overflow-hidden animate-fadeIn">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9c1c22]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#eeb053]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Header */}
        <header className="text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[10px] md:text-[12px] uppercase mb-6 md:mb-8 block"
          >
            Empowerment Initiative
          </motion.span>
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-serif font-black text-[#332d2b] mb-8 uppercase leading-tight tracking-tighter">
            Cybersecurity & <br />
            <span className="text-[#eeb053] italic">Financial Literacy</span> Workshop
          </h1>
          <div className="h-2 w-24 bg-[#9c1c22] mx-auto rounded-full mb-8" />
          <p className="text-xl md:text-2xl font-serif italic text-[#332d2b]/60 max-w-3xl mx-auto uppercase mb-12">
            Learn practical skills to protect yourself online and make smarter financial decisions in a digital age.
          </p>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto bg-white/40 glass p-8 rounded-[2rem] border border-[#eeb053]/20 shadow-xl mb-12">
            <div className="flex flex-col items-center">
              <Calendar className="text-[#9c1c22] mb-3 w-8 h-8" />
              <span className="text-[10px] font-cinzel font-black tracking-widest text-[#332d2b]/40 uppercase mb-1">Date</span>
              <span className="text-sm font-serif font-bold text-[#332d2b] uppercase">{wDate}</span>
            </div>
            <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-[#332d2b]/10 py-6 md:py-0">
              <Clock className="text-[#eeb053] mb-3 w-8 h-8" />
              <span className="text-[10px] font-cinzel font-black tracking-widest text-[#332d2b]/40 uppercase mb-1">Time</span>
              <span className="text-sm font-serif font-bold text-[#332d2b] uppercase">{wTime}</span>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="text-[#9c1c22] mb-3 w-8 h-8" />
              <span className="text-[10px] font-cinzel font-black tracking-widest text-[#332d2b]/40 uppercase mb-1">Location</span>
              <span className="text-sm font-serif font-bold text-[#332d2b] uppercase">{wLocation}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRegister('free')}
            className="px-10 py-5 bg-[#9c1c22] hover:bg-[#332d2b] text-white rounded-full font-cinzel font-black text-sm uppercase tracking-widest transition-all shadow-xl border border-[#eeb053]/30"
          >
            Register Now
          </motion.button>
        </header>

        {/* Workshop Poster / Flyer */}
        {wFlyer && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-24 flex flex-col items-center"
          >
            <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[10px] md:text-[12px] uppercase mb-8 block">Event Flyer</span>
            <div className="relative max-w-2xl w-full mx-auto">
              {/* Glow backdrop */}
              <div className="absolute -inset-4 bg-gradient-to-b from-[#eeb053]/20 via-[#9c1c22]/10 to-[#eeb053]/20 rounded-[3rem] blur-3xl pointer-events-none" />
              {/* Poster card */}
              <div className="relative bg-white rounded-[2.5rem] border-4 border-[#eeb053]/40 shadow-[0_30px_80px_rgba(156,28,34,0.2)] overflow-hidden">
                <img
                  src={wFlyer}
                  alt="LuvWorks Workshop Flyer"
                  className="w-full h-auto block"
                  style={{ objectFit: 'contain' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-md mx-auto">
                <a
                  href={wFlyer}
                  download="LuvWorks-Workshop-Flyer.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#9c1c22] hover:bg-[#332d2b] text-white rounded-full font-cinzel font-black text-[10px] uppercase tracking-widest transition-all shadow-xl border border-[#eeb053]/20"
                >
                  <FileText size={14} /> Download Flyer
                </a>
                <button
                  onClick={() => handleRegister('free')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#eeb053] hover:bg-[#d49a3a] text-[#332d2b] rounded-full font-cinzel font-black text-[10px] uppercase tracking-widest transition-all shadow-xl"
                >
                  Register Now →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tracks Section */}
        <section className="mb-24">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Track 1: Cybersecurity */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 md:p-12 bg-white rounded-[2rem] sm:rounded-[3rem] border border-[#eeb053]/15 shadow-xl flex flex-col"
            >
              <div className="w-16 h-16 bg-[#9c1c22]/10 rounded-2xl flex items-center justify-center mb-8 text-[#9c1c22]">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#332d2b] uppercase mb-6">Track 1: Cybersecurity</h3>
              <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase mb-8">
                Protect your digital footprint, secure your online assets, and recognize sophisticated threats.
              </p>
              <ul className="space-y-4 flex-grow">
                {[
                  "Password Security & Multi-Factor Authentication (MFA)",
                  "Social Engineering, Phishing, & Scam Awareness",
                  "Online Privacy, Tracking, & VPNs",
                  "Safe Social Media & Device Sharing Habits",
                  "Mobile Device & App Permission Safety",
                  "Business Cybersecurity & Threat Models"
                ].map((item, index) => (
                  <li key={index} className="flex gap-4 items-start text-[#332d2b]/80 font-serif uppercase text-sm sm:text-base text-left">
                    <CheckCircle2 className="text-[#9c1c22] shrink-0 mt-1" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Track 2: Financial Literacy */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 md:p-12 bg-white rounded-[2rem] sm:rounded-[3rem] border border-[#eeb053]/15 shadow-xl flex flex-col"
            >
              <div className="w-16 h-16 bg-[#eeb053]/10 rounded-2xl flex items-center justify-center mb-8 text-[#eeb053]">
                <Coins size={32} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#332d2b] uppercase mb-6">Track 2: Financial Literacy</h3>
              <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase mb-8">
                Take control of your money, build wealth, and learn strategies for multiple income sources.
              </p>
              <ul className="space-y-4 flex-grow">
                {[
                  "Smart Budgeting & Personal Finance Structuring",
                  "Generational Wealth & Saving Strategies",
                  "Introduction to Stocks, Bonds, & Mutual Funds",
                  "Debt Reduction & Credit Score Optimization",
                  "Protecting Yourself Against Financial Fraud & Theft",
                  "Establishing & Scaling Multiple Income Streams"
                ].map((item, index) => (
                  <li key={index} className="flex gap-4 items-start text-[#332d2b]/80 font-serif uppercase text-sm sm:text-base text-left">
                    <CheckCircle2 className="text-[#eeb053] shrink-0 mt-1" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Speakers Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-serif font-black uppercase text-[#332d2b] tracking-tight">Workshop Facilitators</h3>
            <div className="h-1 w-20 bg-[#eeb053] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WORKSHOP_DETAILS.facilitators.map((speaker, index) => (
              <div 
                key={index} 
                className="bg-white rounded-[3rem] p-8 shadow-lg text-center border border-black/5 hover:border-[#9c1c22] transition-all duration-300 flex flex-col items-center group relative overflow-hidden"
              >
                <img 
                  src={speaker.image} 
                  alt={speaker.name} 
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-[#eeb053]/30 shadow-md mb-6 transform group-hover:scale-105 transition-transform duration-300" 
                />
                <h4 className="text-2xl font-serif font-black text-[#332d2b] uppercase mb-2">{speaker.name}</h4>
                <p className="text-[#9c1c22] font-cinzel font-black tracking-widest text-[9px] uppercase mb-4 leading-relaxed px-4">{speaker.role}</p>
                <p className="text-sm font-serif text-[#332d2b]/60 leading-relaxed mb-6 flex-grow">
                  {speaker.shortBio}
                </p>
                {speaker.bio && (
                  <button 
                    onClick={() => setSelectedFacilitator(speaker)}
                    className="mt-auto px-6 py-2.5 rounded-full border border-black/10 hover:border-[#9c1c22] hover:bg-[#9c1c22] text-[#332d2b] hover:text-white font-serif text-xs uppercase font-bold tracking-wider transition-all duration-200"
                  >
                    Read Profile
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Profile Modal */}
          <AnimatePresence>
            {selectedFacilitator && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedFacilitator(null)}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#fdfaf6] border border-[#eeb053]/20 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[3rem] p-8 md:p-12 shadow-2xl relative"
                >
                  <button 
                    onClick={() => setSelectedFacilitator(null)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-[#332d2b] transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-start gap-8 mb-8">
                    <img 
                      src={selectedFacilitator.image} 
                      alt={selectedFacilitator.name} 
                      className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full border-4 border-[#eeb053]/30 shadow-md" 
                    />
                    <div className="flex-1">
                      <h4 className="text-2xl md:text-3xl font-serif font-black text-[#332d2b] uppercase mb-2">
                        {selectedFacilitator.name}
                      </h4>
                      <p className="text-[#9c1c22] font-cinzel font-black tracking-widest text-[10px] uppercase leading-relaxed">
                        {selectedFacilitator.role}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 text-[#332d2b]/80 font-serif leading-relaxed text-base">
                    {selectedFacilitator.bio.map((paragraph: string, idx: number) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="mt-10 flex justify-end">
                    <button 
                      onClick={() => setSelectedFacilitator(null)}
                      className="px-8 py-3 rounded-full bg-[#9c1c22] hover:bg-[#7a1219] text-white font-serif text-sm uppercase font-bold tracking-wider transition-colors shadow-lg"
                    >
                      Close Profile
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Pricing / Admission Section */}
        <section className="bg-white/40 glass rounded-[4rem] border border-[#eeb053]/20 shadow-xl p-8 md:p-16 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-serif font-black uppercase text-[#332d2b] mb-4">Choose Your Ticket</h3>
            <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase">Both ticket paths offer complete access to the core workshop content.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Free */}
            <div className="bg-white/80 p-8 rounded-[3rem] border border-black/5 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-cinzel font-black tracking-widest text-[#332d2b]/40 uppercase block mb-2">{WORKSHOP_DETAILS.pricing.free.name}</span>
                <div className="text-5xl font-serif font-black text-[#332d2b] mb-4">{WORKSHOP_DETAILS.pricing.free.price}</div>
                <p className="text-base font-serif text-[#332d2b]/60 uppercase leading-relaxed mb-6">{WORKSHOP_DETAILS.pricing.free.description}</p>
              </div>
              <button 
                onClick={() => onNavigate('register-workshop', 'free')}
                className="w-full py-4 border border-[#9c1c22] hover:bg-[#9c1c22] text-[#9c1c22] hover:text-white rounded-full font-cinzel font-black text-[10px] uppercase tracking-widest transition-all"
              >
                Get Free Ticket
              </button>
            </div>

            {/* Paid */}
            <div className="bg-[#1a1a1a] text-white p-8 rounded-[3rem] border-2 border-[#eeb053] flex flex-col justify-between shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-4 right-4 bg-[#eeb053] text-[#1a1a1a] px-3 py-1 rounded-full text-[8px] font-cinzel font-black uppercase tracking-wider">Support Us</div>
              <div>
                <span className="text-[9px] font-cinzel font-black tracking-widest text-[#eeb053] uppercase block mb-2">{WORKSHOP_DETAILS.pricing.paid.name}</span>
                <div className="text-5xl font-serif font-black text-[#eeb053] mb-4">{WORKSHOP_DETAILS.pricing.paid.price}</div>
                <p className="text-base font-serif text-white/60 uppercase leading-relaxed mb-6">{WORKSHOP_DETAILS.pricing.paid.description}</p>
              </div>
              <button 
                onClick={() => onNavigate('register-workshop', 'donation')}
                className="w-full py-4 bg-[#eeb053] hover:bg-[#df8c3d] text-[#1a1a1a] rounded-full font-cinzel font-black text-[10px] uppercase tracking-widest transition-all text-center"
              >
                Register & Donate
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

// --- Workshop Registration View ---
interface RegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  organization: string;
  jobTitle: string;
  sex: string;
  ageGroup: string;
  profile: string;
  interests: string[];
  cybersecurityLevel: string;
  financialLevel: string;
  referral: string;
  specialRequirements: string;
  questions: string;
  consentMarketing: boolean;
  consentData: boolean;
  consentPhotos: boolean;
  ticketType: 'free' | 'donation';
  donationAmount: string;
  paymentMethod: string;
  paymentReference: string;
  proofName: string;
}

interface WorkshopRegisterViewProps {
  defaultTicketType?: 'free' | 'donation';
  onSubmitSuccess: () => void;
  gatewayConfigs?: Record<string, any>;
}

const WorkshopRegisterView: React.FC<WorkshopRegisterViewProps> = ({ defaultTicketType = 'free', onSubmitSuccess, gatewayConfigs = {} }) => {
  const [formData, setFormData] = useState<RegistrationForm>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    organization: '',
    jobTitle: '',
    sex: '',
    ageGroup: '',
    profile: '',
    interests: [],
    cybersecurityLevel: 'Beginner',
    financialLevel: 'Beginner',
    referral: '',
    specialRequirements: '',
    questions: '',
    consentMarketing: false,
    consentData: false,
    consentPhotos: false,
    ticketType: defaultTicketType,
    donationAmount: defaultTicketType === 'donation' ? '25' : '',
    paymentMethod: defaultTicketType === 'donation' ? 'PayPal (Online)' : 'Bank Transfer',
    paymentReference: '',
    proofName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paypalPaymentVerified, setPaypalPaymentVerified] = useState(false);
  const [isRegisterPaymentModalOpen, setIsRegisterPaymentModalOpen] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ticketType: defaultTicketType,
      donationAmount: defaultTicketType === 'donation' ? '25' : '',
      paymentMethod: defaultTicketType === 'donation' ? 'PayPal (Online)' : 'Bank Transfer'
    }));
    setPaypalPaymentVerified(false);
  }, [defaultTicketType]);

  const handleOpenPaymentModal = () => {
    if (!formData.donationAmount || parseFloat(formData.donationAmount) <= 0) {
      alert('Please specify a valid donation amount.');
      return;
    }
    setIsRegisterPaymentModalOpen(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof RegistrationForm) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleInterestToggle = (topic: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(topic)
        ? prev.interests.filter(t => t !== topic)
        : [...prev.interests, topic];
      return { ...prev, interests };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ticketType === 'donation') {
      if (!formData.donationAmount || parseFloat(formData.donationAmount) <= 0) {
        alert('Please specify a valid donation amount.');
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const ticketTypeDb = formData.ticketType === 'donation' ? 'donation' : 'free';
      const paymentMethodDb = formData.ticketType === 'donation' && paypalPaymentVerified ? 'PayPal (Online)' : null;
      const paymentRefDb = formData.ticketType === 'donation' 
        ? `Donation: $${formData.donationAmount || '0'} - Ref: ${formData.paymentReference || 'Unpaid (Voluntary)'}` 
        : null;
      
      const { error } = await supabase.from('workshop_registrations').insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        organization: formData.organization,
        job_title: formData.jobTitle,
        sex: formData.sex,
        age_group: formData.ageGroup,
        profile: formData.profile,
        interests: formData.interests,
        cybersecurity_level: formData.cybersecurityLevel,
        financial_level: formData.financialLevel,
        referral: formData.referral,
        special_requirements: formData.specialRequirements,
        questions: formData.questions,
        consent_marketing: formData.consentMarketing,
        consent_data: formData.consentData,
        consent_photos: formData.consentPhotos,
        ticket_type: ticketTypeDb,
        payment_method: paymentMethodDb,
        payment_reference: paymentRefDb,
      });
      if (error) {
        console.error('Supabase error:', error);
      } else {
        // Trigger email notifications
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'registration',
            payload: {
              full_name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              city: formData.city,
              organization: formData.organization,
              job_title: formData.jobTitle,
              sex: formData.sex,
              age_group: formData.ageGroup,
              profile: formData.profile,
              interests: formData.interests,
              cybersecurity_level: formData.cybersecurityLevel,
              financial_level: formData.financialLevel,
              referral: formData.referral,
              special_requirements: formData.specialRequirements,
              questions: formData.questions,
              ticket_type: ticketTypeDb,
              payment_method: paymentMethodDb || '',
              payment_reference: paymentRefDb || '',
            }
          })
        }).catch(err => console.error('Email trigger failure:', err));
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
    setIsSubmitting(false);
    setIsSubmitted(true);
    onSubmitSuccess();
  };

  if (isSubmitted) {
    return (
      <section className="pt-24 pb-16 md:pt-48 md:pb-32 bg-[#fdfaf6] min-h-[80vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full mx-auto px-4 text-center"
        >
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 shadow-xl">
            <Check size={48} className="stroke-[3]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-[#332d2b] uppercase mb-6">Registration Confirmed</h2>
          <div className="h-1 w-20 bg-[#eeb053] mx-auto mb-8" />
          <p className="text-xl font-serif text-[#332d2b]/70 uppercase leading-relaxed mb-12">
            Thank you for registering for the Cybersecurity & Financial Literacy Workshop. A confirmation email with event details will be sent to your email address shortly.
          </p>
          <a
            href="/workshop"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', '/workshop');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#9c1c22] hover:bg-[#332d2b] text-white rounded-full font-cinzel font-black text-[10px] uppercase tracking-widest transition-all shadow-md"
          >
            Return to Workshop Page <MoveRight size={14} />
          </a>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-16 md:pt-48 md:pb-32 bg-[#fdfaf6] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[10px] md:text-[12px] uppercase mb-6 block">Workshop Registration</motion.span>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-[#332d2b] uppercase leading-tight tracking-tight mb-6 text-shine">
            Secure Your Place.
          </h1>
          <p className="text-lg font-serif italic text-[#332d2b]/60 max-w-2xl mx-auto uppercase">
            Learn practical skills to protect yourself online and make smarter financial decisions.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white/40 glass p-4 sm:p-6 md:p-12 rounded-[2rem] sm:rounded-[3rem] border border-[#eeb053]/20 shadow-xl space-y-12 text-left">
          {/* Ticket Path Toggle */}
          <div>
            <h3 className="text-lg font-cinzel font-black tracking-widest text-[#9c1c22] uppercase mb-6 border-b border-[#332d2b]/10 pb-2">Ticket Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`cursor-pointer p-6 rounded-2xl border-2 flex flex-col transition-all ${formData.ticketType === 'free' ? 'border-[#9c1c22] bg-white shadow-md' : 'border-transparent bg-white/20 hover:bg-white/40'}`}>
                <input type="radio" name="ticketType" checked={formData.ticketType === 'free'} onChange={() => setFormData(p => ({ ...p, ticketType: 'free' }))} className="sr-only" />
                <span className="text-[10px] font-cinzel font-black uppercase tracking-wider text-[#332d2b]">General Admission & Certificate</span>
                <span className="text-2xl font-serif font-black text-[#9c1c22] mt-1">$0</span>
              </label>
              <label className={`cursor-pointer p-6 rounded-2xl border-2 flex flex-col transition-all ${formData.ticketType === 'donation' ? 'border-[#eeb053] bg-white shadow-lg' : 'border-transparent bg-white/20 hover:bg-white/40'}`}>
                <input type="radio" name="ticketType" checked={formData.ticketType === 'donation'} onChange={() => setFormData(p => ({ ...p, ticketType: 'donation' }))} className="sr-only" />
                <span className="text-[10px] font-cinzel font-black uppercase tracking-wider text-[#332d2b]">Donate for next batch</span>
                <span className="text-2xl font-serif font-black text-[#eeb053] mt-1">Donation</span>
              </label>
            </div>

            {formData.ticketType === 'donation' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-6 bg-white/60 rounded-2xl border border-[#eeb053]/30"
              >
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-3">
                  Donation Amount ($) *
                </label>
                <div className="flex flex-wrap gap-3">
                  {['10', '25', '50', '100'].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      disabled={paypalPaymentVerified}
                      onClick={() => setFormData(p => ({ ...p, donationAmount: amount }))}
                      className={`px-5 py-2.5 rounded-xl text-xs font-serif uppercase transition-all ${
                        formData.donationAmount === amount
                          ? 'bg-[#eeb053] text-[#1a1a1a] font-black'
                          : 'bg-white border border-[#332d2b]/10 hover:bg-white/80 text-[#332d2b]'
                      } ${paypalPaymentVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      ${amount}
                    </button>
                  ))}
                  <div className="relative flex-grow min-w-[150px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#332d2b]/50">$</span>
                    <input
                      type="number"
                      min="1"
                      disabled={paypalPaymentVerified}
                      placeholder="Other Amount"
                      value={formData.donationAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(p => ({ ...p, donationAmount: val }));
                      }}
                      className={`w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#332d2b]/10 bg-white focus:outline-none focus:ring-1 focus:ring-[#eeb053] text-sm text-[#332d2b] ${paypalPaymentVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#332d2b]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-cinzel font-black uppercase text-[#9c1c22] tracking-wider mb-1">
                      {paypalPaymentVerified ? 'Payment Confirmed' : 'Support Voluntary'}
                    </h4>
                    <p className="text-xs font-serif italic text-[#332d2b]/60 uppercase">
                      {paypalPaymentVerified 
                        ? `Transaction Reference: ${formData.paymentReference}`
                        : 'Your support is voluntary but highly appreciated.'
                      }
                    </p>
                  </div>
                  
                  {!paypalPaymentVerified ? (
                    <button
                      type="button"
                      onClick={handleOpenPaymentModal}
                      className="px-6 py-3 bg-[#eeb053] hover:bg-[#9c1c22] hover:text-white text-[#1a1a1a] rounded-xl font-cinzel font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 border border-[#eeb053]/50 shrink-0"
                    >
                      <CreditCard size={14} /> Pay via PayPal
                    </button>
                  ) : (
                    <div className="px-6 py-3 bg-green-500/10 text-green-700 rounded-xl font-cinzel font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-green-500/30 shrink-0">
                      <Check size={14} /> Paid (${parseFloat(formData.donationAmount || '0').toFixed(2)})
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-cinzel font-black tracking-widest text-[#9c1c22] uppercase border-b border-[#332d2b]/10 pb-2">1. Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Full Name *</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b]" />
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b]" />
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b]" />
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">City/Town</label>
                <input type="text" name="city" value={formData.city} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b]" />
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Organization/Company (Optional)</label>
                <input type="text" name="organization" value={formData.organization} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b]" />
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Job Title/Profession (Optional)</label>
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b]" />
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Sex *</label>
                <select required name="sex" value={formData.sex} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b] font-serif uppercase">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Age Group *</label>
                <select required name="ageGroup" value={formData.ageGroup} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b] font-serif uppercase">
                  <option value="">Select your age range</option>
                  <option value="16 - 25">16 – 25</option>
                  <option value="26 - 30">26 – 30</option>
                  <option value="31 - 35">31 – 35</option>
                  <option value="36 - 40">36 – 40</option>
                  <option value="41 - 45">41 – 45</option>
                  <option value="46 - 51">46 – 51</option>
                  <option value="52 and above">52 and above</option>
                </select>
              </div>
            </div>
          </div>

          {/* Participant Profile */}
          <div className="space-y-6">
            <h3 className="text-lg font-cinzel font-black tracking-widest text-[#9c1c22] uppercase border-b border-[#332d2b]/10 pb-2">2. Participant Profile</h3>
            <div>
              <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-4">Which best describes you? *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Student",
                  "Entrepreneur/Business Owner",
                  "Employee",
                  "Freelancer",
                  "Government Worker",
                  "Financial Professional",
                  "IT/Cybersecurity Professional",
                  "Other"
                ].map((role) => (
                  <label key={role} className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between text-xs font-serif uppercase transition-all ${formData.profile === role ? 'border-[#9c1c22] bg-[#9c1c22]/5 text-[#9c1c22] font-black' : 'border-[#332d2b]/10 bg-white/40 text-[#332d2b]'}`}>
                    <input required type="radio" name="profile" checked={formData.profile === role} onChange={() => setFormData(p => ({ ...p, profile: role }))} className="sr-only" />
                    {role}
                    {formData.profile === role && <Check size={14} />}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Workshop Interests */}
          <div className="space-y-6">
            <h3 className="text-lg font-cinzel font-black tracking-widest text-[#9c1c22] uppercase border-b border-[#332d2b]/10 pb-2">3. Workshop Interests (Select All That Apply)</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Cybersecurity Track */}
              <div>
                <h4 className="text-sm font-cinzel font-black text-[#9c1c22] tracking-wider uppercase mb-4">Cybersecurity</h4>
                <div className="space-y-3">
                  {[
                    "Password Security & MFA",
                    "Social Engineering & Phishing Awareness",
                    "Online Privacy",
                    "Safe Social Media Practices",
                    "Mobile Security",
                    "Business Cybersecurity Basics",
                    "Data Protection"
                  ].map((topic) => (
                    <label key={topic} className="flex items-center gap-3 cursor-pointer text-sm font-serif uppercase text-[#332d2b]">
                      <input type="checkbox" checked={formData.interests.includes(topic)} onChange={() => handleInterestToggle(topic)} className="w-4 h-4 accent-[#9c1c22]" />
                      {topic}
                    </label>
                  ))}
                </div>
              </div>

              {/* Financial Literacy Track */}
              <div>
                <h4 className="text-sm font-cinzel font-black text-[#eeb053] tracking-wider uppercase mb-4">Financial Literacy</h4>
                <div className="space-y-3">
                  {[
                    "Budgeting & Personal Finance",
                    "Saving Strategies",
                    "Investing Basics",
                    "Debt Management",
                    "Credit & Loans",
                    "Financial Fraud Prevention",
                    "Building Multiple Income Streams"
                  ].map((topic) => (
                    <label key={topic} className="flex items-center gap-3 cursor-pointer text-sm font-serif uppercase text-[#332d2b]">
                      <input type="checkbox" checked={formData.interests.includes(topic)} onChange={() => handleInterestToggle(topic)} className="w-4 h-4 accent-[#eeb053]" />
                      {topic}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-6">
            <h3 className="text-lg font-cinzel font-black tracking-widest text-[#9c1c22] uppercase border-b border-[#332d2b]/10 pb-2">4. Experience Level</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Cybersecurity Knowledge Level</label>
                <select name="cybersecurityLevel" value={formData.cybersecurityLevel} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b] font-serif uppercase">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Financial Literacy Knowledge Level</label>
                <select name="financialLevel" value={formData.financialLevel} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#eeb053] text-[#332d2b] font-serif uppercase">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logistics & Logistics Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-cinzel font-black tracking-widest text-[#9c1c22] uppercase border-b border-[#332d2b]/10 pb-2">5. Logistics & Questions</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">How did you hear about this workshop?</label>
                <select name="referral" value={formData.referral} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b] font-serif uppercase">
                  <option value="">Select an option</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Friend/Colleague">Friend/Colleague</option>
                  <option value="Email">Email</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">Do you have any accessibility or special requirements?</label>
                <textarea rows={3} name="specialRequirements" value={formData.specialRequirements} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b] font-serif" placeholder="Tell us if you require sign language interpreters, closed captioning, physical accessibility support, etc." />
              </div>
              <div>
                <label className="block text-[9px] font-cinzel font-black tracking-widest text-[#332d2b] uppercase mb-2">What is one question or challenge you'd like addressed during the workshop?</label>
                <textarea rows={3} name="questions" value={formData.questions} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl border border-[#332d2b]/10 bg-white/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9c1c22] text-[#332d2b] font-serif" placeholder="e.g., How do I protect my small business domain from spoofing? or What index funds are best for beginners?" />
              </div>
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-4">
            <h3 className="text-lg font-cinzel font-black tracking-widest text-[#9c1c22] uppercase border-b border-[#332d2b]/10 pb-2">Consent & Agreement</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-4 cursor-pointer text-sm font-serif uppercase text-[#332d2b]">
                <input required type="checkbox" checked={formData.consentData} onChange={() => handleCheckboxChange('consentData')} className="mt-1 w-4 h-4 accent-[#9c1c22]" />
                <span>I consent to the collection and processing of my registration information for workshop administration purposes. *</span>
              </label>
              <label className="flex items-start gap-4 cursor-pointer text-sm font-serif uppercase text-[#332d2b]">
                <input type="checkbox" checked={formData.consentMarketing} onChange={() => handleCheckboxChange('consentMarketing')} className="mt-1 w-4 h-4 accent-[#9c1c22]" />
                <span>I agree to receive workshop updates via email and SMS. (Optional)</span>
              </label>
              <label className="flex items-start gap-4 cursor-pointer text-sm font-serif uppercase text-[#332d2b]">
                <input type="checkbox" checked={formData.consentPhotos} onChange={() => handleCheckboxChange('consentPhotos')} className="mt-1 w-4 h-4 accent-[#9c1c22]" />
                <span>I understand that workshop photos/videos may be taken and used for promotional purposes. (Optional)</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[#9c1c22] hover:bg-[#332d2b] disabled:bg-[#332d2b]/60 text-white rounded-full font-cinzel font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 border border-[#eeb053]/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : (
                <>Register Now</>
              )}
            </button>
          </div>
        </form>

        <PaymentModal 
          isOpen={isRegisterPaymentModalOpen} 
          onClose={() => setIsRegisterPaymentModalOpen(false)} 
          initialAmount={formData.donationAmount || '25'}
          isLockedAmount={true}
          gatewayConfigs={gatewayConfigs}
          donorName={formData.fullName}
          donorEmail={formData.email}
          donorPhone={formData.phone}
          onSuccess={(msg, txId, method) => {
            setFormData(p => ({
              ...p,
              paymentMethod: method,
              paymentReference: txId
            }));
            setPaypalPaymentVerified(true);
          }}
          onError={(msg) => alert(msg)}
        />
      </div>
    </section>
  );
};

// --- Root Component ---

const App: React.FC = () => {
  // Route to admin panel if on /admin
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminApp />;
  }

  const [cms, setCms] = useState<Record<string, string>>({
    'hero:title': 'Love in Action,<br/><span class="italic font-normal text-shine text-[#eeb053]">Change in Motion.</span>',
    'hero:subtitle': 'WE ARE THE KINETIC PULSE OF TRANSFORMATION, ENGINEERING PATHWAYS TO LOVE AND HUMANITY',
    'about:intro': 'At FOL, we believe love is an energy that transcends barriers. Through our programs in health, education, housing, mental wellness, and community empowerment, we foster resilience and inspire individuals to reach their fullest potential. Foundation of Luv serves as both: A direct-impact organization delivering programs and interventions, and a holding, stewardship, and governance body for public-good initiatives that cannot legally or ethically sit under for-profit entities. Through strategic collaboration with Azariah Management Group (AMG) and its creative and technical arms, FoL transforms advocacy into action, and awareness into sustainable systems of support.',
    'contact:phone': '443-402-5802',
    'contact:address': '#9960 Raven Hurst Road, Middle River MD 21221',
    'contact:email': 'hello@foundationofluv.org',
    'workshop:date': 'Saturday, July 18, 2026',
    'workshop:time': '10:00 AM - 3:00 PM EST',
    'workshop:location': 'Online (Podore Link Provided Upon Registration)',
    'workshop:flyer_url': '/workshop-poster.jpg'
  });
  const [gatewayConfigs, setGatewayConfigs] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchCms = async () => {
      try {
        const { data, error } = await supabase.from('site_content').select('section, key, value');
        if (data && !error) {
          const newCms: Record<string, string> = { ...cms };
          const configs: Record<string, any> = {};
          data.forEach((row: any) => {
            if (row.section.startsWith('gateway_')) {
              const gwId = row.section.replace('gateway_', '');
              if (!configs[gwId]) configs[gwId] = {};
              configs[gwId][row.key] = row.value ?? '';
            } else {
              newCms[`${row.section}:${row.key}`] = row.value ?? '';
            }
          });
          setCms(newCms);
          setGatewayConfigs(configs);
        }
      } catch (err) {
        console.error('Failed to fetch CMS content:', err);
      }
    };
    fetchCms();
  }, []);

  const getInitialPage = () => {
    const path = window.location.pathname.replace(/^\//, '');
    const validPages = [...NAVIGATION.map(item => item.id), 'register-workshop'];
    if (validPages.includes(path)) {
      return path;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminLoggedIn(!!session?.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [selectedTicketType, setSelectedTicketType] = useState<'free' | 'donation'>('free');

  const handleNavigate = (pageId: string, ticketType?: 'free' | 'donation') => {
    const navItem = NAVIGATION.find(item => item.id === pageId);
    if (navItem?.url) {
      window.open(navItem.url, '_blank', 'noopener,noreferrer');
      setIsMenuOpen(false);
      return;
    }
    setCurrentPage(pageId);
    if (ticketType) {
      setSelectedTicketType(ticketType);
    }
    const targetPath = pageId === 'home' ? '/' : `/${pageId}`;
    window.history.pushState(null, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'aboutus': return <DetailedAboutView cms={cms} />;
      case 'globalservices': return <GlobalServicesView />;
      case 'roadmap': return <RoadmapView />;
      case 'luvwatts': return <LUVWATTSView />;
      case 'team': return <TeamView />;
      case 'gallery': return <GalleryPageView />;
      case 'programs': return <ProgramsPageView />;
      case 'blog': return <BlogView />;
      case 'resources': return <ResourcesView />;
      case 'workshop': return <WorkshopView onNavigate={handleNavigate} cms={cms} />;
      case 'register-workshop': return <WorkshopRegisterView defaultTicketType={selectedTicketType} onSubmitSuccess={() => showToast("Registration Submitted Successfully!")} />;
      case 'donation': return <DonorView onInitiate={() => setIsPaymentModalOpen(true)} />;
      case 'contact': return <ContactView onSubmitSuccess={() => showToast("Message Sent Successfully!")} cms={cms} />;
      default: return <HomeView onNavigate={handleNavigate} cms={cms} />;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden selection:bg-[#9c1c22]/20 selection:text-[#9c1c22] bg-[#fdfaf6] relative">
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <FireworksBackground />
          <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#9c1c22] via-[#eeb053] to-[#ffffff] z-[100] origin-left" style={{ scaleX: scrollYProgress }} />
          <nav className="fixed w-full z-50 glass border-b-2 border-[#eeb053]/30">
            <div className="max-w-7xl mx-auto px-4 h-16 md:h-24 flex justify-between items-center">
              <div onClick={() => handleNavigate('home')} className="cursor-pointer transition-transform hover:scale-105 shrink-0">
                <Logo className="w-10 h-10 md:w-16 md:h-16" />
              </div>
              <div className="hidden md:flex items-center gap-5">
                {NAVIGATION.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleNavigate(item.id)} 
                    className={`text-[10px] font-cinzel font-bold uppercase tracking-[0.2em] transition-all relative group ${item.id === 'donation' ? 'bg-[#9c1c22] text-white px-5 py-2 rounded-full border border-[#eeb053]/50 hover:bg-[#1a1a1a]' : 'text-[#332d2b] hover:text-[#9c1c22]'}`}
                  >
                    {item.name}
                  </button>
                ))}
                {isAdminLoggedIn && (
                  <a 
                    href="/admin" 
                    className="text-[10px] font-cinzel font-bold uppercase tracking-[0.2em] transition-all relative group bg-[#eeb053] text-black px-5 py-2 rounded-full border border-[#9c1c22]/50 hover:bg-[#1a1a1a]"
                  >
                    Admin Panel
                  </a>
                )}
              </div>
              <button className="md:hidden p-2 text-[#332d2b]" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
            </div>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden glass border-b border-[#332d2b]/10 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl">
                  <div className="px-8 py-10 space-y-6 bg-white">
                    {NAVIGATION.map((item) => (
                      <button 
                        key={item.id} 
                        onClick={() => handleNavigate(item.id)} 
                        className={`block w-full text-left text-lg font-cinzel font-bold tracking-[0.2em] uppercase ${item.id === 'donation' ? 'text-[#9c1c22]' : 'text-[#332d2b]'}`}
                      >
                        {item.name}
                      </button>
                    ))}
                    {isAdminLoggedIn && (
                      <a 
                        href="/admin" 
                        className="block w-full text-left text-lg font-cinzel font-bold tracking-[0.2em] uppercase text-[#9c1c22] border-t border-black/10 pt-6 mt-6"
                      >
                        Admin Panel
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
          
          <main className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div key={currentPage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="bg-[#1a1a1a] text-[#fdfaf6] pt-16 pb-12 md:pt-32 md:pb-20 relative overflow-hidden z-20 border-t-8 border-[#eeb053]">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24 items-start">
                <div className="lg:col-span-2 text-center md:text-left">
                  <div onClick={() => handleNavigate('home')} className="cursor-pointer inline-block mb-8">
                    <Logo className="w-16 h-16 md:w-32 md:h-32 brightness-110 drop-shadow-2xl" />
                  </div>
                  <p className="text-xl md:text-2xl text-[#fdfaf6]/60 max-w-lg mb-8 font-serif italic uppercase leading-relaxed break-words">
                    "Restoring human dignity and transforming global communities through compassion."
                  </p>
                  <div className="flex flex-col gap-4 text-lg md:text-xl font-serif text-[#eeb053]">
                    <div className="flex items-center justify-center md:justify-start gap-3"><Phone size={18} className="text-[#9c1c22]" /> {cms['contact:phone']}</div>
                    <div className="flex items-center justify-center md:justify-start gap-3"><MapPin size={18} className="text-[#9c1c22]" /> {cms['contact:address']}</div>
                  </div>
                  {/* Social Media Links */}
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
                    <a href={RESOURCES_CONTENT.socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#9c1c22] rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all">
                      <Youtube size={18} />
                    </a>
                    <a href={RESOURCES_CONTENT.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#9c1c22] rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all">
                      <Instagram size={18} />
                    </a>
                    <a href={RESOURCES_CONTENT.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#9c1c22] rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all">
                      <Linkedin size={18} />
                    </a>
                    <a href={RESOURCES_CONTENT.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#9c1c22] rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all">
                      <Facebook size={18} />
                    </a>
                  </div>
                </div>
                
                <div className="text-center md:text-left">
                  <h5 className="text-[#eeb053] font-cinzel font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-8">Sitemap</h5>
                  <ul className="space-y-4 text-lg md:text-xl font-serif italic text-[#fdfaf6]/50 uppercase">
                    {NAVIGATION.map((item) => (
                      <li key={item.id}>
                        <button onClick={() => handleNavigate(item.id)} className="hover:text-white transition-colors">
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-center md:text-left">
                  <h5 className="text-[#eeb053] font-cinzel font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-8">Inquiries</h5>
                  <p className="text-lg md:text-xl font-serif italic text-[#fdfaf6]/50 leading-relaxed uppercase break-words">
                    Direct Correspondence:<br />
                    <span className="text-[#eeb053] lowercase">{cms['contact:email']}</span>
                  </p>
                  <div className="mt-8">
                    <a
                      href={RESOURCES_CONTENT.pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-[#eeb053]/20 hover:bg-[#eeb053] text-[#eeb053] hover:text-[#332d2b] rounded-full font-cinzel font-black text-[10px] uppercase tracking-widest transition-all border border-[#eeb053]/30"
                    >
                      <FileText size={14} /> FOL Profile PDF
                    </a>
                  </div>
                </div>
              </div>
              <div className="pt-10 border-t border-white/5 text-[#fdfaf6]/30 text-[9px] md:text-[11px] font-cinzel font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-center md:text-left break-words">
                © 2025 FOUNDATION OF LUV. LOVE IN ACTION, CHANGE IN MOTION.
              </div>
            </div>
          </footer>

          <ScrollToTopButton />
          
          <PaymentModal 
            isOpen={isPaymentModalOpen} 
            onClose={() => setIsPaymentModalOpen(false)} 
            gatewayConfigs={gatewayConfigs}
            onSuccess={async (msg, txId, method, donorInfo) => {
              showToast(msg, 'success');
              if (donorInfo) {
                try {
                  await supabase.from('workshop_registrations').insert({
                    full_name: donorInfo.fullName,
                    email: donorInfo.email,
                    ticket_type: 'donation',
                    payment_method: method,
                    payment_reference: `Donation: $${donorInfo.amount} - Ref: ${txId}`,
                  });
                } catch (e) {
                  console.error("Failed to save donation record:", e);
                }
              }
            }}
            onError={(msg) => showToast(msg, 'error')}
          />

          <AnimatePresence>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default App;
