import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput,
  StyleSheet, Animated, Modal, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useStaggeredEntry } from '@hooks/useStaggeredEntry';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentNote { date: string; teacher: string; note: string; type: 'alert' | 'info' | 'success' }
interface Grade { subject: string; score: number; color: string }

interface Student {
  id: string; name: string; avatar: string; class: string;
  status: 'active' | 'inactive'; since: string;
  attendance: number; totalClasses: number;
  grades: Grade[];
  notes: StudentNote[];
}

interface TeacherNote { date: string; className: string; note: string; type: 'alert' | 'info' | 'success' }

interface Teacher {
  id: string; name: string; avatar: string;
  classCount: number; studentCount: number; since: string;
  avgScore: number;
  classes: string[];
  notes: TeacherNote[];
}

interface ClassStudent { id: string; name: string; avatar: string; status: 'active' | 'inactive' }
interface ClassNote { date: string; teacher: string; note: string; type: 'alert' | 'info' | 'success' }

interface ClassItem {
  id: string; name: string; teacher: string; students: number;
  capacity: number; days: string; room: string; book: string;
  studentList: ClassStudent[];
  notes: ClassNote[];
}

interface ReposicaoRequest {
  id: string; studentName: string; studentAvatar: string;
  className: string; requestedDate: string; requestedTime: string;
  reason: string; status: 'pending' | 'approved' | 'rejected';
}

