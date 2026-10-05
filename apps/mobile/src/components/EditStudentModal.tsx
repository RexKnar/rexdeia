import * as Haptics from 'expo-haptics';
import {
  Check,
  MapPin,
  User,
  Users,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../lib/api';

export interface EditableStudentFields {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  emailId: string;
  phoneNumber: string;
  aadharCardNumber: string;
  religion: string;
  nationality: string;
  community: string;
  caste: string;

  // Parents
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
  annualIncome: string;
  parentsSeparated: string;

  // Guardian
  guardianName?: string;
  guardiansOccupation?: string;
  guardianPhoneNumber?: string;
  guardianEmailId?: string;
  guardianRelationship?: string;
  guardianAadharCardNumber?: string;

  // Address
  residentialAddress: string;
  residentialDistrict: string;
  residentialState: string;
  residentialPostalCode: string;

  permanentAddress?: string;
  permanentDistrict?: string;
  permanentState?: string;
  permanentPostalCode?: string;
}

interface EditStudentModalProps {
  visible: boolean;
  student: EditableStudentFields;
  onClose: () => void;
  onSuccess: (updatedData: Partial<EditableStudentFields>) => void;
}

type TabType = 'personal' | 'parents' | 'address';

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  visible,
  student,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states initialized with student data
  const [formData, setFormData] = useState<EditableStudentFields>({ ...student });

  const handleChange = (key: keyof EditableStudentFields, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopyResidentialToPermanent = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setFormData((prev) => ({
      ...prev,
      permanentAddress: prev.residentialAddress,
      permanentDistrict: prev.residentialDistrict,
      permanentState: prev.residentialState,
      permanentPostalCode: prev.residentialPostalCode,
    }));
  };

  const handleSave = async () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Required Field', 'Please enter student first name.');
      return;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Required Field', 'Please enter student last name.');
      return;
    }

    try {
      setIsSubmitting(true);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}

      await api.put(`/api/mobile/v1/students/${student.id}`, formData);

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      Alert.alert('Success', 'Student details updated successfully.');
      onSuccess(formData);
      onClose();
    } catch (err: any) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
      const errMsg = err?.data?.error || err?.message || 'Failed to update student details.';
      Alert.alert('Error', errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.modalRoot}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
              onClose();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={isSubmitting}
          >
            <X size={22} color="#475569" />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Edit Student Details</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {student.firstName} {student.lastName}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, isSubmitting && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Check size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.saveBtnText}>Save</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Segmented Sub-tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'personal' && styles.tabBtnActive]}
            onPress={() => {
              try {
                Haptics.selectionAsync();
              } catch {}
              setActiveTab('personal');
            }}
          >
            <User size={15} color={activeTab === 'personal' ? '#6559FC' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'personal' && styles.tabTextActive]}>
              Personal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'parents' && styles.tabBtnActive]}
            onPress={() => {
              try {
                Haptics.selectionAsync();
              } catch {}
              setActiveTab('parents');
            }}
          >
            <Users size={15} color={activeTab === 'parents' ? '#6559FC' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'parents' && styles.tabTextActive]}>
              Parents
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'address' && styles.tabBtnActive]}
            onPress={() => {
              try {
                Haptics.selectionAsync();
              } catch {}
              setActiveTab('address');
            }}
          >
            <MapPin size={15} color={activeTab === 'address' ? '#6559FC' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'address' && styles.tabTextActive]}>
              Address
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Form Content */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === 'personal' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Basic Student Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  First Name <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.firstName}
                  onChangeText={(val) => handleChange('firstName', val)}
                  placeholder="Enter first name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Middle Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.middleName || ''}
                  onChangeText={(val) => handleChange('middleName', val)}
                  placeholder="Enter middle name (optional)"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Last Name <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.lastName}
                  onChangeText={(val) => handleChange('lastName', val)}
                  placeholder="Enter last name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.gender}
                    onChangeText={(val) => handleChange('gender', val)}
                    placeholder="Male / Female / Other"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Blood Group</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.bloodGroup}
                    onChangeText={(val) => handleChange('bloodGroup', val)}
                    placeholder="e.g. O+, B+"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.dob}
                  onChangeText={(val) => handleChange('dob', val)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.phoneNumber}
                  onChangeText={(val) => handleChange('phoneNumber', val)}
                  placeholder="Primary phone number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.emailId}
                  onChangeText={(val) => handleChange('emailId', val)}
                  placeholder="student@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Aadhar Card Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.aadharCardNumber}
                  onChangeText={(val) => handleChange('aadharCardNumber', val)}
                  placeholder="12-digit Aadhar number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Religion</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.religion}
                    onChangeText={(val) => handleChange('religion', val)}
                    placeholder="Religion"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Nationality</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.nationality}
                    onChangeText={(val) => handleChange('nationality', val)}
                    placeholder="Nationality"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Community</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.community}
                    onChangeText={(val) => handleChange('community', val)}
                    placeholder="Community"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Caste</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.caste}
                    onChangeText={(val) => handleChange('caste', val)}
                    placeholder="Caste"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>
          )}

          {activeTab === 'parents' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Father's Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Father's Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.fatherName}
                  onChangeText={(val) => handleChange('fatherName', val)}
                  placeholder="Enter father's name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Occupation</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.fatherOccupation}
                    onChangeText={(val) => handleChange('fatherOccupation', val)}
                    placeholder="Occupation"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Phone</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.fatherPhoneNumber}
                    onChangeText={(val) => handleChange('fatherPhoneNumber', val)}
                    placeholder="Phone number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Father's Email ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.fatherEmailId || ''}
                  onChangeText={(val) => handleChange('fatherEmailId', val)}
                  placeholder="father@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Education</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.fatherEducation}
                    onChangeText={(val) => handleChange('fatherEducation', val)}
                    placeholder="e.g. Graduate"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Aadhar Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.fatherAadharCardNumber}
                    onChangeText={(val) => handleChange('fatherAadharCardNumber', val)}
                    placeholder="Aadhar number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Mother's Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mother's Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.motherName}
                  onChangeText={(val) => handleChange('motherName', val)}
                  placeholder="Enter mother's name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Occupation</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.motherOccupation}
                    onChangeText={(val) => handleChange('motherOccupation', val)}
                    placeholder="Occupation"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Phone</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.motherPhoneNumber}
                    onChangeText={(val) => handleChange('motherPhoneNumber', val)}
                    placeholder="Phone number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mother's Email ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.motherEmailId || ''}
                  onChangeText={(val) => handleChange('motherEmailId', val)}
                  placeholder="mother@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Education</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.motherEducation}
                    onChangeText={(val) => handleChange('motherEducation', val)}
                    placeholder="e.g. Graduate"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Aadhar Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.motherAadharCardNumber}
                    onChangeText={(val) => handleChange('motherAadharCardNumber', val)}
                    placeholder="Aadhar number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Annual Family Income</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.annualIncome}
                  onChangeText={(val) => handleChange('annualIncome', val)}
                  placeholder="e.g. 5,00,000"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Guardian Details (Optional)</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Guardian Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.guardianName || ''}
                  onChangeText={(val) => handleChange('guardianName', val)}
                  placeholder="Enter guardian name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Relationship</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.guardianRelationship || ''}
                    onChangeText={(val) => handleChange('guardianRelationship', val)}
                    placeholder="e.g. Uncle"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Phone</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.guardianPhoneNumber || ''}
                    onChangeText={(val) => handleChange('guardianPhoneNumber', val)}
                    placeholder="Phone"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>
          )}

          {activeTab === 'address' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Residential Address</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Street / Building Address</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={formData.residentialAddress}
                  onChangeText={(val) => handleChange('residentialAddress', val)}
                  placeholder="Enter residential address"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>District</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.residentialDistrict}
                    onChangeText={(val) => handleChange('residentialDistrict', val)}
                    placeholder="District"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>State</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.residentialState}
                    onChangeText={(val) => handleChange('residentialState', val)}
                    placeholder="State"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Postal / Pin Code</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.residentialPostalCode}
                  onChangeText={(val) => handleChange('residentialPostalCode', val)}
                  placeholder="6-digit PIN code"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.addressHeaderRow}>
                <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>Permanent Address</Text>
                <TouchableOpacity
                  style={styles.copyAddressBtn}
                  onPress={handleCopyResidentialToPermanent}
                >
                  <Text style={styles.copyAddressText}>Same as Residential</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Street / Building Address</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={formData.permanentAddress || ''}
                  onChangeText={(val) => handleChange('permanentAddress', val)}
                  placeholder="Enter permanent address"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>District</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.permanentDistrict || ''}
                    onChangeText={(val) => handleChange('permanentDistrict', val)}
                    placeholder="District"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>State</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.permanentState || ''}
                    onChangeText={(val) => handleChange('permanentState', val)}
                    placeholder="State"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Postal / Pin Code</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.permanentPostalCode || ''}
                  onChangeText={(val) => handleChange('permanentPostalCode', val)}
                  placeholder="6-digit PIN code"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6559FC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 70,
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6559FC',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#6559FC',
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textAreaInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  twoColRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  copyAddressBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyAddressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6559FC',
  },
});
