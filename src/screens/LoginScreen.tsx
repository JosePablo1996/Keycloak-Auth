import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
};

const LoginScreen: React.FC = () => {
  const { login, isLoading, authState } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Animaciones
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const logoScale = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  // Colores tema Netflix/Spotify Neon
  const neonColors = {
    netflixRed: '#E50914',
    spotifyGreen: '#1DB954',
    neonBlue: '#00D9FF',
    neonPurple: '#8B5CF6',
    neonPink: '#FF2D95',
    darkBg: '#0A0A0A',
    cardBg: '#141414',
    textPrimary: '#FFFFFF',
    textSecondary: '#B3B3B3',
  };

  // Navegación automática después del login exitoso
  useEffect(() => {
    if (authState.isAuthenticated) {
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Profile');
      }, 2000);
    }
  }, [authState.isAuthenticated, navigation]);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación del logo - combinación de pulsación y rotación
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      )
    ]).start();
  }, []);

  // Dimensiones responsivas
  const getCardWidth = () => {
    if (isMobile) return '95%';
    if (isTablet) return '80%';
    return '60%';
  };

  const getMaxWidth = () => {
    if (isDesktop) return 1200;
    if (isTablet) return 800;
    return 480;
  };

  const getCardPadding = () => {
    if (isMobile) return 24;
    if (isTablet) return 36;
    return 40;
  };

  const getTitleSize = () => {
    if (isMobile) return 28;
    if (isTablet) return 32;
    return 36;
  };

  const getSubtitleSize = () => {
    if (isMobile) return 15;
    if (isTablet) return 16;
    return 18;
  };

  const getInputPadding = () => {
    if (isMobile) return 16;
    if (isTablet) return 18;
    return 20;
  };

  const getInputFontSize = () => {
    if (isMobile) return 16;
    if (isTablet) return 17;
    return 18;
  };

  const getButtonPadding = () => {
    if (isMobile) return 16;
    if (isTablet) return 18;
    return 20;
  };

  const getButtonFontSize = () => {
    if (isMobile) return 17;
    if (isTablet) return 18;
    return 19;
  };

  const getLabelSize = () => {
    if (isMobile) return 15;
    if (isTablet) return 16;
    return 17;
  };

  const getIconSize = () => {
    if (isMobile) return 36;
    if (isTablet) return 42;
    return 48;
  };

  const getFormWidth = () => {
    if (isDesktop) return '95%';
    if (isTablet) return '98%';
    return '100%';
  };

  const getFormGap = () => {
    if (isDesktop) return 24;
    if (isTablet) return 20;
    return 18;
  };

  const getMinHeight = () => {
    if (isDesktop) return 600;
    if (isTablet) return 500;
    return 0;
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleNavigateToWelcome = () => {
    navigation.navigate('Welcome');
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogin = async () => {
    if (!username || username.trim() === '' || !password || password.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      await login(username.trim(), password.trim());
    } catch (error) {
      Alert.alert('Error de Autenticación', 'Usuario o contraseña incorrectos');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigation.navigate('Profile');
  };

  return (
    <View style={[styles.container, { backgroundColor: neonColors.darkBg }]}>
      
      {/* Fondo Estático Mejorado */}
      <View style={styles.staticBackground}>
        <View style={[styles.backgroundShape1, { backgroundColor: neonColors.neonPurple }]} />
        <View style={[styles.backgroundShape2, { backgroundColor: neonColors.spotifyGreen }]} />
        <View style={[styles.backgroundShape3, { backgroundColor: neonColors.neonBlue }]} />
        <View style={[styles.backgroundShape4, { backgroundColor: neonColors.netflixRed }]} />
      </View>

      {/* Modal de Conexión Exitosa */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={handleCloseSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Animated.View 
              style={[
                styles.successIconContainer,
                { 
                  backgroundColor: `${neonColors.spotifyGreen}20`,
                  borderColor: neonColors.spotifyGreen,
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              <MaterialCommunityIcons 
                name="check-circle" 
                size={60} 
                color={neonColors.spotifyGreen} 
              />
            </Animated.View>
            <Text style={styles.modalTitle}>¡Conexión Exitosa!</Text>
            <Text style={styles.modalSubtitle}>
              Autenticación completada correctamente
            </Text>
            <View style={styles.modalInfo}>
              <MaterialCommunityIcons name="shield-check" size={16} color={neonColors.neonBlue} />
              <Text style={styles.modalInfoText}>
                Redirigiendo al perfil...
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardWrapper}>
            <Animated.View 
              style={[
                styles.card,
                {
                  backgroundColor: neonColors.cardBg,
                  width: getCardWidth(),
                  maxWidth: getMaxWidth(),
                  padding: getCardPadding(),
                  minHeight: getMinHeight(),
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {/* Header con Logo React */}
              <View style={styles.header}>
                <Animated.View 
                  style={[
                    styles.logoContainer, 
                    { 
                      borderColor: neonColors.neonBlue,
                      backgroundColor: `${neonColors.neonBlue}15`,
                      transform: [
                        { scale: pulseAnim },
                        { rotate: rotateInterpolate }
                      ]
                    }
                  ]}
                >
                  <FontAwesome5 
                    name="react" 
                    size={getIconSize()} 
                    color={neonColors.neonBlue} 
                  />
                </Animated.View>
                <Text style={[styles.title, { 
                  fontSize: getTitleSize(),
                  color: neonColors.textPrimary 
                }]}>
                  Iniciar Sesión
                </Text>
                <Text style={[styles.subtitle, { 
                  fontSize: getSubtitleSize(),
                  color: neonColors.spotifyGreen 
                }]}>
                  Accede a tu cuenta segura
                </Text>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: neonColors.spotifyGreen }]} />
                <MaterialCommunityIcons name="shield-account" size={24} color={neonColors.spotifyGreen} />
                <View style={[styles.dividerLine, { backgroundColor: neonColors.spotifyGreen }]} />
              </View>

              {/* Formulario */}
              <View style={[
                styles.form, 
                { 
                  width: getFormWidth(),
                  gap: getFormGap(),
                  alignSelf: 'center'
                }
              ]}>
                {/* Campo Usuario */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="account-circle" size={20} color={neonColors.neonBlue} />
                    <Text style={[styles.label, { 
                      fontSize: getLabelSize(),
                      color: neonColors.neonBlue 
                    }]}>
                      Usuario *
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        padding: getInputPadding(),
                        fontSize: getInputFontSize(),
                        borderColor: neonColors.neonBlue,
                        color: neonColors.textPrimary
                      }
                    ]}
                    placeholder="Ingresa tu usuario"
                    placeholderTextColor={neonColors.textSecondary}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    editable={!isLoading}
                  />
                </View>

                {/* Campo Contraseña */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="lock" size={20} color={neonColors.neonBlue} />
                    <Text style={[styles.label, { 
                      fontSize: getLabelSize(),
                      color: neonColors.neonBlue 
                    }]}>
                      Contraseña *
                    </Text>
                  </View>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        { 
                          padding: getInputPadding(),
                          fontSize: getInputFontSize(),
                          borderColor: neonColors.neonBlue,
                          color: neonColors.textPrimary
                        }
                      ]}
                      placeholder="Ingresa tu contraseña"
                      placeholderTextColor={neonColors.textSecondary}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      style={[
                        styles.eyeButton,
                        { top: getInputPadding() }
                      ]}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <MaterialCommunityIcons 
                        name={showPassword ? "eye-off" : "eye"} 
                        size={24} 
                        color={neonColors.neonBlue} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botón de Login */}
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    {
                      paddingVertical: getButtonPadding(),
                      backgroundColor: neonColors.spotifyGreen,
                    },
                    isLoading && styles.buttonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    {isLoading ? (
                      <Ionicons name="refresh" size={22} color="#000000" />
                    ) : (
                      <MaterialCommunityIcons name="login" size={22} color="#000000" />
                    )}
                    <Text style={[
                      styles.loginButtonText,
                      { fontSize: getButtonFontSize() }
                    ]}>
                      {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Botón de Registro */}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    {
                      paddingVertical: getButtonPadding() - 4,
                      borderColor: neonColors.neonPurple,
                      backgroundColor: `${neonColors.neonPurple}15`,
                    }
                  ]}
                  onPress={handleNavigateToRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <MaterialCommunityIcons name="account-plus" size={22} color={neonColors.neonPurple} />
                    <Text style={[
                      styles.registerButtonText,
                      { fontSize: getButtonFontSize() - 1 }
                    ]}>
                      Crear Nueva Cuenta
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Estado de carga */}
                {isLoading && (
                  <View style={[styles.loadingContainer, { borderColor: neonColors.spotifyGreen }]}>
                    <MaterialCommunityIcons name="shield-sync" size={20} color={neonColors.spotifyGreen} />
                    <Text style={[styles.loadingText, { color: neonColors.spotifyGreen }]}>
                      Autenticando con Keycloak...
                    </Text>
                  </View>
                )}

                {/* Botón para volver a Welcome */}
                <TouchableOpacity 
                  style={[
                    styles.backButton,
                    { 
                      borderColor: neonColors.neonBlue,
                      backgroundColor: `${neonColors.neonBlue}10`
                    }
                  ]}
                  onPress={handleNavigateToWelcome}
                  disabled={isLoading}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="home" size={20} color={neonColors.neonBlue} />
                    <Text style={[styles.backButtonText, { 
                      color: neonColors.neonBlue,
                      fontSize: getLabelSize() 
                    }]}>
                      Volver al Inicio
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Información del sistema */}
                <View style={[styles.infoContainer, { borderColor: neonColors.neonBlue }]}>
                  <View style={styles.infoHeader}>
                    <MaterialCommunityIcons name="security" size={18} color={neonColors.spotifyGreen} />
                    <Text style={[styles.infoTitle, { color: neonColors.spotifyGreen }]}>
                      Autenticación Segura Keycloak
                    </Text>
                  </View>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons name="server" size={14} color={neonColors.neonBlue} />
                      <Text style={[styles.infoText, { color: neonColors.textSecondary }]}>
                        localhost:8080
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons name="account-group" size={14} color={neonColors.neonBlue} />
                      <Text style={[styles.infoText, { color: neonColors.textSecondary }]}>
                        Realm: test-realm
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Enhanced Footer */}
                <View style={styles.enhancedFooter}>
                  <View style={[styles.footerDivider, { backgroundColor: neonColors.spotifyGreen }]} />
                  <View style={styles.footerContent}>
                    <View style={styles.footerTextContainer}>
                      <Text style={[styles.footerText, { color: neonColors.textSecondary }]}>
                        Desarrollado con ❤️ por Jose Pablo Miranda Quintanilla
                      </Text>
                      <Text style={[styles.footerSubtext, { color: neonColors.textSecondary }]}>
                        Soluciones de autenticación seguras y modernas
                      </Text>
                    </View>
                    <View style={styles.securityBadge}>
                      <View style={styles.badgeIcons}>
                        <FontAwesome5 name="react" size={isMobile ? 14 : 16} color={neonColors.spotifyGreen} />
                        <MaterialCommunityIcons name="shield-account" size={isMobile ? 14 : 16} color={neonColors.spotifyGreen} />
                        <FontAwesome name="key" size={isMobile ? 12 : 14} color={neonColors.spotifyGreen} />
                      </View>
                      <Text style={[styles.securityText, { color: neonColors.textSecondary }]}>
                        Powered by Keycloak
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  staticBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  backgroundShape1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.08,
    transform: [{ rotate: '45deg' }],
  },
  backgroundShape2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.06,
    transform: [{ rotate: '-30deg' }],
  },
  backgroundShape3: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.05,
  },
  backgroundShape4: {
    position: 'absolute',
    bottom: '20%',
    right: '15%',
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.04,
    transform: [{ rotate: '15deg' }],
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1DB954',
    maxWidth: 400,
    width: '90%',
  },
  successIconContainer: {
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 3,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00D9FF',
  },
  modalInfoText: {
    fontSize: 14,
    color: '#00D9FF',
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    minHeight: '100%',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    marginVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    padding: 20,
    borderRadius: 60,
    marginBottom: 18,
    borderWidth: 3,
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    opacity: 0.3,
    borderRadius: 1,
  },
  form: {
    // Las propiedades dinámicas se aplican inline
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  label: {
    fontWeight: '700',
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 55,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    transform: [{ translateY: -11 }],
    padding: 6,
  },
  loginButton: {
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  registerButton: {
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loginButtonText: {
    color: '#000000',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  registerButtonText: {
    color: '#8B5CF6',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 8,
  },
  backButtonText: {
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 217, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoGrid: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  // Enhanced Footer Styles
  enhancedFooter: {
    marginTop: 24,
    paddingTop: 20,
  },
  footerDivider: {
    height: 2,
    borderRadius: 1,
    marginBottom: 16,
    opacity: 0.3,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'left',
    fontStyle: 'italic',
    marginBottom: 4,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 10,
    textAlign: 'left',
    opacity: 0.8,
  },
  securityBadge: {
    alignItems: 'flex-end',
  },
  badgeIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  securityText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'right',
  },
});

export default LoginScreen;