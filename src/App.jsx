import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, onSnapshot, 
  deleteDoc, query, where, orderBy, updateDoc, getDoc, getDocs, writeBatch
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged 
} from 'firebase/auth';
import { 
  Cat, Calendar, Clock, Phone, User, LogOut, 
  Lock, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  ShieldCheck, AlertCircle, Save, ArrowRight, Hourglass, Check, 
  MousePointerClick, CalendarDays, Trash2, Users, ClipboardList, 
  Badge, Star, Info, Target, LayoutDashboard, UserCircle, Edit3, Camera, MapPin, Shield, BadgeCheck, Code, Zap, ZoomIn, ZoomOut, Move, Image as ImageIcon, Heart, Briefcase, KeyRound, Terminal, Cpu, Grid3X3, BookOpen, PlayCircle, ExternalLink, Maximize2
} from 'lucide-react';

/*
      |\      _,,,---,,_
ZZZzz /,`.-'`'    -.  ;-;;,_
     |,4-  ) )-,_. ,\ (  `'-'
    '---''(_/--'  `-'\_)  
    
    Codigo por Adam jeje
    HOLAAAAAAA
*/

// --- CONFIGURACIÓN FIREBASE (GATOTECA) ---
const firebaseConfig = {
  apiKey: "AIzaSyAKa-hXON5XNX_3khN9LdcA_T5uW5-A8TM",
  authDomain: "voluntariadogatoteca.firebaseapp.com",
  projectId: "voluntariadogatoteca",
  storageBucket: "voluntariadogatoteca.firebasestorage.app",
  messagingSenderId: "186413562791",
  appId: "1:186413562791:web:7483cfb9a7e8e1fea69482",
  measurementId: "G-BR1SGTSEE9"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "gatoteca-app-v1"; 


const _k1 = "NjAz"; const _k2 = "MjI2"; const _k3 = "NTU4";
const S_PHONE = atob(_k1 + _k2 + _k3); 


const _p1 = "R2F0bzI="; const _p2 = "MDI2IQ==";
const GENERIC_HASH = atob(_p1) + atob(_p2);


const _s1 = "QlJBSUxMRUJPQ0NF"; const _s2 = "TExJR0hPU1RCT01CT04=";
const ADAM_HASH = atob(_s1) + atob(_s2);

const ZONES = {
  salon: { label: 'Salón', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  mallazo: { label: 'Mallazo', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  cer: { label: 'CER', color: 'bg-rose-100 text-rose-700 border-rose-200' }
};

const PROTOCOL_VIDEOS = [
  { 
    id: 'areneros', 
    title: 'Desinfección de Areneros', 
    description: 'Protocolo correcto para la limpieza y desinfección de las bandejas.',
    url: 'https://drive.google.com/file/d/1eLSzQJAFh64yucPXOuVxc613okEIOgOq/preview',
  },
  { 
    id: 'cuencos', 
    title: 'Desinfección de Cuencos', 
    description: 'Pasos para asegurar la higiene en los comederos y bebederos.',
    url: 'https://drive.google.com/file/d/174NsGo0dEjhh_I4azVyQoXK6cxEJ1py7/preview',
  }
];

const AVATARS = ['🐱', '😸', '😹', '😻', '😼', '😽', '😿', '😾'];

const THEME = {
  card: "bg-white border border-stone-100 shadow-md rounded-2xl"
};

// --- UTILIDADES ---
const getLocalDateKey = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getSeniorityBadge = (joinedAt) => {
  if (!joinedAt) return { label: 'Kitten Volunt', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Star };
  
  const joinDate = new Date(joinedAt);
  const now = new Date();
  const diffTime = Math.abs(now - joinDate);
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));

  if (diffMonths >= 6) {
    return { label: 'Senior Volunt', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: ShieldCheck };
  }
  return { label: 'Kitten Volunt', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Star };
};

// --- COMPONENTES VISUALES ---

// REEMPLAZO HOLOCARD: Tarjeta Premium Estática (Clean Design)
const PremiumCard = ({ children, isDev = false, className = "", onClick }) => {
  if (isDev) {
    return (
        <div onClick={onClick} className={`relative group overflow-hidden bg-stone-900 border border-emerald-500/30 rounded-2xl shadow-xl transition-all hover:scale-[1.02] hover:shadow-emerald-500/20 ${className} ${onClick ? 'cursor-pointer' : ''}`}>
             {/* Fondo Tech para Dev */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
             <div className="absolute inset-0 bg-gradient-to-br from-black via-stone-900 to-emerald-900/20"></div>
             
             {/* Línea decorativa */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500"></div>

             <div className="relative z-10 h-full">
                 {children}
             </div>
        </div>
    )
  }

  return (
    <div onClick={onClick} className={`bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}>
      {children}
    </div>
  );
};

// --- COMPONENTES UI ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon: Icon }) => {
  let variantClass = "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200";
  
  if (variant === 'secondary') variantClass = "bg-white hover:bg-orange-50 text-stone-600 border border-stone-200 hover:border-orange-200 shadow-sm";
  if (variant === 'danger') variantClass = "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200";
  if (variant === 'success') variantClass = "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200";
  if (variant === 'adam') variantClass = "bg-black hover:bg-stone-900 text-emerald-400 border border-emerald-500/50 shadow-lg shadow-emerald-500/20 font-mono tracking-wider";
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${variantClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed shadow-none grayscale' : ''}`}
    >
      {Icon && <Icon size={18} strokeWidth={2.5} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`${THEME.card} ${className}`}>
    {children}
  </div>
);

const ProgressRing = ({ radius, stroke, progress, total, isDev }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const safeProgress = Number.isFinite(progress) ? progress : 0; 
  const progressPercent = Math.min(safeProgress / total, 1);
  const strokeDashoffset = circumference - progressPercent * circumference;

  let color = "text-rose-500";
  if (safeProgress >= total) color = "text-emerald-500";
  else if (safeProgress >= total / 2) color = "text-amber-500";

  if (isDev) color = "text-emerald-400";

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} className={isDev ? "text-stone-700" : "text-stone-200"} r={normalizedRadius} cx={radius} cy={radius} />
        <circle stroke="currentColor" fill="transparent" strokeLinecap="round" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease-out" }} className={color} r={normalizedRadius} cx={radius} cy={radius} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        {isDev ? (
             <span className="text-lg font-bold text-emerald-400">∞</span>
        ) : (
             <>
                <span className={`text-xs font-bold ${color}`}>{safeProgress}h</span>
                <span className="text-[9px] text-stone-400 font-medium">/ {total}</span>
             </>
        )}
      </div>
    </div>
  );
};

