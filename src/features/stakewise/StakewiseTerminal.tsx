"use client";

import React, { useState, useEffect } from "react";
import { Notification, NotifyType } from "@/components/shared/Notification";
import { authService } from "@/modules/auth/service";
import { marketService, Thread } from "@/modules/market/service";
import { betService } from "@/modules/bet/service";
import { logService } from "@/services/logService";
import type { RadarBetSide } from "@/features/forecast-world/types";
import { useTranslation } from "@/context/LangContext";
import { mockUsers as initialUsers, User as UserType } from "@/data/mockUsers";
import { createDefaultMarketDraft } from "./constants";
import { AdminWorkspace } from "./components/AdminWorkspace";
import { AuthScreen } from "./components/AuthScreen";
import { TerminalFooter } from "./components/TerminalFooter";
import { TerminalHeader } from "./components/TerminalHeader";
import { UserWorkspace } from "./components/UserWorkspace";
import { CreateMarketModal } from "./components/modals/CreateMarketModal";
import { EditMarketModal } from "./components/modals/EditMarketModal";
import { JoinMarketModal } from "./components/modals/JoinMarketModal";
import type { AdminTab, AuthView, PortfolioBet, UserSubTab, ViewMode } from "./types";

export function StakewiseTerminal() {
  const { t, lang, setLang } = useTranslation();
  
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("USER");
  const [userSubTab, setUserSubTab] = useState<UserSubTab>("MARKETS");
  const [adminTab, setAdminTab] = useState<AdminTab>("OVERVIEW");
  
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [userBets] = useState<PortfolioBet[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "SUCCESS" as NotifyType });

  const [joinModalThread, setJoinModalThread] = useState<Thread | null>(null);
  const [joinSide, setJoinSide] = useState<"YES" | "NO" | null>(null);
  const [joinAmount, setJoinAmount] = useState<number | "">("");

  // Auth State
  const [authView, setAuthView] = useState<AuthView>("LOGIN");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // Market Management State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState<Thread | null>(null);
  const [newMarket, setNewMarket] = useState(createDefaultMarketDraft);

  // 1. Session Restoration (Priority 1)
  useEffect(() => {
    if (currentUser) return;
    try {
      if (typeof window === "undefined") return;
      const savedUser = authService.getCurrentSession(initialUsers);
      if (savedUser) {
        queueMicrotask(() => {
          setCurrentUser(savedUser);
          setBalance(savedUser.balance);
        });
      }
    } catch (err) {
      console.error("Session restoration failed", err);
    }
  }, [currentUser]);

  // 2. Fetch Initial Data (Non-blocking)
  useEffect(() => {
    const init = async () => {
      try {
        const initialThreads = await marketService.fetchMarkets();
        setThreads(initialThreads);
      } catch (err) {
        console.error("Market fetch error:", err);
      }
    };
    init();
  }, []);

  const handleBypassAdmin = () => {
    const admin = initialUsers[0];
    authService.login(admin.username, initialUsers);
    setCurrentUser(admin);
    setBalance(admin.balance);
    showNotify("Bypass Login Successful", "SUCCESS");
  };

  const showNotify = (message: string, type: NotifyType = "SUCCESS") => {
    setNotify({ isOpen: true, message, type });
    setTimeout(() => setNotify(prev => ({ ...prev, isOpen: false })), 3000);
  };

  // 3. Fast Login Handler
  const handleAuth = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (currentUser) return;

    try {
      if (!usernameInput || !passwordInput) {
        showNotify("Please enter credentials", "ERROR");
        return;
      }

      // Check against initialUsers directly for absolute reliability
      const normalizedUsername = usernameInput.trim().toLowerCase();

      const user = initialUsers.find(u => u.username.toLowerCase() === normalizedUsername);
      
      if (user && user.password === passwordInput) {
          const loggedInUser = authService.login(user.username, initialUsers);
          if (loggedInUser) {
            setCurrentUser(loggedInUser);
            setBalance(loggedInUser.balance);
            showNotify(`${t("common.success")}`, "SUCCESS");
            logService.logLogin(loggedInUser.username).catch(() => {});
            return;
          }
      }

      // Secondary check from logs if not in initialUsers
      const loggedUser = await logService.verifyUser(usernameInput.trim()) as UserType | null;
      if (loggedUser && loggedUser.password === passwordInput) {
          const loggedInUser = authService.login(loggedUser.username, [loggedUser]);
          if (loggedInUser) {
            setCurrentUser(loggedInUser);
            setBalance(loggedInUser.balance);
            showNotify(`${t("common.success")}`, "SUCCESS");
            return;
          }
      }

      showNotify("Invalid credentials", "ERROR");
    } catch (err) {
      console.error("Auth error:", err);
      showNotify("System error", "ERROR");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthView("OTP");
    showNotify("OTP sent to your mobile", "INFO");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
     e.preventDefault();
     if (otpInput === "1234") {
        const demoUser: UserType & { phone: string } = {
           id: `user_${Date.now()}`,
           username: usernameInput,
           password: passwordInput,
           phone: phoneInput,
           wallet: "0x" + Math.random().toString(16).slice(2, 10).toUpperCase(),
           balance: 1000,
           winRate: "0%",
           totalProfit: "0 USDT",
           role: "USER" as const,
           status: "ACTIVE" as const,
           walletStatus: "ACTIVE" as const,
           lastIp: "127.0.0.1"
        };
        
        const registeredUser = authService.login(demoUser.username, [demoUser]) ?? demoUser;
        setCurrentUser(registeredUser);
        setBalance(registeredUser.balance);
        showNotify("Registration successful", "SUCCESS");
        logService.initUser(demoUser.username, demoUser).catch(() => {});
     } else {
        showNotify("Invalid OTP (Try 1234)", "ERROR");
     }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAuthView("LOGIN");
  };

  const toggleLang = () => {
    setLang(lang === "EN" ? "TH" : "EN");
  };

  const handleJoinMarket = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amount = Number(joinAmount);
      const newBalance = betService.placeBet(balance, amount);
      setBalance(newBalance);
      showNotify(t("common.success"), "SUCCESS");
      
      if (currentUser && joinModalThread) {
          logService.logTransaction(currentUser.username, 'BET', amount, `Placed bet on ${joinSide} for market: ${joinModalThread.title}`);
      }
      setJoinModalThread(null);
    } catch (err: unknown) {
      showNotify(err instanceof Error ? err.message : "Unable to place bet", "ERROR");
    }
  };

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const market: Thread = {
      id: Date.now(),
      title: newMarket.title,
      description: newMarket.description,
      status: "OPEN",
      yesPrice: 0.5,
      noPrice: 0.5,
      yesVolume: 0,
      noVolume: 0,
      winner: null,
      creatorId: currentUser.id,
      endDate: new Date(newMarket.endDate).toISOString()
    };
    const saved = await logService.logMarketCreation(currentUser.username, market);
    if (!saved) {
      showNotify("ไม่สามารถบันทึกกระทู้ได้ กรุณาลองใหม่", "ERROR");
      return;
    }

    setThreads((current) => [market, ...current.filter((thread) => thread.id !== market.id)]);
    setIsCreateModalOpen(false);
    setNewMarket(createDefaultMarketDraft());
    showNotify(t("common.success"), "SUCCESS");
  };

  const handleDeleteMarket = (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบตลาดนี้?")) {
      setThreads(threads.filter(t => t.id !== id));
      showNotify("ลบตลาดเรียบร้อยแล้ว", "SUCCESS");
    }
  };

  const handleOpenEdit = (thread: Thread) => {
    setEditingMarket(thread);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMarket) {
      setThreads(threads.map(t => t.id === editingMarket.id ? editingMarket : t));
      setEditingMarket(null);
      showNotify("แก้ไขข้อมูลตลาดเรียบร้อยแล้ว", "SUCCESS");
    }
  };

  const handleUpdateUserStatus = (userId: string, newStatus: "ACTIVE" | "BANNED") => {
     setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
     showNotify(`User status updated to ${newStatus}`, "SUCCESS");
  };

  const handlePlaceRadarBet = (thread: Thread, side: RadarBetSide, amount: number) => {
    if (!currentUser) return false;
    if (amount <= 0 || amount > balance) {
      showNotify(t("world.insufficient_balance"), "ERROR");
      return false;
    }

    try {
      const newBalance = betService.placeBet(balance, amount);
      setBalance(newBalance);
      setThreads((current) => current.map((market) => {
        if (market.id !== thread.id) return market;
        return side === "YES"
          ? { ...market, yesVolume: market.yesVolume + amount }
          : { ...market, noVolume: market.noVolume + amount };
      }));

      showNotify(`${t("world.radar.bet_confirmed")} ${side} ${amount} USDT`, "SUCCESS");
      logService.logTransaction(currentUser.username, "RADAR_BET", amount, `Radar bet ${side} on ${thread.title}`);
      return true;
    } catch (err: unknown) {
      showNotify(err instanceof Error ? err.message : t("world.insufficient_balance"), "ERROR");
      return false;
    }
  };

  const getTracking = (strength: "normal" | "wide" | "widest") => {
    if (lang === "TH") return "tracking-normal";
    if (strength === "widest") return "tracking-[0.1em]";
    if (strength === "wide") return "tracking-widest";
    return "tracking-normal";
  };

  // Main UI Gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black relative">
        <div className="fixed top-4 left-4 z-[9999] text-[12px] text-emerald-500 font-black bg-black/80 px-2 py-1 rounded border border-emerald-500/30">
          SYSTEM_V4.2.19_READY
        </div>
        <AuthScreen
          authView={authView}
          usernameInput={usernameInput}
          passwordInput={passwordInput}
          phoneInput={phoneInput}
          otpInput={otpInput}
          lang={lang}
          onAuthViewChange={setAuthView}
          onUsernameChange={setUsernameInput}
          onPasswordChange={setPasswordInput}
          onPhoneChange={setPhoneInput}
          onOtpChange={setOtpInput}
          onLogin={handleAuth}
          onRegister={handleRegister}
          onVerifyOtp={handleVerifyOtp}
          onToggleLang={toggleLang}
          onBypass={handleBypassAdmin}
          t={t}
        />
        <Notification isOpen={notify.isOpen} message={notify.message} type={notify.type} onClose={() => setNotify(prev => ({ ...prev, isOpen: false }))} />
      </div>
    );
  }

  return (
    <div id="page-root-layout" className="min-h-screen bg-black text-neutral-100 selection:bg-emerald-500 selection:text-black">
      <TerminalHeader
        currentUser={currentUser}
        balance={balance}
        lang={lang}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleLang={toggleLang}
        onLogout={handleLogout}
        t={t}
      />

      <main className="mx-auto max-w-[1500px] px-3 py-5 sm:px-4 md:px-8 md:py-10 lg:px-10 lg:py-14">
        {viewMode === "ADMIN" && currentUser.role === 'SUPER_ADMIN' ? (
          <AdminWorkspace
            adminTab={adminTab}
            users={users}
            threads={threads}
            onAdminTabChange={setAdminTab}
            onUpdateUserStatus={handleUpdateUserStatus}
            onUpgrade={() => showNotify("Upgrade Initiated", "INFO")}
            t={t}
          />
        ) : (
          <UserWorkspace
            userSubTab={userSubTab}
            currentUser={currentUser}
            threads={threads}
            userBets={userBets}
            balance={balance}
            onUserSubTabChange={setUserSubTab}
            onJoinMarket={(thread, side) => { setJoinModalThread(thread); setJoinSide(side); }}
            onCreateMarketOpen={() => setIsCreateModalOpen(true)}
            onDeleteMarket={handleDeleteMarket}
            onEditMarket={handleOpenEdit}
            onProfileUpdate={(updatedData: Partial<UserType>) => {
              setCurrentUser({...currentUser, ...updatedData});
              showNotify(updatedData.wallet ? "เชื่อมต่อ MetaMask เรียบร้อยแล้ว" : "อัปเดตโปรไฟล์เรียบร้อยแล้ว", "SUCCESS");
            }}
            onPlaceRadarBet={handlePlaceRadarBet}
            getTracking={getTracking}
            t={t}
          />
        )}
      </main>

      <TerminalFooter />

      <CreateMarketModal
        isOpen={isCreateModalOpen}
        market={newMarket}
        balance={balance}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMarket}
        onMarketChange={setNewMarket}
        t={t}
      />

      <EditMarketModal
        market={editingMarket}
        onClose={() => setEditingMarket(null)}
        onSubmit={handleSaveEdit}
        onMarketChange={setEditingMarket}
        t={t}
      />

      <JoinMarketModal
        thread={joinModalThread}
        side={joinSide}
        amount={joinAmount}
        balance={balance}
        onClose={() => setJoinModalThread(null)}
        onSideChange={setJoinSide}
        onAmountChange={setJoinAmount}
        onSubmit={handleJoinMarket}
        t={t}
      />

      <Notification isOpen={notify.isOpen} message={notify.message} type={notify.type} onClose={() => setNotify(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
