// ─── Auth / RBAC ──────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'teacher' | 'franchise_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  unitId?: string;   // professor e franqueado pertencem a uma unidade
  unitName?: string;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

// ─── Conteúdo pedagógico ──────────────────────────────────────────────────────

export interface Level {
  id: string;
  name: string;
  order: number;
}

export interface Book {
  id: string;
  levelId: string;
  name: string;
  coverUrl?: string;
  order: number;
}

export interface Unit {
  id: string;
  bookId: string;
  name: string;
  order: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  name: string;
  order: number;
  audioUrl?: string;
  homeworkIds: string[];
}

// ─── Aluno ────────────────────────────────────────────────────────────────────

export interface StudentProgress {
  userId: string;
  currentBook: Book;
  currentUnit: Unit;
  currentLesson: Lesson;
  step: number;
  stepsTotal: number;
  attendanceRate: number;
  homeworkRate: number;
}

export interface Homework {
  id: string;
  lessonId: string;
  title: string;
  type: 'multiple_choice' | 'fill_blank' | 'audio' | 'writing';
  dueDate: string;
  submittedAt?: string;
  score?: number;
  status: 'pending' | 'submitted' | 'graded';
}

export interface Grade {
  id: string;
  userId: string;
  type: 'listening' | 'speaking' | 'writing';
  score: number;
  feedback?: string;
  audioFeedbackUrl?: string;
  createdAt: string;
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

// ─── Professor ────────────────────────────────────────────────────────────────

export interface ClassGroup {
  id: string;
  name: string;
  level: string;
  unitId: string;
  schedule: Schedule[];
  studentCount: number;
}

export interface Schedule {
  dayOfWeek: number; // 0 = domingo
  startTime: string; // HH:mm
  endTime: string;
}

export interface AttendanceRecord {
  id: string;
  classGroupId: string;
  date: string;
  lessonId: string;
  presentStudentIds: string[];
  absentStudentIds: string[];
}

export interface RadarInsight {
  homeworkSubmissionRate: number; // 0-1
  topErrorTopics: string[];
  studentsAtRisk: string[];
}

// ─── Franqueado ───────────────────────────────────────────────────────────────

export interface ChurnAlert {
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  missedClasses: number;
  homeworkMissRate: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface FranchiseUnit {
  id: string;
  name: string;
  city: string;
  state: string;
  ownerName: string;
  status: 'active' | 'suspended' | 'pending';
  engagementScore: number;
  retentionRate: number;
}
