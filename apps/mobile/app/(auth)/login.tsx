import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await login(email.trim(), password.trim());
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      router.replace('/(tabs)/analytics');
    } catch (err: any) {
      console.warn('Login error:', err);
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
      const msg =
        err.message === 'INVALID_PASSWORD'
          ? 'Invalid password. Please check and try again.'
          : err.message === 'USER_NOT_FOUND'
          ? 'No account found with this email address.'
          : err.message || 'Login failed. Please check your credentials or network.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact your school administrator or IT support to reset your password.'
    );
  };

  const handleSignup = () => {
    Alert.alert(
      'Sign Up',
      'Staff accounts are created by your institution. Please contact your administrator.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Top Brand */}
            <View style={styles.brandContainer}>
              <Text style={styles.brandTitle}>Rexdeia</Text>
            </View>

            {/* Header Text */}
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.subtitleText}>
                Sign in to your account to get started.
              </Text>
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Form */}
            <View style={styles.form}>
              {/* Email Field */}
              <View
                style={[
                  styles.inputContainer,
                  isEmailFocused && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address"
                  placeholderTextColor="#6B7280"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCorrect={false}
                />
                <View style={styles.iconContainer}>
                  <Mail size={20} color="#374151" strokeWidth={1.75} />
                </View>
              </View>

              {/* Password Field */}
              <View
                style={[
                  styles.inputContainer,
                  isPasswordFocused && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#6B7280"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  secureTextEntry={isPasswordHidden}
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {isPasswordHidden ? (
                    <EyeOff size={20} color="#374151" strokeWidth={1.75} />
                  ) : (
                    <Eye size={20} color="#374151" strokeWidth={1.75} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign in</Text>
                )}
              </TouchableOpacity>

              {/* Don't have an account? Signup */}
              <View style={styles.signupContainer}>
                <Text style={styles.dontHaveAccountText}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={handleSignup} activeOpacity={0.7}>
                  <Text style={styles.signupLinkText}>Signup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© rexdeia 2025</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 44,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#673AB7',
    letterSpacing: 0.5,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  inputContainerFocused: {
    borderColor: '#673AB7',
    borderWidth: 1.5,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
  },
  iconContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 24,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#673AB7',
    fontWeight: '500',
  },
  signInButton: {
    height: 50,
    backgroundColor: '#7C4DFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  dontHaveAccountText: {
    fontSize: 14,
    color: '#374151',
  },
  signupLinkText: {
    fontSize: 14,
    color: '#673AB7',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
