import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Camera,
  CircleAlert,
  CircleCheck,
  Clock,
  FileSpreadsheet,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
  User,
  Users,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EditStudentModal } from '../../src/components/EditStudentModal';
import { useAuth } from '../../src/context/auth';
import { api } from '../../src/lib/api';

export interface StudentProfileData {
  id: string;
  isSectionIncharge?: boolean;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  emailId: string;
  phoneNumber: string;
  aadharCardNumber: string;
  status: string;
  profileImage?: string | null;
  religion: string;
  nationality: string;
  motherTongue: string;
  community: string;
  caste: string;
  differentlyAbled: string;
  age?: string;

  // Parent Details
  fatherName: string;
  fatherOccupation: string;
  fatherPhoneNumber: string;
  fatherEmailId?: string;
  fatherEducation: string;
  fatherAadharCardNumber: string;

  motherName: string;
  motherOccupation: string;
  motherPhoneNumber: string;
  motherEmailId?: string;
  motherEducation: string;
  motherAadharCardNumber: string;
  parentsSeparated: string;
  annualIncome: string;

  // Guardian Details
  guardianName?: string;
  guardiansOccupation?: string;
  guardianPhoneNumber?: string;
  guardianEmailId?: string;
  guardianRelationship?: string;
  guardianAadharCardNumber?: string;

  // Residential Address
  residentialAddress: string;
  residentialDistrict: string;
  residentialState: string;
  residentialPostalCode: string;

  // Permanent Address
  permanentAddress?: string;
  permanentDistrict?: string;
  permanentState?: string;
  permanentPostalCode?: string;

  // Educational & Admission Details
  emisNumber: string;
  admissionNumber: string;
  dateOfJoining: string;
  admissionType: string;
  admissionMode: string;
  scholarship: string;
  firstLanguage: string;

  // 10th & 11th Details
  schoolName10th?: string;
  yearOfPassing10th?: string;
  obtainedMark10th?: string;
  mediumOfEducation10th?: string;

  schoolName11th?: string;
  yearOfPassing11th?: string;
  obtainedMark11th?: string;
  mediumOfEducation11th?: string;

  // Current Mapping
  rollNo: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  groupId: string;
  groupName: string;
  mediumId: string;
  mediumName: string;
  batchId: string;
  batchName: string;
}

export interface AcademicHistoryItem {
  id: string;
  academicYear: string;
  className: string;
  sectionName: string;
  rollNumber: string;
  groupName: string;
  mediumName: string;
  remark?: string;
  isCurrent: boolean;
}

export interface SubjectMarkItem {
  subjectId: string;
  subjectName: string;
  obtainedMarks: string;
  maxMarks: string;
  isPassed: boolean;
  isAbsent: boolean;
}

export interface ExamReportItem {
  examId: string;
  examName: string;
  totalObtained: number;
  totalPossible: number;
  percentage: number;
  status: 'Pass' | 'Fail' | 'Pending';
  subjects: SubjectMarkItem[];
}

