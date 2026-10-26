import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

type Props = {
    onBack: () => void; onOpenProfile: () => void; onUpdateSchedule: () => void;
    onOpenAI: () => void; onOpenNotifications: () => void;
    onOpenConnectedAccounts: () => void; onLogout: () => void;
    onLoadDemoData: () => void; onClearDemoData: () => void;
};
type ItemProps = { icon: string; title: string; subtitle: string; tint: string; onPress: () => void };
function Item({ icon, title, subtitle, tint, onPress }: ItemProps) {
    return <TouchableOpacity style={s.item} onPress={onPress} accessibilityRole="button">
        <View style={[s.iconBox, { backgroundColor: tint }]}><Text style={s.icon}>{icon}</Text></View>
        <View style={{ flex: 1 }}><Text style={s.itemTitle}>{title}</Text><Text style={s.itemSubtitle}>{subtitle}</Text></View>
        <Text style={s.chevron}>›</Text>
    </TouchableOpacity>;
}
export default function MoreScreen(p: Props) {
    function confirmRemove() {
        const title = 'Remove sample assignments?';
        const message = 'Your own assignments will stay. Only sample assignments will be removed.';
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) p.onClearDemoData();
        } else Alert.alert(title, message, [{ text: 'Cancel', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: p.onClearDemoData }]);
    }
    function support() {
        if (Platform.OS === 'web') { if (typeof window !== 'undefined') window.alert('Help & support is coming soon.'); }
        else Alert.alert('Help & support', 'Help & support is coming soon.');
    }
    return <View style={s.screen}><ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <View style={s.top}><TouchableOpacity onPress={p.onBack}><Text style={s.back}>← Back</Text></TouchableOpacity><Text style={s.logo}>FluxUP</Text></View>
        <Text style={s.eyebrow}>YOUR SPACE</Text><Text style={s.heading}>Make FluxUP yours.</Text>
        <Text style={s.subtitle}>Your schedule, your preferences, your way.</Text>
        <TouchableOpacity style={s.profile} onPress={p.onOpenProfile}><View style={s.avatar}><Text style={s.avatarText}>T</Text></View><View style={{ flex: 1 }}><Text style={s.itemTitle}>My profile</Text><Text style={s.itemSubtitle}>View and edit your student information</Text></View><Text style={s.chevron}>›</Text></TouchableOpacity>
        <Text style={s.section}>PLANNING & ORGANIZATION</Text><View style={s.group}>
            <Item icon="▦" title="Update my schedule" subtitle="Classes, periods, and commitments" tint={colors.blocks.blue} onPress={p.onUpdateSchedule} />
            <Item icon="✦" title="FluxUP AI assistant" subtitle="Get help organizing your day" tint={colors.blocks.purple} onPress={p.onOpenAI} />
        </View>
        <Text style={s.section}>PREFERENCES</Text><View style={s.group}>
            <Item icon="♧" title="Notifications" subtitle="Reminders and deadline alerts" tint={colors.blocks.yellow} onPress={p.onOpenNotifications} />
            <Item icon="↗" title="Connected accounts" subtitle="Manage Google Classroom" tint={colors.blocks.green} onPress={p.onOpenConnectedAccounts} />
        </View>
        <Text style={s.section}>DEMO & DATA</Text><View style={s.group}>
            <Item icon="▤" title="Load sample assignments" subtitle="Show examples inside your classes" tint="#E4F3EB" onPress={p.onLoadDemoData} />
            <Item icon="↺" title="Remove sample assignments" subtitle="Leave your own assignments untouched" tint="#FBEAE6" onPress={confirmRemove} />
        </View>
        <Text style={s.note}>Sample assignments are demonstration data, not Google Classroom imports.</Text>
        <Text style={s.section}>SUPPORT</Text><View style={s.group}><Item icon="?" title="Help & support" subtitle="Questions and feedback" tint={colors.blocks.pink} onPress={support} /></View>
        <TouchableOpacity style={s.logout} onPress={p.onLogout}><Text style={s.logoutText}>Log out</Text></TouchableOpacity>
        <Text style={s.footer}>FluxUP · Version 1.0 Prototype</Text>
    </ScrollView></View>;
}
const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F3F3EF', alignItems: 'center' }, scroll: { width: '100%', maxWidth: 430, backgroundColor: colors.background },
    content: { paddingHorizontal: 26, paddingTop: 30, paddingBottom: 45 }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    back: { color: colors.text.secondary, fontSize: 14, fontWeight: '600' }, logo: { color: colors.brand.primary, fontSize: 27, fontWeight: '800' },
    eyebrow: { color: colors.brand.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.3, marginBottom: 12 },
    heading: { color: colors.text.primary, fontSize: 31, fontWeight: '800', marginBottom: 12 }, subtitle: { color: colors.text.secondary, fontSize: 14, marginBottom: 27 },
    profile: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E4F3EB', borderRadius: 19, padding: 18, marginBottom: 30 },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.brand.primary, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, avatarText: { color: '#FFF', fontSize: 21, fontWeight: '800' },
    section: { color: colors.text.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 },
    group: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 17, paddingHorizontal: 15, marginBottom: 24 },
    item: { flexDirection: 'row', alignItems: 'center', minHeight: 68, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
    iconBox: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, icon: { color: colors.text.primary, fontSize: 19, fontWeight: '700' },
    itemTitle: { color: colors.text.primary, fontSize: 13, fontWeight: '800', marginBottom: 4 }, itemSubtitle: { color: colors.text.secondary, fontSize: 11, lineHeight: 16 }, chevron: { color: colors.text.muted, fontSize: 23, marginLeft: 8 },
    note: { color: colors.text.muted, fontSize: 10, lineHeight: 16, marginTop: -13, marginBottom: 27 },
    logout: { borderWidth: 1, borderColor: '#F0CFCB', backgroundColor: '#FFF4F2', borderRadius: 14, alignItems: 'center', padding: 16 }, logoutText: { color: '#BD6059', fontWeight: '800' }, footer: { color: colors.text.muted, textAlign: 'center', marginTop: 30, fontSize: 11 },
});
