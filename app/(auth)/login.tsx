import { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Text, Logo } from '@components/ui';
import { useAuthStore } from '@stores/authStore';
import type { UserRole, User } from '@/types';

const { height: SCREEN_H } = Dimensions.get('window');

const MOCK_USERS: Record<UserRole, User> = {
  student: {
    id: 'u1',
    name: 'Lucas Andrade',
    email: 'aluno@fiveapp.com',
    role: 'student',
    unitId: 'unit1',
    unitName: 'Five English — Vila Madalena',
  },
  teacher: {
    id: 'u2',
    name: 'Prof. Marina Costa',
    email: 'prof@fiveapp.com',
    role: 'teacher',
    unitId: 'unit1',
    unitName: 'Five English — Vila Madalena',
  },
  franchise_owner: {
    id: 'u3',
    name: 'Carlos Mendes',
    email: 'franqueado@fiveapp.com',
    role: 'franchise_owner',
    unitId: 'unit1',
    unitName: 'Five English — Vila Madalena',
  },
  admin: {
    id: 'u4',
    name: 'Admin Five',
    email: 'admin@fiveapp.com',
    role: 'admin',
  },
};

const ROLE_OPTIONS: { role: UserRole; label: string; color: string }[] = [
  { role: 'student',         label: 'Aluno',      color: '#4a9e50' },
  { role: 'teacher',         label: 'Professor',  color: '#1565C0' },
  { role: 'franchise_owner', label: 'Franqueado', color: '#7B5CF0' },
  { role: 'admin',           label: 'Admin',      color: '#00897B' },
];

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [rememberMe, setRememberMe] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = () => {
    login(MOCK_USERS[selectedRole]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── TOP: área escura com logo ── */}
      <LinearGradient
        colors={['#1a0a3a', '#2d1060', '#1a1030']}
        style={styles.topArea}
      >
        {/* Orbs decorativos */}
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />

        <SafeAreaView edges={['top']} style={styles.logoArea}>
          <Logo width={220} color="#fff" />
          <Text style={styles.tagline}>Seu ecossistema de inglês</Text>
        </SafeAreaView>
      </LinearGradient>

      {/* ── BOTTOM: sheet branca ── */}
      <KeyboardAvoidingView
        style={styles.sheetKav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.sheet}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sheetTitle}>Login</Text>

          {/* Input e-mail */}
          <View style={styles.inputGroup}>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seuemail@email.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                defaultValue={MOCK_USERS[selectedRole].email}
              />
            </View>

            {/* Input senha */}
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                defaultValue="••••••••"
              />
            </View>
          </View>

          {/* Lembrar de mim + Esqueci senha */}
          <View style={styles.optionsRow}>
            <Pressable style={styles.checkRow} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={styles.checkLabel}>Lembrar de mim</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.forgotLink}>Esqueci minha senha</Text>
            </Pressable>
          </View>

          {/* Botão login */}
          <Pressable onPress={handleLogin} style={styles.loginBtnWrap}>
            <LinearGradient
              colors={['#9B6DFF', '#7B3FF6', '#5B1BE5']}
              style={styles.loginBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.loginBtnText}>Entrar</Text>
            </LinearGradient>
          </Pressable>

          {/* Seletor de perfil (dev) */}
          <View style={styles.devSection}>
            <Text style={styles.devLabel}>🛠 Dev — selecione o perfil</Text>
            <View style={styles.roleRow}>
              {ROLE_OPTIONS.map(({ role, label, color }) => (
                <Pressable
                  key={role}
                  onPress={() => setSelectedRole(role)}
                  style={[
                    styles.roleBtn,
                    selectedRole === role && { backgroundColor: color + '18', borderColor: color },
                  ]}
                >
                  <Text style={[styles.roleBtnText, selectedRole === role && { color }]}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1a0a3a' },

  // ── Top área ──
  topArea: {
    height: SCREEN_H * 0.42,
    overflow: 'hidden',
  },
  orb: { position: 'absolute', borderRadius: 999, opacity: 0.3 },
  orb1: { width: 260, height: 260, backgroundColor: '#7B5CF0', top: -80, right: -60 },
  orb2: { width: 160, height: 160, backgroundColor: '#4a9e50', bottom: 10, left: -40 },

  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  tagline: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },

  // ── Sheet branca ──
  sheetKav: { flex: 1 },
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
  },
  sheetContent: {
    padding: 28,
    paddingTop: 32,
    gap: 20,
  },
  sheetTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 32,
    color: '#111827',
    marginBottom: 4,
  },

  // ── Inputs ──
  inputGroup: { gap: 12 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#111827',
    paddingVertical: 14,
  },

  // ── Opções ──
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#7B5CF0',
    borderColor: '#7B5CF0',
  },
  checkLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#6b7280',
  },
  forgotLink: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#7B5CF0',
    textDecorationLine: 'underline',
  },

  // ── Botão login ──
  loginBtnWrap: { borderRadius: 14, overflow: 'hidden' },
  loginBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  loginBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.3,
  },

  // ── Dev selector ──
  devSection: { gap: 10, marginTop: 4 },
  devLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  roleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  roleBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#9ca3af',
  },
});
