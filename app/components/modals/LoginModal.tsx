"use client";

import React, { useState } from 'react';
import { X, Phone, Shield, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { useUserStore } from '../../../store/userStore';
import { authApi } from '../../../lib/apiClient';
import { useCartStore } from '../../../store/cartStore';
import { cartApi } from '../../../lib/apiClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'phone' | 'otp' | 'name' | 'success';

export default function LoginModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const { setUser } = useUserStore();
  const { items } = useCartStore();

  if (!isOpen) return null;

  const handleSendOTP = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.sendOTP(phone);
      if (data.devOtp) setDevOtp(data.devOtp); // dev mode helper
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.verifyOTP(phone, otp, name || undefined);
      if (data.user.isNewUser && !name) {
        setIsNewUser(true);
        setStep('name');
        return;
      }
      await finalizeLogin(data.user);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetName = async () => {
    if (name.length < 2) {
      setError('Please enter your name (at least 2 characters)');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.verifyOTP(phone, otp, name);
      await finalizeLogin(data.user);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const finalizeLogin = async (userData: any) => {
    setUser(userData);
    // Sync local cart to server
    if (items.length > 0) {
      cartApi.sync(items).catch(() => {});
    }
    setStep('success');
    setTimeout(() => {
      onClose();
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setName('');
    setError('');
    setDevOtp('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E6FD9] to-[#1557b0] p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
            {step === 'success' ? (
              <CheckCircle className="w-7 h-7" />
            ) : (
              <Phone className="w-7 h-7" />
            )}
          </div>
          <h2 className="text-xl font-extrabold">
            {step === 'phone' && 'Login / Sign Up'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'name' && "What's your name?"}
            {step === 'success' && 'Welcome! 🎉'}
          </h2>
          <p className="text-white/75 text-sm mt-1">
            {step === 'phone' && 'Enter your mobile number to continue'}
            {step === 'otp' && `OTP sent to +91 ${phone}`}
            {step === 'name' && 'Tell us your name to set up your account'}
            {step === 'success' && "You're now logged in to Nivimeds"}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Phone Step */}
          {step === 'phone' && (
            <>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#1E6FD9] transition-colors">
                <span className="bg-gray-50 px-3 py-3 text-gray-500 font-semibold border-r border-gray-200">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  placeholder="10-digit mobile number"
                  className="flex-1 px-4 py-3 text-gray-800 font-semibold outline-none bg-transparent"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-[#1E6FD9] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Sending OTP...' : 'Send OTP'}
                {!loading && <ChevronRight className="w-4 h-4" />}
              </button>
              <p className="text-xs text-gray-400 text-center">
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <>
              {devOtp && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm text-yellow-800">
                  <strong>Dev Mode OTP:</strong> {devOtp}
                </div>
              )}
              <div className="flex gap-2 justify-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otp[i] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const newOtp = otp.split('');
                      newOtp[i] = val;
                      setOtp(newOtp.join('').slice(0, 6));
                      if (val && i < 5) {
                        (document.querySelectorAll('.otp-input')[i + 1] as HTMLInputElement)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) {
                        (document.querySelectorAll('.otp-input')[i - 1] as HTMLInputElement)?.focus();
                      }
                    }}
                    className="otp-input w-12 h-12 border-2 border-gray-200 rounded-xl text-center font-bold text-lg focus:border-[#1E6FD9] focus:outline-none transition-colors"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full bg-[#1E6FD9] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                className="w-full text-gray-400 text-sm hover:text-gray-600"
              >
                ← Change number
              </button>
            </>
          )}

          {/* Name Step (new user) */}
          {step === 'name' && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
                placeholder="Your full name"
                className="w-full border-2 border-gray-200 focus:border-[#1E6FD9] rounded-xl px-4 py-3 font-semibold outline-none"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleSetName}
                disabled={loading}
                className="w-full bg-[#1E6FD9] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Setting up...' : 'Continue'}
              </button>
            </>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="text-center py-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold">Login successful!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
