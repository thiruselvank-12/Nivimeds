"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Navigation, AlertCircle, CheckCircle, Bike } from 'lucide-react';
import { useLocationStore } from '../../../store/locationStore';
import { isValidPincode } from '../../../lib/utils';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddressModal({ isOpen, onClose }: AddressModalProps) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const { simulateGPSDetect, isDetecting, city, pincode, isServiceable, setPincode } = useLocationStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setPinInput('');
      setPinError('');
      setPinSuccess('');
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleDetectGPS = async () => {
    await simulateGPSDetect();
  };

  const handlePincodeCheck = () => {
    const p = pinInput.trim();
    if (!isValidPincode(p)) {
      setPinError('Please enter a valid 6-digit pincode.');
      setPinSuccess('');
      return;
    }
    setPinError('');
    setPincode(p);
    if (['600001','600002','600010','600020','600050','600100','600102',
         '400001','400050','400070','110001','110010','110011','500001',
         '560001','560010','560100','700001','700010','201301'].includes(p)) {
      setPinSuccess(`✓ Delivery available to pincode ${p}!`);
      setTimeout(onClose, 1500);
    } else {
      setPinError(`Sorry, we don't deliver to pincode ${p} yet.`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#1E6FD9]" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Delivery Location</h2>
                <p className="text-xs text-gray-500">Currently: {city} — {pincode}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* GPS Detect Button */}
            <button
              onClick={handleDetectGPS}
              disabled={isDetecting}
              className="w-full flex items-center gap-3 border-2 border-[#1E6FD9] text-[#1E6FD9] hover:bg-blue-50 disabled:opacity-60 py-3 px-4 rounded-xl font-semibold transition-colors"
            >
              <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
              {isDetecting ? 'Detecting your location…' : 'Detect my current location (GPS)'}
            </button>

            {/* Cyclist Animation — shown during GPS detection */}
            {isDetecting && (
              <div className="relative h-14 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl overflow-hidden border border-green-100">
                {/* Road dashes */}
                <div className="absolute bottom-3 left-0 right-0 flex gap-6 px-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-0.5 w-6 bg-gray-300 rounded-full" />
                  ))}
                </div>
                {/* Animated cyclist */}
                <div
                  className="absolute bottom-2 text-2xl"
                  style={{ animation: 'cyclist 3s linear forwards' }}
                >
                  🚴
                </div>
                <p className="absolute top-2 left-0 right-0 text-center text-xs font-semibold text-[#1E6FD9]">
                  Finding your location…
                </p>
                <style>{`
                  @keyframes cyclist {
                    from { left: 95%; }
                    to { left: -10%; }
                  }
                `}</style>
              </div>
            )}

            {/* Pincode Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Or enter your pincode</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPinInput(val);
                    setPinError('');
                    setPinSuccess('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handlePincodeCheck()}
                  placeholder="e.g. 600100"
                  maxLength={6}
                  className="flex-1 border-2 border-gray-200 focus:border-[#1E6FD9] rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-colors"
                  aria-label="Enter pincode"
                />
                <button
                  onClick={handlePincodeCheck}
                  disabled={pinInput.length !== 6}
                  className="bg-[#1E6FD9] disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold transition-colors hover:bg-blue-700 min-w-[80px]"
                >
                  Check
                </button>
              </div>

              {pinError && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {pinError}
                </div>
              )}
              {pinSuccess && (
                <div className="mt-2 flex items-center gap-2 text-[#4CAF50] text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" /> {pinSuccess}
                </div>
              )}
            </div>

            {/* Popular Pincodes */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Popular areas</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Chennai South', pin: '600100' },
                  { label: 'T. Nagar', pin: '600017' },
                  { label: 'Mumbai Central', pin: '400050' },
                  { label: 'Delhi NCR', pin: '110001' },
                  { label: 'Bengaluru', pin: '560001' },
                ].map((area) => (
                  <button
                    key={area.pin}
                    onClick={() => { setPinInput(area.pin); setPinError(''); setPinSuccess(''); }}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-[#1E6FD9] font-medium transition-colors"
                  >
                    {area.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
