import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User, Lock1, Eye, ArrowRight } from 'iconsax-react-native';

export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.replace('Home')} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.topSection}>
            <Text style={styles.logoText}>MoonSky</Text>
            <Text style={styles.logoSubtext}>iptv player</Text>
          </View>

          <View style={styles.middleSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Log <Text style={styles.titleHighlight}>in</Text> to Your</Text>
              <Text style={styles.title}>Account</Text>
            </View>

            <Text style={styles.subtitle}>
              with this application, you can watch your broadcasts using the link you receive ip tv service
            </Text>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.inputContainer}>
              <User size="22" color="#8B9DAA" style={styles.inputIcon} variant="Linear" />
              <TextInput 
                style={styles.input}
                placeholder="Enter Your Username"
                placeholderTextColor="#55697A"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock1 size="22" color="#8B9DAA" style={styles.inputIcon} variant="Linear" />
              <TextInput 
                style={styles.input}
                placeholder="Enter Your Password"
                placeholderTextColor="#55697A"
                secureTextEntry
              />
              <Eye size="22" color="#8B9DAA" style={styles.inputRightIcon} variant="Linear" />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.replace('Home')}>
              <Text style={styles.loginBtnText}>Login</Text>
              <ArrowRight size="20" color="#FFFFFF" variant="Linear" />
            </TouchableOpacity>
            
            <Text style={styles.versionText}>Version 0.0.1</Text>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: '#0B1319',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 19, 25, 0.88)', 
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#8B9DAA',
    fontSize: 16,
    fontWeight: '500',
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  logoSubtext: {
    color: '#8B9DAA',
    fontSize: 14,
    marginTop: 2,
  },
  middleSection: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
  },
  titleHighlight: {
    color: '#8B9DAA',
  },
  subtitle: {
    color: '#8B9DAA',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSection: {
    flex: 1.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 34, 46, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 60,
    marginBottom: 20,
    width: '100%',
  },
  inputIcon: {
    marginRight: 15,
  },
  inputRightIcon: {
    marginLeft: 15,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: '#2CCAD3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    height: 60,
    width: '100%',
    marginTop: 10,
    shadowColor: '#2CCAD3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  versionText: {
    color: '#55697A',
    fontSize: 12,
    marginTop: 30,
  }
});