const VolunteerProgressBar = ({ hours, target = 12, isDev }) => {
  if (isDev) {
      return (
        <div className="w-full bg-stone-900 border border-emerald-500/30 p-5 rounded-2xl shadow-lg shadow-emerald-500/10 mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(16,185,129,0.1)_50%,transparent_100%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="flex justify-between items-center mb-2 relative z-10">
                <div className="flex items-center gap-2">
                    <Zap size={20} className="text-emerald-400 animate-pulse" />
                    <span className="font-bold text-emerald-100 text-sm font-mono uppercase tracking-widest">Modo Desarrollador</span>
                </div>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                    ∞ / ∞
                </span>
            </div>
            <div className="h-3 w-full bg-stone-800 rounded-full overflow-hidden border border-stone-700 relative">
                 <div className="absolute inset-0 bg-emerald-500/20 animate-pulse"></div>
                 <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_#10b981]"></div>
            </div>
            <p className="text-xs text-emerald-500/70 mt-2 text-right font-mono">
                 System: Online
            </p>
        </div>
      );
  }

  const percentage = Math.min((hours / target) * 100, 100);
  const isComplete = hours >= target;
  
  return (
    <div className="w-full bg-white border border-stone-200 p-5 rounded-2xl shadow-sm mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Target size={20} className={isComplete ? "text-emerald-500" : "text-orange-500"} />
          <span className="font-bold text-stone-700 text-sm">Tu Objetivo Mensual</span>
        </div>
        <span className={`text-sm font-bold ${isComplete ? "text-emerald-600" : "text-stone-500"}`}>
          {hours} / {target} horas
        </span>
      </div>
      <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${isComplete ? "bg-emerald-500" : "bg-orange-400"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-stone-400 mt-2 text-right">
        {isComplete ? "¡Objetivo cumplido! Gracias 😺" : `Te faltan ${target - hours} horas`}
      </p>
    </div>
  );
};

const AvatarDisplay = ({ avatar, size = "large", isDev = false }) => {
  const isImage = avatar?.startsWith('data:image');
  const sizeClass = size === "large" ? "w-28 h-28 text-6xl" : size === "medium" ? "w-14 h-14 text-2xl" : "w-10 h-10 text-xl"; 
  
  const borderClass = isDev 
    ? "border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
    : "border-4 border-white shadow-lg";

  if (isImage) {
    return (
      <img 
        src={avatar} 
        alt="Avatar" 
        className={`${sizeClass} rounded-full object-cover ${borderClass} bg-stone-100 shrink-0`} 
      />
    );
  }
  
  return (
    <div className={`${sizeClass} ${isDev ? 'bg-stone-800 text-emerald-400' : 'bg-white'} rounded-full flex items-center justify-center ${borderClass} shrink-0`}>
      {avatar || '🐱'}
    </div>
  );
};

// --- NUEVO COMPONENTE DE RECORTE (PRO CROP) ---
const ImageCropper = ({ imageSrc, onCrop, onCancel, type = 'avatar' }) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [initialScale, setInitialScale] = useState(1);
  
  // Tamaño de la caja de recorte visible en pantalla
  const VIEWPORT_SIZE = 280; 
  // Resolución de salida (Alta Calidad)
  const OUTPUT_SIZE = 800; 

  const imgRef = useRef(null);
  
  // Calcular escala inicial para que la imagen cubra el viewport ("cover")
  const onImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageSize({ width: naturalWidth, height: naturalHeight });
    
    const scaleW = VIEWPORT_SIZE / naturalWidth;
    const scaleH = VIEWPORT_SIZE / naturalHeight;
    // Usamos el mayor para "cover" (cubrir todo el área)
    const baseScale = Math.max(scaleW, scaleH);
    setInitialScale(baseScale);
  };

  const startDragging = (clientX, clientY) => {
    setIsDragging(true);
    setLastMousePos({ x: clientX, y: clientY });
  };

  const moveImage = (clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - lastMousePos.x;
    const dy = clientY - lastMousePos.y;
    
    setCrop(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setLastMousePos({ x: clientX, y: clientY });
  };

  const stopDragging = () => setIsDragging(false);

  // Manejadores de eventos
  const handleMouseDown = (e) => startDragging(e.clientX, e.clientY);
  const handleMouseMove = (e) => moveImage(e.clientX, e.clientY);
  const handleTouchStart = (e) => startDragging(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e) => moveImage(e.touches[0].clientX, e.touches[0].clientY);

  const performCrop = () => {
    if (!imgRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    
    // Configurar calidad
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Calcular tamaño visual actual de la imagen en el viewport
    const currentScale = initialScale * zoom;
    const visualWidth = imageSize.width * currentScale;
    const visualHeight = imageSize.height * currentScale;

    // 2. Calcular posición visual (centrado + crop offset)
    const visualX = (VIEWPORT_SIZE - visualWidth) / 2 + crop.x;
    const visualY = (VIEWPORT_SIZE - visualHeight) / 2 + crop.y;

    // 3. Mapear coordenadas visuales a coordenadas del Canvas de salida
    // Factor de escala entre Viewport y OutputCanvas
    const ratio = OUTPUT_SIZE / VIEWPORT_SIZE;
    
    const drawX = visualX * ratio;
    const drawY = visualY * ratio;
    const drawW = visualWidth * ratio;
    const drawH = visualHeight * ratio;

    // Fondo blanco por si acaso (aunque usamos jpeg)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    
    // Dibujar imagen
    ctx.drawImage(imgRef.current, drawX, drawY, drawW, drawH);
    
    onCrop(canvas.toDataURL('image/jpeg', 0.90));
  };

  // Calcular estilos visuales
  const currentScale = initialScale * zoom;
  const visualX = (VIEWPORT_SIZE - (imageSize.width * currentScale)) / 2 + crop.x;
  const visualY = (VIEWPORT_SIZE - (imageSize.height * currentScale)) / 2 + crop.y;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in">
      <Card className="w-full max-w-sm bg-stone-900 border-stone-800 text-white overflow-hidden flex flex-col items-center shadow-2xl">
        <div className="w-full p-4 border-b border-stone-800 flex justify-between items-center">
             <h3 className="font-bold flex items-center gap-2 text-stone-200">
                <Edit3 size={18} className="text-orange-500" /> Ajustar Imagen
             </h3>
             <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-800 px-2 py-0.5 rounded">
                {type === 'avatar' ? 'Perfil' : 'Portada'}
             </span>
        </div>
        
        <div className="py-8 w-full flex justify-center bg-stone-950 relative overflow-hidden">
             {/* ÁREA DE RECORTE */}
             <div 
                className="relative overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
                style={{ 
                    width: VIEWPORT_SIZE, 
                    height: VIEWPORT_SIZE,
                    // Si es avatar usamos círculo, si es portada usamos rectángulo (pero aquí cuadrado para simplificar crop, luego CSS lo adapta)
                    borderRadius: type === 'avatar' ? '50%' : '12px',
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.85)' // El truco del overlay oscuro
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={stopDragging}
             >
                {/* Imagen Renderizada */}
                <img 
                    ref={imgRef}
                    src={imageSrc} 
                    alt="Crop Preview"
                    onLoad={onImageLoad}
                    className="max-w-none absolute select-none pointer-events-none"
                    style={{
                        width: imageSize.width * currentScale,
                        height: imageSize.height * currentScale,
                        transform: `translate3d(${visualX}px, ${visualY}px, 0)`,
                        top: 0,
                        left: 0,
                        transformOrigin: 'top left' // Importante para que las coordenadas coincidan
                    }}
                    draggable={false}
                />
                
                {/* Grid Overlay para guiar */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="w-full h-full border border-white/50 flex flex-col">
                        <div className="flex-1 border-b border-white/20 flex">
                             <div className="flex-1 border-r border-white/20"></div>
                             <div className="flex-1 border-r border-white/20"></div>
                             <div className="flex-1"></div>
                        </div>
                        <div className="flex-1 border-b border-white/20 flex">
                             <div className="flex-1 border-r border-white/20"></div>
                             <div className="flex-1 border-r border-white/20"></div>
                             <div className="flex-1"></div>
                        </div>
                        <div className="flex-1 flex">
                             <div className="flex-1 border-r border-white/20"></div>
                             <div className="flex-1 border-r border-white/20"></div>
                             <div className="flex-1"></div>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Indicador de bordes brillantes */}
             <div 
                className="absolute pointer-events-none border-2 border-white/30"
                style={{
                    width: VIEWPORT_SIZE,
                    height: VIEWPORT_SIZE,
                    borderRadius: type === 'avatar' ? '50%' : '12px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
             ></div>
        </div>

        <div className="w-full px-6 py-4 bg-stone-900 border-t border-stone-800">
           <div className="flex justify-between text-xs text-stone-400 mb-2 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1"><ZoomOut size={14}/> -</span> 
              <span className="flex items-center gap-1">+ <ZoomIn size={14}/></span>
           </div>
           <input 
             type="range" 
             min="1" 
             max="3" 
             step="0.05" 
             value={zoom} 
             onChange={(e) => setZoom(parseFloat(e.target.value))}
             className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
           />
        </div>

        <div className="flex gap-3 w-full p-4 bg-stone-900">
           <Button variant="secondary" onClick={onCancel} className="flex-1 justify-center border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white">Cancelar</Button>
           <Button onClick={performCrop} className="flex-1 justify-center shadow-orange-500/20">Guardar Foto</Button>
        </div>
      </Card>
      <div className="text-stone-500 text-xs mt-4 flex items-center gap-2">
         <Move size={12} /> Arrastra para mover
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('loading');
  const [navTab, setNavTab] = useState('calendar'); 
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [shifts, setShifts] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [tempLoginData, setTempLoginData] = useState(null);
  const [joinDateInput, setJoinDateInput] = useState('');

  // LOGIN ADAM SUPREMO
  const [showAdamModal, setShowAdamModal] = useState(false);
  const [adamPassInput, setAdamPassInput] = useState('');
  // Estado temporal para guardar los datos de login mientras se verifica la pass de Adam
  const [pendingAdamLogin, setPendingAdamLogin] = useState(null);

  // Estados para Cropper y Fotos
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropType, setCropType] = useState('avatar'); 
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  
  // Estado para ver perfil de otros voluntarios
  const [visitingProfile, setVisitingProfile] = useState(null);

  // Lista global de voluntarios para la pestaña Comunidad y Admin
  const [communityVolunteers, setCommunityVolunteers] = useState([]);

  // Estado para editar perfil propio
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ name: '', phone: '' });

  // Easter Egg
  useEffect(() => {
    console.log(`
      |\\      _,,,---,,_
ZZZzz /, \`.-'\`'    -.  ;-;;,_
     |,4-  ) )-,_. ,\\ (  \`'-'
    '---''(_/--'  \`-'\\_)  
    
    SYSTEM: CAT_OS LOADED
    `);
  }, []);

  // Carga de voluntarios GLOBAL (Para comunidad y admin)
  useEffect(() => {
    // Si estamos en app o admin, cargamos la lista
    if (view === 'app' || view === 'admin') {
        const q = collection(db, 'artifacts', appId, 'public', 'data', 'volunteers');
        return onSnapshot(q, (snapshot) => {
            const vols = [];
            snapshot.forEach((doc) => vols.push({ id: doc.id, ...doc.data() }));
            setCommunityVolunteers(vols.sort((a, b) => a.name.localeCompare(b.name)));
        });
    }
  }, [view, db]);

  const myStats = useMemo(() => {
    if (!userData || !shifts) return { month: 0, total: 0 };
    let month = 0;
    let total = 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    Object.values(shifts).forEach(dayShifts => {
      // CAMBIO: .flat() para soportar arrays
      if (dayShifts) {
          Object.values(dayShifts).flat().forEach(shift => {
            if (shift.volunteerPhone === userData.phone && shift.status === 'confirmed') {
              total++;
              const d = new Date(shift.date);
              if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                month++;
              }
            }
          });
      }
    });
    return { month, total };
  }, [shifts, userData]);

  useEffect(() => {
    const initAuth = async () => {
      try { await signInAnonymously(auth); } catch (error) { console.error("Error Auth:", error); }
    };
    initAuth();
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const name = localStorage.getItem('gato_vol_name');
        const phone = localStorage.getItem('gato_vol_phone');
        if (name && phone) {
          // Si hay datos guardados, validamos si es el dev antes de cargar
          if (phone === S_PHONE) {
             // Si hay datos locales de Adam, no cargamos automáticamente, obligamos a login manual
             // Para seguridad extra.
             setView('login');
          } else {
             checkUserExists(name, phone);
          }
        } else {
          setView('login');
        }
      }
    });
  }, []);

  const checkUserExists = async (name, phone) => {
    try {
      const volRef = doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', phone);
      const volSnap = await getDoc(volRef);
      if (volSnap.exists()) {
        setUserData({ name, phone, ...volSnap.data() });
        setView('app');
      } else {
        setView('login');
      }
    } catch (e) {
      setUserData({ name, phone });
      setView('app');
    }
  };

  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'shifts');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newShifts = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.date) return;
        if (!newShifts[data.date]) newShifts[data.date] = {};
        
        // CAMBIO: Guardar como array
        if (!newShifts[data.date][data.hour]) newShifts[data.date][data.hour] = [];
        newShifts[data.date][data.hour].push({ ...data, id: doc.id });
      });
      setShifts(newShifts);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => setPendingChanges({}), [selectedDate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const phone = fd.get('phone');
    
    // --- INTERCEPCIÓN DE SEGURIDAD ---
    // Si el teléfono coincide con el del Dev, DETENER todo proceso normal.
    // No permitir entrar a la app ni crear usuario.
    if (phone === S_PHONE) {
        // Guardamos los datos temporalmente
        setPendingAdamLogin({ name, phone });
        // Abrimos el modal de contraseña Maestra
        setShowAdamModal(true);
        // Salimos de la función
        return;
    }

    // FLUJO NORMAL
    if (name && phone && user) {
      processLogin(name, phone);
    }
  };

  const handleAdamAuth = (e) => {
      e.preventDefault();
      try {
          if (adamPassInput === ADAM_HASH) {
              // Contraseña Correcta
              setShowAdamModal(false);
              setAdamPassInput('');
              
              // Si veníamos de un intento de login (pantalla inicio)
              if (pendingAdamLogin) {
                  processLogin(pendingAdamLogin.name, pendingAdamLogin.phone);
                  setPendingAdamLogin(null); // Limpiar
              } else {
                  // Si veníamos del botón de "Modo Dios" dentro de la app (ya logueados)
                  setIsAdmin(true);
                  setView('admin');
              }
          } else {
              setAdminError('Contraseña incorrecta');
          }
      } catch (err) { setAdminError('Error'); }
  };

  const processLogin = async (name, phone) => {
      setIsSaving(true);
      try {
        const volRef = doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', phone);
        const volSnap = await getDoc(volRef);

        if (volSnap.exists()) {
          localStorage.setItem('gato_vol_name', name);
          localStorage.setItem('gato_vol_phone', phone);
          setUserData({ name, phone, ...volSnap.data() });
          setView('app');
        } else {
          setTempLoginData({ name, phone });
          setShowRegisterModal(true);
        }
      } catch (error) { alert("Error de conexión."); } finally { setIsSaving(false); }
  };

  const completeRegistration = async (e) => {
    e.preventDefault();
    if (!tempLoginData || !joinDateInput) return;
    setIsSaving(true);
    try {
      const { name, phone } = tempLoginData;
      const newUserData = {
        name,
        phone,
        joinedAt: new Date(joinDateInput).toISOString(),
        createdAt: new Date().toISOString(),
        avatar: '🐱',
        zones: ['salon'],
        bio: '',
        gallery: []
      };
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', phone), newUserData);
      localStorage.setItem('gato_vol_name', name);
      localStorage.setItem('gato_vol_phone', phone);
      setUserData(newUserData);
      setShowRegisterModal(false);
      setView('app');
    } catch (error) { alert("Error al registrar."); } finally { setIsSaving(false); }
  };

  // --- GESTIÓN DE IMÁGENES ---

  const handleImageSelect = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    // LIMITE AUMENTADO A 15MB
    if (file.size > 15 * 1024 * 1024) { alert("Imagen muy grande (Max 15MB)"); return; }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        setCropImageSrc(e.target.result);
        setCropType(type);
        event.target.value = null;
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (base64) => {
    if (!userData) return;
    setCropImageSrc(null); 
    
    try {
        const volRef = doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', userData.phone);
        if (cropType === 'avatar') {
            await updateDoc(volRef, { avatar: base64 });
            setUserData({ ...userData, avatar: base64 });
        } else if (cropType === 'cover') {
            await updateDoc(volRef, { coverPhoto: base64 });
            setUserData({ ...userData, coverPhoto: base64 });
        } else if (cropType === 'gallery') {
            const newPhoto = {
                id: Date.now(),
                url: base64,
                status: 'pending', // Requiere aprobación
                createdAt: new Date().toISOString()
            };
            const currentGallery = userData.gallery || [];
            await updateDoc(volRef, { gallery: [...currentGallery, newPhoto] });
            setUserData({ ...userData, gallery: [...currentGallery, newPhoto] });
            alert("¡Foto subida! Pendiente de aprobación por un admin.");
        }
    } catch (e) { 
        console.error(e); 
        alert("Error al guardar la imagen.");
    }
  };

  const updateBio = async (newBio) => {
     if (!userData) return;
     try {
       const volRef = doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', userData.phone);
       await updateDoc(volRef, { bio: newBio });
       setUserData({ ...userData, bio: newBio });
     } catch (e) { console.error(e); }
  };

  // --- ACTUALIZACIÓN DE PERFIL PROPIO ---
  const handleUpdateOwnProfile = async () => {
      if(!editProfileForm.name || !editProfileForm.phone) return alert("Completa todos los campos");
      setIsSaving(true);

      const oldPhone = userData.phone;
      const newPhone = editProfileForm.phone;
      const newName = editProfileForm.name;

      try {
          // Si el teléfono cambia, usamos la lógica de migración (similar a admin)
          if (oldPhone !== newPhone) {
              // Verificar si el nuevo teléfono ya existe
              const newVolRef = doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', newPhone);
              const snap = await getDoc(newVolRef);
              if (snap.exists()) {
                  alert("Este número de teléfono ya está registrado por otro voluntario.");
                  setIsSaving(false);
                  return;
              }
              
              // Migrar
              const shiftsRef = collection(db, 'artifacts', appId, 'public', 'data', 'shifts');
              const shiftsQuery = query(shiftsRef, where('volunteerPhone', '==', oldPhone));
              const shiftsSnap = await getDocs(shiftsQuery);
              
              const batch = writeBatch(db);
              
              // 1. Crear nuevo doc
              batch.set(newVolRef, { ...userData, name: newName, phone: newPhone });
              
              // 2. Mover turnos
              shiftsSnap.forEach(docSnap => {
                  const shiftData = docSnap.data();
                  const newId = `${shiftData.date}_${shiftData.hour}_${newPhone}`;
                  batch.set(doc(shiftsRef, newId), { ...shiftData, volunteerPhone: newPhone, volunteerName: newName });
                  batch.delete(doc(shiftsRef, docSnap.id));
              });
              
              // 3. Borrar antiguo
              batch.delete(doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', oldPhone));
              
              await batch.commit();

              // Actualizar LocalStorage y Estado para que no se cierre sesión "mal"
              localStorage.setItem('gato_vol_name', newName);
              localStorage.setItem('gato_vol_phone', newPhone);
              setUserData({ ...userData, name: newName, phone: newPhone });

          } else {
              // Solo actualizar nombre
              const volRef = doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', oldPhone);
              await updateDoc(volRef, { name: newName });
              localStorage.setItem('gato_vol_name', newName);
              setUserData({ ...userData, name: newName });
          }

          setIsEditingProfile(false);
          alert("Perfil actualizado correctamente.");

      } catch (error) {
          console.error(error);
          alert("Error al actualizar perfil.");
      } finally {
          setIsSaving(false);
      }
  };

  const startEditingProfile = () => {
      setEditProfileForm({ name: userData.name, phone: userData.phone });
      setIsEditingProfile(true);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    try {
      if (adminPassInput === GENERIC_HASH) {
        setIsAdmin(true); setShowAdminModal(false); setView('admin'); setAdminError(''); setAdminPassInput('');
      } else setAdminError('Contraseña incorrecta');
    } catch { setAdminError('Error'); }
  };

  const togglePending = (hour, currentShift) => {
    if (!userData) return;
    setPendingChanges(prev => {
      const next = { ...prev };
      // Si currentShift existe, significa que ya estoy apuntado
      const isMine = !!currentShift;
      const action = next[hour];
      
      if (isMine) {
        // Lógica de desapuntarse (borrar)
        if (action === 'remove') delete next[hour]; else next[hour] = 'remove';
      } else {
        // Lógica de apuntarse
        if (action === 'add') delete next[hour]; else next[hour] = 'add';
      }
      return next;
    });
  };

  const confirm = async () => {
    if (!selectedDate || !user || !userData) return;
    setIsSaving(true);
    try {
      const dateKey = getLocalDateKey(selectedDate);
      const shiftsRef = collection(db, 'artifacts', appId, 'public', 'data', 'shifts');
      await Promise.all(Object.entries(pendingChanges).map(async ([h, action]) => {
        // CAMBIO: ID Único por usuario
        const id = `${dateKey}_${h}_${userData.phone}`;
        if (action === 'add') {
          await setDoc(doc(shiftsRef, id), {
            date: dateKey, hour: parseInt(h), volunteerName: userData.name, volunteerPhone: userData.phone, userId: user.uid, status: 'pending', createdAt: new Date().toISOString()
          });
        } else { await deleteDoc(doc(shiftsRef, id)); }
      }));
      setPendingChanges({}); setSelectedDate(null);
    } catch (err) { alert("Error al guardar."); } finally { setIsSaving(false); }
  };

  if (view === 'loading') return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="animate-pulse text-orange-500"><Cat size={64} /></div></div>;

  const isDevUser = userData?.phone === S_PHONE;

  if (view === 'login') return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-stone-50">
      <div className="absolute top-4 right-4 z-10"><Button variant="secondary" onClick={() => setShowAdminModal(true)} className="text-xs"><Lock size={14} /> Admin</Button></div>
      <div className="w-full max-w-md animate-in fade-in zoom-in-95">
        <Card className="p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600" />
          <div className="flex flex-col items-center mb-8">
            <div className="bg-orange-100 p-5 rounded-full mb-4 text-orange-500 shadow-inner"><Cat size={56} /></div>
            <h1 className="text-3xl font-extrabold text-stone-800 text-center">La Gatoteca</h1>
            <p className="text-stone-500 font-medium text-center">Portal de Voluntarios</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wide">Tu Nombre</label>
              <div className="relative mt-1"><User className="absolute left-4 top-3.5 text-orange-300" size={20} /><input name="name" required className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-300 rounded-xl outline-none font-medium text-stone-700" placeholder="Ej. Laura Gato" /></div>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wide">Tu Teléfono</label>
              <div className="relative mt-1"><Phone className="absolute left-4 top-3.5 text-orange-300" size={20} /><input name="phone" required type="tel" className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-300 rounded-xl outline-none font-medium text-stone-700" placeholder="600 000 000" /></div>
            </div>
            <Button type="submit" className="w-full mt-2 py-3.5 text-lg shadow-lg shadow-orange-200" disabled={isSaving}>{isSaving ? "Verificando..." : "Empezar a Ayudar"}</Button>
          </form>
        </Card>
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-sm p-8 relative animate-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600"><CalendarDays size={32} /></div>
              <h3 className="text-xl font-bold text-stone-800">¡Bienvenido/a!</h3>
              <p className="text-stone-500 mt-2 text-sm">Para configurar tu perfil, necesitamos saber tu antigüedad aproximada.</p>
            </div>
            <form onSubmit={completeRegistration} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wide block mb-2">¿Desde cuándo eres voluntario?</label>
                <input type="date" required max={new Date().toISOString().split('T')[0]} value={joinDateInput} onChange={(e) => setJoinDateInput(e.target.value)} className="w-full p-3 bg-stone-50 rounded-xl border-2 border-stone-200 focus:border-orange-300 outline-none text-stone-700 font-bold" />
                <p className="text-[10px] text-stone-400 mt-2 italic">* Fecha aproximada.</p>
              </div>
              <Button type="submit" className="w-full py-3" disabled={isSaving}>{isSaving ? "Guardando..." : "Completar Registro"}</Button>
            </form>
          </Card>
        </div>
      )}
      
      {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} onSubmit={handleAdminLogin} pass={adminPassInput} setPass={setAdminPassInput} error={adminError} />}

      {/* MODAL ADAM LOGIN INTERCEPT (SOLO APARECE SI USAN EL NUMERO DEV) */}
      {showAdamModal && pendingAdamLogin && (
          <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <Card className="w-full max-w-sm p-8 relative animate-in zoom-in-95 border-emerald-500 border-2 bg-black shadow-2xl shadow-emerald-500/20">
              <button onClick={() => { setShowAdamModal(false); setPendingAdamLogin(null); }} className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"><XCircle size={24}/></button>
              <div className="text-center mb-8">
                <div className="bg-emerald-900/30 border border-emerald-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400"><Code size={32} /></div>
                <h3 className="text-2xl font-black text-white tracking-tight">Acceso Restringido</h3>
                <p className="text-xs text-emerald-500/70 mt-2 font-mono uppercase tracking-widest">Identificación Requerida</p>
              </div>
              <form onSubmit={handleAdamAuth} className="space-y-4">
                <input type="password" autoFocus value={adamPassInput} onChange={e=>setAdamPassInput(e.target.value)} className="w-full p-4 bg-stone-900 rounded-2xl border-2 border-stone-800 focus:border-emerald-500 focus:bg-black outline-none transition-all font-bold text-center tracking-widest text-lg text-emerald-400 placeholder-stone-700" placeholder="ACCESS KEY" />
                {adminError && <p className="text-rose-500 text-sm bg-rose-900/20 border border-rose-500/30 p-3 rounded-xl font-medium text-center">{adminError}</p>}
                <Button type="submit" variant="adam" className="w-full py-4 text-lg">Verificar Identidad</Button>
              </form>
            </Card>
          </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen font-sans pb-24 transition-colors duration-500 ${isDevUser ? 'bg-stone-900 text-stone-300' : 'bg-stone-50 text-stone-800'}`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b shadow-sm transition-colors duration-500 ${isDevUser ? 'bg-black/80 border-emerald-900/50' : 'bg-white/80 border-stone-200'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('app')}>
            <div className={`p-2 rounded-xl text-white shadow-md transform group-hover:rotate-12 transition-transform ${isDevUser ? 'bg-emerald-900 text-emerald-400 border border-emerald-500/50' : 'bg-gradient-to-br from-orange-400 to-orange-600'}`}>
                {isDevUser ? <Terminal size={24}/> : <Cat size={24} />}
            </div>
            <div className="leading-none">
                <h1 className={`font-bold text-xl ${isDevUser ? 'text-emerald-500 font-mono' : 'text-stone-800'}`}>
                    {isDevUser ? 'Gatoteca_OS' : 'Gatoteca'}
                </h1>
                <span className={`text-[10px] font-bold tracking-widest uppercase ${isDevUser ? 'text-stone-500' : 'text-orange-500'}`}>
                    {isDevUser ? 'v2.0.4.DEV' : 'Voluntarios'}
                </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
              {isAdmin ? (
                <div className="flex gap-2">
                  {view === 'app' && <Button variant="secondary" onClick={() => setView('admin')} className="!px-3 text-orange-600 border-orange-200 bg-orange-50"><ShieldCheck size={20} /></Button>}
                  <Button variant="secondary" onClick={() => { setIsAdmin(false); setView('app'); }} className="!px-3 text-rose-500 border-stone-200"><LogOut size={20} /></Button>
                </div>
              ) : (
                <div className="flex gap-2">
                    {userData && (
                        <div className={`flex p-1 rounded-xl ${isDevUser ? 'bg-stone-800 border border-emerald-500/20' : 'bg-stone-100'}`}>
                            <button onClick={() => setNavTab('calendar')} className={`p-2 rounded-lg transition-all ${navTab === 'calendar' ? (isDevUser ? 'bg-emerald-900/40 text-emerald-400 shadow-sm' : 'bg-white shadow-sm text-orange-600') : 'text-stone-400'}`}><CalendarDays size={20} /></button>
                            <button onClick={() => setNavTab('community')} className={`p-2 rounded-lg transition-all ${navTab === 'community' ? (isDevUser ? 'bg-emerald-900/40 text-emerald-400 shadow-sm' : 'bg-white shadow-sm text-orange-600') : 'text-stone-400'}`}><Users size={20} /></button>
                            <button onClick={() => setNavTab('protocols')} className={`p-2 rounded-lg transition-all ${navTab === 'protocols' ? (isDevUser ? 'bg-emerald-900/40 text-emerald-400 shadow-sm' : 'bg-white shadow-sm text-orange-600') : 'text-stone-400'}`}><BookOpen size={20} /></button>
                            <button onClick={() => setNavTab('profile')} className={`p-2 rounded-lg transition-all ${navTab === 'profile' ? (isDevUser ? 'bg-emerald-900/40 text-emerald-400 shadow-sm' : 'bg-white shadow-sm text-orange-600') : 'text-stone-400'}`}><User size={20} /></button>
                        </div>
                    )}
                    
                    {/* BOTÓN MODO DIOS EXCLUSIVO PARA ADAM (SI YA HA INICIADO SESIÓN) */}
                    {isDevUser && (
                        <button onClick={() => setShowAdamModal(true)} className="p-2.5 bg-black rounded-xl text-green-400 border border-green-500/50 shadow-sm hover:shadow-green-500/20 transition-all"><Zap size={20} /></button>
                    )}

                    <button onClick={() => setShowAdminModal(true)} className={`p-2.5 rounded-xl ${isDevUser ? 'bg-stone-800 text-stone-500' : 'bg-stone-100 text-stone-400'}`}><Lock size={20} /></button>
                </div>
              )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 animate-in fade-in duration-500">
        {view === 'admin' ? (
          <AdminPanel 
            shifts={shifts} 
            goBack={() => { setView('app'); setNavTab('calendar'); }} 
            db={db} 
            volunteers={communityVolunteers} 
            appId={appId}
          />
        ) : (
          <>
              {/* VISTA CALENDARIO */}
              {navTab === 'calendar' && (
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold ${isDevUser ? 'text-white' : 'text-stone-800'}`}>Calendario</h2>
                            <p className="text-stone-500 text-sm">Gestiona tus turnos</p>
                        </div>
                        <CalendarDays size={28} className={isDevUser ? 'text-emerald-500' : 'text-orange-500'} />
                    </div>
                    {userData && !isAdmin && <div className="w-full max-w-2xl animate-in slide-in-from-top-4"><VolunteerProgressBar hours={myStats.month} isDev={isDevUser} /></div>}
                    {isAdmin && !userData && (
                        <div className="w-full max-w-2xl mb-6 bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3 text-blue-800 shadow-sm">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><ShieldCheck size={24} /></div>
                            <div><h3 className="font-bold text-sm">Modo Observador</h3><p className="text-xs opacity-90">Entra como voluntario para reservar.</p></div>
                        </div>
                    )}
                    <div className="w-full max-w-2xl mb-8"><CalendarWidget selectedDate={selectedDate} onChange={setSelectedDate} shifts={shifts} userPhone={userData?.phone} isDev={isDevUser} /></div>
                </div>
              )}
              
              {/* VISTA PROTOCOLOS */}
              {navTab === 'protocols' && (
                  <div className="flex flex-col items-center w-full animate-in slide-in-from-right-8">
                      <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold ${isDevUser ? 'text-white' : 'text-stone-800'}`}>Protocolos</h2>
                            <p className="text-stone-500 text-sm">Formación y limpieza</p>
                        </div>
                        <BookOpen size={28} className={isDevUser ? 'text-emerald-500' : 'text-orange-500'} />
                    </div>
                    
                    <div className="w-full max-w-2xl space-y-6">
                        {PROTOCOL_VIDEOS.map((video) => (
                            <Card key={video.id} className={`overflow-hidden ${isDevUser ? 'bg-stone-900 border-emerald-900' : 'bg-white'}`}>
                                <div className={`p-4 border-b flex items-center gap-3 ${isDevUser ? 'border-stone-800 bg-stone-900' : 'border-stone-100 bg-stone-50'}`}>
                                    <div className={`p-2 rounded-full ${isDevUser ? 'bg-emerald-900 text-emerald-400' : 'bg-orange-100 text-orange-500'}`}>
                                        <PlayCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${isDevUser ? 'text-white' : 'text-stone-800'}`}>{video.title}</h3>
                                        <p className="text-xs text-stone-500">{video.description}</p>
                                    </div>
                                </div>
                                <div className="aspect-video w-full bg-black relative">
                                    <iframe 
                                        src={video.url}
                                        className="w-full h-full absolute inset-0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        title={video.title}
                                    ></iframe>
                                </div>
                                <div className={`p-2 text-center border-t text-[10px] text-stone-400 italic ${isDevUser ? 'border-stone-800 bg-stone-900' : 'border-stone-100 bg-stone-50'}`}>
                                     💡 Dale al botón de pantalla completa en el reproductor para ver mejor.
                                </div>
                            </Card>
                        ))}
                    </div>
                  </div>
              )}

              {/* VISTA COMUNIDAD */}
              {navTab === 'community' && (
                  <div className="flex flex-col items-center w-full animate-in slide-in-from-right-8">
                    <div className="w-full max-w-2xl mb-6">
                        <h2 className={`text-2xl font-bold ${isDevUser ? 'text-white' : 'text-stone-800'}`}>Comunidad</h2>
                        <p className="text-stone-500 text-sm">Conoce a tus compañeros de la Gatoteca</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl">
                        {communityVolunteers.map(vol => {
                            const isAdam = vol.phone === S_PHONE;
                            const badge = getSeniorityBadge(vol.joinedAt);
                            
                            const CardContent = () => (
                                <div className={`p-4 h-full flex flex-col items-center text-center relative z-10 ${isAdam ? 'text-white' : ''}`}>
                                    <div className="mb-2 relative">
                                        <AvatarDisplay avatar={vol.avatar} size="medium" isDev={isAdam} />
                                    </div>
                                    <div className={`font-bold text-sm truncate w-full flex items-center justify-center gap-1 ${isAdam ? 'text-emerald-400 font-mono' : 'text-stone-800'}`}>
                                        {vol.name}
                                        {isAdam && <Code size={12} />}
                                    </div>
                                    
                                    {/* ETIQUETA STAFF */}
                                    {vol.isWorker && (
                                      <div className="mt-1 mb-1">
                                        <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full border border-indigo-200 font-bold flex items-center justify-center gap-1">
                                          <BadgeCheck size={10} /> Staff
                                        </span>
                                      </div>
                                    )}

                                    {!isAdam && (
                                        <div className={`mt-1 text-[10px] px-2 py-0.5 rounded-full border ${badge.color}`}>
                                            {badge.label}
                                        </div>
                                    )}
                                    {isAdam && (
                                          <div className="mt-1 text-[9px] px-2 py-0.5 rounded-sm border border-emerald-500/50 text-emerald-500 font-mono tracking-widest uppercase">
                                                  SYSTEM
                                          </div>
                                    )}
                                </div>
                            );

                            return (
                                <PremiumCard 
                                    key={vol.phone} 
                                    isDev={isAdam} 
                                    onClick={() => setVisitingProfile(vol)}
                                    className="h-full"
                                >
                                    <CardContent />
                                </PremiumCard>
                            );
                        })}
                    </div>
                  </div>
              )}

              {/* VISTA PERFIL (PROPIO) */}
              {navTab === 'profile' && userData && (
                  <div className="flex flex-col items-center w-full animate-in slide-in-from-right-8">
                      <div className="w-full max-w-md">
                        <div className="mb-6"><h2 className={`text-2xl font-bold ${isDevUser ? 'text-white' : 'text-stone-800'}`}>Tu Perfil</h2></div>
                        <Card className={`p-0 relative overflow-hidden pb-8 ${isDevUser ? 'bg-stone-900 border-emerald-900' : 'bg-white'}`}>
                            <div className="relative w-full h-48 bg-stone-100 group">
                                {userData.coverPhoto ? (
                                    <img src={userData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full ${isDevUser ? 'bg-gradient-to-r from-black to-emerald-900' : 'bg-gradient-to-br from-orange-400 to-orange-200'}`} />
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                    <div className="bg-white/90 p-2 rounded-full text-stone-700 shadow-sm flex items-center gap-2 px-4 font-bold text-sm"><Camera size={18} /> Cambiar Portada</div>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'cover')} />
                            </div>
                            
                            <div className="relative flex flex-col items-center -mt-16 px-6">
                                <div className="relative group cursor-pointer mb-3" onClick={() => document.getElementById('avatar-upload').click()}>
                                    <AvatarDisplay avatar={userData.avatar} isDev={isDevUser} />
                                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" size={24} /></div>
                                    <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-stone-100 shadow-sm"><Edit3 size={14} className="text-stone-600" /></div>
                                </div>
                                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'avatar')} />

                                {!isEditingProfile ? (
                                    <>
                                        <h3 className={`text-2xl font-extrabold flex items-center gap-2 text-center ${isDevUser ? 'text-emerald-500 font-mono' : 'text-stone-800'}`}>
                                            {userData.name}
                                            {isDevUser && <Code size={20} />}
                                        </h3>
                                        <p className="text-sm text-stone-400 font-mono mb-2">{userData.phone}</p>
                                        <button onClick={startEditingProfile} className="text-orange-500 text-xs font-bold hover:underline mb-3">Editar Datos</button>
                                    </>
                                ) : (
                                    <div className="w-full bg-orange-50 p-4 rounded-xl border border-orange-200 mb-4 animate-in fade-in">
                                        <p className="text-xs font-bold text-orange-600 uppercase mb-2">Editar mis datos</p>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-stone-500 font-bold">Nombre</label>
                                                <input value={editProfileForm.name} onChange={(e) => setEditProfileForm({...editProfileForm, name: e.target.value})} className="w-full p-2 rounded-lg border border-orange-200 focus:outline-none focus:border-orange-400 text-sm font-bold" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-stone-500 font-bold">Teléfono (Usuario)</label>
                                                <input value={editProfileForm.phone} onChange={(e) => setEditProfileForm({...editProfileForm, phone: e.target.value})} className="w-full p-2 rounded-lg border border-orange-200 focus:outline-none focus:border-orange-400 text-sm font-mono" />
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <Button variant="secondary" onClick={() => setIsEditingProfile(false)} className="flex-1 py-1.5 text-xs">Cancelar</Button>
                                                <Button onClick={handleUpdateOwnProfile} className="flex-1 py-1.5 text-xs" disabled={isSaving}>Guardar</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ETIQUETA STAFF PROPIO */}
                                {userData.isWorker && (
                                  <div className="mb-2">
                                    <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-0.5 rounded-full border border-indigo-200 font-bold flex items-center gap-1">
                                      <BadgeCheck size={14} /> Staff
                                    </span>
                                  </div>
                                )}

                                {!isDevUser && (() => {
                                    const badge = getSeniorityBadge(userData.joinedAt);
                                    const BadgeIcon = badge.icon;
                                    return <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}><BadgeIcon size={14} /> {badge.label}</div>;
                                })()}
                            </div>
                            
                            <div className="px-8 mt-6 space-y-6">
                              {/* Bio */}
                              <div className="text-center">
                                  <textarea 
                                    className={`w-full border rounded-xl p-3 text-sm resize-none focus:outline-none transition-colors text-center ${isDevUser ? 'bg-stone-800 border-stone-700 text-stone-300 focus:border-emerald-500' : 'bg-stone-50 border-stone-100 text-stone-600 focus:border-orange-300'}`}
                                    placeholder="Escribe algo sobre ti..."
                                    rows="2"
                                    value={userData.bio || ''}
                                    onChange={(e) => updateBio(e.target.value)}
                                  />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div className={`p-4 rounded-2xl text-center border ${isDevUser ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-100'}`}>
                                      <p className="text-xs text-stone-500 uppercase font-bold tracking-wide mb-1">Horas Mes</p>
                                      <p className={`text-3xl font-black ${isDevUser ? 'text-emerald-500' : 'text-orange-500'}`}>{isDevUser ? '∞' : myStats.month}</p>
                                  </div>
                                  <div className={`p-4 rounded-2xl text-center border ${isDevUser ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-100'}`}>
                                      <p className="text-xs text-stone-500 uppercase font-bold tracking-wide mb-1">Horas Total</p>
                                      <p className={`text-3xl font-black ${isDevUser ? 'text-white' : 'text-stone-700'}`}>{isDevUser ? '∞' : myStats.total}</p>
                                  </div>
                              </div>
                              
                              {/* Galería */}
                              <div>
                                  <div className="flex items-center justify-between mb-3">
                                      <p className="text-xs font-bold text-stone-400 uppercase">Mis Fotos</p>
                                      <button onClick={() => galleryInputRef.current.click()} className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:underline"><Camera size={14}/> Subir</button>
                                      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'gallery')} />
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                      {(userData.gallery || []).map((img, i) => (
                                          <div key={i} className="aspect-square rounded-lg overflow-hidden bg-stone-100 relative group">
                                              <img src={img.url} className={`w-full h-full object-cover ${img.status === 'pending' ? 'opacity-50 grayscale' : ''}`} />
                                              {img.status === 'pending' && <div className="absolute inset-0 flex items-center justify-center"><Hourglass size={16} className="text-stone-500"/></div>}
                                          </div>
                                      ))}
                                      {(userData.gallery || []).length === 0 && <div className="col-span-3 text-center py-4 text-stone-400 text-xs italic">Aún no has subido fotos.</div>}
                                  </div>
                              </div>
                              
                              <div className="text-center border-t border-stone-100 pt-6">
                                  <p className="text-xs text-stone-400 font-medium">Miembro desde <span className="text-stone-600 font-bold">{new Date(userData.joinedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                              </div>
                            </div>
                        </Card>
                      </div>
                  </div>
              )}
         </>
        )}
      </main>

      {/* MODAL CROPPER */}
      {cropImageSrc && (
        <ImageCropper 
           imageSrc={cropImageSrc} 
           onCrop={handleCropComplete} 
           onCancel={() => setCropImageSrc(null)} 
           type={cropType}
        />
      )}

      {/* MODAL VISUALIZAR PERFIL (COMUNIDAD & ADMIN) */}
      {visitingProfile && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          
          {/* Contenedor del Botón de Cerrar Externo (Arriba a la derecha del modal global) */}
          <button 
              onClick={() => setVisitingProfile(null)} 
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur p-2 rounded-full text-white transition-colors cursor-pointer z-[90]"
          >
              <XCircle size={32} />
          </button>

          <PremiumCard isDev={visitingProfile.phone === S_PHONE}>
              <div className="relative">
                  {/* Header Imagen */}
                  <div className="w-full h-32 bg-stone-200 relative z-0">
                      {visitingProfile.coverPhoto ? (
                          <img src={visitingProfile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-200" />
                      )}
                  </div>
                  
                  {/* Contenido */}
                  <div className={`relative flex flex-col items-center pt-16 px-6 pb-8 ${visitingProfile.phone === S_PHONE ? 'text-stone-200' : 'text-stone-800'}`}>
                      <div className="relative -mt-16 mb-4 z-10">
                          <AvatarDisplay avatar={visitingProfile.avatar} size="large" isDev={visitingProfile.phone === S_PHONE} />
                      </div>
                      <h3 className={`text-2xl font-extrabold text-center flex items-center gap-2 ${visitingProfile.phone === S_PHONE ? 'text-emerald-400 font-mono' : 'text-stone-800'}`}>
                        {visitingProfile.name}
                        {visitingProfile.phone === S_PHONE && <Code size={20} />}
                      </h3>
                      
                      {/* ETIQUETA STAFF EN MODAL COMUNIDAD */}
                      {visitingProfile.isWorker && (
                        <div className="mt-1 mb-2">
                          <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-0.5 rounded-full border border-indigo-200 font-bold flex items-center gap-1">
                            <BadgeCheck size={14} /> Staff
                          </span>
                        </div>
                      )}

                      {visitingProfile.phone !== S_PHONE && (() => {
                          const badge = getSeniorityBadge(visitingProfile.joinedAt);
                          const BadgeIcon = badge.icon;
                          return <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}><BadgeIcon size={14} /> {badge.label}</div>;
                      })()}
                      
                      {visitingProfile.bio && <p className={`text-sm text-center mt-4 italic max-w-xs ${visitingProfile.phone === S_PHONE ? 'text-stone-400' : 'text-stone-600'}`}>"{visitingProfile.bio}"</p>}

                      {/* GALERÍA PÚBLICA (SOLO APROBADAS) */}
                      <div className="w-full mt-6">
                          <p className="text-xs font-bold text-stone-400 uppercase mb-2 text-center">Fotos</p>
                          <div className="grid grid-cols-3 gap-2">
                             {(visitingProfile.gallery || []).filter(p => p.status === 'approved').map((img, i) => (
                                 <div key={i} className="aspect-square rounded-lg overflow-hidden bg-stone-100 cursor-pointer hover:opacity-90 transition-opacity">
                                     <img src={img.url} className="w-full h-full object-cover" />
                                 </div>
                             ))}
                          </div>
                          {(!visitingProfile.gallery || visitingProfile.gallery.filter(p => p.status === 'approved').length === 0) && (
                             <p className="text-center text-stone-400 text-xs italic">Sin fotos públicas.</p>
                          )}
                      </div>
                  </div>
              </div>
          </PremiumCard>
        </div>
      )}

      {/* MODAL HORAS */}
      {selectedDate && view === 'app' && navTab === 'calendar' && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4">
           <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity" onClick={() => {setSelectedDate(null); setPendingChanges({});}} />
           <div className={`relative w-full max-w-3xl rounded-t-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-200 ${isDevUser ? 'bg-stone-900 border border-emerald-900' : 'bg-stone-50'}`}>
              <div className={`px-6 py-5 border-b flex items-center justify-between shrink-0 z-10 ${isDevUser ? 'bg-black border-emerald-900' : 'bg-white border-stone-200'}`}>
                <div className="flex items-center gap-3">
                   <div className={`p-2.5 rounded-xl ${isDevUser ? 'bg-emerald-900 text-emerald-400' : 'bg-orange-100 text-orange-600'}`}><Calendar size={24} /></div>
                   <div>
                     <h3 className={`text-xl font-bold capitalize leading-none ${isDevUser ? 'text-white' : 'text-stone-800'}`}>{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}</h3>
                     <p className={`font-medium capitalize text-sm mt-0.5 ${isDevUser ? 'text-stone-500' : 'text-stone-500'}`}>{selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                   </div>
                </div>
                <button onClick={() => {setSelectedDate(null); setPendingChanges({});}} className="text-stone-400 hover:text-stone-600 transition-colors bg-stone-100 p-2 rounded-full"><XCircle size={24} /></button>
              </div>
              
              {/* Asistencia del Día (Resumen) */}
              {userData && (() => {
                  const dateKey = getLocalDateKey(selectedDate);
                  // CAMBIO: Leemos array y aplanamos
                  const dayShifts = shifts[dateKey] ? Object.values(shifts[dateKey]).flat() : [];
                  const myDayShifts = dayShifts.filter(s => s.volunteerPhone === userData.phone);
                  const confirmedCount = myDayShifts.filter(s => s.status === 'confirmed').length;
                  const absentCount = myDayShifts.filter(s => s.status === 'absent').length;
                  const totalRequested = myDayShifts.length;

                  if (totalRequested > 0 && selectedDate < new Date()) {
                    return (
                        <div className="bg-stone-50 px-6 py-3 border-b border-stone-100 text-sm flex gap-4 text-stone-600 font-medium">
                           <span><span className="font-bold text-stone-800">{totalRequested}</span> solicitadas</span>
                           {confirmedCount > 0 && <span className="text-emerald-600 flex items-center gap-1 font-bold"><CheckCircle size={14}/> {confirmedCount} asistidas</span>}
                           {absentCount > 0 && <span className="text-rose-600 flex items-center gap-1 font-bold"><XCircle size={14}/> {absentCount} faltas</span>}
                        </div>
                    );
                  }
                  return null;
              })()}

              <div className={`overflow-y-auto p-6 grow custom-scrollbar ${isDevUser ? 'bg-stone-900' : 'bg-stone-50'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(() => {
                    const day = selectedDate.getDay();
                    const endHour = (day === 0 || day === 6) ? 22 : 21;
                    const now = new Date();
                    const isToday = selectedDate.toDateString() === now.toDateString();
                    const currentHour = now.getHours();
                    const hours = [];
                    for(let i=9; i<endHour; i++) hours.push(i);
                    
                    return hours.map((hour) => {
                      const dateKey = getLocalDateKey(selectedDate);
                      
                      // CAMBIO PRINCIPAL: Lista de turnos
                      const currentShifts = shifts[dateKey]?.[hour] || [];
                      const count = currentShifts.length;
                      const maxCapacity = 4;
                      
                      // Buscamos si YO estoy
                      const myShift = userData ? currentShifts.find(s => s.volunteerPhone === userData.phone) : null;
                      
                      const isMine = !!myShift;
                      const isFull = count >= maxCapacity;
                      const occupied = count > 0;
                      
                      const status = myShift?.status || 'confirmed';
                      const pending = pendingChanges[hour];
                      // Lógica estricta de "Pasado": Si es hoy y la hora es menor o igual, ya pasó.
                      const isPastHour = isToday && hour <= currentHour;
                      const isFuture = selectedDate > now || (isToday && hour > currentHour);
                      
                      let variant = 'default'; let label = `${count}/${maxCapacity} Libres`; let icon = null;

                      if (!userData) { 
                         if (isFull) { variant = 'occupied'; label = 'Completo'; icon = Lock; } 
                         else if (occupied) { variant = 'disabled'; label = `${count} Voluntarios`; } 
                         else { variant = 'disabled'; label = 'Disponible'; } 
                      } 
                      else if (isPastHour && !isMine) { variant = 'disabled'; label = 'Pasado'; } 
                      else if (isMine) {
                        // Si es mío...
                        if (pending === 'remove') { 
                            variant = 'delete'; label = 'Eliminar'; icon = Trash2; 
                        } else if (isPastHour) {
                            // Si es pasado y es mío, mostramos estado pero bloqueado
                            if (status === 'confirmed') { variant = 'confirmed'; label = 'Asistido'; icon = CheckCircle; }
                            else if (status === 'pending') { variant = 'pending'; label = 'Pendiente'; icon = Hourglass; }
                            else if (status === 'absent') { variant = 'absent'; label = 'Falta'; icon = XCircle; }
                        } else {
                            // Es futuro y mío
                            if (status === 'confirmed') { variant = 'confirmed'; label = 'Confirmado'; icon = CheckCircle; }
                            else if (status === 'pending') { variant = 'pending'; label = 'Pendiente'; icon = Hourglass; }
                        }
                      } else if (isFull) { 
                        variant = 'occupied'; label = 'Completo'; icon = Lock; 
                      } else if (pending === 'add') { 
                        variant = 'selected'; label = 'Solicitar'; icon = CheckCircle; 
                      } else {
                          // Estado por defecto (disponible y no lleno)
                          label = `${count}/${maxCapacity} Ocupado`;
                          if (count === 0) label = "Disponible";
                      }

                      const styles = {
                        default: "bg-white border-stone-200 hover:border-orange-300 hover:shadow-md cursor-pointer",
                        disabled: "bg-stone-100 border-stone-200 opacity-50 cursor-not-allowed",
                        confirmed: "bg-emerald-50 border-emerald-400 text-emerald-800",
                        pending: "bg-amber-50 border-amber-400 text-amber-800",
                        absent: "bg-rose-50 border-rose-300 text-rose-600 opacity-90",
                        selected: "bg-orange-50 border-orange-500 text-orange-800 shadow-sm",
                        delete: "bg-rose-50 border-rose-400 text-rose-800",
                        occupied: "bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed text-stone-400"
                      };

                      // Dev override styles
                      if (isDevUser) {
                          styles.default = "bg-stone-800 border-stone-700 hover:border-emerald-500 text-stone-300";
                          styles.disabled = "bg-stone-900 border-stone-800 opacity-30 cursor-not-allowed text-stone-600";
                          styles.selected = "bg-emerald-900/30 border-emerald-500 text-emerald-400";
                          styles.confirmed = "bg-emerald-900/20 border-emerald-500/50 text-emerald-400";
                      }

                      return (
                        <button 
                            key={hour} 
                            onClick={() => { 
                                if (!userData) return; 
                                // Bloqueo estricto para horas pasadas
                                if (isPastHour) return; 
                                if (!isFull || isMine) togglePending(hour, myShift); 
                            }} 
                            disabled={(!userData) || (isFull && !isMine) || isPastHour} 
                            className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col justify-center min-h-[5rem] ${styles[variant]}`}
                        >
                          <div className="flex justify-between items-center w-full mb-1"><span className="text-xl font-bold font-mono tracking-tight">{hour}:00</span>{icon && React.createElement(icon, { size: 18, strokeWidth: 2.5 })}</div>
                          <span className="text-[10px] font-bold uppercase tracking-wider truncate w-full block opacity-90">{label}</span>
                          {/* Visualizador de puntitos de ocupación */}
                          {!isMine && !isFull && count > 0 && (
                            <div className="flex gap-0.5 mt-1">
                                {Array.from({length: count}).map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${isDevUser ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>)}
                            </div>
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
              <div className={`border-t p-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 ${isDevUser ? 'bg-black border-emerald-900' : 'bg-white border-stone-200'}`}>
                 <div className="flex items-center gap-3 text-sm">
                   {Object.keys(pendingChanges).length > 0 ? (
                      <><span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200">+{Object.values(pendingChanges).filter(x => x === 'add').length}</span><span className="text-rose-700 font-bold bg-rose-100 px-2 py-1 rounded-md border border-rose-200">-{Object.values(pendingChanges).filter(x => x === 'remove').length}</span><span className="text-stone-500 ml-1 font-medium">cambios</span></>
                   ) : <span className="text-stone-400 font-medium">{userData ? "Pulsa horas para editar..." : "Modo Observador"}</span>}
                 </div>
                 <div className="flex w-full sm:w-auto gap-3">
                   <Button variant="secondary" onClick={() => {setSelectedDate(null); setPendingChanges({});}} className="flex-1 sm:flex-none justify-center">Cancelar</Button>
                   <Button onClick={confirm} variant="success" disabled={!userData || Object.keys(pendingChanges).length === 0 || isSaving} className="flex-1 sm:flex-none justify-center shadow-lg" icon={isSaving ? Hourglass : Check}>{isSaving ? "Guardando..." : "CONFIRMAR"}</Button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showAdamModal && pendingAdamLogin && (
        <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
           {/* Este bloque es redundante con el de arriba, pero asegura que se renderice si se llama desde aquí */}
           <Card className="w-full max-w-sm p-8 relative animate-in zoom-in-95 border-emerald-500 border-2 bg-black shadow-2xl shadow-emerald-500/20">
              <button onClick={() => { setShowAdamModal(false); setPendingAdamLogin(null); }} className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"><XCircle size={24}/></button>
              <div className="text-center mb-8">
                <div className="bg-emerald-900/30 border border-emerald-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400"><Code size={32} /></div>
                <h3 className="text-2xl font-black text-white tracking-tight">Acceso Restringido</h3>
                <p className="text-xs text-emerald-500/70 mt-2 font-mono uppercase tracking-widest">Identificación Requerida</p>
              </div>
              <form onSubmit={handleAdamAuth} className="space-y-4">
                <input type="password" autoFocus value={adamPassInput} onChange={e=>setAdamPassInput(e.target.value)} className="w-full p-4 bg-stone-900 rounded-2xl border-2 border-stone-800 focus:border-emerald-500 focus:bg-black outline-none transition-all font-bold text-center tracking-widest text-lg text-emerald-400 placeholder-stone-700" placeholder="ACCESS KEY" />
                {adminError && <p className="text-rose-500 text-sm bg-rose-900/20 border border-rose-500/30 p-3 rounded-xl font-medium text-center">{adminError}</p>}
                <Button type="submit" variant="adam" className="w-full py-4 text-lg">Verificar Identidad</Button>
              </form>
           </Card>
        </div>
      )}
      
      {showAdminModal && !pendingAdamLogin && <AdminModal onClose={() => setShowAdminModal(false)} onSubmit={handleAdminLogin} pass={adminPassInput} setPass={setAdminPassInput} error={adminError} />}
    </div>
  );
}

// --- PANEL ADMIN ---
function AdminPanel({ shifts, goBack, db, volunteers, appId }) {
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [editingVolunteer, setEditingVolunteer] = useState(null); 
  const [viewingVolunteer, setViewingVolunteer] = useState(null); 
  const [viewDate, setViewDate] = useState(new Date()); 
  const [adminTab, setAdminTab] = useState('dashboard'); 
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

  // Estado original para migración de teléfono en edición
  const [originalPhone, setOriginalPhone] = useState(null);

  const handleMonthChange = (inc) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + inc);
    setViewDate(newDate);
  };

  const calculateVolunteerStats = (phone) => {
      let month = 0;
      let total = 0;
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      if (shifts && typeof shifts === 'object') {
        Object.values(shifts).forEach(dayShifts => {
            Object.values(dayShifts).flat().forEach(shift => {
              if (shift.volunteerPhone === phone && (shift.status === 'confirmed' || shift.status === undefined)) {
                total++;
                const d = new Date(shift.date);
                if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                    month++;
                }
              }
            });
        });
      }
      return { month, total };
  };

  const stats = useMemo(() => {
    const map = {};
    const viewMonth = viewDate.getMonth();
    const viewYear = viewDate.getFullYear();
    Object.values(shifts).forEach(dayShifts => {
        Object.values(dayShifts).flat().forEach(shift => {
          if (!map[shift.volunteerPhone]) map[shift.volunteerPhone] = { name: shift.volunteerName, phone: shift.volunteerPhone, total: 0, month: 0 };
          const isConfirmed = shift.status === 'confirmed' || shift.status === undefined;
          if (isConfirmed) {
            map[shift.volunteerPhone].total += 1;
            const d = new Date(shift.date); 
            if (d.getMonth() === viewMonth && d.getFullYear() === viewYear) map[shift.volunteerPhone].month += 1;
          }
        });
    });
    return Object.values(map).sort((a, b) => b.month - a.month);
  }, [shifts, viewDate]);

  const pendingShifts = useMemo(() => {
    const list = [];
    if (shifts) {
      Object.values(shifts).forEach(dayShifts => {
        if(dayShifts) Object.values(dayShifts).flat().forEach(s => {
          if (s && s.status === 'pending') list.push(s);
        });
      });
    }
    return list.sort((a, b) => a.date.localeCompare(b.date) || a.hour - b.hour);
  }, [shifts]);

  const validate = async (s, status) => {
    const shiftsRef = collection(db, 'artifacts', appId, 'public', 'data', 'shifts');
    try { 
        await updateDoc(doc(shiftsRef, s.id), { status }); 
    } catch (e) { console.error(e); }
  };

  const handleDeleteVolunteer = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.phone === S_PHONE) {
        alert("⚠️ ACCESO DENEGADO: No puedes borrar al Desarrollador Supremo.");
        setDeleteTarget(null);
        return;
    }
    const idsToDelete = [];
    Object.values(shifts).forEach(dayShifts => {
        Object.values(dayShifts).flat().forEach(s => {
          if (s.volunteerPhone === deleteTarget.phone) idsToDelete.push(s.id);
        });
    });
    try {
      const shiftsRef = collection(db, 'artifacts', appId, 'public', 'data', 'shifts');
      const volsRef = collection(db, 'artifacts', appId, 'public', 'data', 'volunteers');
      await Promise.all(idsToDelete.map(id => deleteDoc(doc(shiftsRef, id))));
      await deleteDoc(doc(volsRef, deleteTarget.phone));
      setDeleteTarget(null); 
    } catch (error) { alert("Error al borrar."); }
  };
  
  const saveVolunteerChanges = async (updatedData) => {
    try {
      // Verificar si el teléfono ha cambiado
      if (originalPhone && originalPhone !== updatedData.phone) {
          // Lógica de migración completa
          const newPhone = updatedData.phone;
          
          // 1. Verificar si ya existe
          const newVolRef = doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', newPhone);
          const snap = await getDoc(newVolRef);
          if (snap.exists()) {
              alert("Error: El nuevo número de teléfono ya pertenece a otro voluntario.");
              return;
          }

          if (confirm(`Estás cambiando el teléfono de ${originalPhone} a ${newPhone}. Esto migrará todo el historial. ¿Continuar?`)) {
              const shiftsRef = collection(db, 'artifacts', appId, 'public', 'data', 'shifts');
              const q = query(shiftsRef, where('volunteerPhone', '==', originalPhone));
              const querySnapshot = await getDocs(q);
              
              const batch = writeBatch(db);

              // Crear nuevo voluntario
              batch.set(newVolRef, updatedData);

              // Migrar turnos
              querySnapshot.forEach((docSnap) => {
                  const shiftData = docSnap.data();
                  // Nuevo ID basado en el nuevo teléfono
                  const newShiftId = `${shiftData.date}_${shiftData.hour}_${newPhone}`;
                  
                  // Crear turno nuevo
                  batch.set(doc(shiftsRef, newShiftId), {
                      ...shiftData,
                      volunteerPhone: newPhone,
                      volunteerName: updatedData.name // Actualizar nombre también por si acaso
                  });
                  
                  // Borrar turno antiguo
                  batch.delete(doc(shiftsRef, docSnap.id));
              });

              // Borrar voluntario antiguo
              batch.delete(doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', originalPhone));

              await batch.commit();
              alert("Migración completada con éxito.");
          } else {
              return;
          }
      } else {
          // Actualización simple
          const volRef = doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', updatedData.phone);
          await updateDoc(volRef, updatedData);
      }
      setEditingVolunteer(null);
      setOriginalPhone(null);
    } catch (error) {
      console.error("Error updating volunteer:", error);
      alert("Error al actualizar.");
    }
  };
  
  const approvePhoto = async (volunteerPhone, photoId, action) => {
      try {
          const volRef = doc(db, 'artifacts', appId, 'public', 'data', 'volunteers', volunteerPhone);
          const vol = volunteers.find(v => v.phone === volunteerPhone);
          if (!vol) return;
          
          let newGallery;
          if (action === 'approve') {
              newGallery = vol.gallery.map(p => p.id === photoId ? {...p, status: 'approved'} : p);
          } else {
              newGallery = vol.gallery.filter(p => p.id !== photoId);
          }
          await updateDoc(volRef, { gallery: newGallery });
      } catch (e) { console.error(e); }
  };

  const renderManagementCalendar = () => {
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const startDay = (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() || 7) - 1;
    
    return (
        <div className="grid grid-cols-7 gap-1 md:gap-2">
            {['L','M','X','J','V','S','D'].map(d => <div key={d} className="text-center text-xs font-bold text-stone-400 py-2">{d}</div>)}
            {Array.from({length:startDay}).map((_,i)=><div key={`blank-${i}`}/>)}
            {Array.from({length:daysInMonth}).map((_,i)=>{
                const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i+1);
                const dk = getLocalDateKey(d);
                // CAMBIO: .flat() para soportar arrays
                const dayShifts = shifts[dk] ? Object.values(shifts[dk]).flat() : [];
                const count = dayShifts.length;
                const isSelected = selectedDayDetail && getLocalDateKey(selectedDayDetail) === dk;

                return (
                    <button 
                        key={i} 
                        onClick={() => setSelectedDayDetail(d)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                            isSelected ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-stone-100 bg-white hover:border-orange-200'
                        }`}
                    >
                        <span className="text-sm font-bold">{i+1}</span>
                        {count > 0 && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-medium bg-stone-100 px-1.5 py-0.5 rounded-md">
                                <Users size={10} /> {count}
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
  };
  
  // Recoger todas las fotos pendientes
  const pendingPhotos = useMemo(() => {
      let photos = [];
      volunteers.forEach(v => {
          if (v.gallery) {
              v.gallery.forEach(p => {
                  if (p.status === 'pending') {
                      photos.push({ ...p, volunteerName: v.name, volunteerPhone: v.phone });
                  }
              });
          }
      });
      return photos;
  }, [volunteers]);

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-8 gap-4">
        <div className="flex flex-col items-center md:items-start w-full md:w-auto">
          <h2 className="text-2xl font-bold text-stone-800">Admin</h2>
          <div className="flex bg-stone-100 p-1 rounded-xl mt-2 w-full md:w-auto justify-between md:justify-start">
            <button onClick={() => setAdminTab('dashboard')} className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${adminTab === 'dashboard' ? 'bg-white text-orange-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}><div className="flex items-center justify-center gap-2"><ClipboardList size={16}/> <span className="hidden sm:inline">Progreso</span></div></button>
            <button onClick={() => setAdminTab('calendar')} className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${adminTab === 'calendar' ? 'bg-white text-orange-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}><div className="flex items-center justify-center gap-2"><Calendar size={16}/> <span className="hidden sm:inline">Gestión</span></div></button>
            <button onClick={() => setAdminTab('directory')} className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${adminTab === 'directory' ? 'bg-white text-orange-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}><div className="flex items-center justify-center gap-2"><Users size={16}/> <span className="hidden sm:inline">Voluntarios</span></div></button>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <Button variant="secondary" onClick={goBack} icon={ArrowRight} className="w-full md:w-auto justify-center">Volver al Calendario</Button>
          {(adminTab === 'dashboard' || adminTab === 'calendar') && (
            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2 bg-stone-50 rounded-lg p-1">
              <button onClick={() => handleMonthChange(-1)} className="p-1.5 hover:bg-white rounded-md text-stone-500 shadow-sm"><ChevronLeft size={18}/></button>
              <p className="text-stone-500 capitalize font-medium text-sm w-full md:w-32 text-center select-none">{viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
              <button onClick={() => handleMonthChange(1)} className="p-1.5 hover:bg-white rounded-md text-stone-500 shadow-sm"><ChevronRight size={18}/></button>
            </div>
          )}
        </div>
      </div>

      {adminTab === 'dashboard' && (
        <>
            {/* SECCIÓN DE APROBACIÓN DE FOTOS */}
            {pendingPhotos.length > 0 && (
                <Card className="border-purple-200 bg-purple-50 mb-6 overflow-hidden">
                  <div className="p-4 border-b border-purple-200 flex items-center gap-3 bg-purple-100/50">
                    <Camera className="text-purple-600" size={20} />
                    <h3 className="font-bold text-purple-800 text-sm">Fotos Pendientes ({pendingPhotos.length})</h3>
                  </div>
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-80 overflow-y-auto custom-scrollbar">
                    {pendingPhotos.map(p => (
                        <div key={p.id} className="relative group">
                            <img src={p.url} className="rounded-lg shadow-sm w-full h-32 object-cover bg-white" />
                            <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] p-1 truncate text-center">{p.volunteerName}</div>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => approvePhoto(p.volunteerPhone, p.id, 'approve')} className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600"><Check size={16}/></button>
                                <button onClick={() => approvePhoto(p.volunteerPhone, p.id, 'reject')} className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600"><XCircle size={16}/></button>
                            </div>
                        </div>
                    ))}
                  </div>
                </Card>
            )}

            <Card className="overflow-hidden">
                <div className="p-6 border-b border-stone-200 bg-stone-50/50 flex justify-between items-center"><h3 className="font-bold text-stone-700 text-lg">Progreso Mensual</h3></div>
                <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-stone-50 text-stone-500 text-xs uppercase font-bold tracking-wide border-b border-stone-200">
                        <th className="p-4 pl-6">Voluntario</th>
                        <th className="hidden sm:table-cell p-4 text-center">Mes</th>
                        <th className="hidden sm:table-cell p-4 text-center">Total</th>
                        <th className="p-4 text-right pr-6">Acciones</th>
                    </tr></thead>
                    <tbody className="divide-y divide-stone-100">
                    {stats.map(v => {
                        const volInfo = volunteers.find(vol => vol.phone === v.phone);
                        const isAdam = v.phone === S_PHONE;
                        return (
                        <tr key={v.phone} className="hover:bg-orange-50 transition-colors">
                            <td className="p-4 pl-6">
                                <div className="flex items-center gap-3">
                                    <AvatarDisplay avatar={volInfo?.avatar} size="small" isDev={isAdam} />
                                    <div className="min-w-0">
                                        <div className="font-medium text-stone-800 text-sm truncate max-w-[120px] sm:max-w-none flex items-center gap-1">
                                            {v.name}
                                            {/* ETIQUETA STAFF COMPACTA (LISTA) */}
                                            {volInfo?.isWorker && <span className="bg-indigo-100 text-indigo-700 text-[9px] px-1.5 rounded-full border border-indigo-200 font-bold flex items-center gap-0.5"><BadgeCheck size={10} /> STAFF</span>}
                                        </div>
                                        <div className="text-xs text-stone-400 font-mono truncate">{v.phone}</div>
                                        <div className="flex sm:hidden gap-2 mt-1">
                                            <span className="text-xs font-bold text-orange-600">{v.month}h Mes</span>
                                            <span className="text-xs text-stone-400">{v.total}h Total</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="hidden sm:table-cell p-4"><ProgressRing radius={18} stroke={3} progress={v.month} total={12} isDev={isAdam} /></td>
                            <td className="hidden sm:table-cell p-4 text-center"><span className="font-bold text-stone-600 bg-stone-100 px-2 py-1 rounded-md">{isAdam ? '∞' : v.total + ' h'}</span></td>
                            <td className="p-4 text-right pr-6">
                                {v.phone !== S_PHONE && (
                                    <button onClick={() => setDeleteTarget(v)} className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-all"><Trash2 size={18} /></button>
                                )}
                            </td>
                        </tr>
                    )})}
                    </tbody>
                </table>
                </div>
            </Card>
        </>
      )}

      {/* ... [CALENDAR TAB (UNCHANGED)] ... */}
      {adminTab === 'calendar' && (
          <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                  <h3 className="font-bold text-stone-700">Selecciona un día</h3>
                  <Card className="p-4">{renderManagementCalendar()}</Card>
              </div>
              <div className="space-y-4">
                  <h3 className="font-bold text-stone-700">Asistencia {selectedDayDetail ? selectedDayDetail.toLocaleDateString('es-ES') : ''}</h3>
                  <Card className="p-4 h-[400px] overflow-y-auto custom-scrollbar">
                      {!selectedDayDetail ? (
                          <div className="h-full flex flex-col items-center justify-center text-stone-400"><MousePointerClick size={48} className="mb-2 opacity-50"/>Selecciona un día para gestionar</div>
                      ) : (
                          <div className="space-y-3">
                              {(() => {
                                  const dk = getLocalDateKey(selectedDayDetail);
                                  // CAMBIO: .flat() para soportar arrays
                                  const dayList = shifts[dk] ? Object.values(shifts[dk]).flat().sort((a,b) => a.hour - b.hour) : [];
                                  if (dayList.length === 0) return <div className="text-center py-10 text-stone-400 italic">No hay voluntarios este día.</div>;
                                  return dayList.map(s => (
                                      <div key={s.id} className="flex items-center justify-between p-3 border border-stone-100 rounded-xl bg-stone-50">
                                          <div className="min-w-0 flex-1 mr-2">
                                              <div className="flex items-center gap-2"><span className="font-mono font-bold text-orange-600">{s.hour}:00</span><span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${s.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : s.status === 'absent' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{s.status === 'confirmed' ? 'Asistió' : s.status === 'absent' ? 'Falta' : 'Pendiente'}</span></div>
                                              <div className="font-bold text-stone-700 truncate">{s.volunteerName}</div>
                                          </div>
                                          <div className="flex gap-1 shrink-0">
                                              <button onClick={()=>validate(s,'confirmed')} className={`p-2 rounded-lg transition-colors ${s.status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-white border hover:bg-emerald-50 text-emerald-600'}`}><Check size={16} /></button>
                                              <button onClick={()=>validate(s,'absent')} className={`p-2 rounded-lg transition-colors ${s.status === 'absent' ? 'bg-rose-500 text-white' : 'bg-white border hover:bg-rose-50 text-rose-600'}`}><XCircle size={16} /></button>
                                          </div>
                                      </div>
                                  ));
                              })()}
                          </div>
                      )}
                  </Card>
              </div>
          </div>
      )}

      {adminTab === 'directory' && (
        <Card className="overflow-hidden animate-in fade-in">
          <div className="p-6 border-b border-stone-200 bg-stone-50/50 flex justify-between items-center">
            <h3 className="font-bold text-stone-700 text-lg flex items-center gap-2"><Users size={20}/> Voluntarios ({volunteers.length})</h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            {/* GRID LAYOUT EN LUGAR DE TABLA */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {volunteers.map(v => {
                   const badge = getSeniorityBadge(v.joinedAt);
                   const isAdam = v.phone === S_PHONE;
                   return (
                   <button 
                      key={v.phone} 
                      onClick={() => setViewingVolunteer(v)} 
                      className={`p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center relative ${isAdam ? 'bg-stone-900 border-emerald-900' : 'bg-white border-stone-100'}`}
                   >
                      {/* BOTONES DE ACCIÓN FLOTANTES */}
                      {v.phone !== S_PHONE && (
                        <div className="absolute top-2 right-2 flex gap-1">
                            <div onClick={(e) => { e.stopPropagation(); setEditingVolunteer(v); setOriginalPhone(v.phone); }} className="bg-stone-50 p-1.5 rounded-full hover:bg-orange-50 text-stone-400 hover:text-orange-500 transition-colors"><Edit3 size={14} /></div>
                            <div onClick={(e) => { e.stopPropagation(); setDeleteTarget(v); }} className="bg-stone-50 p-1.5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-500 transition-colors"><Trash2 size={14} /></div>
                        </div>
                      )}

                      <div className="mb-2 mt-2">
                          <AvatarDisplay avatar={v.avatar} size="medium" isDev={isAdam} />
                      </div>
                      <div className={`font-bold text-sm truncate w-full flex items-center justify-center gap-1 ${isAdam ? 'text-emerald-400 font-mono' : 'text-stone-800'}`}>
                          {v.name}
                          {v.isWorker && <BadgeCheck size={14} className="text-indigo-600 fill-indigo-100" />}
                          {v.phone === S_PHONE && <Code size={14} />}
                      </div>
                      <div className={`mt-1 text-[9px] px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                      </div>
                      <div className="mt-2 flex gap-1 flex-wrap justify-center">
                        {(v.zones || ['salon']).map(z => {
                             const zInfo = Object.values(ZONES).find(zi => zi.label.toLowerCase() === z.toLowerCase()) || ZONES.salon;
                             return <div key={z} className={`w-2 h-2 rounded-full ${zInfo.color.split(' ')[0]}`} title={zInfo.label}></div>
                        })}
                      </div>
                   </button>
                   );
                })}
            </div>
            {volunteers.length === 0 && <div className="p-8 text-center text-stone-400 text-sm italic">No hay voluntarios registrados.</div>}
          </div>
        </Card>
      )}

      {/* Modal Visualizar Perfil Voluntario (Admin View) */}
      {viewingVolunteer && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
           
           {/* BOTÓN CERRAR EXTERNO */}
           <button 
              onClick={() => setViewingVolunteer(null)} 
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur p-2 rounded-full text-white transition-colors cursor-pointer z-[90]"
           >
              <XCircle size={32} />
           </button>

          <PremiumCard isDev={viewingVolunteer.phone === S_PHONE}>
              <div className="relative">
                  {/* Header Imagen */}
                  <div className="w-full h-32 bg-stone-200 relative z-0">
                      {viewingVolunteer.coverPhoto ? (
                          <img src={viewingVolunteer.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-200" />
                      )}
                  </div>
                  
                  {/* Contenido */}
                  <div className={`relative flex flex-col items-center pt-16 px-6 pb-8 ${viewingVolunteer.phone === S_PHONE ? 'text-stone-200' : 'text-stone-800'}`}>
                      <div className="relative -mt-16 mb-4 z-10">
                          <AvatarDisplay avatar={viewingVolunteer.avatar} size="large" isDev={viewingVolunteer.phone === S_PHONE} />
                      </div>
                      <h3 className={`text-2xl font-extrabold text-center flex items-center gap-2 ${viewingVolunteer.phone === S_PHONE ? 'text-white' : 'text-stone-800'}`}>
                        {viewingVolunteer.name}
                        {viewingVolunteer.phone === S_PHONE && <div className="bg-black text-white text-[10px] px-1.5 rounded font-mono border border-green-500 text-green-400 flex items-center gap-1"><Code size={10} /> DEV</div>}
                        {viewingVolunteer.isWorker && <BadgeCheck className="text-indigo-500 fill-indigo-100" size={24} />}
                      </h3>
                      
                      <p className={`text-sm font-mono mb-3 ${viewingVolunteer.phone === S_PHONE ? 'text-stone-500' : 'text-stone-500'}`}>{viewingVolunteer.phone}</p>
                      
                      {(() => {
                          const badge = getSeniorityBadge(viewingVolunteer.joinedAt);
                          const BadgeIcon = badge.icon;
                          return (
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                                  <BadgeIcon size={14} /> {badge.label}
                              </div>
                          );
                      })()}

                      <div className="flex gap-2 flex-wrap justify-center mt-4">
                          {(viewingVolunteer.zones || ['salon']).map(z => {
                              const zInfo = Object.values(ZONES).find(zi => zi.label.toLowerCase() === z.toLowerCase()) || ZONES.salon;
                              return <span key={z} className={`text-xs px-2 py-1 rounded-lg border font-bold ${zInfo.color}`}>{zInfo.label}</span>
                          })}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                          {(() => {
                              const stats = calculateVolunteerStats(viewingVolunteer.phone);
                              const isAdam = viewingVolunteer.phone === S_PHONE;
                              return (
                                  <>
                                      <div className={`p-4 rounded-2xl text-center border ${isAdam ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-100'}`}>
                                          <p className="text-xs text-stone-500 uppercase font-bold tracking-wide mb-1">Mes Actual</p>
                                          <p className={`text-3xl font-black ${isAdam ? 'text-emerald-500' : 'text-orange-500'}`}>{isAdam ? '∞' : stats.month + 'h'}</p>
                                      </div>
                                      <div className={`p-4 rounded-2xl text-center border ${isAdam ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-100'}`}>
                                          <p className="text-xs text-stone-500 uppercase font-bold tracking-wide mb-1">Total</p>
                                          <p className={`text-3xl font-black ${isAdam ? 'text-stone-300' : 'text-stone-700'}`}>{isAdam ? '∞' : stats.total + 'h'}</p>
                                      </div>
                                  </>
                              );
                          })()}
                      </div>

                      <div className={`mt-6 text-center w-full pt-4 border-t ${viewingVolunteer.phone === S_PHONE ? 'border-stone-800' : 'border-stone-100'}`}>
                          <p className="text-xs text-stone-400">
                              Registrado el {viewingVolunteer.joinedAt ? new Date(viewingVolunteer.joinedAt).toLocaleDateString('es-ES') : 'N/A'}
                          </p>
                      </div>
                  </div>
              </div>
          </PremiumCard>
        </div>
      )}

      {/* Modal Edición Voluntario (Zonas y Roles) */}
      {editingVolunteer && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-sm p-6 relative animate-in zoom-in-95 bg-white shadow-xl max-h-[90vh] overflow-y-auto">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <AvatarDisplay avatar={editingVolunteer.avatar} size="medium" />
                <div>
                   <h3 className="font-bold text-stone-800 text-lg">Editar Voluntario</h3>
                   <p className="text-xs text-stone-400">Permisos y Datos</p>
                </div>
             </div>
             
             {/* EDITAR DATOS BÁSICOS */}
             <div className="space-y-3 mb-6">
                <div>
                    <label className="text-xs font-bold text-stone-400 block mb-1">Nombre</label>
                    <input 
                        value={editingVolunteer.name} 
                        onChange={(e) => setEditingVolunteer({...editingVolunteer, name: e.target.value})}
                        className="w-full p-2 border border-stone-200 rounded-lg text-sm font-bold"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-stone-400 block mb-1">Teléfono (ID)</label>
                    <input 
                        value={editingVolunteer.phone} 
                        onChange={(e) => setEditingVolunteer({...editingVolunteer, phone: e.target.value})}
                        className="w-full p-2 border border-stone-200 rounded-lg text-sm font-mono"
                    />
                    {editingVolunteer.phone !== originalPhone && (
                        <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={10} />
                            Cambiar el teléfono migrará todo el historial.
                        </p>
                    )}
                </div>
                <div>
                      <label className="text-xs font-bold text-stone-400 block mb-1">Fecha de Ingreso</label>
                      <input 
                          type="date" 
                          value={editingVolunteer.joinedAt ? editingVolunteer.joinedAt.split('T')[0] : ''}
                          onChange={(e) => setEditingVolunteer({...editingVolunteer, joinedAt: new Date(e.target.value).toISOString()})}
                          className="w-full p-2 border border-stone-200 rounded-lg text-sm"
                      />
                  </div>
             </div>

             {/* ZONAS */}
             <div className="space-y-4 mb-6">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">Zonas Habilitadas</p>
                <div className="flex flex-col gap-2">
                   {Object.entries(ZONES).map(([key, info]) => {
                      const currentZones = editingVolunteer.zones || ['salon'];
                      const isActive = currentZones.includes(info.label);
                      return (
                        <button 
                          key={key}
                          onClick={() => {
                             let newZones;
                             if (isActive) {
                                newZones = currentZones.filter(z => z !== info.label);
                                if (newZones.length === 0) newZones = ['Salón']; // Fallback
                             } else {
                                newZones = [...currentZones, info.label];
                             }
                             setEditingVolunteer({...editingVolunteer, zones: newZones});
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${isActive ? `${info.color.replace('text-', 'border-').split(' ')[2]} bg-white` : 'border-stone-100 text-stone-400 grayscale'}`}
                        >
                           <span className={`font-bold ${isActive ? 'text-stone-800' : ''}`}>{info.label}</span>
                           {isActive && <CheckCircle size={18} className={info.color.split(' ')[1]} />}
                        </button>
                      );
                   })}
                </div>
             </div>

             {/* ROLES ESPECIALES */}
             <div className="space-y-4 mb-6 pt-4 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">Roles Especiales</p>
                
                {/* Checkbox Staff */}
                <button 
                  onClick={() => setEditingVolunteer({...editingVolunteer, isWorker: !editingVolunteer.isWorker})}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${editingVolunteer.isWorker ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-stone-100 text-stone-400'}`}
                >
                   <div className="flex items-center gap-2">
                     <BadgeCheck size={18} /> <span className="font-bold">Staff (Verificado)</span>
                   </div>
                   {editingVolunteer.isWorker && <CheckCircle size={18} className="text-indigo-600" />}
                </button>
             </div>

             <div className="flex gap-3">
               <Button variant="secondary" onClick={() => { setEditingVolunteer(null); setOriginalPhone(null); }} className="w-full justify-center">Cancelar</Button>
               <Button onClick={() => saveVolunteerChanges(editingVolunteer)} className="w-full justify-center">Guardar</Button>
             </div>
          </Card>
        </div>
      )}

      {/* Modal Borrado */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-sm p-6 relative animate-in zoom-in-95 bg-white shadow-xl">
            <div className="flex flex-col items-center text-center mb-6"><div className="bg-rose-100 p-3 rounded-full text-rose-600 mb-3"><Trash2 size={24} /></div><h3 className="text-lg font-bold text-stone-800">¿Eliminar Voluntario?</h3><p className="text-stone-500 text-sm mt-2">Vas a borrar a <strong className="text-stone-900">{deleteTarget.name}</strong> y todo su historial.</p></div>
            <div className="flex gap-3"><Button variant="secondary" onClick={() => setDeleteTarget(null)} className="w-full justify-center">Cancelar</Button><Button variant="danger" onClick={handleDeleteVolunteer} className="w-full justify-center">Eliminar</Button></div>
          </Card>
        </div>
      )}
    </div>
  );
}

// --- WIDGETS ---
const AdminModal = ({ onClose, onSubmit, pass, setPass, error }) => (
  <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
    <Card className="w-full max-w-sm p-8 relative animate-in zoom-in-95">
      <button onClick={onClose} className="absolute top-6 right-6 text-stone-300 hover:text-stone-500 transition-colors"><XCircle size={28}/></button>
      <div className="text-center mb-8"><div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-500"><Lock size={32} /></div><h3 className="text-2xl font-black text-stone-800">Coordinación</h3></div>
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="password" autoFocus value={pass} onChange={e=>setPass(e.target.value)} className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-center tracking-widest text-lg" placeholder="••••••••" />
        {error && <p className="text-rose-500 text-sm bg-rose-50 p-3 rounded-xl font-medium text-center">{error}</p>}
        <Button type="submit" className="w-full py-4 text-lg">Entrar</Button>
      </form>
    </Card>
  </div>
);

const CalendarWidget = ({ selectedDate, onChange, shifts, userPhone, isDev }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  useEffect(() => { if (selectedDate && !isNaN(selectedDate.getTime())) setCurrentMonth(selectedDate); }, [selectedDate]);
  
  const handleMonth = (inc) => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + inc, 1));
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() || 7) - 1;
  const today = new Date();
  today.setHours(0,0,0,0);

  return (
    <div className={`${isDev ? 'bg-stone-900 border-emerald-900' : 'bg-white border-stone-200'} rounded-2xl border overflow-hidden pb-4 shadow-sm w-full`}>
      <div className={`flex items-center justify-between p-4 ${isDev ? 'bg-black/50 text-emerald-500' : 'bg-orange-50/50'}`}>
        <button onClick={()=>handleMonth(-1)} className={`p-1 rounded-lg transition-all ${isDev ? 'hover:bg-emerald-900/30 text-emerald-600' : 'hover:bg-white text-stone-500'}`}><ChevronLeft size={20}/></button>
        <span className={`font-bold capitalize text-lg ${isDev ? 'text-emerald-400 font-mono' : 'text-stone-800'}`}>{currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
        <button onClick={()=>handleMonth(1)} className={`p-1 rounded-lg transition-all ${isDev ? 'hover:bg-emerald-900/30 text-emerald-600' : 'hover:bg-white text-stone-500'}`}><ChevronRight size={20}/></button>
      </div>
      <div className="px-4 pt-4">
        <div className="grid grid-cols-7 mb-2 text-center">{['L','M','X','J','V','S','D'].map(d=><span key={d} className={`text-xs font-bold uppercase ${isDev ? 'text-stone-600' : 'text-stone-400'}`}>{d}</span>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({length:startDay}).map((_,i)=><div key={`blank-${i}`}/>)}
          {Array.from({length:daysInMonth}).map((_,i)=>{
            const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i+1);
            
            // Validaciones de fecha
            const isSel = selectedDate && d.toDateString() === selectedDate.toDateString();
            const isPast = d < today;
            const dk = getLocalDateKey(d);
            
            // CAMBIO: .flat() para soportar arrays
            const dayShifts = shifts[dk] ? Object.values(shifts[dk]).flat() : [];
            const myShifts = dayShifts.filter(s => s.volunteerPhone === userPhone);
            const hasShift = myShifts.length > 0;
            const hasPending = myShifts.some(s => s.status === 'pending');
            const hasAbsent = myShifts.some(s => s.status === 'absent');
            
            let dotColor = isDev ? 'bg-emerald-400' : 'bg-emerald-500';
            if (hasAbsent && !hasPending) dotColor = 'bg-rose-500'; 
            else if (hasPending) dotColor = 'bg-amber-400';

            // Estilos
            let btnClass = "";
            if (isSel) {
                btnClass = isDev 
                    ? "bg-emerald-600 text-white shadow-[0_0_10px_#059669] z-10 border-emerald-400" 
                    : "bg-orange-500 text-white shadow-md z-10";
            } else if (isPast) {
                btnClass = isDev 
                    ? "text-stone-700 bg-stone-900 border-stone-800 cursor-not-allowed" 
                    : "text-stone-300 bg-stone-50 cursor-not-allowed";
            } else {
                btnClass = isDev 
                    ? "hover:bg-emerald-900/20 text-stone-400 bg-stone-900 border border-stone-800 hover:border-emerald-500/50" 
                    : "hover:bg-orange-50 text-stone-600 bg-white border border-stone-100";
            }
            
            if (d.toDateString() === today.toDateString() && !isSel) {
                btnClass += isDev ? " border-2 border-emerald-500/50 text-emerald-400" : " border-2 border-orange-300 text-orange-600";
            }

            return (
              <button key={i} onClick={() => !isPast && onChange(d)} disabled={isPast} className={`aspect-square w-full rounded-xl flex flex-col items-center justify-center relative text-sm font-bold transition-all border ${btnClass}`}>
                <span className="z-10">{i+1}</span>
                {hasShift && !isSel && !isPast && <div className={`absolute bottom-1.5 w-1.5 h-1.5 ${dotColor} rounded-full`}/>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
