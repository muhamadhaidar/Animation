import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { userProfile, updateUserProfile } from '@/utils/dataStore';
import { LinearGradient } from 'expo-linear-gradient';
import ScaleButton from '@/components/ScaleButton'; 

export default function Profile() {
    const isFocused = useIsFocused();
    const [profile, setProfile] = useState(userProfile);
    const [theme, setTheme] = useState(userProfile.theme);

    const [modalVisible, setModalVisible] = useState(false);
    
    // STATE FORM EDIT
    const [editName, setEditName] = useState(userProfile.name);
    const [editJob, setEditJob] = useState(userProfile.job);
    // Tambah state umur (diubah ke string biar bisa masuk TextInput)
    const [editAge, setEditAge] = useState(userProfile.age ? String(userProfile.age) : ''); 
    const [editGender, setEditGender] = useState(userProfile.gender);

    useEffect(() => { 
        if (isFocused) {
            setProfile({ ...userProfile });
            setTheme(userProfile.theme);
            // Reset form state saat profil dimuat ulang
            setEditName(userProfile.name);
            setEditJob(userProfile.job);
            setEditAge(String(userProfile.age));
            setEditGender(userProfile.gender);
        }
    }, [isFocused]);

    const toggleTheme = (val: boolean) => {
        const newTheme = val ? 'dark' : 'light';
        setTheme(newTheme);
        updateUserProfile({ theme: newTheme });
    };

    const isDark = theme === 'dark';
    const bgColor = isDark ? ['#0f172a', '#111827'] : ['#f8fafc', '#ffffff'];
    const textColor = isDark ? '#fff' : '#1e293b';
    const subTextColor = isDark ? '#94a3b8' : '#64748b';
    const cardBg = isDark ? 'rgba(30, 41, 59, 0.6)' : '#ffffff';
    const borderColor = isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0';

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1 });
        if (!result.canceled) {
            updateUserProfile({ image: result.assets[0].uri });
            setProfile({ ...profile, image: result.assets[0].uri });
        }
    };

    const handleSaveInfo = () => {
        // Simpan semua data termasuk umur
        updateUserProfile({ 
            name: editName, 
            job: editJob, 
            age: editAge, // Simpan umur
            gender: editGender 
        });
        
        setProfile({ 
            ...profile, 
            name: editName, 
            job: editJob, 
            age: editAge, 
            gender: editGender 
        });
        setModalVisible(false);
    };

    return (
        <LinearGradient colors={bgColor} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: profile.image }} style={styles.avatar} />
                        <ScaleButton style={styles.editIcon} onPress={pickImage}>
                            <Ionicons name="camera" size={20} color="white" />
                        </ScaleButton>
                    </View>
                    <Text style={[styles.name, { color: textColor }]}>{profile.name}, {profile.age}</Text>
                    <Text style={[styles.job, { color: subTextColor }]}>{profile.job}</Text>
                </View>

                {/* THEME SWITCHER */}
                <View style={[styles.menuItem, { backgroundColor: cardBg, borderColor, marginHorizontal: 20 }]}>
                     <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9' }]}>
                        <Ionicons name={isDark ? "moon" : "sunny"} size={22} color={isDark ? "#fbbf24" : "#f59e0b"} />
                    </View>
                    <Text style={[styles.menuText, { color: textColor }]}>Dark Mode</Text>
                    <Switch 
                        trackColor={{ false: "#767577", true: "#38bdf8" }}
                        thumbColor={isDark ? "#fff" : "#f4f3f4"}
                        onValueChange={toggleTheme}
                        value={isDark}
                    />
                </View>

                {/* MENU ITEMS */}
                <View style={styles.menuContainer}>
                    <ScaleButton style={[styles.menuItem, { backgroundColor: cardBg, borderColor }]} onPress={() => setModalVisible(true)}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.1)' }]}>
                            <Ionicons name="person" size={22} color="#38bdf8" />
                        </View>
                        <Text style={[styles.menuText, { color: textColor }]}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={20} color={subTextColor} />
                    </ScaleButton>

                    <ScaleButton style={[styles.menuItem, { backgroundColor: cardBg, borderColor }]}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
                            <Ionicons name="settings" size={22} color="#ec4899" />
                        </View>
                        <Text style={[styles.menuText, { color: textColor }]}>Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color={subTextColor} />
                    </ScaleButton>
                </View>
            </ScrollView>

            {/* Modal Edit */}
            <Modal animationType="slide" visible={modalVisible} transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e293b' : '#fff' }]}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>Edit Profile</Text>
                        
                        {/* Input Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput 
                                style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: textColor, borderColor }]} 
                                value={editName} 
                                onChangeText={setEditName} 
                            />
                        </View>

                        {/* Input Job */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Job</Text>
                            <TextInput 
                                style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: textColor, borderColor }]} 
                                value={editJob} 
                                onChangeText={setEditJob} 
                            />
                        </View>

                        {/* Input Age (BARU) */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Age</Text>
                            <TextInput 
                                style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: textColor, borderColor }]} 
                                value={editAge} 
                                onChangeText={setEditAge} 
                                keyboardType="numeric" // Keyboard angka
                                maxLength={3}
                            />
                        </View>
                        
                        {/* Input Gender */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Gender</Text> 
                            <View style={styles.genderRow}>
                                <ScaleButton 
                                    style={[
                                        styles.genderBtn, 
                                        editGender === 'female' && styles.genderActive, 
                                        { borderColor, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }
                                    ]} 
                                    onPress={() => setEditGender('female')}
                                >
                                    <Text style={[
                                        styles.genderText, 
                                        editGender === 'female' && styles.genderTextActive
                                    ]}>
                                        Female
                                    </Text>
                                </ScaleButton>

                                <ScaleButton 
                                    style={[
                                        styles.genderBtn, 
                                        editGender === 'male' && styles.genderActive, 
                                        { borderColor, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }
                                    ]} 
                                    onPress={() => setEditGender('male')}
                                >
                                    <Text style={[
                                        styles.genderText, 
                                        editGender === 'male' && styles.genderTextActive
                                    ]}>
                                        Male
                                    </Text>
                                </ScaleButton>
                            </View>
                        </View>

                        {/* Save Button */}
                        <ScaleButton onPress={handleSaveInfo} style={styles.saveBtn}>
                            <Text style={styles.saveText}>Save Changes</Text>
                        </ScaleButton>
                        
                        {/* Cancel Button */}
                        <ScaleButton onPress={() => setModalVisible(false)} style={{ marginTop: 15, padding: 10 }}>
                            <Text style={{ color: subTextColor }}>Cancel</Text>
                        </ScaleButton>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
    avatarWrapper: { marginBottom: 15 },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#38bdf8' },
    editIcon: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#2563eb', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#0f172a' },
    name: { fontSize: 24, fontWeight: 'bold' },
    job: { fontSize: 16, marginTop: 5 },
    menuContainer: { paddingHorizontal: 20, marginTop: 20 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuText: { flex: 1, fontSize: 16, fontWeight: '600' },
    
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    inputGroup: { width: '100%', marginBottom: 15 },
    label: { color: '#94a3b8', marginBottom: 8, fontSize: 12, fontWeight: 'bold' },
    input: { padding: 15, borderRadius: 12, borderWidth: 1 },
    genderRow: { flexDirection: 'row', gap: 10 },
    genderBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
    genderActive: { borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)' },
    genderText: { color: '#64748b', fontWeight: 'bold' },
    genderTextActive: { color: '#38bdf8' },
    saveBtn: { width: '100%', backgroundColor: '#38bdf8', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    saveText: { color: '#0f172a', fontWeight: 'bold' }
});