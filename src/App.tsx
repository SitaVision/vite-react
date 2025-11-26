import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Shield, 
  Lock, 
  Box, 
  Cpu, 
  Zap, 
  ChevronRight, 
  Info, 
  RefreshCw, 
  ArrowRightLeft, 
  Wallet, 
  AlertTriangle,
  CheckCircle2,
  Menu,
  X,
  Network,
  Crosshair,
  Skull,
  Play,
  Grid,
  Key,
  Database,
  FileCode,
  FileSearch,
  Activity,
  Siren,
  Search,
  Terminal,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Layers,
  Code2,
  Scale,
  LucideIcon
} from 'lucide-react';

// --- TYPE DEFINITIONS FOR TSX ---

type GameType = 'defender' | 'memory' | 'risk' | 'trading' | 'contract' | null;

interface GameEntity {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'good' | 'bad';
  text: string;
  icon: LucideIcon;
}

interface MemoryCard {
  id: number;
  icon: LucideIcon;
  color: string;
  matched: boolean;
}

interface RiskCase {
  id: number;
  type: 'SCAM' | 'SAFE';
  domain: string;
  action: string;
  contract: string;
  riskLevel: string;
  reason: string;
}

interface Position {
    type: 'LONG' | 'SHORT';
    entryPrice: number;
}

interface Feedback {
    type: 'success' | 'error';
    message: string;
}

