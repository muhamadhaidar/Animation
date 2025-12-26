// utils/dataStore.ts

// 1. Matches List (Orang yang sudah match tapi belum chat)
// KITA KOSONGKAN ARRAY INI
export let matchesList: any[] = []; 

// 2. Chat History (Menyimpan semua pesan)
export let chatHistory: Record<string, any[]> = {};

// 3. Profiles Data (Menyimpan data nama & foto user yang sedang chat)
export let chatProfiles: Record<string, any> = {};


// --- FUNGSI-FUNGSI LOGIC ---

// Tambah Match Baru (Dipanggil saat Swipe Kanan & Match)
export const addMatch = (profile: any) => {
    // Cek agar tidak duplikat (baik di matchesList maupun chatHistory)
    const inMatches = matchesList.find(m => m.name === profile.name);
    const inChat = chatHistory[profile.name];

    if (!inMatches && !inChat) {
        matchesList.unshift({
            id: profile.id,
            name: profile.name,
            img: profile.image
        });
        console.log(`Added ${profile.name} to New Matches`);
    }
};

// Kirim Pesan (Pindahkan dari 'New Matches' ke 'Messages List')
export const sendMessageToUser = (userProfile: any, text: string) => {
    const { name, image } = userProfile;

    // 1. Hapus user ini dari daftar "New Matches" (karena sudah mulai chat)
    matchesList = matchesList.filter(m => m.name !== name);

    // 2. Simpan Profil User (jika belum ada)
    if (!chatProfiles[name]) {
        chatProfiles[name] = { name, img: image };
    }

    // 3. Tambahkan Pesan ke History
    if (!chatHistory[name]) {
        chatHistory[name] = [];
    }

    chatHistory[name].push({
        id: Date.now().toString(),
        text: text,
        sender: 'me',
        timestamp: new Date()
    });
};

// Ambil List Chat Aktif (Untuk ditampilkan di Tab Messages)
export const getActiveChats = () => {
    return Object.keys(chatHistory).map(name => {
        const msgs = chatHistory[name];
        const lastMsg = msgs[msgs.length - 1]; // Ambil pesan terakhir
        const profile = chatProfiles[name];

        return {
            id: name,
            name: name,
            img: profile?.img,
            lastMessage: lastMsg?.text || 'Sent a message',
            time: lastMsg?.timestamp
        };
    });
};

// Ambil Full History Chat spesifik user (Untuk Screen Chat Room)
export const getMessagesForUser = (name: string) => {
    return chatHistory[name] || [];
};