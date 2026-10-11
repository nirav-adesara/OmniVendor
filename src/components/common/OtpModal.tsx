import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';

export const OtpModal: React.FC = () => {
  const {
    isOtpModalOpen,
    otpModalInitialRole,
    closeOtpModal,
    activeOtpData,
    otpCountdown,
    requestPhoneOtp,
    verifyPhoneOtp,
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOtpModalOpen) {
      setStep('phone');
      setPhoneNumber(otpModalInitialRole === 'vendor' ? '9825022001' : '');
      setOtpCode('');
      setErrorMsg('');
    }
  }, [isOtpModalOpen, otpModalInitialRole]);

  if (!isOtpModalOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNumber = phoneNumber.trim().replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const generated = await requestPhoneOtp(cleanNumber, '+91');
      setOtpCode(generated); // Pre-filled so verification is seamless
      setStep('otp');
    } catch {
      setErrorMsg('Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit verification code');
      return;
    }

    setErrorMsg('');
    const assignedRole = otpModalInitialRole || 'customer';
    const success = verifyPhoneOtp(otpCode, undefined, assignedRole);
    if (!success) {
      setErrorMsg('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white border border-stone-200 rounded-2xl shadow-xl p-6 text-stone-900">
        {/* Close Button */}
        <button
          onClick={closeOtpModal}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Standard Heading */}
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            {step === 'phone' ? 'Sign In' : 'Enter Verification Code'}
          </h2>
          {step === 'otp' && (
            <p className="text-xs text-stone-500 mt-1">
              Sent to +91 {activeOtpData?.phone || phoneNumber}
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Phone Login Field and Button */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Mobile Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-xs font-semibold bg-stone-100 border border-r-0 border-stone-200 rounded-l-xl text-stone-600 select-none">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-stone-200 text-stone-900 text-sm font-medium rounded-r-xl px-3 py-2.5 focus:outline-hidden focus:border-stone-900 transition-all font-mono"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-colors shadow-xs disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Sending...' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification Field and Button */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.3em] font-mono text-xl py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-stone-900 font-bold"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="hover:text-stone-900 underline"
              >
                Change number
              </button>
              <button
                type="button"
                disabled={otpCountdown > 0}
                onClick={() => handleSendOtp()}
                className="text-stone-600 hover:text-stone-900 disabled:opacity-40"
              >
                {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend code'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