interface Convenio {
  id: string; name: string; category: string; discount: string;
  address: string; icon: string; color: string; active: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TABS = ['Alunos', 'Professores', 'Turmas', 'Reposições', 'Convênios'];

const NOTE_CFG = {
  alert:   { icon: 'warning-outline' as const, color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  info:    { icon: 'information-circle-outline' as const, color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  success: { icon: 'checkmark-circle-outline' as const, color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
};

const STUDENTS: Student[] = [
  { id: 'a1', name: 'Ana Clara Silva', avatar: 'https://i.pravatar.cc/150?img=20', class: 'Book 3 — 19h', status: 'active', since: 'Jan 2025', attendance: 20, totalClasses: 22,
    grades: [{ subject: 'Listening', score: 8.5, color: '#7B5CF0' }, { subject: 'Speaking', score: 9.2, color: '#10B981' }, { subject: 'Writing', score: 7.8, color: '#F59E0B' }],
    notes: [
      { date: '25/03', teacher: 'Prof. Marina', note: 'Excelente participação oral. Progrediu muito em Speaking.', type: 'success' },
      { date: '20/03', teacher: 'Prof. Marina', note: 'Homework entregue com atraso. Conversar sobre organização.', type: 'info' },
    ],
  },
  { id: 'a2', name: 'Lucas Almeida', avatar: 'https://i.pravatar.cc/150?img=10', class: 'Book 1 — 08h', status: 'active', since: 'Mar 2024', attendance: 21, totalClasses: 22,
    grades: [{ subject: 'Listening', score: 9.0, color: '#7B5CF0' }, { subject: 'Speaking', score: 9.5, color: '#10B981' }, { subject: 'Writing', score: 9.0, color: '#F59E0B' }],
    notes: [
      { date: '24/03', teacher: 'Prof. Marina', note: 'Writing nota 9.5 — excelente evolução. Desafiar com exercícios avançados.', type: 'success' },
    ],
  },
  { id: 'a3', name: 'Pedro Santos', avatar: 'https://i.pravatar.cc/150?img=15', class: 'Book 3 — 19h', status: 'inactive', since: 'Jun 2024', attendance: 14, totalClasses: 22,
    grades: [{ subject: 'Listening', score: 6.0, color: '#7B5CF0' }, { subject: 'Speaking', score: 5.5, color: '#10B981' }, { subject: 'Writing', score: 6.2, color: '#F59E0B' }],
    notes: [
      { date: '25/03', teacher: 'Prof. Marina', note: '5ª falta consecutiva. Risco de evasão — contatar responsável.', type: 'alert' },
      { date: '18/03', teacher: 'Prof. Marina', note: 'Não trouxe material. Disperso durante a aula.', type: 'alert' },
      { date: '10/03', teacher: 'Prof. Marina', note: 'Homework não entregue pela 3ª vez.', type: 'alert' },
    ],
  },
  { id: 'a4', name: 'Julia Martins', avatar: 'https://i.pravatar.cc/150?img=25', class: 'Book 2 — 17h', status: 'active', since: 'Ago 2024', attendance: 19, totalClasses: 22,
    grades: [{ subject: 'Listening', score: 7.5, color: '#7B5CF0' }, { subject: 'Speaking', score: 8.0, color: '#10B981' }, { subject: 'Writing', score: 7.0, color: '#F59E0B' }],
    notes: [
      { date: '22/03', teacher: 'Prof. Carlos', note: 'Dificuldade com verbos irregulares. Sugerir reforço.', type: 'info' },
    ],
  },
  { id: 'a5', name: 'Marcos Torres', avatar: 'https://i.pravatar.cc/150?img=30', class: 'Book 2 — 17h', status: 'active', since: 'Set 2025', attendance: 22, totalClasses: 22,
    grades: [{ subject: 'Listening', score: 8.0, color: '#7B5CF0' }, { subject: 'Speaking', score: 8.5, color: '#10B981' }, { subject: 'Writing', score: 8.0, color: '#F59E0B' }],
    notes: [],
  },
  { id: 'a6', name: 'Beatriz Ferreira', avatar: 'https://i.pravatar.cc/150?img=32', class: 'Book 1 — 08h', status: 'active', since: 'Fev 2025', attendance: 20, totalClasses: 22,
    grades: [{ subject: 'Listening', score: 9.0, color: '#7B5CF0' }, { subject: 'Speaking', score: 9.5, color: '#10B981' }, { subject: 'Writing', score: 9.2, color: '#F59E0B' }],
    notes: [
      { date: '24/03', teacher: 'Prof. Marina', note: 'Melhor aluna da turma. 100% de presença e todas as entregas em dia.', type: 'success' },
    ],
  },
];

const TEACHERS: Teacher[] = [
  { id: 'p1', name: 'Prof. Marina Costa', avatar: 'https://i.pravatar.cc/150?img=5', classCount: 3, studentCount: 37, since: '2022', avgScore: 8.4,
    classes: ['Book 3 — 19h', 'Book 1 — 08h', 'Book 1 — Turma D'],
    notes: [
      { date: '25/03', className: 'Book 3 — 19h', note: 'Pedro S. com 5ª falta. Risco de evasão.', type: 'alert' },
      { date: '24/03', className: 'Book 1 — 08h', note: 'Aula excelente. 100% presença, todos entregaram HW.', type: 'success' },
      { date: '21/03', className: 'Book 3 — 19h', note: 'Simulado oral. Dificuldade com question tags.', type: 'info' },
    ],
  },
  { id: 'p2', name: 'Prof. Carlos Souza', avatar: 'https://i.pravatar.cc/150?img=12', classCount: 2, studentCount: 25, since: '2023', avgScore: 7.6,
    classes: ['Book 2 — 17h', 'Book 2 — Reposição'],
    notes: [
      { date: '25/03', className: 'Book 2 — 17h', note: 'Apenas 6/10 presentes. Reforçar comunicação.', type: 'info' },
      { date: '23/03', className: 'Book 2 — 17h', note: 'Camila R. nota 5.0 em Speaking. Muito abaixo.', type: 'alert' },
    ],
  },
];

const CLASSES: ClassItem[] = [
  { id: 't1', name: 'Book 1 — 08h', teacher: 'Prof. Marina', students: 15, capacity: 18, days: 'Ter / Qui', room: 'Sala 2', book: 'Book 1',
    studentList: [
      { id: 's1', name: 'Lucas Almeida', avatar: 'https://i.pravatar.cc/150?img=10', status: 'active' },
      { id: 's2', name: 'Beatriz Ferreira', avatar: 'https://i.pravatar.cc/150?img=32', status: 'active' },
      { id: 's3', name: 'Fernanda O.', avatar: 'https://i.pravatar.cc/150?img=44', status: 'active' },
    ],
    notes: [
      { date: '24/03', teacher: 'Prof. Marina', note: '100% de presença. Vocabulário Unit 5 bem assimilado.', type: 'success' },
    ],
  },
  { id: 't2', name: 'Book 2 — 17h', teacher: 'Prof. Carlos', students: 10, capacity: 15, days: 'Qua / Sex', room: 'Sala 1', book: 'Book 2',
    studentList: [
      { id: 's4', name: 'Julia Martins', avatar: 'https://i.pravatar.cc/150?img=25', status: 'active' },
      { id: 's5', name: 'Marcos Torres', avatar: 'https://i.pravatar.cc/150?img=30', status: 'active' },
      { id: 's6', name: 'Eduardo M.', avatar: 'https://i.pravatar.cc/150?img=53', status: 'active' },
    ],
    notes: [
      { date: '25/03', teacher: 'Prof. Carlos', note: 'Apenas 6/10 presentes. Aplicar recuperação na sexta.', type: 'alert' },
      { date: '21/03', teacher: 'Prof. Carlos', note: 'Dificuldade geral com Simple Past irregulares.', type: 'info' },
    ],
  },
  { id: 't3', name: 'Book 3 — 19h', teacher: 'Prof. Marina', students: 12, capacity: 12, days: 'Seg / Qua / Sex', room: 'Sala 3', book: 'Book 3',
    studentList: [
      { id: 's7', name: 'Ana Clara Silva', avatar: 'https://i.pravatar.cc/150?img=20', status: 'active' },
      { id: 's8', name: 'Pedro Santos', avatar: 'https://i.pravatar.cc/150?img=15', status: 'inactive' },
      { id: 's9', name: 'Camila R.', avatar: 'https://i.pravatar.cc/150?img=47', status: 'active' },
    ],
    notes: [
      { date: '25/03', teacher: 'Prof. Marina', note: 'Avançou até p. 34. Dificuldade com Present Perfect.', type: 'info' },
      { date: '21/03', teacher: 'Prof. Marina', note: 'Simulado oral. Question tags problemáticos.', type: 'info' },
    ],
  },
];

const INITIAL_REPOSICOES: ReposicaoRequest[] = [
  { id: 'rp1', studentName: 'Pedro Santos', studentAvatar: 'https://i.pravatar.cc/150?img=15', className: 'Book 3 — 19h', requestedDate: '29/03 — Sáb', requestedTime: '09:00', reason: 'Viagem familiar', status: 'pending' },
  { id: 'rp2', studentName: 'Julia Martins', studentAvatar: 'https://i.pravatar.cc/150?img=25', className: 'Book 2 — 17h', requestedDate: '29/03 — Sáb', requestedTime: '10:00', reason: 'Consulta médica', status: 'pending' },
  { id: 'rp3', studentName: 'Eduardo M.', studentAvatar: 'https://i.pravatar.cc/150?img=53', className: 'Book 2 — 17h', requestedDate: '05/04 — Sáb', requestedTime: '09:00', reason: 'Prova na escola', status: 'pending' },
  { id: 'rp4', studentName: 'Ana Clara Silva', studentAvatar: 'https://i.pravatar.cc/150?img=20', className: 'Book 3 — 19h', requestedDate: '22/03 — Sáb', requestedTime: '09:00', reason: 'Compromisso pessoal', status: 'approved' },
  { id: 'rp5', studentName: 'Lucas Almeida', studentAvatar: 'https://i.pravatar.cc/150?img=10', className: 'Book 1 — 08h', requestedDate: '15/03 — Sáb', requestedTime: '10:00', reason: 'Viagem', status: 'rejected' },
];

const INITIAL_CONVENIOS: Convenio[] = [
  { id: 'cv1', name: 'Farmácia Drogafort', category: 'Saúde', discount: '15%', address: 'Rua das Flores, 123', icon: 'medkit', color: '#10B981', active: true },
  { id: 'cv2', name: 'Academia FitLife', category: 'Bem-estar', discount: '20%', address: 'Av. Principal, 456', icon: 'barbell', color: '#7B5CF0', active: true },
  { id: 'cv3', name: 'Restaurante Sabor & Arte', category: 'Alimentação', discount: '10%', address: 'Praça Central, 78', icon: 'restaurant', color: '#F59E0B', active: true },
  { id: 'cv4', name: 'Livraria Cultura Local', category: 'Educação', discount: '12%', address: 'Rua do Livro, 55', icon: 'book', color: '#3B82F6', active: true },
  { id: 'cv5', name: 'Ótica VisionMax', category: 'Saúde', discount: '25%', address: 'Shopping Norte, L45', icon: 'glasses', color: '#06B6D4', active: false },
  { id: 'cv6', name: 'Studio Photo Click', category: 'Serviços', discount: '30%', address: 'Rua das Artes, 89', icon: 'camera', color: '#EC4899', active: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bookColor(book: string): string {
  if (book.includes('1')) return '#3B82F6';
  if (book.includes('2')) return '#10B981';
  return '#7B5CF0';
}

// ─── Note Row Component ──────────────────────────────────────────────────────

function NoteRow({ note, showTeacher }: { note: { date: string; note: string; type: string; teacher?: string; className?: string }; showTeacher?: boolean }) {
  const cfg = NOTE_CFG[note.type as keyof typeof NOTE_CFG] ?? NOTE_CFG.info;
  return (
    <View style={ms.noteRow}>
      <View style={[ms.noteIcon, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.icon} size={14} color={cfg.color} />
      </View>
      <View style={ms.noteContent}>
        <Text style={ms.noteMeta}>
          {showTeacher && note.teacher ? `${note.teacher} · ` : ''}{(note as any).className ? `${(note as any).className} · ` : ''}{note.date}
        </Text>
        <Text style={ms.noteText}>{note.note}</Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ManagementScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [reposicoes, setReposicoes] = useState(INITIAL_REPOSICOES);
  const [convenios, setConvenios] = useState(INITIAL_CONVENIOS);
  const { s } = useStaggeredEntry(3);

  const query = search.toLowerCase();
  const filteredStudents = STUDENTS.filter((st) => st.name.toLowerCase().includes(query));
  const filteredTeachers = TEACHERS.filter((t) => t.name.toLowerCase().includes(query));
  const filteredClasses = CLASSES.filter((c) => c.name.toLowerCase().includes(query));

  return (
    <LinearGradient colors={['#F0EFF5', '#E8E7EF', '#DDDCE8']} style={st.bg}>
      <StatusBar style="dark" />
      <SafeAreaView style={st.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <Animated.View style={[st.header, s(0)]}>
            <Text style={st.headerTitle}>Gestão da Unidade</Text>
            <View style={st.searchShadow}>
              <BlurView intensity={50} tint="light" style={st.searchBar}>
                <Ionicons name="search-outline" size={18} color="#888" />
                <TextInput style={st.searchInput} placeholder="Buscar por nome..." placeholderTextColor="#aaa" value={search} onChangeText={setSearch} autoCapitalize="none" autoCorrect={false} />
                {search.length > 0 && <Pressable onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color="#bbb" /></Pressable>}
              </BlurView>
            </View>
          </Animated.View>

          {/* Tabs */}
          <Animated.View style={s(1)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.tabsRow}>
              {TABS.map((tab, i) => (
                <Pressable key={tab} onPress={() => setActiveTab(i)} style={[st.tabChip, activeTab === i && st.tabChipActive]}>
                  <Text style={[st.tabChipText, activeTab === i && st.tabChipTextActive]}>{tab}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Content */}
          <Animated.View style={[st.content, s(2)]}>

            {/* Alunos */}
            {activeTab === 0 && (
              <View style={st.list}>
                {filteredStudents.map((student) => (
                  <Pressable key={student.id} onPress={() => setSelectedStudent(student)}>
                    <View style={st.cardShadow}>
                      <BlurView intensity={50} tint="light" style={st.card}>
                        <View style={st.cardRow}>
                          <Image source={{ uri: student.avatar }} style={st.avatarSm} contentFit="cover" />
                          <View style={st.cardInfo}>
                            <Text style={st.cardName}>{student.name}</Text>
                            <Text style={st.cardSub}>{student.class}</Text>
                          </View>
                          <View style={[st.badge, student.status === 'active' ? st.badgeGreen : st.badgeGray]}>
                            <Text style={[st.badgeText, student.status === 'active' ? st.badgeGreenText : st.badgeGrayText]}>
                              {student.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={16} color="#ccc" />
                        </View>
                      </BlurView>
                    </View>
                  </Pressable>
                ))}
                {filteredStudents.length === 0 && <Text style={st.empty}>Nenhum aluno encontrado</Text>}
              </View>
            )}

            {/* Professores */}
            {activeTab === 1 && (
              <View style={st.list}>
                {filteredTeachers.map((teacher) => (
                  <Pressable key={teacher.id} onPress={() => setSelectedTeacher(teacher)}>
                    <View style={st.cardShadow}>
                      <BlurView intensity={50} tint="light" style={st.card}>
                        <View style={st.cardRow}>
                          <Image source={{ uri: teacher.avatar }} style={st.avatarMd} contentFit="cover" />
                          <View style={st.cardInfo}>
                            <Text style={st.cardName}>{teacher.name}</Text>
                            <Text style={st.cardSub}>{teacher.classCount} turmas · {teacher.studentCount} alunos · Desde {teacher.since}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={16} color="#ccc" />
                        </View>
                      </BlurView>
                    </View>
                  </Pressable>
                ))}
                {filteredTeachers.length === 0 && <Text style={st.empty}>Nenhum professor encontrado</Text>}
              </View>
            )}

            {/* Turmas */}
            {activeTab === 2 && (
              <View style={st.list}>
                {filteredClasses.map((cls) => {
                  const color = bookColor(cls.book);
                  const slotsLeft = cls.capacity - cls.students;
                  return (
                    <Pressable key={cls.id} onPress={() => setSelectedClass(cls)}>
                      <View style={st.cardShadow}>
                        <BlurView intensity={50} tint="light" style={st.card}>
                          <View style={st.cardRow}>
                            <View style={[st.bookIcon, { backgroundColor: color + '18' }]}>
                              <Ionicons name="book-outline" size={20} color={color} />
                            </View>
                            <View style={st.cardInfo}>
                              <Text style={st.cardName}>{cls.name}</Text>
                              <Text style={st.cardSub}>{cls.teacher} · {cls.days}</Text>
                            </View>
                            <View style={[st.badge, slotsLeft > 0 ? st.badgeGreen : st.badgeRed]}>
                              <Text style={[st.badgeText, slotsLeft > 0 ? st.badgeGreenText : st.badgeRedText]}>
                                {slotsLeft > 0 ? `${slotsLeft} vagas` : 'Lotada'}
                              </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#ccc" />
                          </View>
                        </BlurView>
                      </View>
                    </Pressable>
                  );
                })}
                {filteredClasses.length === 0 && <Text style={st.empty}>Nenhuma turma encontrada</Text>}
              </View>
            )}

            {/* Reposições */}
            {activeTab === 3 && (
              <View style={st.list}>
                {/* Contadores */}
                <View style={st.repoCounters}>
                  {(['pending', 'approved', 'rejected'] as const).map((status) => {
                    const count = reposicoes.filter((r) => r.status === status).length;
                    const cfg = { pending: { label: 'Pendentes', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' }, approved: { label: 'Aprovadas', color: '#10B981', bg: 'rgba(16,185,129,0.12)' }, rejected: { label: 'Recusadas', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' } }[status];
                    return (
                      <View key={status} style={[st.repoCounter, { backgroundColor: cfg.bg }]}>
                        <Text style={[st.repoCounterNum, { color: cfg.color }]}>{count}</Text>
                        <Text style={[st.repoCounterLabel, { color: cfg.color }]}>{cfg.label}</Text>
                      </View>
                    );
                  })}
                </View>

                {reposicoes.map((req) => {
                  const isPending = req.status === 'pending';
                  const statusCfg = { pending: { label: 'Pendente', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' }, approved: { label: 'Aprovada', color: '#10B981', bg: 'rgba(16,185,129,0.12)' }, rejected: { label: 'Recusada', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' } }[req.status];
                  return (
                    <View key={req.id} style={st.cardShadow}>
                      <BlurView intensity={50} tint="light" style={st.card}>
                        <View style={st.cardRow}>
                          <Image source={{ uri: req.studentAvatar }} style={st.avatarSm} contentFit="cover" />
                          <View style={st.cardInfo}>
                            <Text style={st.cardName}>{req.studentName}</Text>
                            <Text style={st.cardSub}>{req.className}</Text>
                          </View>
                          <View style={[st.badge, { backgroundColor: statusCfg.bg }]}>
                            <Text style={[st.badgeText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                          </View>
                        </View>
                        <View style={st.repoDetails}>
                          <View style={st.repoDetailRow}>
                            <Ionicons name="calendar-outline" size={13} color="#7B5CF0" />
                            <Text style={st.repoDetailText}>{req.requestedDate} às {req.requestedTime}</Text>
                          </View>
                          <View style={st.repoDetailRow}>
                            <Ionicons name="chatbubble-outline" size={13} color="#888" />
                            <Text style={st.repoDetailReason}>{req.reason}</Text>
                          </View>
                        </View>
                        {isPending && (
                          <View style={st.repoActions}>
                            <Pressable
                              style={st.repoRejectBtn}
                              onPress={() => setReposicoes((prev) => prev.map((r) => r.id === req.id ? { ...r, status: 'rejected' } : r))}
                            >
                              <Ionicons name="close" size={16} color="#EF4444" />
                              <Text style={st.repoRejectText}>Recusar</Text>
                            </Pressable>
                            <Pressable
                              style={st.repoApproveBtn}
                              onPress={() => setReposicoes((prev) => prev.map((r) => r.id === req.id ? { ...r, status: 'approved' } : r))}
                            >
                              <Ionicons name="checkmark" size={16} color="#fff" />
                              <Text style={st.repoApproveText}>Aprovar</Text>
                            </Pressable>
                          </View>
                        )}
                      </BlurView>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Convênios */}
            {activeTab === 4 && (
              <View style={st.list}>
                <Pressable style={st.addConvenioBtn}>
                  <LinearGradient colors={['#8B5CF6', '#6D28D9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={st.addConvenioBtnGrad}>
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={st.addConvenioBtnText}>Novo Parceiro</Text>
                  </LinearGradient>
                </Pressable>

                {convenios.map((conv) => (
                  <View key={conv.id} style={st.cardShadow}>
                    <BlurView intensity={50} tint="light" style={st.card}>
                      <View style={st.cardRow}>
                        <View style={[st.convIcon, { backgroundColor: conv.color + '18' }]}>
                          <Ionicons name={conv.icon as any} size={20} color={conv.color} />
                        </View>
                        <View style={st.cardInfo}>
                          <Text style={st.cardName}>{conv.name}</Text>
                          <Text style={st.cardSub}>{conv.category}</Text>
                          <View style={st.convAddrRow}>
                            <Ionicons name="location-outline" size={11} color="#aaa" />
                            <Text style={st.convAddr}>{conv.address}</Text>
                          </View>
                        </View>
                        <View style={st.convRight}>
                          <View style={[st.convDiscountBadge, { backgroundColor: conv.color + '18' }]}>
                            <Text style={[st.convDiscountText, { color: conv.color }]}>{conv.discount}</Text>
                          </View>
                          <Pressable
                            onPress={() => setConvenios((prev) => prev.map((c) => c.id === conv.id ? { ...c, active: !c.active } : c))}
                            style={[st.convToggle, conv.active ? st.convToggleOn : st.convToggleOff]}
                          >
                            <View style={[st.convToggleDot, conv.active ? st.convToggleDotOn : st.convToggleDotOff]} />
                          </Pressable>
                        </View>
                      </View>
                    </BlurView>
                  </View>
                ))}
              </View>
            )}

          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* ══════════════════ MODAL: Aluno ══════════════════ */}
      <Modal visible={!!selectedStudent} transparent animationType="slide" onRequestClose={() => setSelectedStudent(null)}>
        <Pressable style={ms.overlay} onPress={() => setSelectedStudent(null)} />
        {selectedStudent && (
          <BlurView intensity={55} tint="light" style={ms.sheet}>
            <View style={ms.handle} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Header */}
              <View style={ms.modalHeader}>
                <Image source={{ uri: selectedStudent.avatar }} style={ms.modalAvatar} contentFit="cover" />
                <View style={ms.modalHeaderInfo}>
                  <Text style={ms.modalName}>{selectedStudent.name}</Text>
                  <Text style={ms.modalSub}>{selectedStudent.class} · Desde {selectedStudent.since}</Text>
                </View>
                <View style={[st.badge, selectedStudent.status === 'active' ? st.badgeGreen : st.badgeGray]}>
                  <Text style={[st.badgeText, selectedStudent.status === 'active' ? st.badgeGreenText : st.badgeGrayText]}>
                    {selectedStudent.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>

              {/* Presença */}
              <Text style={ms.sectionTitle}>Frequência</Text>
              <View style={ms.attendanceCard}>
                <Text style={ms.attendanceBig}>{Math.round((selectedStudent.attendance / selectedStudent.totalClasses) * 100)}%</Text>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={ms.attendanceLabel}>{selectedStudent.attendance} de {selectedStudent.totalClasses} aulas</Text>
                  <View style={ms.barTrack}>
                    <View style={[ms.barFill, { width: `${(selectedStudent.attendance / selectedStudent.totalClasses) * 100}%`, backgroundColor: selectedStudent.attendance / selectedStudent.totalClasses >= 0.8 ? '#10B981' : '#F59E0B' }]} />
                  </View>
                </View>
              </View>

              {/* Boletim */}
              <Text style={ms.sectionTitle}>Boletim</Text>
              {selectedStudent.grades.map((g) => (
                <View key={g.subject} style={ms.gradeRow}>
                  <Text style={ms.gradeSubject}>{g.subject}</Text>
                  <View style={ms.barTrack}>
                    <View style={[ms.barFill, { width: `${(g.score / 10) * 100}%`, backgroundColor: g.color }]} />
                  </View>
                  <Text style={[ms.gradeScore, { color: g.color }]}>{g.score}</Text>
                </View>
              ))}

              {/* Anotações */}
              <Text style={ms.sectionTitle}>Anotações dos professores ({selectedStudent.notes.length})</Text>
              {selectedStudent.notes.length === 0
                ? <Text style={ms.emptyNote}>Nenhuma anotação registrada.</Text>
                : selectedStudent.notes.map((n, i) => <NoteRow key={i} note={n} showTeacher />)
              }
            </ScrollView>
          </BlurView>
        )}
      </Modal>

      {/* ══════════════════ MODAL: Professor ══════════════════ */}
      <Modal visible={!!selectedTeacher} transparent animationType="slide" onRequestClose={() => setSelectedTeacher(null)}>
        <Pressable style={ms.overlay} onPress={() => setSelectedTeacher(null)} />
        {selectedTeacher && (
          <BlurView intensity={55} tint="light" style={ms.sheet}>
            <View style={ms.handle} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Header */}
              <View style={ms.modalHeader}>
                <Image source={{ uri: selectedTeacher.avatar }} style={ms.modalAvatar} contentFit="cover" />
                <View style={ms.modalHeaderInfo}>
                  <Text style={ms.modalName}>{selectedTeacher.name}</Text>
                  <Text style={ms.modalSub}>Desde {selectedTeacher.since}</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={ms.statsRow}>
                {[
                  { label: 'Turmas', value: selectedTeacher.classCount, icon: 'school-outline' as const, color: '#7B5CF0' },
                  { label: 'Alunos', value: selectedTeacher.studentCount, icon: 'people-outline' as const, color: '#3B82F6' },
                  { label: 'Média', value: selectedTeacher.avgScore.toFixed(1), icon: 'star-outline' as const, color: '#10B981' },
                ].map((s, i) => (
                  <View key={i} style={ms.statCard}>
                    <Ionicons name={s.icon} size={16} color={s.color} />
                    <Text style={[ms.statValue, { color: s.color }]}>{s.value}</Text>
                    <Text style={ms.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Turmas */}
              <Text style={ms.sectionTitle}>Turmas vinculadas</Text>
              {selectedTeacher.classes.map((cls, i) => (
                <View key={i} style={ms.classChip}>
                  <Ionicons name="book-outline" size={14} color="#7B5CF0" />
                  <Text style={ms.classChipText}>{cls}</Text>
                </View>
              ))}

              {/* Anotações recentes */}
              <Text style={ms.sectionTitle}>Anotações recentes ({selectedTeacher.notes.length})</Text>
              {selectedTeacher.notes.map((n, i) => <NoteRow key={i} note={n} />)}
            </ScrollView>
          </BlurView>
        )}
      </Modal>

      {/* ══════════════════ MODAL: Turma ══════════════════ */}
      <Modal visible={!!selectedClass} transparent animationType="slide" onRequestClose={() => setSelectedClass(null)}>
        <Pressable style={ms.overlay} onPress={() => setSelectedClass(null)} />
        {selectedClass && (
          <BlurView intensity={55} tint="light" style={ms.sheet}>
            <View style={ms.handle} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Header */}
              <View style={ms.modalHeader}>
                <View style={[st.bookIcon, { backgroundColor: bookColor(selectedClass.book) + '18' }]}>
                  <Ionicons name="book-outline" size={22} color={bookColor(selectedClass.book)} />
                </View>
                <View style={ms.modalHeaderInfo}>
                  <Text style={ms.modalName}>{selectedClass.name}</Text>
                  <Text style={ms.modalSub}>{selectedClass.teacher} · {selectedClass.days} · {selectedClass.room}</Text>
                </View>
              </View>

              {/* Capacidade */}
              <Text style={ms.sectionTitle}>Capacidade</Text>
              <View style={ms.capacityCard}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={ms.capacityLabel}>{selectedClass.students} de {selectedClass.capacity} alunos</Text>
                  <View style={ms.barTrack}>
                    <View style={[ms.barFill, {
                      width: `${(selectedClass.students / selectedClass.capacity) * 100}%`,
                      backgroundColor: selectedClass.students >= selectedClass.capacity ? '#EF4444' : bookColor(selectedClass.book),
                    }]} />
                  </View>
                </View>
                <View style={[st.badge, selectedClass.capacity - selectedClass.students > 0 ? st.badgeGreen : st.badgeRed]}>
                  <Text style={[st.badgeText, selectedClass.capacity - selectedClass.students > 0 ? st.badgeGreenText : st.badgeRedText]}>
                    {selectedClass.capacity - selectedClass.students > 0 ? `${selectedClass.capacity - selectedClass.students} vagas` : 'Lotada'}
                  </Text>
                </View>
              </View>

              {/* Alunos */}
              <Text style={ms.sectionTitle}>Alunos ({selectedClass.studentList.length})</Text>
              {selectedClass.studentList.map((student) => (
                <View key={student.id} style={ms.studentRow}>
                  <Image source={{ uri: student.avatar }} style={ms.studentAvatar} contentFit="cover" />
                  <Text style={ms.studentName}>{student.name}</Text>
                  <View style={[ms.miniStatus, student.status === 'active' ? { backgroundColor: 'rgba(16,185,129,0.12)' } : { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
                    <View style={[ms.miniDot, { backgroundColor: student.status === 'active' ? '#10B981' : '#999' }]} />
                  </View>
                </View>
              ))}

              {/* Anotações */}
              <Text style={ms.sectionTitle}>Anotações da turma ({selectedClass.notes.length})</Text>
              {selectedClass.notes.map((n, i) => <NoteRow key={i} note={n} showTeacher />)}
            </ScrollView>
          </BlurView>
        )}
      </Modal>

    </LinearGradient>
  );
}

// ─── Screen Styles ────────────────────────────────────────────────────────────

const st = StyleSheet.create({
  bg: { flex: 1 }, safe: { flex: 1 }, scroll: { paddingBottom: 110 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, gap: 14 },
  headerTitle: { fontFamily: 'Nunito_900Black', fontSize: 24, color: '#1a1030' },
  searchShadow: { borderRadius: 18, shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  searchBar: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 10 },
  searchInput: { flex: 1, fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#1a1030', padding: 0 },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginTop: 16, marginBottom: 18 },
  tabChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' },
  tabChipActive: { backgroundColor: '#1a1030', borderColor: '#1a1030' },
  tabChipText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#888' },
  tabChipTextActive: { color: '#fff' },
  content: { paddingHorizontal: 20 },
  list: { gap: 10 },
  cardShadow: { borderRadius: 18, shadowColor: '#7B5CF0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  card: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', padding: 14, gap: 6 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardInfo: { flex: 1, gap: 2 },
  cardName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1a1030' },
  cardSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  avatarSm: { width: 40, height: 40, borderRadius: 20 },
  avatarMd: { width: 44, height: 44, borderRadius: 22 },
  bookIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
  badgeGreen: { backgroundColor: 'rgba(16,185,129,0.12)' },
  badgeGray: { backgroundColor: 'rgba(0,0,0,0.06)' },
  badgeRed: { backgroundColor: 'rgba(239,68,68,0.12)' },
  badgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
  badgeGreenText: { color: '#10B981' },
  badgeGrayText: { color: '#999' },
  badgeRedText: { color: '#EF4444' },
  empty: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: 40 },

  // Reposições
  repoCounters: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  repoCounter: { flex: 1, borderRadius: 14, paddingVertical: 10, alignItems: 'center', gap: 2 },
  repoCounterNum: { fontFamily: 'Nunito_900Black', fontSize: 22 },
  repoCounterLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 11 },
  repoDetails: { gap: 4, marginLeft: 52 },
  repoDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  repoDetailText: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#1a1030' },
  repoDetailReason: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888', flex: 1 },
  repoActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  repoRejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 12, paddingVertical: 10 },
  repoRejectText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#EF4444' },
  repoApproveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 10 },
  repoApproveText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#fff' },

  // Convênios
  addConvenioBtn: { borderRadius: 50, overflow: 'hidden', marginBottom: 4 },
  addConvenioBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  addConvenioBtnText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#fff' },
  convIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  convAddrRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  convAddr: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa' },
  convRight: { alignItems: 'center', gap: 6, flexShrink: 0 },
  convDiscountBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50 },
  convDiscountText: { fontFamily: 'Nunito_900Black', fontSize: 14 },
  convToggle: { width: 40, height: 22, borderRadius: 11, justifyContent: 'center', paddingHorizontal: 2 },
  convToggleOn: { backgroundColor: '#10B981' },
  convToggleOff: { backgroundColor: 'rgba(0,0,0,0.12)' },
  convToggleDot: { width: 18, height: 18, borderRadius: 9 },
  convToggleDotOn: { backgroundColor: '#fff', alignSelf: 'flex-end' },
  convToggleDotOff: { backgroundColor: '#fff', alignSelf: 'flex-start' },
});

// ─── Modal Styles ─────────────────────────────────────────────────────────────

const ms = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%', overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)', alignSelf: 'center', marginBottom: 16 },

  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  modalAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: 'rgba(255,255,255,0.9)' },
  modalHeaderInfo: { flex: 1 },
  modalName: { fontFamily: 'Nunito_900Black', fontSize: 18, color: '#1a1030' },
  modalSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888', marginTop: 2 },

  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#1a1030', marginTop: 18, marginBottom: 10 },

  // Attendance
  attendanceCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  attendanceBig: { fontFamily: 'Nunito_900Black', fontSize: 32, color: '#1a1030' },
  attendanceLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#888' },
  barTrack: { height: 7, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99 },

  // Grades
  gradeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  gradeSubject: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#1a1030', width: 70 },
  gradeScore: { fontFamily: 'Nunito_900Black', fontSize: 16, width: 30, textAlign: 'right' },

  // Notes
  noteRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  noteIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  noteContent: { flex: 1 },
  noteMeta: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#aaa', marginBottom: 2 },
  noteText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#1a1030', lineHeight: 19 },
  emptyNote: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#aaa' },

  // Teacher stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 14, padding: 12, alignItems: 'center', gap: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  statValue: { fontFamily: 'Nunito_900Black', fontSize: 22 },
  statLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: '#888' },

  classChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(123,92,240,0.08)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginBottom: 6 },
  classChipText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#1a1030' },

  // Class capacity
  capacityCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  capacityLabel: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#1a1030' },

  // Student list in class modal
  studentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
  studentAvatar: { width: 32, height: 32, borderRadius: 16 },
  studentName: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#1a1030', flex: 1 },
  miniStatus: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  miniDot: { width: 8, height: 8, borderRadius: 4 },
});
