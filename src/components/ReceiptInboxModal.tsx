import React, { useState } from "react";
import { 
  X, 
  Mail, 
  Sparkles, 
  Check, 
  ExternalLink, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { SampleEmailReceipt } from "../types";

interface ReceiptInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleEmails: SampleEmailReceipt[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
  onExtractSingle: (email: SampleEmailReceipt) => void;
  isExtracting: boolean;
}

export function ReceiptInboxModal({
  isOpen,
  onClose,
  sampleEmails,
  selectedEmailId,
  onSelectEmail,
  onExtractSingle,
  isExtracting,
}: ReceiptInboxModalProps) {
  if (!isOpen) return null;

  const currentEmail = sampleEmails.find((e) => e.id === selectedEmailId) || sampleEmails[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Gmail Receipt Explorer
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                  receipt OR invoice OR order OR purchase
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Inspect raw incoming purchase emails before AI parsing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left column is email list, right column is raw email preview & AI action */}
        <div className="grid grid-cols-1 md:grid-cols-12 grow overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Left: Email List (5 cols) */}
          <div className="md:col-span-5 overflow-y-auto max-h-[300px] md:max-h-[600px] bg-slate-50/70 p-2 space-y-1">
            {sampleEmails.map((email) => {
              const isSelected = currentEmail?.id === email.id;
              return (
                <div
                  key={email.id}
                  onClick={() => onSelectEmail(email.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white shadow-xs border border-emerald-500/50"
                      : "hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-900 truncate max-w-[140px]">
                      {email.senderName}
                    </span>
                    <span className="text-slate-400">{email.receivedTime}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 truncate mb-1">
                    {email.subject}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {email.preview}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Email Detail & AI Extraction Trigger (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between overflow-y-auto max-h-[400px] md:max-h-[600px] bg-white p-5">
            {currentEmail ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>From: <strong className="text-slate-700">{currentEmail.sender}</strong></span>
                    <span>{currentEmail.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {currentEmail.subject}
                  </h4>
                </div>

                {/* Raw Email Content Body */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[260px] overflow-y-auto select-text">
                  {currentEmail.rawBody}
                </div>

                {/* Privacy Badge */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Privacy by Design:</strong> Only extracted transaction values (Merchant, Amount, Date, Category) are saved to your ledger. The full email body is never stored permanently.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select an email to view
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
              <span className="text-xs text-slate-500">
                Message ID: <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">{currentEmail?.id}</code>
              </span>

              {currentEmail && (
                <button
                  onClick={() => onExtractSingle(currentEmail)}
                  disabled={isExtracting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isExtracting ? "Extracting..." : "Parse with Gemini AI"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
