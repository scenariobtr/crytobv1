"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Copy, CreditCard, ExternalLink, Link2, Wallet } from "lucide-react";
import { useTranslation } from "@/context/LangContext";

interface Transaction {
  id: string;
  amount: number;
  status: string;
}

type EthereumProvider = {
  isMetaMask?: boolean;
  request: (args: { method: "eth_accounts" | "eth_requestAccounts" | "eth_chainId" }) => Promise<unknown>;
  on?: (event: "accountsChanged" | "chainChanged", handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: "accountsChanged" | "chainChanged", handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const MetaMaskMark = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 507.83 470.86" aria-hidden="true">
    <polygon fill="#e2761b" stroke="#e2761b" strokeLinecap="round" strokeLinejoin="round" points="482.09 0.5 284.32 147.38 320.9 60.72 482.09 0.5" />
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="25.54 0.5 221.72 148.77 186.93 60.72 25.54 0.5" />
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="410.93 340.97 358.26 421.67 470.96 452.67 503.36 342.76 410.93 340.97" />
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="4.67 342.76 36.87 452.67 149.57 421.67 96.9 340.97 4.67 342.76" />
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="143.21 204.62 111.8 252.13 223.7 257.1 219.73 136.85 143.21 204.62" />
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="364.42 204.62 286.91 135.46 284.32 257.1 396.03 252.13 364.42 204.62" />
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="149.57 421.67 216.75 388.87 158.71 343.55 149.57 421.67" />
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="290.88 388.87 358.26 421.67 348.92 343.55 290.88 388.87" />
    <polygon fill="#d7c1b3" stroke="#d7c1b3" strokeLinecap="round" strokeLinejoin="round" points="358.26 421.67 290.88 388.87 296.25 432.8 295.65 451.28 358.26 421.67" />
    <polygon fill="#d7c1b3" stroke="#d7c1b3" strokeLinecap="round" strokeLinejoin="round" points="149.57 421.67 212.18 451.28 211.78 432.8 216.75 388.87 149.57 421.67" />
    <polygon fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" points="213.17 314.54 157.12 298.04 196.67 279.95 213.17 314.54" />
    <polygon fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" points="294.46 314.54 310.96 279.95 350.71 298.04 294.46 314.54" />
    <polygon fill="#cd6116" stroke="#cd6116" strokeLinecap="round" strokeLinejoin="round" points="149.57 421.67 159.11 340.97 96.9 342.76 149.57 421.67" />
    <polygon fill="#cd6116" stroke="#cd6116" strokeLinecap="round" strokeLinejoin="round" points="348.72 340.97 358.26 421.67 410.93 342.76 348.72 340.97" />
    <polygon fill="#cd6116" stroke="#cd6116" strokeLinecap="round" strokeLinejoin="round" points="396.03 252.13 284.32 257.1 294.66 314.54 311.16 279.95 350.91 298.04 396.03 252.13" />
    <polygon fill="#cd6116" stroke="#cd6116" strokeLinecap="round" strokeLinejoin="round" points="157.12 298.04 196.87 279.95 213.17 314.54 223.7 257.1 111.8 252.13 157.12 298.04" />
    <polygon fill="#e4751f" stroke="#e4751f" strokeLinecap="round" strokeLinejoin="round" points="111.8 252.13 158.71 343.55 157.12 298.04 111.8 252.13" />
    <polygon fill="#e4751f" stroke="#e4751f" strokeLinecap="round" strokeLinejoin="round" points="350.91 298.04 348.92 343.55 396.03 252.13 350.91 298.04" />
    <polygon fill="#e4751f" stroke="#e4751f" strokeLinecap="round" strokeLinejoin="round" points="223.7 257.1 213.17 314.54 226.29 382.31 229.27 293.07 223.7 257.1" />
    <polygon fill="#e4751f" stroke="#e4751f" strokeLinecap="round" strokeLinejoin="round" points="284.32 257.1 278.96 292.87 281.34 382.31 294.66 314.54 284.32 257.1" />
    <polygon fill="#f6851b" stroke="#f6851b" strokeLinecap="round" strokeLinejoin="round" points="294.66 314.54 281.34 382.31 290.88 388.87 348.92 343.55 350.91 298.04 294.66 314.54" />
    <polygon fill="#f6851b" stroke="#f6851b" strokeLinecap="round" strokeLinejoin="round" points="157.12 298.04 158.71 343.55 216.75 388.87 226.29 382.31 213.17 314.54 157.12 298.04" />
    <polygon fill="#c0ad9e" stroke="#c0ad9e" strokeLinecap="round" strokeLinejoin="round" points="295.65 451.28 296.25 432.8 291.28 428.42 216.35 428.42 211.78 432.8 212.18 451.28 149.57 421.67 171.43 439.55 215.75 470.36 291.88 470.36 336.4 439.55 358.26 421.67 295.65 451.28" />
    <polygon fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" points="290.88 388.87 281.34 382.31 226.29 382.31 216.75 388.87 211.78 432.8 216.35 428.42 291.28 428.42 296.25 432.8 290.88 388.87" />
    <polygon fill="#763d16" stroke="#763d16" strokeLinecap="round" strokeLinejoin="round" points="490.44 156.92 507.33 75.83 482.09 0.5 290.88 142.41 364.42 204.62 468.37 235.03 491.43 208.2 481.49 201.05 497.39 186.54 485.07 177 500.97 164.87 490.44 156.92" />
    <polygon fill="#763d16" stroke="#763d16" strokeLinecap="round" strokeLinejoin="round" points="0.5 75.83 17.39 156.92 6.66 164.87 22.56 177 10.44 186.54 26.34 201.05 16.4 208.2 39.26 235.03 143.21 204.62 216.75 142.41 25.54 0.5 0.5 75.83" />
    <polygon fill="#f6851b" stroke="#f6851b" strokeLinecap="round" strokeLinejoin="round" points="468.37 235.03 364.42 204.62 396.03 252.13 348.92 343.55 410.93 342.76 503.36 342.76 468.37 235.03" />
    <polygon fill="#f6851b" stroke="#f6851b" strokeLinecap="round" strokeLinejoin="round" points="143.21 204.62 39.26 235.03 4.67 342.76 96.9 342.76 158.71 343.55 111.8 252.13 143.21 204.62" />
    <polygon fill="#f6851b" stroke="#f6851b" strokeLinecap="round" strokeLinejoin="round" points="284.32 257.1 290.88 142.41 321.1 60.72 186.93 60.72 216.75 142.41 223.7 257.1 226.09 293.27 226.29 382.31 281.34 382.31 281.74 293.27 284.32 257.1" />
  </svg>
);

interface WalletDashboardProps {
  balance: number;
  walletStatus: string;
  walletAddress: string;
  transactions: Transaction[];
  onWalletConnect: (walletAddress: string) => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ 
  balance, 
  walletStatus, 
  walletAddress, 
  transactions,
  onWalletConnect,
}) => {
  const { t, lang } = useTranslation();
  const [connectedAddress, setConnectedAddress] = React.useState("");
  const [chainId, setChainId] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [walletMessage, setWalletMessage] = React.useState("");

  const getTracking = (strength: "normal" | "wide" | "widest") => {
    if (lang === "TH") return "tracking-normal";
    if (strength === "wide") return "tracking-widest";
    if (strength === "widest") return "tracking-[0.4em]";
    return "tracking-wide";
  };

  const displayAddress = connectedAddress || walletAddress;
  const isMetaMaskAvailable = typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask);
  const isConnected = Boolean(connectedAddress);

  const formatAddress = (address: string) => {
    if (!address || address.length <= 14) return address || t("wallet.not_connected");
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainName = (id: string) => {
    const chains: Record<string, string> = {
      "0x1": "Ethereum Mainnet",
      "0x38": "BNB Smart Chain",
      "0x89": "Polygon",
      "0xa": "Optimism",
      "0xa4b1": "Arbitrum One",
      "0xaa36a7": "Sepolia",
    };
    return chains[id] ?? (id ? `${t("wallet.chain")} ${id}` : t("wallet.unknown_network"));
  };

  const readProviderState = React.useCallback(async () => {
    const provider = window.ethereum;
    if (!provider) return;

    const accountsResult = await provider.request({ method: "eth_accounts" });
    const accounts = Array.isArray(accountsResult) ? accountsResult.filter((account): account is string => typeof account === "string") : [];
    const chainResult = await provider.request({ method: "eth_chainId" });
    const activeChainId = typeof chainResult === "string" ? chainResult : "";

    setConnectedAddress(accounts[0] ?? "");
    setChainId(activeChainId);
    if (accounts[0]) onWalletConnect(accounts[0]);
  }, [onWalletConnect]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    queueMicrotask(() => {
      readProviderState().catch(() => {});
    });

    const handleAccountsChanged = (accounts: unknown) => {
      const nextAccounts = Array.isArray(accounts) ? accounts.filter((account): account is string => typeof account === "string") : [];
      const nextAddress = nextAccounts[0] ?? "";
      setConnectedAddress(nextAddress);
      if (nextAddress) onWalletConnect(nextAddress);
    };

    const handleChainChanged = (nextChainId: unknown) => {
      setChainId(typeof nextChainId === "string" ? nextChainId : "");
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [onWalletConnect, readProviderState]);

  const handleConnectMetaMask = async () => {
    const provider = window.ethereum;
    if (!provider) {
      setWalletMessage(t("wallet.metamask_not_installed"));
      return;
    }

    setIsConnecting(true);
    setWalletMessage("");

    try {
      const accountsResult = await provider.request({ method: "eth_requestAccounts" });
      const accounts = Array.isArray(accountsResult) ? accountsResult.filter((account): account is string => typeof account === "string") : [];
      const chainResult = await provider.request({ method: "eth_chainId" });
      const nextAddress = accounts[0] ?? "";

      setConnectedAddress(nextAddress);
      setChainId(typeof chainResult === "string" ? chainResult : "");
      if (nextAddress) {
        onWalletConnect(nextAddress);
        setWalletMessage(t("wallet.metamask_connected"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t("wallet.metamask_connect_failed");
      setWalletMessage(message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCopyAddress = async () => {
    if (!displayAddress || typeof navigator === "undefined") return;
    await navigator.clipboard.writeText(displayAddress);
    setWalletMessage(t("wallet.wallet_copied"));
  };

  return (
    <div id="cont-user-wallet-root" className="space-y-8 animate-in fade-in duration-500 md:space-y-12">
      
      <div id="grid-user-wallet-main" className="grid grid-cols-1 gap-5 md:gap-8 xl:grid-cols-12">
        
        {/* Main Wallet Card */}
        <div id="card-wallet-balance-info" className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl sm:p-8 md:p-12 xl:col-span-8">
          <Wallet id="icon-wallet-bg" className="pointer-events-none absolute -bottom-12 -right-16 h-56 w-56 rotate-12 text-emerald-500/10 sm:h-80 sm:w-80" />
          
          <div id="cont-wallet-header" className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div id="cont-balance-labels">
              <p id="lbl-wallet-total-txt" className={`text-[11px] font-black uppercase ${getTracking("wide")} text-neutral-400 mb-3`}>{t("wallet.stakewise_balance")}</p>
              <h2 id="lbl-wallet-balance-val" className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[clamp(2.35rem,15vw,5.5rem)] font-black italic leading-none tracking-tighter text-white">
                {balance.toLocaleString()} <span id="lbl-wallet-balance-unit" className="text-2xl font-black not-italic text-emerald-500 md:text-4xl">USDT</span>
              </h2>
              <p className="mt-4 max-w-2xl text-xs font-bold uppercase leading-relaxed text-neutral-500 sm:text-sm">
                {t("wallet.metamask_intro")}
              </p>
            </div>
            
            <div 
              id="badge-wallet-status-indicator"
              className={`flex items-center gap-2 rounded-full border-2 px-5 py-2 text-[11px] font-black uppercase shadow-lg ${getTracking("wide")} ${isConnected ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" : "border-orange-500 text-orange-400 bg-orange-500/10"}`}
            >
              <div className={`h-2 w-2 rounded-full animate-pulse ${isConnected ? "bg-emerald-500" : "bg-orange-500"}`}></div>
              {isConnected ? t("wallet.metamask_linked") : t("wallet.wallet_required")}
            </div>
          </div>

          <div id="cont-wallet-footer" className="relative z-10 mt-10 flex flex-col justify-between gap-6 md:mt-16 md:flex-row md:items-end md:gap-8">
            <div id="cont-wallet-address-box" className="space-y-4 flex-1 max-lg">
              <p id="lbl-wallet-address-txt" className={`text-[11px] font-black text-neutral-400 uppercase ${getTracking("wide")}`}>{t("wallet.metamask_address")}</p>
              <div className="flex gap-2 sm:gap-3">
                <div 
                  id="txt-wallet-address-val"
                  className="flex min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-neutral-700 bg-black/60 px-4 py-4 font-mono text-xs text-neutral-300 shadow-inner sm:px-5 sm:text-sm"
                >
                  <span className="truncate">{formatAddress(displayAddress)}</span>
                </div>
                <button id="btn-wallet-address-copy" type="button" onClick={handleCopyAddress} disabled={!displayAddress} className="rounded-xl bg-neutral-800 p-4 text-white shadow-lg transition-all hover:bg-emerald-500 hover:text-black active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 group" aria-label="Copy wallet address">
                  <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600">{t("wallet.provider")}</p>
                  <p className={`mt-2 text-sm font-black uppercase ${isMetaMaskAvailable ? "text-emerald-400" : "text-orange-400"}`}>
                    {isMetaMaskAvailable ? t("wallet.metamask_ready") : t("wallet.not_installed")}
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600">{t("wallet.network")}</p>
                  <p className="mt-2 truncate text-sm font-black uppercase text-white">{getChainName(chainId)}</p>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600">{t("wallet.app_wallet")}</p>
                  <p className={`mt-2 text-sm font-black uppercase ${walletStatus === "ACTIVE" ? "text-emerald-400" : "text-orange-400"}`}>{walletStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MetaMask Connect Panel */}
        <div 
          id="card-wallet-action-panel"
          className={`relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl border-2 p-6 transition-all sm:p-8 md:p-10 xl:col-span-4 ${isConnected ? "bg-emerald-500 border-emerald-400" : "bg-neutral-900 border-neutral-800"}`}
        >
          <div id="cont-action-header" className="space-y-4 relative z-10">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${isConnected ? "bg-black/10" : "bg-black/30"}`}>
               <MetaMaskMark className="h-10 w-10 shrink-0" />
            </div>
            <div>
              <h4 id="lbl-action-title" className={`text-3xl font-black uppercase italic leading-none sm:text-4xl ${isConnected ? "text-black" : "text-white"}`}>
                MetaMask
              </h4>
              <div className="h-4"></div>
              <p id="lbl-action-desc" className={`inline-block rounded px-3 py-1 text-xs font-black uppercase ${getTracking("wide")} ${isConnected ? "bg-black/10 text-black/80" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"}`}>
                {isConnected ? t("wallet.connected_verified") : t("wallet.connect_browser_wallet")}
              </p>
            </div>
            <div className={`rounded-2xl border p-4 text-xs font-bold leading-relaxed ${isConnected ? "border-black/10 bg-black/10 text-black/70" : "border-zinc-800 bg-black/40 text-zinc-500"}`}>
              {isConnected
                ? `${t("wallet.active_account")}: ${formatAddress(connectedAddress)} ${t("wallet.on_network")} ${getChainName(chainId)}`
                : t("wallet.metamask_permission_note")}
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            {walletMessage && (
              <div className={`flex items-start gap-2 rounded-2xl border p-3 text-[10px] font-black uppercase leading-relaxed ${isConnected ? "border-black/10 bg-black/10 text-black/70" : "border-orange-500/20 bg-orange-500/10 text-orange-400"}`}>
                {isConnected ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
                <span>{walletMessage}</span>
              </div>
            )}

            <button
              id="btn-wallet-connect-metamask"
              type="button"
              onClick={handleConnectMetaMask}
              disabled={isConnecting}
              className={`flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-sm font-black uppercase shadow-2xl transition-all active:scale-95 disabled:cursor-wait ${getTracking("wide")} ${isConnected ? "bg-black text-white hover:bg-neutral-900" : "bg-emerald-500 text-black hover:bg-white"}`}
            >
              <Link2 className="h-5 w-5" />
              {isConnecting ? t("wallet.connecting") : isConnected ? t("wallet.reconnect_metamask") : t("wallet.connect_metamask")}
            </button>

            {!isMetaMaskAvailable && (
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 py-4 text-[11px] font-black uppercase text-zinc-400 transition-all hover:border-orange-500/40 hover:text-orange-400"
              >
                {t("wallet.install_metamask")} <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <section id="sect-user-wallet-history" className="space-y-6 pt-6 md:space-y-8 md:pt-12">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-5 md:pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <CreditCard id="icon-history-card" className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 id="lbl-wallet-history-title" className={`text-xl font-black uppercase ${getTracking("widest")} text-white italic`}>{t("wallet.tx_logs")}</h3>
          </div>
        </div>
        
        <div id="cont-wallet-table-wrapper" className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900/50 shadow-2xl">
          <table id="tbl-wallet-transactions" className="min-w-[620px] w-full border-collapse text-left">
            <thead id="thead-wallet-tx" className={`bg-black/80 text-[11px] font-black uppercase text-neutral-300 border-b border-neutral-800 ${getTracking("wide")}`}>
              <tr id="tr-wallet-tx-head">
                <th id="th-tx-id" className="px-8 py-7">{t("wallet.ref_hash")}</th>
                <th id="th-tx-amount" className="px-8 py-7 text-right">{t("wallet.amount")}</th>
                <th id="th-tx-status" className="px-8 py-7 text-center">{t("wallet.status")}</th>
              </tr>
            </thead>
            <tbody id="tbody-wallet-tx" className="divide-y divide-neutral-800">
              {transactions.length > 0 ? transactions.map(tx => (
                <tr key={tx.id} id={`row-tx-${tx.id}`} className="hover:bg-emerald-500/5 transition-all group cursor-default">
                  <td id={`cell-tx-id-${tx.id}`} className="px-8 py-8 font-mono text-neutral-400 group-hover:text-white text-sm tracking-tighter">{tx.id}</td>
                  <td id={`cell-tx-amount-${tx.id}`} className="px-8 py-8 text-right font-black text-white text-xl italic">{tx.amount.toLocaleString()} <span className="text-xs text-emerald-500 not-italic ml-1">USDT</span></td>
                  <td id={`cell-tx-status-${tx.id}`} className="px-8 py-8 text-center">
                    <span 
                      id={`badge-tx-status-${tx.id}`}
                      className={`px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-lg border border-emerald-500/30 shadow-sm ${getTracking("wide")}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr id="tr-no-data">
                  <td colSpan={3} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                       <CreditCard className="w-12 h-12 text-neutral-400" />
                       <p className={`text-sm font-black uppercase ${getTracking("widest")} text-neutral-300`}>{t("wallet.no_data")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