// --- Custom CSS for Animations & Glows ---
const customStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  @keyframes pulse-glow-cyan {
    0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.1); border-color: rgba(34, 211, 238, 0.6); }
    50% { box-shadow: 0 0 40px rgba(34, 211, 238, 0.6), inset 0 0 40px rgba(34, 211, 238, 0.2); border-color: rgba(34, 211, 238, 1); }
  }
  @keyframes pulse-glow-violet {
    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.6); }
    50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6), inset 0 0 40px rgba(139, 92, 246, 0.2); border-color: rgba(139, 92, 246, 1); }
  }
  @keyframes pulse-glow-red {
    0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); border-color: rgba(239, 68, 68, 0.6); }
    50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); border-color: rgba(239, 68, 68, 1); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes scanline {
    0% { top: 0%; }
    100% { top: 100%; }
  }
  @keyframes flip-in {
    0% { transform: rotateY(90deg); opacity: 0; }
    100% { transform: rotateY(0deg); opacity: 1; }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float 7s ease-in-out infinite 1s; }
  .animate-pulse-glow-cyan { animation: pulse-glow-cyan 3s infinite; }
  .animate-pulse-glow-violet { animation: pulse-glow-violet 3s infinite; }
  .animate-pulse-glow-red { animation: pulse-glow-red 2s infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-spin-reverse-slow { animation: spin-slow 25s linear infinite reverse; }
  .animate-flip-in { animation: flip-in 0.4s ease-out forwards; }
  
  .glass-panel {
    background: rgba(10, 10, 20, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(34, 211, 238, 0.2);
    box-shadow: 0 0 30px rgba(34, 211, 238, 0.1);
  }

  .glass-panel-danger {
    background: rgba(40, 10, 10, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.1);
  }
  
  .holo-gradient-text {
    background: linear-gradient(to right, #00f2ff, #9d00ff, #00f2ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-size: 200% auto;
    animation: gradientMove 5s linear infinite;
    text-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
  }

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }

  .cyber-circuit-bg {
    background-color: #050a14;
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 60%),
      linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
  }

  /* 3D Cube Styles */
  .cube-scene {
    perspective: 800px;
  }
  .cube {
    width: 60px;
    height: 60px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s;
  }
  .cube-face {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 1px solid rgba(34, 211, 238, 0.5);
    background: rgba(15, 23, 42, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    color: white;
    backface-visibility: visible; /* Make sure we can see inside/back */
  }
  .cube-front  { transform: rotateY(  0deg) translateZ(30px); }
  .cube-back   { transform: rotateY(180deg) translateZ(30px); }
  .cube-right  { transform: rotateY( 90deg) translateZ(30px); }
  .cube-left   { transform: rotateY(-90deg) translateZ(30px); }
  .cube-top    { transform: rotateX( 90deg) translateZ(30px); }
  .cube-bottom { transform: rotateX(-90deg) translateZ(30px); }

  .text-glow-cyan { text-shadow: 0 0 10px rgba(34, 211, 238, 0.8); }
  .text-glow-violet { text-shadow: 0 0 10px rgba(139, 92, 246, 0.8); }
  .text-glow-red { text-shadow: 0 0 10px rgba(239, 68, 68, 0.8); }
  
  .crosshair-cursor { cursor: crosshair; }
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;

// --- GAME CONSTANTS ---
const DEFENDER_TERMS: { BAD: { text: string; icon: LucideIcon; }[]; GOOD: { text: string; icon: LucideIcon; }[] } = {
  BAD: [
    { text: "Phishing Link", icon: Skull },
    { text: "Fake Airdrop", icon: AlertTriangle },
    { text: "Send Seed Phrase", icon: X },
    { text: "Wallet Inspector", icon: Skull },
    { text: "Free ETH", icon: Zap },
    { text: "Unlimited Approval", icon: Lock },
  ],
  GOOD: [
    { text: "Hardware Wallet", icon: Shield },
    { text: "Enable 2FA", icon: Lock },
    { text: "Verify URL", icon: CheckCircle2 },
    { text: "Revoke Access", icon: X },
    { text: "Check Gas", icon: Network },
  ]
};

const MEMORY_ICONS: { id: string; icon: LucideIcon; color: string; }[] = [
  { id: 'btc', icon: Wallet, color: 'text-orange-400' },
  { id: 'eth', icon: Network, color: 'text-blue-400' },
  { id: 'key', icon: Key, color: 'text-yellow-400' },
  { id: 'lock', icon: Lock, color: 'text-green-400' },
  { id: 'shield', icon: Shield, color: 'text-cyan-400' },
  { id: 'scan', icon: Crosshair, color: 'text-red-400' },
  { id: 'data', icon: Database, color: 'text-violet-400' },
  { id: 'code', icon: FileCode, color: 'text-pink-400' },
];

const RISK_CASES: RiskCase[] = [
  { id: 1, type: 'SCAM', domain: 'unisvvap.org', action: 'Swap Exact Tokens', contract: '0x8b...3f1a (Unverified)', riskLevel: 'CRITICAL', reason: 'Fake domain (Phishing) + Unverified Contract' },
  { id: 2, type: 'SAFE', domain: 'app.aave.com', action: 'Deposit ETH', contract: '0x7f...a4b2 (Verified)', riskLevel: 'LOW', reason: 'Legitimate Protocol' },
  { id: 3, type: 'SCAM', domain: 'opensea-support.io', action: 'Set Approval For All', contract: '0x1a...9c22 (New)', riskLevel: 'HIGH', reason: 'Fake Support Site + Wallet Drainer Permission' },
  { id: 4, type: 'SAFE', domain: 'curve.fi', action: 'Add Liquidity', contract: '0xd5...1a2f (Verified)', riskLevel: 'LOW', reason: 'Official Curve Contract' },
  { id: 5, type: 'SCAM', domain: 'wallet-connect-fix.com', action: 'Sign Message', contract: 'N/A', riskLevel: 'HIGH', reason: 'Phishing for Signature (Permit Scam)' },
];

// Define Contract Block Type
type ContractBlockType = "TRIGGER" | "CONDITION" | "ACTION";

interface ContractBlock {
    id: string;
    type: ContractBlockType;
    label: string;
    icon: LucideIcon;
}

const CONTRACT_LEVELS: { id: number; name: string; description: string; correctSequence: string[]; blocks: ContractBlock[] }[] = [
  {
    id: 1,
    name: "Crowdfunding Escrow",
    description: "Release funds ONLY if the goal is met by the deadline.",
    correctSequence: ["trigger", "condition", "action"], 
    blocks: [
      { id: "trigger", type: "TRIGGER", label: "On Deadline", icon: Activity },
      { id: "condition", type: "CONDITION", label: "If Balance >= Goal", icon: Scale },
      { id: "action", type: "ACTION", label: "Release Funds", icon: DollarSign },
      { id: "bad1", type: "ACTION", label: "Refund Everyone", icon: RefreshCw }, // Distractor
    ]
  }
];

// --- 3D CUBE COMPONENT ---
interface CubeBlockProps {
    type: ContractBlockType;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    selected: boolean;
}

const CubeBlock: React.FC<CubeBlockProps> = ({ type, label, icon: Icon, onClick, selected }) => {
  const colorClass = type === "TRIGGER" ? "border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" :
                     type === "CONDITION" ? "border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]" :
                     "border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
  
  const bgClass = selected ? "bg-white/10" : "bg-slate-900/90";

  return (
    <div className="cube-scene w-24 h-24 flex items-center justify-center cursor-pointer group" onClick={onClick}>
      <div className={`cube group-hover:animate-[spin_3s_linear_infinite] ${selected ? 'animate-bounce' : ''}`} style={{ transform: 'rotateX(-15deg) rotateY(25deg)' }}>
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map(face => (
          <div key={face} className={`cube-face cube-${face} ${colorClass} ${bgClass}`}>
            {face === 'front' ? <Icon size={24} /> : ''}
            {face === 'top' ? <span className="text-[8px]">{type}</span> : ''}
          </div>
        ))}
      </div>
      <div className="absolute -bottom-4 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none bg-black/50 px-2 py-1 rounded">
        {label}
      </div>
    </div>
  );
};

// --- GAME 5: CONTRACT ARCHITECT (SMART CONTRACT 3D PUZZLE) ---
const SmartContractGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Use ContractBlock | null for accurate slot typing
  const [slots, setSlots] = useState<(ContractBlock | null)[]>([null, null, null]);
  const [availableBlocks] = useState(CONTRACT_LEVELS[0].blocks);
  const [status, setStatus] = useState<"building" | "compiling" | "success" | "error">("building");

  const addToSlot = (block: ContractBlock) => {
    const firstEmpty = slots.findIndex(s => s === null);
    if (firstEmpty !== -1) {
      const newSlots = [...slots];
      newSlots[firstEmpty] = block;
      setSlots(newSlots);
    }
  };

  const clearSlots = () => setSlots([null, null, null]);

  const deployContract = () => {
    setStatus("compiling");
    setTimeout(() => {
      // Logic check for correct sequence of block IDs
      const isCorrect = slots[0]?.id === "trigger" && slots[1]?.id === "condition" && slots[2]?.id === "action";

      if (isCorrect) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center font-mono overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1)_0%,rgba(0,0,0,0.8)_80%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)_scale(2)] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="absolute top-0 w-full p-4 bg-slate-900 border-b border-violet-900/50 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <Layers className="text-violet-400" />
          <div>
            <h2 className="text-xl font-bold text-violet-400 tracking-widest">CONTRACT ARCHITECT</h2>
            <div className="text-xs text-slate-500">BUILDING: CROWDFUNDING V1.0</div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><X size={20} /></button>
      </div>

      {/* Main Workspace */}
      <div className="relative z-10 w-full max-w-6xl h-full flex flex-col lg:flex-row p-8 gap-12 items-center justify-center">
        
        {/* Left: Component Palette */}
        <div className="w-full lg:w-1/3 h-[400px] glass-panel rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm text-violet-300 font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
            <Box size={16} /> Logic Blocks
          </h3>
          <div className="grid grid-cols-2 gap-8 overflow-y-auto p-2 flex-1 place-items-center">
            {availableBlocks.map(block => (
              <CubeBlock 
                key={block.id} 
                type={block.type} 
                label={block.label} 
                icon={block.icon}
                onClick={() => addToSlot(block)} 
                selected={slots.includes(block)} 
              />
            ))}
          </div>
          <div className="mt-4 text-center text-xs text-slate-500">Click block to add to chain</div>
        </div>

        {/* Center: Assembly Line (The "Chain") */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          
          {/* Holographic Platform */}
          <div className="relative w-full max-w-2xl h-[200px] border-2 border-dashed border-violet-500/30 rounded-full flex items-center justify-center gap-8 bg-violet-900/10 [transform:rotateX(45deg)] shadow-[0_0_50px_rgba(139,92,246,0.2)]">
             
             {/* Connection Lines */}
             <div className="absolute top-1/2 left-0 w-full h-1 bg-violet-500/20 -translate-y-1/2"></div>

             {slots.map((block, i) => (
               <div key={i} className="relative z-10 w-24 h-24 border border-white/10 rounded flex items-center justify-center [transform:rotateX(-45deg)] transition-all">
                 {block ? (
                   <div className="animate-fade-in-up">
                     <CubeBlock 
                        type={block.type} 
                        label={block.label} 
                        icon={block.icon} 
                        onClick={() => {}} 
                        selected={true} 
                    />
                     {status === 'compiling' && (
                        <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-50"></div>
                     )}
                   </div>
                 ) : (
                   <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-600 font-bold text-xl">
                     {i + 1}
                   </div>
                 )}
               </div>
             ))}
          </div>

          {/* Action Panel */}
          <div className="mt-12 flex gap-6">
            <button onClick={clearSlots} className="px-6 py-3 rounded-xl border border-slate-600 text-slate-400 hover:bg-slate-800 transition-colors">
              CLEAR
            </button>
            <button 
              onClick={deployContract}
              disabled={slots.includes(null) || status === 'compiling'}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2
                ${status === 'compiling' ? 'bg-violet-500/50 cursor-wait' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-105'}
                ${slots.includes(null) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {status === 'compiling' ? <RefreshCw className="animate-spin" /> : <Code2 />}
              {status === 'compiling' ? 'COMPILING...' : 'DEPLOY CONTRACT'}
            </button>
          </div>

          {status === 'success' && (
            <div className="mt-8 p-4 bg-emerald-900/50 border border-emerald-500 text-emerald-300 rounded-xl flex items-center gap-3 animate-fade-in-up">
              <CheckCircle2 size={24} />
              <div>
                <div className="font-bold">DEPLOYMENT SUCCESSFUL</div>
                <div className="text-xs">Logic verified. Smart Contract is active on testnet.</div>
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="mt-8 p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-xl flex items-center gap-3 animate-fade-in-up">
              <AlertTriangle size={24} />
              <div>
                <div className="font-bold">LOGIC ERROR</div>
                <div className="text-xs">The sequence is invalid. Try: Trigger &rarr; Condition &rarr; Action.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- GAME 1: VAULT DEFENDER ---
const VaultDefenderGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [entities, setEntities] = useState<GameEntity[]>([]);
  const requestRef = useRef<number>();
  const spawnTimerRef = useRef<number>(); 
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const spawnEntity = useCallback(() => {
    const isBad = Math.random() > 0.4;
    const type = isBad ? 'BAD' : 'GOOD';
    const term = DEFENDER_TERMS[type][Math.floor(Math.random() * DEFENDER_TERMS[type].length)];
    const startX = Math.random() * 80 + 10;
    
    const newEntity: GameEntity = {
      id: Date.now() + Math.random(),
      x: startX,
      y: -10,
      speed: Math.random() * 0.3 + 0.2,
      type: isBad ? 'bad' : 'good',
      ...term
    };

    setEntities(prev => [...prev, newEntity]);
  }, []);

  const updateGame = useCallback(() => {
    setEntities(prevEntities => {
      const nextEntities: GameEntity[] = [];
      let damageTaken = 0;

      prevEntities.forEach(ent => {
        if (typeof ent.y === 'number') {
            ent.y += ent.speed;
        }
        
        if (ent.y > 90) {
          if (ent.type === 'bad') damageTaken++;
        } else {
          nextEntities.push(ent);
        }
      });

      if (damageTaken > 0) {
        setLives(l => {
          const newLives = l - damageTaken;
          if (newLives <= 0) setGameState('gameover');
          return newLives;
        });
      }
      return nextEntities;
    });

    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
      const interval = setInterval(spawnEntity, 1500);
      spawnTimerRef.current = interval as unknown as number; 
      
      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      };
    }
  }, [gameState, spawnEntity, updateGame]);

  const handleEntityClick = (id: number, type: 'good' | 'bad') => {
    if (gameState !== 'playing') return;

    if (type === 'bad') {
      setScore(s => s + 100);
      setEntities(prev => prev.filter(e => e.id !== id));
    } else {
      setScore(s => Math.max(0, s - 50));
      setLives(l => {
         const newLives = l - 1;
         if (newLives <= 0) setGameState('gameover');
         return newLives;
      });
      setEntities(prev => prev.filter(e => e.id !== id));
    }
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setEntities([]);
    setGameState('playing');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center font-sans overflow-hidden cyber-circuit-bg">
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2 border border-cyan-500/20 rounded-full animate-spin-slow"></div>
       </div>

       {/* HUD */}
       <div className="absolute top-0 w-full p-6 flex justify-between items-start z-50">
          <div className="flex flex-col">
             <h2 className="text-3xl font-bold text-white text-glow-cyan uppercase tracking-widest">Vault Defender</h2>
             <span className="text-cyan-400 font-mono text-sm">SECURITY PROTOCOL: ACTIVE</span>
          </div>
          <div className="flex gap-4 sm:gap-8">
             <div className="glass-panel px-6 py-2 rounded-lg flex flex-col items-center border-cyan-500/50">
                <span className="text-xs text-cyan-300 uppercase">Score</span>
                <span className="text-2xl font-bold text-white font-mono">{score}</span>
             </div>
             <div className="glass-panel px-6 py-2 rounded-lg flex flex-col items-center border-red-500/50">
                <span className="text-xs text-red-300 uppercase">Integrity</span>
                <div className="flex gap-1 mt-1">
                  {[...Array(3)].map((_, i) => (
                    <Shield key={i} size={20} className={i < lives ? "text-cyan-400 fill-cyan-400" : "text-slate-800"} />
                  ))}
                </div>
             </div>
             <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                <X size={24} />
             </button>
          </div>
       </div>

       {/* Gameplay */}
       {gameState === 'playing' && (
         <div ref={gameContainerRef} className="relative w-full h-full max-w-4xl mx-auto z-10 crosshair-cursor">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 flex items-center justify-center">
               <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
               <Shield size={64} className="text-cyan-300 relative z-10 filter drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
               <div className="absolute -bottom-10 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)]"></div>
            </div>

            {entities.map(ent => (
               <button
                 key={ent.id}
                 onClick={() => handleEntityClick(ent.id, ent.type)}
                 className={`absolute transform -translate-x-1/2 p-3 rounded-lg border backdrop-blur-md transition-transform active:scale-95 flex items-center gap-2 group
                   ${ent.type === 'bad' 
                      ? 'border-red-500/50 bg-red-900/30 hover:bg-red-900/50 hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                      : 'border-emerald-500/50 bg-emerald-900/30 hover:bg-emerald-900/50 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                   }`}
                 style={{ left: `${ent.x}%`, top: `${ent.y}%` }}
               >
                 <ent.icon size={20} className={ent.type === 'bad' ? "text-red-400" : "text-emerald-400"} />
                 <span className={`font-bold text-sm ${ent.type === 'bad' ? "text-red-100" : "text-emerald-100"}`}>{ent.text}</span>
                 
                 <div className="absolute -inset-2 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 scale-110 transition-all pointer-events-none">
                    <Crosshair size={12} className="absolute -top-1 -left-1 text-white/50" />
                    <Crosshair size={12} className="absolute -bottom-1 -right-1 text-white/50" />
                 </div>
               </button>
            ))}
         </div>
       )}

       {gameState === 'start' && (
         <div className="z-30 text-center max-w-md animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cyan-900/30 border-2 border-cyan-500 flex items-center justify-center animate-pulse-glow-cyan">
               <Crosshair size={48} className="text-cyan-400" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 text-glow-cyan">DEFEND THE VAULT</h1>
            <p className="text-cyan-200/70 mb-8 leading-relaxed">
               Incoming data stream detected. <br/>
               <span className="text-red-400 font-bold">CLICK</span> on malicious threats (Red).<br/>
               <span className="text-emerald-400 font-bold">AVOID</span> safe assets (Green).
            </p>
            <button onClick={startGame} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xl rounded-full shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
              <Play fill="black" size={24} /> INITIALIZE DRILL
            </button>
         </div>
       )}

       {gameState === 'gameover' && (
         <div className="z-30 text-center max-w-md glass-panel-danger p-8 rounded-2xl animate-fade-in-up">
            <AlertTriangle size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl font-bold text-red-500 mb-2 text-glow-red">SECURITY BREACH</h2>
            <div className="text-6xl font-mono font-bold text-white mb-8">{score} <span className="text-lg text-slate-400">PTS</span></div>
            <div className="flex gap-4 justify-center">
              <button onClick={startGame} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg">TRY AGAIN</button>
              <button onClick={onClose} className="px-6 py-3 bg-transparent border border-white/20 hover:bg-white/10 text-white rounded-lg">EXIT</button>
            </div>
         </div>
       )}
    </div>
  );
};

// --- GAME 2: NEURAL SYNC ---
const NeuralSyncGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [choiceOne, setChoiceOne] = useState<MemoryCard | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<MemoryCard | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Shuffle cards
  const shuffleCards = () => {
    const shuffledCards: MemoryCard[] = [...MEMORY_ICONS, ...MEMORY_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random(), matched: false }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setMatchedCount(0);
    setGameWon(false);
  };

  // Handle a choice
  const handleChoice = (card: MemoryCard) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.icon === choiceTwo.icon) { 
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.icon === choiceOne.icon) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        setMatchedCount(prev => prev + 1);
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Check win condition
  useEffect(() => {
    if (matchedCount === MEMORY_ICONS.length && matchedCount > 0) {
      setGameWon(true);
    }
  }, [matchedCount]);

  // Reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  // Start game on load
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050a14] flex flex-col items-center justify-center font-sans overflow-hidden cyber-circuit-bg">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50 bg-slate-900/50 backdrop-blur-md border-b border-violet-500/20">
        <div>
           <h2 className="text-3xl font-bold text-white text-glow-violet uppercase tracking-widest flex items-center gap-3">
             <Cpu className="text-violet-400" /> Neural Sync
           </h2>
           <span className="text-violet-300/70 font-mono text-sm">DECRYPT THE BLOCKCHAIN</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-center">
              <span className="text-xs text-violet-400 uppercase block">Turns</span>
              <span className="text-2xl font-bold text-white font-mono">{turns}</span>
           </div>
           <button onClick={shuffleCards} className="p-2 bg-violet-900/50 rounded-lg hover:bg-violet-800/50 border border-violet-500/30 text-white transition-colors">
              <RefreshCw size={20} />
           </button>
           <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-white/10 text-white transition-colors">
              <X size={24} />
           </button>
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative z-10 grid grid-cols-4 gap-4 max-w-2xl mx-auto p-4">
        {cards.map(card => (
          <div key={card.id} className="relative w-20 h-20 sm:w-24 sm:h-24 perspective-1000 cursor-pointer group"
               onClick={() => !disabled && !card.matched && choiceOne?.id !== card.id && handleChoice(card)}>
             
             <div className={`w-full h-full relative transform-style-3d transition-all duration-500 ${card === choiceOne || card === choiceTwo || card.matched ? 'rotate-y-180' : ''}`}>
                
                {/* Front (Hidden) */}
                <div className="absolute inset-0 backface-hidden bg-slate-900/80 border-2 border-violet-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.1)] group-hover:border-violet-400 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                   <Grid size={32} className="text-violet-500/50" />
                </div>

                {/* Back (Revealed) */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 border-2 ${card.matched ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.5)]'} rounded-xl flex items-center justify-center`}>
                   <card.icon size={40} className={card.color} />
                   {card.matched && (
                     <div className="absolute inset-0 bg-emerald-500/20 rounded-xl animate-pulse"></div>
                   )}
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Win Modal */}
      {gameWon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in-up">
           <div className="glass-panel p-10 rounded-3xl text-center max-w-md border-violet-500/50 shadow-[0_0_50px_rgba(139,92,246,0.4)]">
              <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-violet-400/50">
                <CheckCircle2 size={40} className="text-violet-300" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 text-glow-violet">SYNC COMPLETE</h2>
              <p className="text-violet-200/80 mb-6">Blockchain data successfully decrypted in {turns} turns.</p>
              <button onClick={shuffleCards} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-full shadow-lg transition-all mr-4">
                SYNC AGAIN
              </button>
              <button onClick={onClose} className="px-8 py-3 bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold rounded-full transition-all">
                CLOSE
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

// --- GAME 3: RISK SENTINEL ---
const RiskSentinelGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentCase, setCurrentCase] = useState<RiskCase>(RISK_CASES[0]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [streak, setStreak] = useState<number>(0);

  const nextCase = () => {
    const randomCase = RISK_CASES[Math.floor(Math.random() * RISK_CASES.length)];
    // Ensure ID is unique for key usage, even if case content repeats
    setCurrentCase({...randomCase, id: Date.now()}); 
    setFeedback(null);
  };

  const handleDecision = (decision: 'APPROVE' | 'REJECT') => {
    const isCorrect = (decision === 'APPROVE' && currentCase.type === 'SAFE') ||
                      (decision === 'REJECT' && currentCase.type === 'SCAM');
    
    if (isCorrect) {
      setScore(s => s + 50 + (streak * 10));
      setStreak(s => s + 1);
      setFeedback({ type: 'success', message: `CORRECT: ${currentCase.reason}` });
    } else {
      setStreak(0);
      setFeedback({ type: 'error', message: `INCORRECT: ${currentCase.reason}` });
    }

    setTimeout(nextCase, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center font-mono">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
      
      <div className="absolute top-0 w-full p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <Terminal className="text-emerald-500" />
          <h2 className="text-xl font-bold text-emerald-500 tracking-widest">RISK SENTINEL // ANALYST MODE</h2>
        </div>
        <div className="flex items-center gap-8">
           <div className="text-slate-400 text-sm">SESSION SCORE: <span className="text-white font-bold text-lg">{score}</span></div>
           <div className="text-slate-400 text-sm">STREAK: <span className="text-emerald-400 font-bold text-lg">{streak}x</span></div>
           <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-lg shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
          <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
             <div className="flex items-center gap-2 text-blue-400">
               <Activity size={18} className="animate-pulse" />
               <span className="text-sm tracking-widest">INCOMING REQUEST DETECTED</span>
             </div>
             <span className="text-slate-500 text-xs">ID: {currentCase.id.toString().slice(-6)}</span>
          </div>

          <div className="space-y-6">
             <div className="p-4 bg-slate-950 rounded border border-slate-800">
               <div className="text-slate-500 text-xs uppercase mb-1">Origin Domain</div>
               <div className="text-xl text-white font-bold">{currentCase.domain}</div>
             </div>
             <div className="p-4 bg-slate-950 rounded border border-slate-800">
               <div className="text-slate-500 text-xs uppercase mb-1">Contract Address</div>
               <div className="text-lg text-slate-300 font-mono">{currentCase.contract}</div>
             </div>
             <div className="p-4 bg-slate-950 rounded border border-slate-800">
               <div className="text-slate-500 text-xs uppercase mb-1">Requested Action</div>
               <div className="text-lg text-yellow-400 font-bold">{currentCase.action}</div>
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
           <div className={`flex-1 mb-6 p-6 rounded-lg border flex items-center justify-center text-center transition-all duration-300 ${
             feedback 
               ? feedback.type === 'success' ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'
               : 'bg-slate-900/50 border-slate-800'
           }`}>
              {feedback ? (
                <div>
                   {feedback.type === 'success' ? <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4" /> : <Siren size={48} className="mx-auto text-red-500 mb-4 animate-bounce" />}
                   <h3 className={`text-2xl font-bold mb-2 ${feedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                     {feedback.type === 'success' ? 'ANALYSIS CORRECT' : 'THREAT MISSED'}
                   </h3>
                   <p className="text-slate-300 max-w-xs mx-auto">{feedback.message}</p>
                </div>
              ) : (
                 <div className="text-slate-500 flex flex-col items-center">
                    <Search size={48} className="mb-4 opacity-50" />
                    <p>AWAITING ANALYST DECISION...</p>
                 </div>
              )}
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => !feedback && handleDecision('APPROVE')}
                disabled={!!feedback}
                className="py-6 bg-slate-800 hover:bg-emerald-600/20 border border-slate-600 hover:border-emerald-500 text-emerald-500 hover:text-emerald-400 font-bold text-xl rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2 group"
              >
                <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                VERIFY SAFE
              </button>
              <button 
                onClick={() => !feedback && handleDecision('REJECT')}
                disabled={!!feedback}
                className="py-6 bg-slate-800 hover:bg-red-600/20 border border-slate-600 hover:border-red-500 text-red-500 hover:text-red-400 font-bold text-xl rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2 group"
              >
                <Siren size={24} className="group-hover:scale-110 transition-transform" />
                REPORT SCAM
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- GAME 4: TRADING SIMULATOR ---
const TradingSimGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [priceHistory, setPriceHistory] = useState<number[]>([100]);
  const [balance, setBalance] = useState<number>(10000);
  const [position, setPosition] = useState<Position | null>(null);
  const [pnl, setPnl] = useState<number>(0);
  const chartRef = useRef<SVGSVGElement>(null);

  // Generate price movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        const lastPrice = prev[prev.length - 1];
        const change = (Math.random() - 0.5) * 5; // Volatility
        const newPrice = Math.max(10, lastPrice + change);
        
        const newHistory = [...prev, newPrice];
        if (newHistory.length > 50) newHistory.shift();
        return newHistory;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Calculate PnL in real-time
  useEffect(() => {
    if (position) {
      const currentPrice = priceHistory[priceHistory.length - 1];
      let unrealizedPnl = 0;
      if (position.type === 'LONG') {
        unrealizedPnl = (currentPrice - position.entryPrice) * 100; // Multiplier
      } else {
        unrealizedPnl = (position.entryPrice - currentPrice) * 100;
      }
      setPnl(unrealizedPnl);
    } else {
      setPnl(0);
    }
  }, [priceHistory, position]);

  const openPosition = (type: 'LONG' | 'SHORT') => {
    if (position) return;
    const entryPrice = priceHistory[priceHistory.length - 1];
    setPosition({ type, entryPrice });
  };

  const closePosition = () => {
    if (!position) return;
    setBalance(prev => prev + pnl);
    setPosition(null);
    setPnl(0);
  };

  // Helper to draw chart path
  const getPath = (): string => {
    if (priceHistory.length < 2) return "";
    const min = Math.min(...priceHistory);
    const max = Math.max(...priceHistory);
    const range = max - min || 1;
    const height = 300;
    const width = 600;
    const stepX = width / (priceHistory.length - 1);

    return priceHistory.map((p, i) => {
      const x = i * stepX;
      const y = height - ((p - min) / range) * height * 0.8 - 20; // 20px padding
      return `${x},${y}`;
    }).join(' ');
  };

  const currentPrice = priceHistory[priceHistory.length - 1];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center font-mono">
       <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

       <div className="absolute top-0 w-full p-4 bg-slate-900 border-b border-cyan-900/50 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-cyan-400" />
          <h2 className="text-xl font-bold text-white tracking-widest">TREND MASTER // TRADING SIM</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><X size={20} /></button>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
         
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-slate-900/80 border border-slate-700 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-end mb-4">
               <div>
                 <div className="text-slate-400 text-xs">MARKET PRICE</div>
                 <div className="text-4xl font-bold text-white animate-pulse">${currentPrice.toFixed(2)}</div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-green-500 text-xs">LIVE FEED</span>
               </div>
            </div>
            
            <div className="h-[300px] w-full bg-slate-950/50 border border-slate-800 rounded-lg relative overflow-hidden">
               <svg ref={chartRef} viewBox="0 0 600 300" className="w-full h-full preserve-3d" style={{filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.3))'}}>
                 <defs>
                   <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                     <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                     <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                   </linearGradient>
                 </defs>
                 <polyline 
                    points={getPath()} 
                    fill="none" 
                    stroke="#22d3ee" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                 />
               </svg>
            </div>
         </div>

         {/* Controls */}
         <div className="flex flex-col gap-6">
            
            {/* Stats Card */}
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-6">
               <div className="text-slate-400 text-xs mb-1">ACCOUNT BALANCE</div>
               <div className="text-3xl font-bold text-white mb-6">${balance.toFixed(2)}</div>
               
               <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 mb-4">
                  <div className="text-slate-500 text-xs mb-1">UNREALIZED PNL</div>
                  <div className={`text-2xl font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            {!position ? (
              <div className="grid grid-cols-2 gap-4 flex-1">
                <button 
                  onClick={() => openPosition('LONG')}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex flex-col items-center justify-center gap-2"
                >
                  <TrendingUp size={32} />
                  <span>LONG</span>
                </button>
                <button 
                  onClick={() => openPosition('SHORT')}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex flex-col items-center justify-center gap-2"
                >
                  <TrendingDown size={32} />
                  <span>SHORT</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={closePosition}
                className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-3"
              >
                <DollarSign size={24} />
                CLOSE POSITION ({position.type})
              </button>
            )}
         </div>

      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

interface SimulatorButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    description: string;
}

const SimulatorButton: React.FC<SimulatorButtonProps> = ({ icon: Icon, label, onClick, description }) => (
  <div className="group relative">
    <button 
      onClick={onClick}
      className={`relative w-full overflow-hidden p-6 rounded-2xl border-2 border-cyan-500/30 bg-slate-900/50 hover:border-cyan-400 hover:bg-slate-900/80 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex flex-col items-center gap-3 relative z-10">
        <div className="p-3 rounded-full bg-slate-950 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <Icon size={32} className="text-cyan-300" />
        </div>
        <span className="text-lg font-bold text-white tracking-wide text-glow-cyan">{label}</span>
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-4 left-0 w-1/3 h-[1px] bg-cyan-500" />
        <div className="absolute bottom-4 right-0 w-1/3 h-[1px] bg-violet-500" />
      </div>
    </button>
    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
      <div className="glass-panel p-3 rounded-lg text-xs text-center text-cyan-100 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
        <div className="flex justify-center mb-1"><Info size={14} className="text-cyan-400" /></div>
        {description}
      </div>
    </div>
  </div>
);

interface MissionCardProps {
    title: string;
    progress: number;
    xp: number;
    status: 'completed' | 'active' | 'locked';
}

const MissionCard: React.FC<MissionCardProps> = ({ title, progress, xp, status }) => (
  <div className="glass-panel p-5 rounded-xl relative overflow-hidden group hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all cursor-pointer border-cyan-500/30">
    <div className="absolute top-0 right-0 p-3 opacity-70">
      {status === 'locked' ? <Lock size={18} className="text-slate-500" /> : <CheckCircle2 size={18} className="text-emerald-400 text-glow-cyan" />}
    </div>
    <h4 className="font-bold text-lg text-white mb-3 group-hover:text-cyan-300 transition-colors text-glow-cyan">{title}</h4>
    <div className="flex justify-between items-end mb-2">
      <span className="text-xs text-cyan-300 uppercase tracking-wider">Progress</span>
      <span className="text-sm font-mono text-cyan-400 text-glow-cyan">{progress}%</span>
    </div>
    <div className="h-2 w-full bg-slate-900/80 rounded-full overflow-hidden border border-cyan-500/20">
      <div 
        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 transition-all duration-1000 relative" 
        style={{ width: `${progress}%` }}
      >
        <div className="absolute top-0 right-0 h-full w-4 bg-white/30 skew-x-[-20deg] animate-[drift_2s_linear_infinite]" />
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <span className="text-xs text-violet-200 bg-violet-900/50 px-2.5 py-1 rounded-md border border-violet-500/50 text-glow-violet">+{xp} XP</span>
      {status === 'active' && <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse-glow-cyan" />}
    </div>
  </div>
);

interface Message {
    id: number;
    sender: 'ai' | 'user';
    text: string;
}

const AICoachChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: "Welcome to SitaVault! I'm your Guardian AI. I'm here to guide you through the crypto universe safely. Ready to set up your first simulated wallet?" }
  ]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "That's a great question. In our simulator, 'Gas Fees' are fake, but in reality, they are payments to the network validators. Always check gas before confirming!" 
      }]);
    }, 1500);
  };

  return (
    <div className="glass-panel rounded-2xl h-full flex flex-col relative overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
      <div className="p-4 border-b border-cyan-500/30 bg-slate-900/80 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 opacity-50" />
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-600 p-[2px] animate-pulse-glow-cyan">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <Cpu size={24} className="text-cyan-300" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse shadow-[0_0_10px_rgba(34,255,100,0.8)]"></div>
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-white text-lg text-glow-cyan">Guardian AI</h3>
          <p className="text-xs text-cyan-300/80 font-mono">Security Mentor • <span className="text-green-400">Online</span></p>
        </div>
      </div>
      <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar bg-slate-950/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-sm shadow-lg ${
              msg.sender === 'user' 
                ? 'bg-violet-900/40 border border-violet-500/50 text-white rounded-br-none shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                : 'bg-cyan-900/40 border border-cyan-500/50 text-slate-100 rounded-bl-none shadow-[0_0_15px_rgba(34,211,238,0.2)]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-cyan-500/30 bg-slate-900/80">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about wallets, risks, swaps..."
            className="w-full bg-slate-950/80 border border-cyan-500/30 rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder-cyan-700/70 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
          />
          <button onClick={handleSend} className="absolute right-2 p-2 bg-cyan-500/20 rounded-full text-cyan-400 hover:bg-cyan-500/80 hover:text-white transition-colors shadow-[0_0_10px_rgba(34,211,238,0.3)]">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [mounted, setMounted] = useState<boolean>(false);
  // Game State: null, 'defender', 'memory', 'risk', 'trading', 'contract'
  const [activeGame, setActiveGame] = useState<GameType>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden cyber-circuit-bg">
      <style>{customStyles}</style>

      {/* Render Active Game Overlay */}
      {activeGame === 'defender' && <VaultDefenderGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'memory' && <NeuralSyncGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'risk' && <RiskSentinelGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'trading' && <TradingSimGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'contract' && <SmartContractGame onClose={() => setActiveGame(null)} />}

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] mix-blend-screen" />
        {mounted && [...Array(25)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-cyan-300 rounded-full opacity-60 animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out, pulse ${Math.random() * 3 + 2}s infinite`
            }}
          />
        ))}
      </div>

      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 rounded-b-none border-x-0 h-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-[0_0_20px_rgba(34,211,238,0.6)] border border-cyan-400/50">
              <Shield size={24} className="text-white fill-white/20" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors text-glow-cyan">
              Sita<span className="text-cyan-400">Vault</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-cyan-100/70 uppercase tracking-widest">
            {['Education', 'Simulator', 'Missions', 'Security Center'].map((item) => (
              <a key={item} href="#" className="hover:text-cyan-400 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5">
             <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(34,255,100,0.8)]" />
                <span className="text-cyan-200 font-mono">Simulated Network</span>
             </div>
            <button className="px-6 py-2.5 rounded-full bg-cyan-950/50 border-2 border-cyan-500/50 hover:bg-cyan-900/80 hover:border-cyan-400 text-white text-sm font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              Connect <span className="hidden sm:inline">Virtual Wallet</span>
            </button>
            <button className="md:hidden text-cyan-300">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          
          <div className="space-y-10 animate-fade-in-up relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -z-10" />
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-violet-900/30 border border-violet-400/50 text-violet-200 text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Zap size={16} className="fill-current text-violet-400" />
              Risk-Free Sandbox Environment
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold leading-tight text-white tracking-tight">
              Learn Crypto <br />
              <span className="holo-gradient-text relative">
                Safely.
                <span className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 blur-md opacity-50"></span>
              </span>
            </h1>
            
            <p className="text-xl text-cyan-100/80 max-w-xl leading-relaxed font-medium">
              Master DeFi, wallets, and security in a hyper-realistic, 
              zero-risk simulator. Mistakes here cost nothing, but 
              teach you everything.
            </p>
            
            {/* Game Buttons Container */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-1">Select Training Module</h3>
              <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                <button 
                  onClick={() => setActiveGame('defender')}
                  className="px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 border border-cyan-500/40 text-white font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:bg-cyan-500/20 hover:scale-[1.02] transition-all flex items-center gap-3 group flex-1 min-w-[200px]"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/20 group-hover:animate-pulse">
                    <Crosshair size={24} className="text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-cyan-300">ACTION DRILL</div>
                    <div className="text-lg">Vault Defender</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveGame('memory')}
                  className="px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-violet-800/20 border border-violet-500/40 text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:bg-violet-500/20 hover:scale-[1.02] transition-all flex items-center gap-3 group flex-1 min-w-[200px]"
                >
                  <div className="p-2 rounded-lg bg-violet-500/20 group-hover:animate-pulse">
                    <Cpu size={24} className="text-violet-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-violet-300">MEMORY SYNC</div>
                    <div className="text-lg">Neural Match</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveGame('risk')}
                  className="px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600/20 to-emerald-800/20 border border-emerald-500/40 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-500/20 hover:scale-[1.02] transition-all flex items-center gap-3 group flex-1 min-w-[200px]"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/20 group-hover:animate-pulse">
                    <FileSearch size={24} className="text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-emerald-300">RISK ANALYSIS</div>
                    <div className="text-lg">Risk Sentinel</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveGame('trading')}
                  className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/40 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:bg-blue-500/20 hover:scale-[1.02] transition-all flex items-center gap-3 group flex-1 min-w-[200px]"
                >
                  <div className="p-2 rounded-lg bg-blue-500/20 group-hover:animate-pulse">
                    <BarChart3 size={24} className="text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-blue-300">TRADING SIM</div>
                    <div className="text-lg">Trend Master</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveGame('contract')}
                  className="px-6 py-4 rounded-xl bg-gradient-to-r from-fuchsia-600/20 to-fuchsia-800/20 border border-fuchsia-500/40 text-white font-bold shadow-[0_0_20px_rgba(217,70,239,0.2)] hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] hover:bg-fuchsia-500/20 hover:scale-[1.02] transition-all flex items-center gap-3 group flex-1 min-w-[200px]"
                >
                  <div className="p-2 rounded-lg bg-fuchsia-500/20 group-hover:animate-pulse">
                    <Code2 size={24} className="text-fuchsia-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-fuchsia-300">CONTRACT 3D</div>
                    <div className="text-lg">Contract Architect</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-10 pt-8 border-t border-cyan-500/20">
               {[
                 { label: "Active Learners", val: "12k+", icon: Cpu },
                 { label: "Scams Prevented", val: "1.4M", icon: Shield },
               ].map((stat, idx) => (
                 <div key={idx} className="flex items-center gap-4">
                   <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <stat.icon size={24} className="text-cyan-400" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-3xl font-bold text-white text-glow-cyan">{stat.val}</span>
                     <span className="text-xs text-cyan-300 uppercase tracking-wide font-bold">{stat.label}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-4 h-[600px] lg:h-full sticky top-24">
            <AICoachChat />
          </div>

        </div>
      </main>
    </div>
  );
}
