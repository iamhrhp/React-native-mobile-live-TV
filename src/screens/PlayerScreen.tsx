import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { ArrowLeft2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

export const PlayerScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { channel } = route.params;
  const isHttpOnIos = Platform.OS === 'ios' && channel?.streamUrl?.startsWith('http://');
  const [loading, setLoading] = useState(!isHttpOnIos);
  const [error, setError] = useState(isHttpOnIos);
  const [errorMsg, setErrorMsg] = useState(isHttpOnIos ? 'HTTP streams are not currently working well on iOS.' : 'Stream is currently unavailable or unsupported.');

  const videoRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Keep app in portrait by default
    Orientation.lockToPortrait();

    return () => {
      // Ensure it stays portrait when leaving
      Orientation.lockToPortrait();
    };
  }, []);

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (loading && !error) {
      timeout = setTimeout(() => {
        setLoading(false);
        setError(true);
        setErrorMsg('Stream timed out. It might be offline.');
      }, 10000); // 10 seconds timeout for IPTV streams
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [loading, error]);

  return (
    <View style={styles.container}>
      {loading && !error && (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      )}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity 
            style={{ marginTop: 20, padding: 12, paddingHorizontal: 30, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 25 }} 
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={StyleSheet.absoluteFill} pointerEvents={loading ? 'none' : 'auto'}>
          <Video
            ref={videoRef}
            source={{ uri: channel?.streamUrl }}
            style={StyleSheet.absoluteFill}
            controls={true}
            resizeMode="contain"
            fullscreenAutorotate={true}
            onLoad={() => setLoading(false)}
            onReadyForDisplay={() => {
              setLoading(false);
              if (Platform.OS === 'ios') {
                videoRef.current?.presentFullscreenPlayer();
              }
            }}
            onFullscreenPlayerWillPresent={() => {
              // Instead of forcefully breaking the OS rotation lock, simply unlock the 
              // orientation so the user can physically rotate their phone to go landscape!
              Orientation.unlockAllOrientations();
            }}
            onFullscreenPlayerWillDismiss={() => {
              Orientation.lockToPortrait();
            }}
            onFullscreenPlayerDidDismiss={() => {
              Orientation.lockToPortrait();
              if (Platform.OS === 'ios') {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }
            }}
            onError={(e) => {
              console.log("Video playback error: ", e);
              setLoading(false);
              setError(true);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  headerSafeArea: {
    position: 'absolute',
    top: 120,
    left: 20,
    zIndex: 99999,
    elevation: 10,
  },
  backButton: {
    padding: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  loader: { position: 'absolute', alignSelf: 'center', zIndex: 10 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#ff4444', fontSize: 16, textAlign: 'center' },
  controlsOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  playPauseBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 10,
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 16,
  }
});
