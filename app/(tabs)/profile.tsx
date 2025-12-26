import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: 'https://randomuser.me/api/portraits/men/85.jpg' }} 
                        style={styles.profileImage} 
                    />
                    <View style={styles.percentBadge}>
                        <Text style={styles.percentText}>80%</Text>
                    </View>
                </View>
                <Text style={styles.name}>Michael, 29</Text>
                <Text style={styles.job}>Photographer</Text>

                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.roundButtonSmall}>
                        <Ionicons name="settings-sharp" size={24} color="#B0B0B0" />
                        <Text style={styles.btnLabel}>SETTINGS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButtonLarge}>
                        <Ionicons name="pencil" size={30} color="#fff" />
                        <Text style={styles.btnLabelLarge}>EDIT INFO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButtonSmall}>
                        <Ionicons name="shield-checkmark" size={24} color="#B0B0B0" />
                        <Text style={styles.btnLabel}>SAFETY</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F5F7' },
    header: { alignItems: 'center', backgroundColor: '#fff', paddingBottom: 40, borderBottomLeftRadius: 50, borderBottomRightRadius: 50, shadowColor: "#000", shadowOpacity: 0.05, elevation: 5 },
    imageContainer: { marginTop: 40, marginBottom: 15 },
    profileImage: { width: 120, height: 120, borderRadius: 60 },
    percentBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FE3C72', padding: 5, borderRadius: 15 },
    percentText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    name: { fontSize: 24, fontWeight: 'bold' },
    job: { color: 'gray', fontSize: 16, marginBottom: 20 },
    actionsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 20 },
    roundButtonSmall: { alignItems: 'center', justifyContent: 'center', gap: 5 },
    roundButtonLarge: { alignItems: 'center', justifyContent: 'center', position: 'relative', top: 10, backgroundColor: '#FE3C72', width: 60, height: 60, borderRadius: 30 },
    btnLabel: { fontSize: 10, color: '#B0B0B0', marginTop: 5, fontWeight: 'bold' },
    btnLabelLarge: { fontSize: 10, color: '#B0B0B0', marginTop: 70, fontWeight: 'bold', position: 'absolute', width: 100, textAlign: 'center' },
});