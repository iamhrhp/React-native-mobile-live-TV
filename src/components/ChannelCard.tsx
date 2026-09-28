import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ChannelWithStream } from '../types';
import { Heart } from 'iconsax-react-native';

interface Props {
  channel: ChannelWithStream;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const ChannelCard = ({ channel, onPress, onToggleFavorite }: Props) => {
  const isHttpOnIos = Platform.OS === 'ios' && channel?.streamUrl?.startsWith('http://');
  const hasNoStream = !channel?.streamUrl;
  const [imageError, setImageError] = React.useState(false);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {(!channel.logo || imageError) ? (
        <View style={[styles.logo, styles.fallbackLogo]}>
          <Text style={styles.fallbackText}>
            {channel.name ? channel.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
      ) : (
        <Image 
          source={{ uri: channel.logo }} 
          style={styles.logo} 
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{channel.name}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {channel.country?.toUpperCase()} • {channel.languages?.join(', ')}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {channel.categories?.join(', ')}
        </Text>
        {hasNoStream && <Text style={styles.warningBadge}>No Stream URL</Text>}
        {isHttpOnIos && <Text style={styles.warningBadge}>HTTP (Fails on iOS)</Text>}
      </View>
      <TouchableOpacity onPress={onToggleFavorite} style={styles.favBtn}>
        <Heart 
          size="24" 
          color={channel.isFavorite ? "#ff4444" : "#cccccc"} 
          variant={channel.isFavorite ? "Bold" : "Outline"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#11222E',
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  logo: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#0B1319' },
  fallbackLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2CCAD3', 
  },
  fallbackText: {
    color: '#0B1319',
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: { flex: 1, marginLeft: 16 },
  name: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  meta: { fontSize: 12, color: '#8B9DAA', marginTop: 4 },
  category: { fontSize: 12, color: '#8B9DAA', marginTop: 4 },
  warningBadge: { fontSize: 10, color: '#ff4444', marginTop: 4, fontWeight: 'bold' },
  favBtn: { padding: 8 },
});
