import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  useWindowDimensions,
  ActivityIndicator
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons, FontAwesome } from '@expo/vector-icons';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Profile: undefined;
};

// Extender UserInfo para campos personalizados
interface ExtendedUserInfo {
  phone?: string;
  address?: string; // NUEVO CAMPO AGREGADO
  sub?: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

const ProfileScreen: React.FC = () => {
  const { authState, logout, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Animaciones
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  // Colores tema Netflix/Spotify Neon
  const neonColors = {
    netflixRed: '#E50914',
    spotifyGreen: '#1DB954',
    neonBlue: '#00D9FF',
    neonPurple: '#8B5CF6',
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
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
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
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2500,
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
      ),
    ]).start();
  }, []);

  // Calcular dimensiones dinámicas responsivas
  const getCardWidth = () => {
    if (isMobile) return '98%';
    if (isTablet) return '90%';
    return '85%';
  };

  const getMaxWidth = () => {
    if (isDesktop) return 1400;
    if (isTablet) return 1000;
    return 480;
  };

  const getCardPadding = () => {
    if (isMobile) return 24;
    if (isTablet) return 32;
    return 40;
  };

  const getTitleSize = () => {
    if (isMobile) return 28;
    if (isTablet) return 34;
    return 42;
  };

  const getSubtitleSize = () => {
    if (isMobile) return 15;
    if (isTablet) return 17;
    return 20;
  };

  const getLabelSize = () => {
    if (isMobile) return 15;
    if (isTablet) return 17;
    return 19;
  };

  const getIconSize = () => {
    if (isMobile) return 36;
    if (isTablet) return 46;
    return 56;
  };

  const getButtonPadding = () => {
    if (isMobile) return 16;
    if (isTablet) return 20;
    return 24;
  };

  const getButtonFontSize = () => {
    if (isMobile) return 17;
    if (isTablet) return 19;
    return 22;
  };

  const getInfoFontSize = () => {
    if (isMobile) return 14;
    if (isTablet) return 17;
    return 20;
  };

  const getSectionTitleSize = () => {
    if (isMobile) return 18;
    if (isTablet) return 22;
    return 26;
  };

  const getContentWidth = () => {
    if (isDesktop) return '98%';
    if (isTablet) return '98%';
    return '100%';
  };

  const getMinHeight = () => {
    if (isDesktop) return 700;
    if (isTablet) return 600;
    return 0;
  };

  const getSectionGap = () => {
    if (isDesktop) return 40;
    if (isTablet) return 32;
    return 24;
  };

  const getInfoCardPadding = () => {
    if (isDesktop) return 24;
    if (isTablet) return 20;
    return 18;
  };

  const getSessionCardPadding = () => {
    if (isDesktop) return 20;
    if (isTablet) return 16;
    return 15;
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleLogout = () => {
    logout();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  if (!authState.userInfo) {
    return (
      <View style={[styles.container, { backgroundColor: neonColors.darkBg }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={neonColors.spotifyGreen} />
          <Text style={[styles.loadingText, { color: neonColors.textPrimary }]}>
            Cargando información del usuario...
          </Text>
        </View>
      </View>
    );
  }

  const user = authState.userInfo as ExtendedUserInfo;
  const phoneNumber = user.phone;
  const userAddress = user.address; // NUEVA VARIABLE PARA DIRECCIÓN

  return (
    <View style={[styles.container, { backgroundColor: neonColors.darkBg }]}>
      {/* Gradient Background */}
      <View style={styles.gradientBackground}>
        <View style={[styles.gradientCircle1, { backgroundColor: neonColors.netflixRed }]} />
        <View style={[styles.gradientCircle2, { backgroundColor: neonColors.spotifyGreen }]} />
        <View style={[styles.gradientCircle3, { backgroundColor: neonColors.neonPurple }]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
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
            {/* Header */}
            <View style={styles.header}>
              <Animated.View 
                style={[
                  styles.logoContainer, 
                  { 
                    borderColor: neonColors.spotifyGreen,
                    backgroundColor: `${neonColors.spotifyGreen}15`,
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
                  color={neonColors.spotifyGreen} 
                />
              </Animated.View>
              <Text style={[styles.title, { 
                fontSize: getTitleSize(),
                color: neonColors.textPrimary 
              }]}>
                Perfil de Usuario
              </Text>
              <Text style={[styles.subtitle, { 
                fontSize: getSubtitleSize(),
                color: neonColors.spotifyGreen 
              }]}>
                Información de tu cuenta
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: neonColors.spotifyGreen }]} />
              <MaterialCommunityIcons name="shield-account" size={28} color={neonColors.spotifyGreen} />
              <View style={[styles.dividerLine, { backgroundColor: neonColors.spotifyGreen }]} />
            </View>

            {/* Contenedor principal del contenido */}
            <View style={[
              styles.contentContainer,
              { 
                width: getContentWidth(),
                gap: getSectionGap(),
                alignSelf: 'center'
              }
            ]}>
              {/* Información Personal */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="person" size={26} color={neonColors.neonBlue} />
                  <Text style={[styles.sectionTitle, { 
                    color: neonColors.neonBlue,
                    fontSize: getSectionTitleSize()
                  }]}>
                    Información Personal
                  </Text>
                </View>

                <View style={styles.infoGrid}>
                  {/* Username */}
                  <View style={[styles.infoCard, { padding: getInfoCardPadding() }]}>
                    <View style={[styles.infoIcon, { backgroundColor: `${neonColors.spotifyGreen}20` }]}>
                      <FontAwesome5 name="user" size={20} color={neonColors.spotifyGreen} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { 
                        color: neonColors.textSecondary,
                        fontSize: getLabelSize()
                      }]}>
                        Username
                      </Text>
                      <Text style={[styles.infoValue, { 
                        color: neonColors.spotifyGreen, 
                        fontSize: getInfoFontSize() 
                      }]}>
                        {user.preferred_username || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Email */}
                  <View style={[styles.infoCard, { padding: getInfoCardPadding() }]}>
                    <View style={[styles.infoIcon, { backgroundColor: `${neonColors.neonBlue}20` }]}>
                      <MaterialIcons name="email" size={20} color={neonColors.neonBlue} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { 
                        color: neonColors.textSecondary,
                        fontSize: getLabelSize()
                      }]}>
                        Email
                      </Text>
                      <Text style={[styles.infoValue, { 
                        color: neonColors.neonBlue, 
                        fontSize: getInfoFontSize() 
                      }]}>
                        {user.email || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Teléfono */}
                  <View style={[styles.infoCard, { padding: getInfoCardPadding() }]}>
                    <View style={[styles.infoIcon, { backgroundColor: `${neonColors.neonPurple}20` }]}>
                      <Ionicons name="phone-portrait" size={20} color={neonColors.neonPurple} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { 
                        color: neonColors.textSecondary,
                        fontSize: getLabelSize()
                      }]}>
                        Teléfono
                      </Text>
                      <Text style={[styles.infoValue, { 
                        color: neonColors.neonPurple, 
                        fontSize: getInfoFontSize() 
                      }]}>
                        {phoneNumber || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* NUEVO CAMPO: Dirección */}
                  <View style={[styles.infoCard, { padding: getInfoCardPadding() }]}>
                    <View style={[styles.infoIcon, { backgroundColor: `${neonColors.netflixRed}20` }]}>
                      <MaterialCommunityIcons name="home-map-marker" size={20} color={neonColors.netflixRed} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { 
                        color: neonColors.textSecondary,
                        fontSize: getLabelSize()
                      }]}>
                        Dirección
                      </Text>
                      <Text style={[styles.infoValue, { 
                        color: neonColors.netflixRed, 
                        fontSize: getInfoFontSize() 
                      }]}>
                        {userAddress || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Nombre */}
                  <View style={[styles.infoCard, { padding: getInfoCardPadding() }]}>
                    <View style={[styles.infoIcon, { backgroundColor: `${neonColors.spotifyGreen}20` }]}>
                      <FontAwesome5 name="signature" size={18} color={neonColors.spotifyGreen} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { 
                        color: neonColors.textSecondary,
                        fontSize: getLabelSize()
                      }]}>
                        Nombre Completo
                      </Text>
                      <Text style={[styles.infoValue, { 
                        color: neonColors.spotifyGreen, 
                        fontSize: getInfoFontSize() 
                      }]}>
                        {user.name || `${user.given_name || ''} ${user.family_name || ''}`.trim() || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* ID del Usuario */}
                  <View style={[styles.infoCard, { padding: getInfoCardPadding() }]}>
                    <View style={[styles.infoIcon, { backgroundColor: `${neonColors.neonPurple}20` }]}>
                      <MaterialCommunityIcons name="identifier" size={20} color={neonColors.neonPurple} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { 
                        color: neonColors.textSecondary,
                        fontSize: getLabelSize()
                      }]}>
                        User ID
                      </Text>
                      <Text style={[styles.infoValue, { 
                        color: neonColors.neonPurple, 
                        fontSize: getInfoFontSize() 
                      }]}>
                        {user.sub || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Información de la Sesión */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="shield-check" size={26} color={neonColors.spotifyGreen} />
                  <Text style={[styles.sectionTitle, { 
                    color: neonColors.spotifyGreen,
                    fontSize: getSectionTitleSize()
                  }]}>
                    Estado de la Sesión
                  </Text>
                </View>

                <View style={styles.sessionGrid}>
                  <View style={[styles.sessionCard, { padding: getSessionCardPadding() }]}>
                    <View style={[styles.sessionIcon, { backgroundColor: `${neonColors.spotifyGreen}20` }]}>
                      <Ionicons name="checkmark-done" size={22} color={neonColors.spotifyGreen} />
                    </View>
                    <Text style={[styles.sessionLabel, { 
                      color: neonColors.textSecondary,
                      fontSize: getLabelSize()
                    }]}>
                      Autenticado
                    </Text>
                    <Text style={[styles.sessionValue, { 
                      color: neonColors.spotifyGreen,
                      fontSize: getInfoFontSize()
                    }]}>
                      Sí
                    </Text>
                  </View>

                  <View style={[styles.sessionCard, { padding: getSessionCardPadding() }]}>
                    <View style={[styles.sessionIcon, { backgroundColor: `${neonColors.neonBlue}20` }]}>
                      <MaterialCommunityIcons name="clock" size={22} color={neonColors.neonBlue} />
                    </View>
                    <Text style={[styles.sessionLabel, { 
                      color: neonColors.textSecondary,
                      fontSize: getLabelSize()
                    }]}>
                      Sesión activa
                    </Text>
                    <Text style={[styles.sessionValue, { 
                      color: neonColors.neonBlue,
                      fontSize: getInfoFontSize()
                    }]}>
                      Ahora
                    </Text>
                  </View>

                  <View style={[styles.sessionCard, { padding: getSessionCardPadding() }]}>
                    <View style={[styles.sessionIcon, { backgroundColor: `${neonColors.neonPurple}20` }]}>
                      <FontAwesome5 name="key" size={20} color={neonColors.neonPurple} />
                    </View>
                    <Text style={[styles.sessionLabel, { 
                      color: neonColors.textSecondary,
                      fontSize: getLabelSize()
                    }]}>
                      Proveedor
                    </Text>
                    <Text style={[styles.sessionValue, { 
                      color: neonColors.neonPurple,
                      fontSize: getInfoFontSize()
                    }]}>
                      Keycloak
                    </Text>
                  </View>
                </View>
              </View>

              {/* Botón de Logout */}
              <Animated.View style={{ opacity: glowOpacity }}>
                <TouchableOpacity 
                  style={[
                    styles.logoutButton,
                    {
                      paddingVertical: getButtonPadding(),
                      backgroundColor: neonColors.netflixRed,
                      shadowColor: neonColors.netflixRed,
                    },
                    isLoading && styles.buttonDisabled,
                  ]}
                  onPress={handleLogout}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="log-out" size={26} color="#000000" />
                    <Text style={[
                      styles.logoutButtonText,
                      { fontSize: getButtonFontSize() }
                    ]}>
                      {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                    </Text>
                    <MaterialIcons name="exit-to-app" size={24} color="#000000" />
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {/* Información del sistema */}
              <View style={[styles.infoContainer, { 
                borderColor: neonColors.neonBlue,
                padding: getInfoCardPadding()
              }]}>
                <View style={styles.infoHeader}>
                  <FontAwesome5 name="react" size={20} color={neonColors.spotifyGreen} />
                  <Text style={[styles.infoTitle, { 
                    color: neonColors.spotifyGreen,
                    fontSize: getLabelSize()
                  }]}>
                    Autenticación Segura
                  </Text>
                </View>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Ionicons name="server" size={16} color={neonColors.neonBlue} />
                    <Text style={[styles.infoText, { 
                      color: neonColors.textSecondary,
                      fontSize: getInfoFontSize()
                    }]}>
                      localhost:8080
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="shield-account" size={16} color={neonColors.neonBlue} />
                    <Text style={[styles.infoText, { 
                      color: neonColors.textSecondary,
                      fontSize: getInfoFontSize()
                    }]}>
                      Realm: test-realm
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="key" size={16} color={neonColors.neonBlue} />
                    <Text style={[styles.infoText, { 
                      color: neonColors.textSecondary,
                      fontSize: getInfoFontSize()
                    }]}>
                      Client: react-client
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="home-account" size={16} color={neonColors.neonBlue} />
                    <Text style={[styles.infoText, { 
                      color: neonColors.textSecondary,
                      fontSize: getInfoFontSize()
                    }]}>
                      Campo Dirección: Activo
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  gradientCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.15,
  },
  gradientCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.12,
  },
  gradientCircle3: {
    position: 'absolute',
    top: '45%',
    right: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.1,
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
    boxShadow: '0 10px 20px rgba(29, 185, 84, 0.3)',
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
    boxShadow: '0 0 15px rgba(29, 185, 84, 0.5)',
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
  contentContainer: {
    // Las propiedades dinámicas se aplican inline
  },
  section: {
    // marginBottom se maneja ahora con gap del contentContainer
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    marginLeft: 10,
    textShadowColor: 'currentColor',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  infoGrid: {
    gap: 15,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    padding: 10,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    marginBottom: 4,
    opacity: 0.8,
  },
  infoValue: {
    fontWeight: '600',
    textShadowColor: 'currentColor',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  sessionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  sessionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    flex: 1,
  },
  sessionIcon: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
  },
  sessionLabel: {
    marginBottom: 4,
    textAlign: 'center',
    opacity: 0.8,
  },
  sessionValue: {
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'currentColor',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  logoutButton: {
    borderRadius: 14,
    boxShadow: '0 8px 20px rgba(229, 9, 20, 0.6)',
    elevation: 12,
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
  logoutButtonText: {
    color: '#000000',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  infoContainer: {
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
    fontWeight: '700',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  infoText: {
    // fontSize se aplica dinámicamente
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 20,
    opacity: 0.8,
    textAlign: 'center',
  },
});

export default ProfileScreen;