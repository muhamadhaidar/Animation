// utils/dataStore.ts

// --- 1. DATA USER & CONFIG ---
export let userProfile = {
    name: "Michael",
    age: 29,
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    gender: "male",
    job: "Photographer",
    theme: 'dark' // 'dark' | 'light'
};

// --- SIMPLE EVENT LISTENER FOR THEME ---
type Listener = () => void;
let listeners: Listener[] = [];

export const subscribeToTheme = (listener: Listener) => {
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
};

export const updateUserProfile = (newData: any) => {
    userProfile = { ...userProfile, ...newData };
    // Jika theme berubah, beri tahu semua listener (untuk _layout.tsx)
    if (newData.theme) {
        listeners.forEach(l => l());
    }
};

// --- 2. DATABASE KARTU ---
export const FEMALE_CARDS = [
    { id: 101, name: 'Emily', age: 22, desc: 'Art student 🎨', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800', isMatch: true },
    { id: 102, name: 'Sarah', age: 24, desc: 'Travel enthusiast ✈️', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800', isMatch: true },
    { id: 103, name: 'Jessica', age: 25, desc: 'Coffee addict ☕', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800', isMatch: true },
    { id: 104, name: 'Anna', age: 21, desc: 'Music lover 🎵', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800', isMatch: true },
    { id: 105, name: 'Elsa', age: 23, desc: 'Nature lover 🌲', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800', isMatch: true },
];

export const MALE_CARDS = [
    { id: 201, name: 'David', age: 26, desc: 'Photographer 📷', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800', isMatch: true },
    { id: 202, name: 'James', age: 28, desc: 'Chef 🍳', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800', isMatch: true },
    { id: 203, name: 'Robert', age: 25, desc: 'Gym rat 💪', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800', isMatch: true },
    { id: 204, name: 'John', age: 27, desc: 'Musician 🎸', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800', isMatch: true },
    { id: 205, name: 'Michael', age: 24, desc: 'Designer 🎨', image: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=800', isMatch: true },
];

// --- 3. STORAGE CHAT ---
const dbStorage = {
    male: { history: {} as Record<string, any[]>, profiles: {} as Record<string, any> },
    female: { history: {} as Record<string, any[]>, profiles: {} as Record<string, any> }
};

const getCurrentDB = () => userProfile.gender === 'male' ? dbStorage.male : dbStorage.female;

export const addMatch = (profile: any) => {
    const db = getCurrentDB();
    if (!db.history[profile.name]) {
        db.profiles[profile.name] = { name: profile.name, img: profile.image };
        db.history[profile.name] = []; 
    }
};

export const sendMessageToUser = (userProfileInput: any, text: string) => {
    const db = getCurrentDB();
    const { name, image } = userProfileInput;
    if (!db.profiles[name]) db.profiles[name] = { name, img: image };
    if (!db.history[name]) db.history[name] = [];
    db.history[name].push({ id: Date.now().toString(), text, sender: 'me', timestamp: new Date() });
};

export const getActiveChats = () => {
    const db = getCurrentDB();
    return Object.keys(db.history).map(name => {
        const msgs = db.history[name];
        const lastMsg = msgs[msgs.length - 1]; 
        const profile = db.profiles[name];
        const displayText = msgs.length === 0 ? "It's a Match! 💖" : (lastMsg.sender === 'me' ? `You: ${lastMsg.text}` : lastMsg.text);
        return {
            id: name, name: name, img: profile?.img,
            lastMessage: displayText, time: lastMsg?.timestamp || new Date(), isNew: msgs.length === 0 
        };
    }).reverse();
};

export const getMessagesForUser = (name: string) => getCurrentDB().history[name] || [];