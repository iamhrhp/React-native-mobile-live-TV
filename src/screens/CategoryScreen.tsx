import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Play, Warning2 } from 'iconsax-react-native';

type CategoryScreenRouteProp = RouteProp<{ Category: { title: string, channels: any[] } }, 'Category'>;

export const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { title, channels } = route.params;

  const renderPortraitCard = ({ item }: { item: any }) => {
    const isHttp = item.streamUrl && item.streamUrl.startsWith('http://');
    const noStream = !item.streamUrl;
    const hasIssue = isHttp || noStream;

    return (
      <TouchableOpacity 
        style={styles.portraitCard}
        onPress={() => navigation.navigate('Player', { channel: item })}
      >
        <View style={styles.posterArea}>
          <Text style={styles.posterTitle} numberOfLines={3}>{item.name}</Text>
          
          {hasIssue && (
            <View style={styles.issueOverlay}>
              <Warning2 size="18" color="#FF4444" variant="Bold" />
            </View>
          )}

          <View style={styles.playOverlay}>
            <Play size="20" color="#FFF" variant="Bold" />
          </View>
        </View>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={channels}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={renderPortraitCard}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1319' },
  list: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  portraitCard: {
    width: '31%',
    alignItems: 'center',
  },
  posterArea: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: '#11222E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  posterTitle: {
    color: '#2CCAD3',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    padding: 6,
  },
  playOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    color: '#8B9DAA',
    fontSize: 11,
    textAlign: 'center',
    width: '100%',
  },
});
