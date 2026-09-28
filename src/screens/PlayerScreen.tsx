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

  React.useEffect(() => {
    // Allow rotating the device freely while on the player screen
    Orientation.unlockAllOrientations();

    let timeout: NodeJS.Timeout;
    if (loading && !error) {
      timeout = setTimeout(() => {
        setLoading(false);
        setError(true);
        setErrorMsg('Stream timed out. It might be offline.');
      }, 10000); // 10 seconds timeout for IPTV streams
    }
    return () => {
      clearTimeout(timeout);
      // Always snap back to portrait when leaving this screen
      Orientation.lockToPortrait();
    };
  }, [loading, error]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft2 size="28" color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>

      {loading && !error && (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      )}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <View style={StyleSheet.absoluteFill} pointerEvents={loading ? 'none' : 'auto'}>
          <Video
            source={{ uri: channel?.streamUrl }}
            style={StyleSheet.absoluteFill}
            controls={true}
            resizeMode="contain"
            fullscreenOrientation="landscape"
            fullscreenAutorotate={true}
            onLoad={() => setLoading(false)}
            onReadyForDisplay={() => setLoading(false)}
            onFullscreenPlayerWillPresent={() => {
              Orientation.lockToLandscape();
            }}
            onFullscreenPlayerWillDismiss={() => {
              Orientation.lockToPortrait();
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
    top: 100,
    left: 0,
    zIndex: 9999,
  },
  backButton: {
    padding: 16,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
