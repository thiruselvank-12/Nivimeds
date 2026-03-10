"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Shield, ArrowRight, X, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useUserStore, DEMO_USER } from '../../../store/userStore';
import { isValidPhone } from '../../../lib/utils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'phone' | 'otp' | 'success';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(180); // 3 min
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [sentOtp] = useState('123456'); // Simulated OTP
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { setUser } = useUserStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setAttempts(0);
      setIsLocked(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // OTP countdown
  useEffect(() => {
    if (step !== 'otp') return;
    setCountdown(180);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Lock countdown
  useEffect(() => {
    if (!isLocked) return;
    setLockCountdown(300);
    const timer = setInterval(() => {
      setLockCountdown((c) => {
        if (c <= 1) { clearInterval(timer); setIsLocked(false); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked]);

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleSendOtp = () => {
    if (!isValidPhone(phone)) {
      setPhoneError('Enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneError('');
    setStep('otp');
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (isLocked) return;
    const entered = otp.join('');
    if (entered !== sentOtp) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setIsLocked(true);
        setOtpError('');
      } else {
        setOtpError(`Incorrect OTP. ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? 's' : ''} remaining.`);
      }
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      return;
    }
    setStep('success');
    setUser({ ...DEMO_USER, phone });
    setTimeout(onClose, 2000);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setAttempts(0);
    setCountdown(180);
    otpRefs.current[0]?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E6FD9] to-[#0A4B9C] p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">
            {step === 'phone' && 'Login to Nivimeds'}
            {step === 'otp' && 'Enter OTP'}
            {step === 'success' && 'Welcome back!'}
          </h2>
          <p className="text-blue-200 text-sm mt-1">
            {step === 'phone' && 'Get medicines, lab tests & more'}
            {step === 'otp' && `OTP sent to +91 ${phone}`}
            {step === 'success' && 'You are now logged in 🎉'}
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9 text-[#4CAF50]" />
              </div>
              <p className="text-lg font-bold text-gray-800">Login Successful!</p>
              <p className="text-sm text-gray-500">Redirecting you now…</p>
            </div>
          )}

          {/* Phone Step */}
          {step === 'phone' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <div className="flex gap-0 border-2 border-gray-200 focus-within:border-[#1E6FD9] rounded-xl overflow-hidden transition-colors">
                  <span className="flex items-center bg-gray-50 px-3 text-sm font-bold text-gray-600 border-r border-gray-200">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    placeholder="10-digit mobile number"
                    className="flex-1 px-4 py-3 text-sm outline-none bg-white"
                    aria-label="Mobile number"
                  />
                </div>
                {phoneError && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {phoneError}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">We&apos;ll send a 6-digit OTP to verify your number.</p>
              </div>
              <button
                onClick={handleSendOtp}
                className="w-full bg-[#1E6FD9] hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                Send OTP <ArrowRight className="w-4 h-4" />
              </button>
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <>
              {/* Lock message */}
              {isLocked && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center space-y-1">
                  <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
                  <p className="text-sm font-bold text-red-700">Account temporarily locked</p>
                  <p className="text-xs text-red-500">Too many incorrect attempts. Try again in {formatTimer(lockCountdown)}</p>
                </div>
              )}

              {!isLocked && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                      Enter the 6-digit OTP <span className="text-gray-400 font-normal">(Demo OTP: 123456)</span>
                    </label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          maxLength={1}
                          className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-200 focus:border-[#1E6FD9] rounded-xl outline-none transition-colors"
                          aria-label={`OTP digit ${i + 1}`}
                        />
                      ))}
                    </div>
                    {otpError && (
                      <p className="mt-2 text-sm text-red-500 text-center flex items-center justify-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {otpError}
                      </p>
                    )}
                  </div>

                  {/* Countdown */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      {countdown > 0 ? `Expires in ${formatTimer(countdown)}` : 'OTP expired'}
                    </span>
                    <button
                      onClick={handleResend}
                      disabled={countdown > 0}
                      className="flex items-center gap-1 text-[#1E6FD9] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:underline"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                    </button>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.join('').length !== 6 || countdown === 0}
                    className="w-full bg-[#4CAF50] hover:bg-green-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    Verify OTP <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={() => setStep('phone')}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                ← Change mobile number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