export default function StudentDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Tabs state: 'personal' | 'report' | 'history'
  const [activeTab, setActiveTab] = useState<'personal' | 'report' | 'history'>('personal');

  // Core Data State
  const [student, setStudent] = useState<StudentProfileData | null>(null);
  const [academicHistory, setAcademicHistory] = useState<AcademicHistoryItem[]>([]);
  const [reports, setReports] = useState<ExamReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit & Photo Upload State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // User-scoped cache key
  const cacheKey = user?.id && id ? `@rexdeia_student_detail_${user.id}_${id}` : null;

  // Reset state on user switch
  useEffect(() => {
    setStudent(null);
    setAcademicHistory([]);
    setReports([]);
    setErrorMessage(null);
  }, [user?.id, id]);

  // Load cached data
  useEffect(() => {
    if (!cacheKey) return;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.student) {
            setStudent(parsed.student);
            setAcademicHistory(parsed.academicHistory || []);
            setReports(parsed.reports || []);
            setIsLoading(false);
          }
        }
      } catch {}
    })();
  }, [cacheKey]);

  // Fetch Student Details from API
  const fetchStudentDetails = useCallback(
    async (isManualRefresh = false) => {
      if (!id || !user?.id) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (!student) {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const res = await api.get<{
          success: boolean;
          data: {
            student: StudentProfileData;
            academicHistory: AcademicHistoryItem[];
            reports: ExamReportItem[];
            isSectionIncharge?: boolean;
          };
        }>(`/api/mobile/v1/students/${id}`);

        if (res?.data?.student) {
          const studentData = {
            ...res.data.student,
            isSectionIncharge:
              res.data.isSectionIncharge ?? res.data.student.isSectionIncharge ?? false,
          };
          setStudent(studentData);
          setAcademicHistory(res.data.academicHistory || []);
          setReports(res.data.reports || []);

          if (cacheKey) {
            await AsyncStorage.setItem(
              cacheKey,
              JSON.stringify({
                ...res.data,
                student: studentData,
              })
            ).catch(() => {});
          }
        } else {
          setErrorMessage('Student record not found.');
        }
      } catch (err: any) {
        if (err?.message !== 'SESSION_EXPIRED') {
          const msg = err?.data?.error || err?.message || 'Failed to load student details.';
          setErrorMessage(msg);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id, user?.id, student, cacheKey]
  );

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);

  const handleRefresh = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    fetchStudentDetails(true);
  };

  const handleTabChange = (tab: 'personal' | 'report' | 'history') => {
    if (activeTab === tab) return;
    try {
      Haptics.selectionAsync();
    } catch {}
    setActiveTab(tab);
  };

  const handleCall = (phoneNumber?: string) => {
    if (!phoneNumber) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email?: string) => {
    if (!email) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    Linking.openURL(`mailto:${email}`);
  };

  // Photo Picker & Upload Handling
  const uploadStudentPhoto = async (imageUri: string, fileName: string) => {
    if (!id) return;
    try {
      setIsUploadingPhoto(true);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}

      const formData = new FormData();
      formData.append('photo', {
        uri: imageUri,
        name: fileName,
        type: 'image/jpeg',
      } as any);

      const res = await api.post<{
        success: boolean;
        data: { profileImage: string };
      }>(`/api/mobile/v1/students/${id}/photo`, formData);

      if (res?.data?.profileImage) {
        setStudent((prev) => (prev ? { ...prev, profileImage: res.data.profileImage } : null));

        if (cacheKey) {
          const cached = await AsyncStorage.getItem(cacheKey).catch(() => null);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (parsed?.student) {
                parsed.student.profileImage = res.data.profileImage;
                await AsyncStorage.setItem(cacheKey, JSON.stringify(parsed)).catch(() => {});
              }
            } catch {}
          }
        }

        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        Alert.alert('Success', 'Student photo updated successfully.');
      }
    } catch (err: any) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
      const msg = err?.data?.error || err?.message || 'Failed to upload photo.';
      Alert.alert('Upload Failed', msg);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePickPhoto = async () => {
    if (!student?.isSectionIncharge) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    Alert.alert(
      'Upload Student Photo',
      'Select a photo source for this student',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const perm = await ImagePicker.requestCameraPermissionsAsync();
            if (!perm.granted) {
              Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.6,
            });
            if (!result.canceled && result.assets[0]?.uri) {
              uploadStudentPhoto(result.assets[0].uri, result.assets[0].fileName || `student_${id}.jpg`);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!perm.granted) {
              Alert.alert('Permission Denied', 'Gallery permission is required to select a photo.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.6,
            });
            if (!result.canceled && result.assets[0]?.uri) {
              uploadStudentPhoto(result.assets[0].uri, result.assets[0].fileName || `student_${id}.jpg`);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Student Details Edit Success Handling
  const handleSaveSuccess = async (updatedData: Partial<StudentProfileData>) => {
    setStudent((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedData };
      merged.fullName = [merged.firstName, merged.middleName, merged.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();
      return merged;
    });

    if (cacheKey) {
      const cached = await AsyncStorage.getItem(cacheKey).catch(() => null);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.student) {
            parsed.student = {
              ...parsed.student,
              ...updatedData,
              fullName: [
                updatedData.firstName ?? parsed.student.firstName,
                updatedData.middleName ?? parsed.student.middleName,
                updatedData.lastName ?? parsed.student.lastName,
              ]
                .filter(Boolean)
                .join(' ')
                .trim(),
            };
            await AsyncStorage.setItem(cacheKey, JSON.stringify(parsed)).catch(() => {});
          }
        } catch {}
      }
    }
  };

  const initial = student?.fullName ? student.fullName.charAt(0).toUpperCase() : '?';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {}
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/students' as any);
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle} numberOfLines={1}>
            {student?.fullName || 'Student Profile'}
          </Text>
          <Text style={styles.navSubtitle}>
            {student?.className
              ? `Class ${student.className}${student.sectionName ? ` - ${student.sectionName}` : ''}`
              : 'Details & Records'}
          </Text>
        </View>

        {student?.isSectionIncharge && (
          <TouchableOpacity
            style={styles.navEditBtn}
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
              setIsEditModalVisible(true);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Pencil size={18} color="#6559FC" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.refreshIconBtn}
          onPress={handleRefresh}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <RefreshCw size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      {isLoading && !student ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6559FC" />
          <Text style={styles.loadingText}>Loading student profile...</Text>
        </View>
      ) : errorMessage && !student ? (
        <View style={styles.centerContainer}>
          <View style={styles.errorCircle}>
            <CircleAlert size={36} color="#EF4444" />
          </View>
          <Text style={styles.errorTitle}>Could Not Load Student</Text>
          <Text style={styles.errorSubtitle}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchStudentDetails(false)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : student ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#6559FC']}
              tintColor="#6559FC"
            />
          }
        >
          {/* 1. Hero Profile Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              {/* Avatar Box with status badge */}
              <View style={styles.avatarContainer}>
                {student.profileImage ? (
                  <Image source={{ uri: student.profileImage }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>{initial}</Text>
                  </View>
                )}
                {student.status === 'Active' && (
                  <View style={styles.avatarVerifiedBadge}>
                    <CircleCheck size={14} color="#FFFFFF" />
                  </View>
                )}
                {student.isSectionIncharge && (
                  <TouchableOpacity
                    style={styles.avatarCameraBadge}
                    onPress={handlePickPhoto}
                    activeOpacity={0.8}
                    disabled={isUploadingPhoto}
                  >
                    <Camera size={13} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
                {isUploadingPhoto && (
                  <View style={styles.avatarLoadingOverlay}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  </View>
                )}
              </View>

              {/* Header Badges & Name */}
              <View style={styles.heroInfo}>
                <View style={styles.heroBadgesRow}>
                  {/* Status Pill */}
                  <View
                    style={[
                      styles.statusPill,
                      student.status === 'Active' ? styles.statusPillActive : styles.statusPillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        student.status === 'Active'
                          ? styles.statusPillTextActive
                          : styles.statusPillTextInactive,
                      ]}
                    >
                      {student.status || 'Active'}
                    </Text>
                  </View>

                  {/* Roll No Pill */}
                  {student.rollNo && student.rollNo !== '-' && (
                    <View style={styles.rollPill}>
                      <Text style={styles.rollPillText}>Roll #{student.rollNo}</Text>
                    </View>
                  )}

                  {/* Class & Section Pill */}
                  {student.className ? (
                    <View style={styles.classPill}>
                      <Text style={styles.classPillText}>
                        {student.className}
                        {student.sectionName ? `-${student.sectionName}` : ''}
                      </Text>
                    </View>
                  ) : null}

                  {/* Group / Stream Pill */}
                  {student.groupName && student.groupName !== '-' && (
                    <View style={styles.streamPill}>
                      <Text style={styles.streamPillText}>{student.groupName}</Text>
                    </View>
                  )}
                </View>

                {/* Student Full Name */}
                <Text style={styles.heroName} numberOfLines={2}>
                  {student.fullName}
                </Text>
              </View>

              {/* Quick Action Buttons (Call / Email) */}
              <View style={styles.quickActionsCol}>
                {(student.phoneNumber || student.fatherPhoneNumber) && (
                  <TouchableOpacity
                    style={styles.actionCircleBtn}
                    onPress={() => handleCall(student.phoneNumber || student.fatherPhoneNumber)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Phone size={17} color="#6559FC" />
                  </TouchableOpacity>
                )}

                {student.emailId && (
                  <TouchableOpacity
                    style={[styles.actionCircleBtn, styles.actionCircleBtnSpacing]}
                    onPress={() => handleEmail(student.emailId)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Mail size={17} color="#6559FC" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Incharge Privileges Banner */}
            {student.isSectionIncharge && (
              <View style={styles.heroInchargeBanner}>
                <View style={styles.heroInchargeLeft}>
                  <View style={styles.inchargeBadgePill}>
                    <Text style={styles.inchargeBadgeText}>Section Incharge</Text>
                  </View>
                  <Text style={styles.inchargeHintText}>You have editing privileges for this student</Text>
                </View>
                <TouchableOpacity
                  style={styles.heroEditBtn}
                  onPress={() => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setIsEditModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Pencil size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.heroEditBtnText}>Edit Details</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 2. Segmented Tabs Header */}
          <View style={styles.segmentedTabsContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'personal' && styles.tabButtonActive]}
              onPress={() => handleTabChange('personal')}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.tabButtonText, activeTab === 'personal' && styles.tabButtonTextActive]}
              >
                Personal Info
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'report' && styles.tabButtonActive]}
              onPress={() => handleTabChange('report')}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.tabButtonText, activeTab === 'report' && styles.tabButtonTextActive]}
              >
                Report (Marks)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
              onPress={() => handleTabChange('history')}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.tabButtonText, activeTab === 'history' && styles.tabButtonTextActive]}
              >
                Academic History
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'personal' && (
            <View style={styles.tabContentContainer}>
              {/* SECTION A: BASIC DETAILS */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <View style={[styles.sectionIconBox, { backgroundColor: '#EEF2FF' }]}>
                      <User size={16} color="#6559FC" />
                    </View>
                    <Text style={styles.sectionTitle}>BASIC DETAILS</Text>
                  </View>
                  <Text style={styles.sectionTag}>Student Profile</Text>
                </View>

                <View style={styles.detailsGrid}>
                  {/* Full Name */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Full Name</Text>
                    <Text style={styles.fieldValue}>{student.fullName}</Text>
                  </View>

                  {/* Date of Birth */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Date of Birth</Text>
                    <Text style={styles.fieldValue}>
                      {student.dob || '-'}
                      {student.age ? ` (${student.age} yrs)` : ''}
                    </Text>
                  </View>

                  {/* Gender & Blood Group */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Gender</Text>
                    <View style={styles.inlineRow}>
                      <Text style={styles.fieldValue}>{student.gender}</Text>
                      {student.bloodGroup && student.bloodGroup !== '-' && (
                        <View style={styles.bloodBadge}>
                          <Text style={styles.bloodBadgeText}>{student.bloodGroup}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Aadhar Number */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Aadhar Number</Text>
                    <Text style={styles.fieldValue}>{student.aadharCardNumber || '-'}</Text>
                  </View>

                  {/* Email ID */}
                  <View style={[styles.gridItem, styles.gridItemFull]}>
                    <View style={styles.fieldLabelRow}>
                      <Text style={styles.fieldLabel}>Email ID</Text>
                      {student.emailId && (
                        <TouchableOpacity onPress={() => handleEmail(student.emailId)}>
                          <Text style={styles.fieldActionLink}>Email</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.fieldValue}>{student.emailId || '-'}</Text>
                  </View>

                  {/* Mobile Number */}
                  <View style={styles.gridItem}>
                    <View style={styles.fieldLabelRow}>
                      <Text style={styles.fieldLabel}>Mobile Number</Text>
                      {student.phoneNumber && (
                        <TouchableOpacity onPress={() => handleCall(student.phoneNumber)}>
                          <Text style={styles.fieldActionLink}>Call</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.fieldValue}>{student.phoneNumber || '-'}</Text>
                  </View>

                  {/* Mother Tongue */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Mother Tongue</Text>
                    <Text style={styles.fieldValue}>{student.motherTongue}</Text>
                  </View>

                  {/* Differently Abled */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Differently Abled</Text>
                    <Text style={styles.fieldValue}>{student.differentlyAbled}</Text>
                  </View>

                  {/* Religion & Nationality */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Religion / Nationality</Text>
                    <Text style={styles.fieldValue}>
                      {student.religion !== '-' ? student.religion : ''}
                      {student.religion !== '-' && student.nationality !== '-' ? ' • ' : ''}
                      {student.nationality !== '-' ? student.nationality : '-'}
                    </Text>
                  </View>

                  {/* Community & Caste */}
                  {(student.community !== '-' || student.caste !== '-') && (
                    <View style={styles.gridItem}>
                      <Text style={styles.fieldLabel}>Community / Caste</Text>
                      <Text style={styles.fieldValue}>
                        {student.community !== '-' ? student.community : ''}
                        {student.community !== '-' && student.caste !== '-' ? ' • ' : ''}
                        {student.caste !== '-' ? student.caste : '-'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* SECTION B: PARENTS DETAILS */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <View style={[styles.sectionIconBox, { backgroundColor: '#FDF2F8' }]}>
                      <Users size={16} color="#DB2777" />
                    </View>
                    <Text style={styles.sectionTitle}>PARENTS DETAILS</Text>
                  </View>
                  <Text style={styles.sectionTag}>Contacts</Text>
                </View>

                {/* Sub-cards for Father and Mother */}
                <View style={styles.parentCardsRow}>
                  {/* Father Sub-Card */}
                  <View style={styles.parentBox}>
                    <View style={styles.parentBoxHeader}>
                      <Text style={styles.parentRoleLabel}>FATHER</Text>
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryBadgeText}>Primary</Text>
                      </View>
                    </View>
                    <Text style={styles.parentNameText}>{student.fatherName}</Text>

                    {student.fatherOccupation && student.fatherOccupation !== '-' && (
                      <Text style={styles.parentMetaText}>{student.fatherOccupation}</Text>
                    )}

                    {student.fatherPhoneNumber ? (
                      <TouchableOpacity
                        style={styles.phoneActionRow}
                        onPress={() => handleCall(student.fatherPhoneNumber)}
                      >
                        <Text style={styles.phoneActionText}>{student.fatherPhoneNumber}</Text>
                        <Phone size={13} color="#6559FC" />
                      </TouchableOpacity>
                    ) : null}

                    {student.fatherEducation && student.fatherEducation !== '-' && (
                      <Text style={styles.parentSubMetaText}>Edu: {student.fatherEducation}</Text>
                    )}
                  </View>

                  {/* Mother Sub-Card */}
                  <View style={styles.parentBox}>
                    <View style={styles.parentBoxHeader}>
                      <Text style={styles.parentRoleLabel}>MOTHER</Text>
                      <View style={styles.guardianBadge}>
                        <Text style={styles.guardianBadgeText}>Parent</Text>
                      </View>
                    </View>
                    <Text style={styles.parentNameText}>{student.motherName}</Text>

                    {student.motherOccupation && student.motherOccupation !== '-' && (
                      <Text style={styles.parentMetaText}>{student.motherOccupation}</Text>
                    )}

                    {student.motherPhoneNumber ? (
                      <TouchableOpacity
                        style={styles.phoneActionRow}
                        onPress={() => handleCall(student.motherPhoneNumber)}
                      >
                        <Text style={styles.phoneActionText}>{student.motherPhoneNumber}</Text>
                        <Phone size={13} color="#6559FC" />
                      </TouchableOpacity>
                    ) : null}

                    <View style={styles.inlineMetaRow}>
                      <Text style={styles.parentSubMetaText}>
                        Separated: <Text style={styles.parentBoldMeta}>{student.parentsSeparated}</Text>
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Guardian info if present */}
                {student.guardianName ? (
                  <View style={styles.guardianBox}>
                    <Text style={styles.parentRoleLabel}>
                      GUARDIAN {student.guardianRelationship ? `(${student.guardianRelationship})` : ''}
                    </Text>
                    <Text style={styles.parentNameText}>{student.guardianName}</Text>
                    {student.guardianPhoneNumber && (
                      <TouchableOpacity
                        style={styles.phoneActionRow}
                        onPress={() => handleCall(student.guardianPhoneNumber)}
                      >
                        <Text style={styles.phoneActionText}>{student.guardianPhoneNumber}</Text>
                        <Phone size={13} color="#6559FC" />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
              </View>

              {/* SECTION C: RESIDENTIAL ADDRESS */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <View style={[styles.sectionIconBox, { backgroundColor: '#ECFDF5' }]}>
                      <MapPin size={16} color="#059669" />
                    </View>
                    <Text style={styles.sectionTitle}>RESIDENTIAL ADDRESS</Text>
                  </View>
                </View>

                <View style={styles.addressBox}>
                  <Text style={styles.addressText}>
                    {student.residentialAddress ||
                      `${student.residentialDistrict || ''} ${student.residentialState || ''}`.trim() ||
                      'No residential address recorded.'}
                  </Text>

                  <View style={styles.addressMetaRow}>
                    {student.residentialPostalCode ? (
                      <Text style={styles.addressMetaItem}>
                        PIN: <Text style={styles.addressMetaBold}>{student.residentialPostalCode}</Text>
                      </Text>
                    ) : null}

                    {student.residentialDistrict ? (
                      <Text style={styles.addressMetaItem}>
                        • District: <Text style={styles.addressMetaBold}>{student.residentialDistrict}</Text>
                      </Text>
                    ) : null}

                    {student.residentialState ? (
                      <Text style={styles.addressMetaItem}>
                        • State: <Text style={styles.addressMetaBold}>{student.residentialState}</Text>
                      </Text>
                    ) : null}
                  </View>
                </View>

                {student.permanentAddress && student.permanentAddress !== student.residentialAddress && (
                  <View style={[styles.addressBox, { marginTop: 10 }]}>
                    <Text style={styles.fieldLabel}>Permanent Address</Text>
                    <Text style={styles.addressText}>{student.permanentAddress}</Text>
                    <View style={styles.addressMetaRow}>
                      {student.permanentPostalCode ? (
                        <Text style={styles.addressMetaItem}>
                          PIN: <Text style={styles.addressMetaBold}>{student.permanentPostalCode}</Text>
                        </Text>
                      ) : null}
                      {student.permanentDistrict ? (
                        <Text style={styles.addressMetaItem}>
                          • District: <Text style={styles.addressMetaBold}>{student.permanentDistrict}</Text>
                        </Text>
                      ) : null}
                    </View>
                  </View>
                )}
              </View>

              {/* SECTION D: EDUCATIONAL & ADMISSION */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <View style={[styles.sectionIconBox, { backgroundColor: '#EFF6FF' }]}>
                      <GraduationCap size={16} color="#2563EB" />
                    </View>
                    <Text style={styles.sectionTitle}>EDUCATIONAL & ADMISSION</Text>
                  </View>
                </View>

                <View style={styles.detailsGrid}>
                  {/* EMIS Number */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>EMIS Number</Text>
                    <Text style={styles.fieldValue}>{student.emisNumber || '-'}</Text>
                  </View>

                  {/* Admission Number */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Admission Number</Text>
                    <Text style={styles.fieldValue}>{student.admissionNumber || '-'}</Text>
                  </View>

                  {/* Date of Joining */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Date of Joining</Text>
                    <Text style={styles.fieldValue}>{student.dateOfJoining || '-'}</Text>
                  </View>

                  {/* Current Batch */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Academic Batch</Text>
                    <Text style={styles.fieldValue}>{student.batchName || '-'}</Text>
                  </View>

                  {/* Medium & Group */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Medium & Group</Text>
                    <Text style={styles.fieldValue}>
                      {student.mediumName || '-'}
                      {student.groupName ? ` • ${student.groupName}` : ''}
                    </Text>
                  </View>

                  {/* Admission Mode & Type */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Admission Mode</Text>
                    <Text style={styles.fieldValue}>
                      {student.admissionMode} {student.admissionType !== '-' ? `(${student.admissionType})` : ''}
                    </Text>
                  </View>

                  {/* Scholarship */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>Scholarship</Text>
                    <Text style={styles.fieldValue}>{student.scholarship}</Text>
                  </View>

                  {/* First Language */}
                  <View style={styles.gridItem}>
                    <Text style={styles.fieldLabel}>First Language</Text>
                    <Text style={styles.fieldValue}>{student.firstLanguage}</Text>
                  </View>

                  {/* 10th Record */}
                  {student.schoolName10th && (
                    <View style={[styles.gridItem, styles.gridItemFull]}>
                      <Text style={styles.fieldLabel}>10th Standard School</Text>
                      <Text style={styles.fieldValue}>{student.schoolName10th}</Text>
                      <Text style={styles.fieldSubValue}>
                        Year: {student.yearOfPassing10th || '-'} • Marks: {student.obtainedMark10th || '-'} • Medium:{' '}
                        {student.mediumOfEducation10th || '-'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: REPORT (MARKS) */}
          {activeTab === 'report' && (
            <View style={styles.tabContentContainer}>
              {reports.length === 0 ? (
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIconCircle}>
                    <FileSpreadsheet size={32} color="#94A3B8" />
                  </View>
                  <Text style={styles.emptyCardTitle}>No Exam Reports Available</Text>
                  <Text style={styles.emptyCardSubtitle}>
                    There are no recorded exam results or report cards for this student in the current session.
                  </Text>
                </View>
              ) : (
                reports.map((exam) => (
                  <View key={exam.examId} style={styles.examCard}>
                    <View style={styles.examCardHeader}>
                      <View>
                        <Text style={styles.examNameText}>{exam.examName}</Text>
                        <Text style={styles.examScoreMeta}>
                          Total: {exam.totalObtained} / {exam.totalPossible} ({exam.percentage}%)
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.examStatusBadge,
                          exam.status === 'Pass'
                            ? styles.examStatusPass
                            : exam.status === 'Fail'
                            ? styles.examStatusFail
                            : styles.examStatusPending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.examStatusText,
                            exam.status === 'Pass'
                              ? styles.examStatusTextPass
                              : exam.status === 'Fail'
                              ? styles.examStatusTextFail
                              : styles.examStatusTextPending,
                          ]}
                        >
                          {exam.status}
                        </Text>
                      </View>
                    </View>

                    {/* Subject Marks Table */}
                    <View style={styles.subjectsTable}>
                      <View style={styles.subjectsTableHeader}>
                        <Text style={[styles.subjectsTableCol, { flex: 2 }]}>Subject</Text>
                        <Text style={[styles.subjectsTableCol, { textAlign: 'center' }]}>Marks</Text>
                        <Text style={[styles.subjectsTableCol, { textAlign: 'right' }]}>Result</Text>
                      </View>

                      {exam.subjects.map((sub, idx) => (
                        <View key={sub.subjectId || idx} style={styles.subjectRow}>
                          <Text style={[styles.subjectNameText, { flex: 2 }]} numberOfLines={1}>
                            {sub.subjectName}
                          </Text>
                          <Text style={[styles.subjectMarkText, { textAlign: 'center' }]}>
                            {sub.obtainedMarks} / {sub.maxMarks}
                          </Text>
                          <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text
                              style={[
                                styles.subjectResultBadge,
                                sub.isPassed ? styles.resultPass : styles.resultFail,
                              ]}
                            >
                              {sub.isAbsent ? 'Absent' : sub.isPassed ? 'Pass (P)' : 'Fail (F)'}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* TAB 3: ACADEMIC HISTORY */}
          {activeTab === 'history' && (
            <View style={styles.tabContentContainer}>
              {academicHistory.length === 0 ? (
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIconCircle}>
                    <Clock size={32} color="#94A3B8" />
                  </View>
                  <Text style={styles.emptyCardTitle}>No Academic History</Text>
                  <Text style={styles.emptyCardSubtitle}>
                    No previous year academic history mappings were found for this student.
                  </Text>
                </View>
              ) : (
                academicHistory.map((item, index) => (
                  <View key={item.id || index} style={styles.historyCard}>
                    <View style={styles.historyCardHeader}>
                      <View style={styles.historyYearRow}>
                        <Calendar size={16} color="#6559FC" />
                        <Text style={styles.historyYearText}>{item.academicYear}</Text>
                      </View>

                      <View
                        style={[
                          styles.historyStatusBadge,
                          item.isCurrent ? styles.historyStatusCurrent : styles.historyStatusArchived,
                        ]}
                      >
                        <Text
                          style={[
                            styles.historyStatusText,
                            item.isCurrent ? styles.historyStatusTextCurrent : styles.historyStatusTextArchived,
                          ]}
                        >
                          {item.isCurrent ? 'Current Student' : 'Archived'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.historyDetailsRow}>
                      <View style={styles.historyDetailItem}>
                        <Text style={styles.historyDetailLabel}>Class & Section</Text>
                        <Text style={styles.historyDetailValue}>
                          {item.className} - {item.sectionName}
                        </Text>
                      </View>

                      <View style={styles.historyDetailItem}>
                        <Text style={styles.historyDetailLabel}>Roll Number</Text>
                        <Text style={styles.historyDetailValue}>{item.rollNumber || '-'}</Text>
                      </View>

                      <View style={styles.historyDetailItem}>
                        <Text style={styles.historyDetailLabel}>Medium</Text>
                        <Text style={styles.historyDetailValue}>{item.mediumName || '-'}</Text>
                      </View>
                    </View>

                    {item.remark ? (
                      <View style={styles.historyRemarkBox}>
                        <Text style={styles.historyRemarkText}>Remark: {item.remark}</Text>
                      </View>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      ) : null}

      {/* Edit Student Modal */}
      {student && student.isSectionIncharge && (
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <EditStudentModal
            visible={isEditModalVisible}
            student={student as any}
            onClose={() => setIsEditModalVisible(false)}
            onSuccess={handleSaveSuccess}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  navTitleContainer: {
    flex: 1,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  navSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  refreshIconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  errorCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6559FC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  // Hero Profile Card
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EEF2FF',
    marginBottom: 16,
    shadowColor: '#6559FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4F46E5',
  },
  avatarVerifiedBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#10B981',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  heroBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  statusPillActive: {
    backgroundColor: '#ECFDF5',
  },
  statusPillInactive: {
    backgroundColor: '#F1F5F9',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPillTextActive: {
    color: '#059669',
  },
  statusPillTextInactive: {
    color: '#64748B',
  },
  rollPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  rollPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  classPill: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  classPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  streamPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  streamPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  quickActionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  actionCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircleBtnSpacing: {
    marginLeft: 2,
  },

  // Segmented Tabs
  segmentedTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#6559FC',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabContentContainer: {
    gap: 14,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 14,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  sectionTag: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
    columnGap: 12,
  },
  gridItem: {
    width: '48%',
  },
  gridItemFull: {
    width: '100%',
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 3,
  },
  fieldActionLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6559FC',
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  fieldSubValue: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bloodBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  bloodBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },

  // Parents Cards Row
  parentCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  parentBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  parentBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  parentRoleLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  primaryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4F46E5',
  },
  guardianBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  guardianBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  parentNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  parentMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  phoneActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    marginBottom: 4,
  },
  phoneActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6559FC',
  },
  parentSubMetaText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  parentBoldMeta: {
    fontWeight: '700',
    color: '#0F172A',
  },
  inlineMetaRow: {
    marginTop: 4,
  },
  guardianBox: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // Address Box
  addressBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 6,
  },
  addressMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  addressMetaItem: {
    fontSize: 11,
    color: '#64748B',
  },
  addressMetaBold: {
    fontWeight: '700',
    color: '#0F172A',
  },

  // Tab 2: Reports Cards
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptyCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  examCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 12,
  },
  examNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  examScoreMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  examStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  examStatusPass: {
    backgroundColor: '#ECFDF5',
  },
  examStatusFail: {
    backgroundColor: '#FEE2E2',
  },
  examStatusPending: {
    backgroundColor: '#FEF3C7',
  },
  examStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  examStatusTextPass: {
    color: '#059669',
  },
  examStatusTextFail: {
    color: '#DC2626',
  },
  examStatusTextPending: {
    color: '#D97706',
  },
  subjectsTable: {
    gap: 8,
  },
  subjectsTableHeader: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  subjectsTableCol: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  subjectNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  subjectMarkText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  subjectResultBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  resultPass: {
    color: '#059669',
  },
  resultFail: {
    color: '#DC2626',
  },

  // Tab 3: Academic History
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 10,
  },
  historyYearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyYearText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  historyStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  historyStatusCurrent: {
    backgroundColor: '#ECFDF5',
  },
  historyStatusArchived: {
    backgroundColor: '#F1F5F9',
  },
  historyStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyStatusTextCurrent: {
    color: '#059669',
  },
  historyStatusTextArchived: {
    color: '#64748B',
  },
  historyDetailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  historyDetailItem: {
    flex: 1,
  },
  historyDetailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  historyDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyRemarkBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  historyRemarkText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  navEditBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    marginRight: 8,
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#6559FC',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInchargeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  heroInchargeLeft: {
    flex: 1,
    marginRight: 10,
  },
  inchargeBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginBottom: 2,
  },
  inchargeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6559FC',
  },
  inchargeHintText: {
    fontSize: 11,
    color: '#64748B',
  },
  heroEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6559FC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  heroEditBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
