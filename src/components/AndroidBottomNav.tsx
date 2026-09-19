import React from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileSpreadsheet, 
  Bot, 
  Plus, 
  Sparkles 
} from "lucide-react";

interface AndroidBottomNavProps {
  activeTab: "dashboard" | "approval" | "sheets" | "aicoach";
  setActiveTab: (tab: "dashboard" | "approval" | "sheets" | "aicoach") => void;
  pendingCount: number;
  onOpenManualModal: () => void;
}

export function AndroidBottomNav({
  activeTab,
  setActiveTab,
  pendingCount,
  onOpenManualModal,
}: AndroidBottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around h-14">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === "dashboard" ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === "dashboard" ? "bg-emerald-50" : ""}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Overview</span>
        </button>

        {/* Review Hub with Badge */}
        <button
          onClick={() => setActiveTab("approval")}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === "approval" ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <div className={`p-1 rounded-full relative ${activeTab === "approval" ? "bg-emerald-50" : ""}`}>
            <CheckSquare className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Review</span>
        </button>

        {/* Center Elevated Action Button (FAB) */}
        <div className="relative -top-3 flex flex-col items-center justify-center px-1">
          <button
            onClick={onOpenManualModal}
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/35 flex items-center justify-center active:scale-95 transition-transform"
            title="Add Receipt"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-bold text-slate-500 mt-1">Add</span>
        </div>

        {/* Sheets */}
        <button
          onClick={() => setActiveTab("sheets")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === "sheets" ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === "sheets" ? "bg-emerald-50" : ""}`}>
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Sheets</span>
        </button>

        {/* AI Coach */}
        <button
          onClick={() => setActiveTab("aicoach")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === "aicoach" ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === "aicoach" ? "bg-emerald-50" : ""}`}>
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">AI Coach</span>
        </button>
      </div>
    </div>
  );
}
