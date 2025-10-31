import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons, FontAwesome } from '@expo/vector-icons';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Profile: undefined;
};

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  const [currentScreen, setCurrentScreen] = useState<'features' | 'login'>('features');
  const [isAnimating, setIsAnimating] = useState(false);

  // Animaciones
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const screenSlideAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  // Colores tema Netflix/Spotify Neon
  const neonColors = {
    netflixRed: '#E50914',
    spotifyGreen: '#1DB954',
    neonPink: '#FF006E',
    neonPurple: '#8B5CF6',
    neonBlue: '#00D9FF',
    neonYellow: '#FFD60A',
    darkBg: '#0A0A0A',
    cardBg: '#141414',
    textPrimary: '#FFFFFF',
    textSecondary: '#B3B3B3',
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
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

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  const handleNavigateToFeatures = () => {
    if (isAnimating || currentScreen === 'features') return;
    
    setIsAnimating(true);
    Animated.timing(screenSlideAnim, {
      toValue: -1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreen('features');
      screenSlideAnim.setValue(0);
      setIsAnimating(false);
    });
  };

  const screenTranslateX = screenSlideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-width, 0, width],
  });

  const cardScale = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Determinar número de columnas según el dispositivo
  const getGridColumns = () => {
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
  };

  const gridColumns = getGridColumns();

  const renderFeaturesSection = () => (
    <View style={styles.column}>
      <ScrollView 
        contentContainerStyle={styles.featuresScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.featuresContainer}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.View style={[
              styles.logoContainer, 
              { 
                transform: [
                  { scale: pulseAnim },
                  { rotate: rotateInterpolate }
                ] 
              }
            ]}>
              <View style={[styles.logoCircle, { borderColor: neonColors.spotifyGreen }]}>
                <FontAwesome5 name="react" size={isMobile ? 44 : isTablet ? 52 : 60} color={neonColors.spotifyGreen} />
              </View>
            </Animated.View>
            
            <Text style={[styles.heroTitle, { color: neonColors.textPrimary }]}>
              Keycloak Auth
            </Text>
            <Text style={[styles.heroSubtitle, { color: neonColors.spotifyGreen }]}>
              Tu acceso seguro comienza aquí
            </Text>
          </View>

          {/* Features Grid - Cuadrícula Responsiva */}
          <View style={[styles.featuresGrid, { 
            flexDirection: gridColumns === 1 ? 'column' : 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }]}>
            {/* Feature 1 */}
            <View style={[
              styles.featureCard, 
              { 
                borderLeftColor: neonColors.netflixRed,
                width: gridColumns === 1 ? '100%' : gridColumns === 2 ? '48%' : '31%'
              }
            ]}>
              <View style={[styles.featureIconBox, { backgroundColor: `${neonColors.netflixRed}20` }]}>
                <MaterialCommunityIcons name="shield-lock" size={isMobile ? 22 : 26} color={neonColors.netflixRed} />
              </View>
              <Text style={[styles.featureTitle, { color: neonColors.textPrimary }]}>
                Seguridad Avanzada
              </Text>
              <Text style={[styles.featureDescription, { color: neonColors.textSecondary }]}>
                Autenticación robusta con Keycloak y cifrado de última generación
              </Text>
            </View>

            {/* Feature 2 */}
            <View style={[
              styles.featureCard, 
              { 
                borderLeftColor: neonColors.spotifyGreen,
                width: gridColumns === 1 ? '100%' : gridColumns === 2 ? '48%' : '31%'
              }
            ]}>
              <View style={[styles.featureIconBox, { backgroundColor: `${neonColors.spotifyGreen}20` }]}>
                <FontAwesome5 name="react" size={isMobile ? 22 : 26} color={neonColors.spotifyGreen} />
              </View>
              <Text style={[styles.featureTitle, { color: neonColors.textPrimary }]}>
                React Native
              </Text>
              <Text style={[styles.featureDescription, { color: neonColors.textSecondary }]}>
                Desarrollado con la última tecnología de React Native y Expo
              </Text>
            </View>

            {/* Feature 3 */}
            <View style={[
              styles.featureCard, 
              { 
                borderLeftColor: neonColors.neonBlue,
                width: gridColumns === 1 ? '100%' : gridColumns === 2 ? '48%' : '31%'
              }
            ]}>
              <View style={[styles.featureIconBox, { backgroundColor: `${neonColors.neonBlue}20` }]}>
                <Ionicons name="phone-portrait" size={isMobile ? 22 : 26} color={neonColors.neonBlue} />
              </View>
              <Text style={[styles.featureTitle, { color: neonColors.textPrimary }]}>
                Diseño Responsive
              </Text>
              <Text style={[styles.featureDescription, { color: neonColors.textSecondary }]}>
                Interfaz adaptable a todos los dispositivos móviles y tablets
              </Text>
            </View>

            {/* Feature 4 */}
            <View style={[
              styles.featureCard, 
              { 
                borderLeftColor: neonColors.neonPink,
                width: gridColumns === 1 ? '100%' : gridColumns === 2 ? '48%' : '31%'
              }
            ]}>
              <View style={[styles.featureIconBox, { backgroundColor: `${neonColors.neonPink}20` }]}>
                <MaterialIcons name="animation" size={isMobile ? 22 : 26} color={neonColors.neonPink} />
              </View>
              <Text style={[styles.featureTitle, { color: neonColors.textPrimary }]}>
                UX Fluida
              </Text>
              <Text style={[styles.featureDescription, { color: neonColors.textSecondary }]}>
                Experiencia de usuario mejorada con animaciones nativas suaves
              </Text>
            </View>

            {/* Feature 5 */}
            <View style={[
              styles.featureCard, 
              { 
                borderLeftColor: neonColors.neonPurple,
                width: gridColumns === 1 ? '100%' : gridColumns === 2 ? '48%' : '31%'
              }
            ]}>
              <View style={[styles.featureIconBox, { backgroundColor: `${neonColors.neonPurple}20` }]}>
                <MaterialCommunityIcons name="rocket-launch" size={isMobile ? 22 : 26} color={neonColors.neonPurple} />
              </View>
              <Text style={[styles.featureTitle, { color: neonColors.textPrimary }]}>
                Alto Rendimiento
              </Text>
              <Text style={[styles.featureDescription, { color: neonColors.textSecondary }]}>
                Optimizado para máxima velocidad y eficiencia energética
              </Text>
            </View>

            {/* Feature 6 */}
            <View style={[
              styles.featureCard, 
              { 
                borderLeftColor: neonColors.neonYellow,
                width: gridColumns === 1 ? '100%' : gridColumns === 2 ? '48%' : '31%'
              }
            ]}>
              <View style={[styles.featureIconBox, { backgroundColor: `${neonColors.neonYellow}20` }]}>
                <FontAwesome5 name="code" size={isMobile ? 22 : 26} color={neonColors.neonYellow} />
              </View>
              <Text style={[styles.featureTitle, { color: neonColors.textPrimary }]}>
                Código Limpio
              </Text>
              <Text style={[styles.featureDescription, { color: neonColors.textSecondary }]}>
                Base de código mantenible y extensible para desarrolladores
              </Text>
            </View>
          </View>

          {/* CTA Button */}
          <Animated.View style={{ opacity: glowOpacity }}>
            <TouchableOpacity 
              style={[
                styles.ctaButton,
                { 
                  backgroundColor: neonColors.spotifyGreen,
                  shadowColor: neonColors.spotifyGreen
                }
              ]}
              onPress={handleNavigateToLogin}
              disabled={isAnimating}
            >
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons name="login-variant" size={isMobile ? 22 : 26} color="#000000" />
                <Text style={styles.ctaButtonText}>Acceder Ahora</Text>
                <MaterialIcons name="arrow-forward" size={isMobile ? 22 : 26} color="#000000" />
              </View>
            </TouchableOpacity>
          </Animated.View>

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
      </ScrollView>
    </View>
  );

  const renderLoginSection = () => (
    <View style={styles.column}>
      <ScrollView 
        contentContainerStyle={styles.loginScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isMobile && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleNavigateToFeatures}
            disabled={isAnimating}
          >
            <Ionicons name="arrow-back" size={22} color={neonColors.spotifyGreen} />
            <Text style={[styles.backButtonText, { color: neonColors.spotifyGreen }]}>
              Volver
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.loginContent}>
          {/* Header */}
          <View style={styles.loginHeader}>
            <Animated.View 
              style={[
                styles.loginIconContainer,
                { 
                  transform: [
                    { scale: pulseAnim },
                    { rotate: rotateInterpolate }
                  ],
                  borderColor: neonColors.netflixRed,
                  backgroundColor: `${neonColors.netflixRed}15`
                }
              ]}
            >
              <FontAwesome5 name="react" size={isMobile ? 32 : isTablet ? 38 : 44} color={neonColors.netflixRed} />
            </Animated.View>
            <Text style={[styles.loginGreeting, { color: neonColors.textPrimary }]}>
              ¡Bienvenido de Vuelta!
            </Text>
            <Text style={[styles.loginSubtitle, { color: neonColors.spotifyGreen }]}>
              Tu aventura continúa
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.loginDividerContainer}>
            <View style={[styles.loginDividerLine, { backgroundColor: neonColors.spotifyGreen }]} />
            <MaterialCommunityIcons name="shield-star" size={isMobile ? 24 : 30} color={neonColors.spotifyGreen} />
            <View style={[styles.loginDividerLine, { backgroundColor: neonColors.spotifyGreen }]} />
          </View>

          {/* Content */}
          <View style={styles.loginContentBody}>
            <View style={styles.loginSectionHeader}>
              <FontAwesome5 name="user-shield" size={isMobile ? 20 : 24} color={neonColors.neonBlue} />
              <Text style={[styles.loginSectionTitle, { color: neonColors.textPrimary }]}>
                Acceso Seguro
              </Text>
            </View>
            
            <Text style={[styles.loginDescription, { color: neonColors.textSecondary }]}>
              Conéctate de manera segura usando tus credenciales corporativas mediante nuestro sistema de autenticación centralizada Keycloak
            </Text>

            {/* CTA Button */}
            <Animated.View style={{ opacity: glowOpacity }}>
              <TouchableOpacity 
                style={[
                  styles.loginButton, 
                  { 
                    backgroundColor: neonColors.netflixRed,
                    shadowColor: neonColors.netflixRed
                  }
                ]}
                onPress={handleNavigateToLogin}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons name="key-chain" size={isMobile ? 20 : 24} color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>Acceder con Keycloak</Text>
                  <MaterialIcons name="arrow-forward" size={isMobile ? 18 : 22} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Back Button */}
          <TouchableOpacity 
            style={[
              styles.secondaryBackButton,
              { borderColor: neonColors.spotifyGreen }
            ]}
            onPress={handleNavigateToFeatures}
            disabled={isAnimating}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="arrow-back" size={18} color={neonColors.spotifyGreen} />
              <Text style={[styles.secondaryBackButtonText, { color: neonColors.spotifyGreen }]}>
                Ver Características
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderAnimatedScreen = () => {
    const screenToRender = currentScreen === 'features' ? renderFeaturesSection() : renderLoginSection();
    
    return (
      <Animated.View 
        style={[
          styles.animatedScreen,
          {
            transform: [{ translateX: screenTranslateX }]
          }
        ]}
      >
        {screenToRender}
      </Animated.View>
    );
  };

  // Calcular tamaño máximo de la card según dispositivo
  const getMaxCardWidth = () => {
    if (isDesktop) return 1200;
    if (isTablet) return 900;
    return 440;
  };

  const maxCardWidth = getMaxCardWidth();

  return (
    <View style={[styles.container, { backgroundColor: neonColors.darkBg }]}>
      {/* Gradient Background */}
      <View style={styles.gradientBackground}>
        <View style={[styles.gradientCircle1, { backgroundColor: neonColors.netflixRed }]} />
        <View style={[styles.gradientCircle2, { backgroundColor: neonColors.spotifyGreen }]} />
        <View style={[styles.gradientCircle3, { backgroundColor: neonColors.neonPurple }]} />
      </View>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.card,
            {
              backgroundColor: neonColors.cardBg,
              opacity: fadeAnim,
              transform: [{ scale: cardScale }],
              maxWidth: maxCardWidth,
            }
          ]}
        >
          {renderAnimatedScreen()}
        </Animated.View>
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
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  gradientCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.1,
  },
  gradientCircle3: {
    position: 'absolute',
    top: '40%',
    right: -150,
    width: 350,
    height: 350,
    borderRadius: 175,
    opacity: 0.08,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    minHeight: '100%',
  },
  card: {
    borderRadius: 20,
    width: '100%',
    minHeight: 550,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  animatedScreen: {
    flex: 1,
    minHeight: 550,
  },
  column: {
    flex: 1,
    padding: 24,
  },
  featuresScrollContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  loginScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  // Features Section
  featuresContainer: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    padding: 20,
    borderRadius: 60,
    borderWidth: 3,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresGrid: {
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 18,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  featureIconBox: {
    padding: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  ctaButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
    letterSpacing: 0.5,
  },
  // Enhanced Footer Styles
  enhancedFooter: {
    marginTop: 20,
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
  // Login Section
  loginContent: {
    flex: 1,
    justifyContent: 'center',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loginIconContainer: {
    padding: 18,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  loginGreeting: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loginSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  loginDividerLine: {
    flex: 1,
    height: 2,
    opacity: 0.3,
    borderRadius: 1,
  },
  loginContentBody: {
    marginBottom: 24,
  },
  loginSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  loginSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  loginDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  loginButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  secondaryBackButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 24,
    alignSelf: 'center',
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  secondaryBackButtonText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default WelcomeScreen;