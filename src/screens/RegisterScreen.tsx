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
import { Ionicons, FontAwesome5, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
};

const RegisterScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    fullName: '',
    address: '', // NUEVO CAMPO AÑADIDO
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Animaciones
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
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

  // Animación del logo React
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
    if (isMobile) return 20;
    if (isTablet) return 30;
    return 40;
  };

  const getTitleSize = () => {
    if (isMobile) return 26;
    if (isTablet) return 30;
    return 34;
  };

  const getSubtitleSize = () => {
    if (isMobile) return 14;
    if (isTablet) return 15;
    return 16;
  };

  const getInputPadding = () => {
    if (isMobile) return 14;
    if (isTablet) return 16;
    return 18;
  };

  const getInputFontSize = () => {
    if (isMobile) return 15;
    if (isTablet) return 16;
    return 17;
  };

  const getButtonPadding = () => {
    if (isMobile) return 14;
    if (isTablet) return 16;
    return 18;
  };

  const getButtonFontSize = () => {
    if (isMobile) return 16;
    if (isTablet) return 17;
    return 18;
  };

  const getLabelSize = () => {
    if (isMobile) return 14;
    if (isTablet) return 15;
    return 16;
  };

  const getIconSize = () => {
    if (isMobile) return 32;
    if (isTablet) return 38;
    return 44;
  };

  const getFormWidth = () => {
    if (isDesktop) return '95%';
    if (isTablet) return '98%';
    return '100%';
  };

  const getFormGap = () => {
    if (isDesktop) return 20;
    if (isTablet) return 16;
    return 14;
  };

  const getMinHeight = () => {
    if (isDesktop) return 650;
    if (isTablet) return 550;
    return 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  const handleNavigateToWelcome = () => {
    navigation.navigate('Welcome');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de usuario');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return false;
    }
    if (!formData.address.trim()) { // VALIDACIÓN NUEVA PARA DIRECCIÓN
      Alert.alert('Error', 'Por favor ingresa tu dirección');
      return false;
    }
    if (!formData.password) {
      Alert.alert('Error', 'Por favor ingresa una contraseña');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      phone: '',
      fullName: '',
      address: '', // INCLUIDO EN EL RESET
      password: '',
      confirmPassword: ''
    });
  };

  // Manejar éxito del registro
  const handleSuccess = () => {
    setShowSuccessModal(false);
    resetForm();
    navigation.navigate('Login');
  };

  // Función de registro para producción
  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          fullName: formData.fullName.trim(),
          address: formData.address.trim(), // ENVIADO AL BACKEND
          password: formData.password
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccessModal(true);
      } else {
        Alert.alert('Error en el Registro', result.message || 'No se pudo crear la cuenta.');
      }
    } catch (error) {
      Alert.alert(
        'Error de Conexión', 
        'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: neonColors.darkBg }]}>
      
      {/* Modal de éxito */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Animated.View 
              style={[
                styles.successIcon, 
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
            
            <Text style={styles.modalTitle}>¡Registro Exitoso!</Text>
            
            <Text style={styles.modalMessage}>
              Tu cuenta ha sido creada exitosamente en Keycloak. 
              Ahora puedes iniciar sesión con tus credenciales.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: neonColors.spotifyGreen }]}
                onPress={handleSuccess}
              >
                <Text style={styles.modalButtonText}>Ir al Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'transparent', borderWidth: 2, borderColor: neonColors.neonBlue }]}
                onPress={() => {
                  setShowSuccessModal(false);
                  resetForm();
                }}
              >
                <Text style={[styles.modalButtonText, { color: neonColors.neonBlue }]}>
                  Registrar Otro
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fondo Estático */}
      <View style={styles.staticBackground}>
        <View style={[styles.backgroundShape1, { backgroundColor: neonColors.neonPurple }]} />
        <View style={[styles.backgroundShape2, { backgroundColor: neonColors.spotifyGreen }]} />
        <View style={[styles.backgroundShape3, { backgroundColor: neonColors.neonBlue }]} />
        <View style={[styles.backgroundShape4, { backgroundColor: neonColors.netflixRed }]} />
      </View>

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
              {/* Header con Logo React Animado */}
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
                  Crear Cuenta
                </Text>
                <Text style={[styles.subtitle, { 
                  fontSize: getSubtitleSize(),
                  color: neonColors.neonBlue 
                }]}>
                  Regístrate en nuestra plataforma segura
                </Text>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: neonColors.neonBlue }]} />
                <MaterialCommunityIcons name="account-plus" size={24} color={neonColors.neonBlue} />
                <View style={[styles.dividerLine, { backgroundColor: neonColors.neonBlue }]} />
              </View>

              {/* Formulario de Registro */}
              <View style={[
                styles.form, 
                { 
                  width: getFormWidth(),
                  gap: getFormGap(),
                  alignSelf: 'center'
                }
              ]}>
                {/* Campo Username */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="account" size={18} color={neonColors.neonPurple} />
                    <Text style={[styles.label, { 
                      fontSize: getLabelSize(),
                      color: neonColors.neonPurple 
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
                        borderColor: neonColors.neonPurple,
                        color: neonColors.textPrimary
                      }
                    ]}
                    placeholder="Crea tu nombre de usuario"
                    placeholderTextColor={neonColors.textSecondary}
                    value={formData.username}
                    onChangeText={(text) => handleInputChange('username', text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>

                {/* Campo Email */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="email" size={18} color={neonColors.neonPurple} />
                    <Text style={[styles.label, { 
                      fontSize: getLabelSize(),
                      color: neonColors.neonPurple 
                    }]}>
                      Email *
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        padding: getInputPadding(),
                        fontSize: getInputFontSize(),
                        borderColor: neonColors.neonPurple,
                        color: neonColors.textPrimary
                      }
                    ]}
                    placeholder="tu@email.com"
                    placeholderTextColor={neonColors.textSecondary}
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </View>

                {/* Campo Teléfono */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="phone" size={18} color={neonColors.neonPurple} />
                    <Text style={[styles.label, { 
                      fontSize: getLabelSize(),
                      color: neonColors.neonPurple 
                    }]}>
                      Teléfono
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        padding: getInputPadding(),
                        fontSize: getInputFontSize(),
                        borderColor: neonColors.neonPurple,
                        color: neonColors.textPrimary
                      }
                    ]}
                    placeholder="+1 (555) 123-4567"
                    placeholderTextColor={neonColors.textSecondary}
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    keyboardType="phone-pad"
                    editable={!isLoading}
                  />
                </View>

                {/* Campo Nombre Completo */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="card-account-details" size={18} color={neonColors.neonPurple} />
                    <Text style={[styles.label, { 
                      fontSize: getLabelSize(),
                      color: neonColors.neonPurple 
                    }]}>
                      Nombre Completo *
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        padding: getInputPadding(),
                        fontSize: getInputFontSize(),
                        borderColor: neonColors.neonPurple,
                        color: neonColors.textPrimary
                      }
                    ]}
                    placeholder="Juan Pérez García"
                    placeholderTextColor={neonColors.textSecondary}
                    value={formData.fullName}
                    onChangeText={(text) => handleInputChange('fullName', text)}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                </View>

                {/* NUEVO CAMPO: Dirección */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="home-map-marker" size={18} color={neonColors.neonPurple} />
                    <Text style={[styles.label, { 
                      fontSize: getLabelSize(),
                      color: neonColors.neonPurple 
                    }]}>
                      Dirección *
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        padding: getInputPadding(),
                        fontSize: getInputFontSize(),
                        borderColor: neonColors.neonPurple,
                        color: neonColors.textPrimary
                      }
                    ]}
                    placeholder="Ingresa tu dirección completa"
                    placeholderTextColor={neonColors.textSecondary}
                    value={formData.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                    autoCapitalize="words"
                    editable={!isLoading}
                    multiline={true}
                    numberOfLines={2}
                  />
                </View>

                {/* Campo Contraseña */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="lock" size={18} color={neonColors.neonPurple} />
                    <Text style={[styles.label, { 
                      fontSize: getLabelSize(),
                      color: neonColors.neonPurple 
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
                          borderColor: neonColors.neonPurple,
                          color: neonColors.textPrimary
                        }
                      ]}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={neonColors.textSecondary}
                      value={formData.password}
                      onChangeText={(text) => handleInputChange('password', text)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
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
                        size={22} 
                        color={neonColors.neonPurple} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Campo Confirmar Contraseña */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="lock-check" size={18} color={neonColors.neonPurple} />
                    <Text style={[styles.label, { 
                      fontSize: getLabelSize(),
                      color: neonColors.neonPurple 
                    }]}>
                      Confirmar Contraseña *
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
                          borderColor: neonColors.neonPurple,
                          color: neonColors.textPrimary
                        }
                      ]}
                      placeholder="Repite tu contraseña"
                      placeholderTextColor={neonColors.textSecondary}
                      value={formData.confirmPassword}
                      onChangeText={(text) => handleInputChange('confirmPassword', text)}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      style={[
                        styles.eyeButton,
                        { top: getInputPadding() }
                      ]}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      <MaterialCommunityIcons 
                        name={showConfirmPassword ? "eye-off" : "eye"} 
                        size={22} 
                        color={neonColors.neonPurple} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botón de Registro */}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    {
                      paddingVertical: getButtonPadding(),
                      backgroundColor: neonColors.neonBlue,
                    },
                    isLoading && styles.buttonDisabled,
                  ]}
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    {isLoading ? (
                      <Ionicons name="refresh" size={20} color="#000000" />
                    ) : (
                      <MaterialCommunityIcons name="account-check" size={20} color="#000000" />
                    )}
                    <Text style={[
                      styles.registerButtonText,
                      { fontSize: getButtonFontSize() }
                    ]}>
                      {isLoading ? 'Creando Cuenta...' : 'Crear Cuenta'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Estado de carga */}
                {isLoading && (
                  <View style={[styles.loadingContainer, { borderColor: neonColors.neonBlue }]}>
                    <MaterialCommunityIcons name="account-sync" size={18} color={neonColors.neonBlue} />
                    <Text style={[styles.loadingText, { color: neonColors.neonBlue }]}>
                      {Platform.OS === 'web' ? 'Conectando con el servidor...' : 'Registrando en Keycloak...'}
                    </Text>
                  </View>
                )}

                {/* Botones de Navegación */}
                <View style={styles.navigationButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.secondaryButton,
                      { 
                        borderColor: neonColors.spotifyGreen,
                        backgroundColor: `${neonColors.spotifyGreen}10`
                      }
                    ]}
                    onPress={handleNavigateToLogin}
                    disabled={isLoading}
                  >
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons name="login" size={18} color={neonColors.spotifyGreen} />
                      <Text style={[styles.secondaryButtonText, { 
                        color: neonColors.spotifyGreen,
                        fontSize: getLabelSize() 
                      }]}>
                        Ya tengo cuenta
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.backButton,
                      { 
                        borderColor: neonColors.netflixRed,
                        backgroundColor: `${neonColors.netflixRed}10`
                      }
                    ]}
                    onPress={handleNavigateToWelcome}
                    disabled={isLoading}
                  >
                    <View style={styles.buttonContent}>
                      <Ionicons name="home" size={18} color={neonColors.netflixRed} />
                      <Text style={[styles.backButtonText, { 
                        color: neonColors.netflixRed,
                        fontSize: getLabelSize() 
                      }]}>
                        Volver al Inicio
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Información del sistema */}
                <View style={[styles.infoContainer, { borderColor: neonColors.neonBlue }]}>
                  <View style={styles.infoHeader}>
                    <MaterialCommunityIcons name="key-chain" size={16} color={neonColors.neonBlue} />
                    <Text style={[styles.infoTitle, { color: neonColors.neonBlue }]}>
                      Registro Seguro Keycloak
                    </Text>
                  </View>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons name="server-network" size={12} color={neonColors.spotifyGreen} />
                      <Text style={[styles.infoText, { color: neonColors.textSecondary }]}>
                        Backend: localhost:3001
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons name="shield-check" size={12} color={neonColors.spotifyGreen} />
                      <Text style={[styles.infoText, { color: neonColors.textSecondary }]}>
                        Realm: test-realm
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons name="home-account" size={12} color={neonColors.spotifyGreen} />
                      <Text style={[styles.infoText, { color: neonColors.textSecondary }]}>
                        Campo Dirección: Incluido
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

// Los estilos se mantienen iguales...
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
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
    width: '100%',
    maxWidth: 400,
  },
  successIcon: {
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 3,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
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
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    marginVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    padding: 20,
    borderRadius: 60,
    marginBottom: 16,
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
    marginBottom: 20,
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
    gap: 6,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
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
  registerButton: {
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
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
  registerButtonText: {
    color: '#000000',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  navigationButtons: {
    gap: 8,
    marginTop: 8,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontWeight: '700',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  backButtonText: {
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 16,
    padding: 14,
    backgroundColor: 'rgba(0, 217, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 2,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  infoGrid: {
    gap: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  infoText: {
    fontSize: 11,
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

export default RegisterScreen;