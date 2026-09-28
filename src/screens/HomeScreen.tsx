import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, StyleSheet, Button, ScrollView, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useChannels } from '../hooks/useChannels';
import { ChannelCard } from '../components/ChannelCard';
import { Setting4, HambergerMenu, SearchNormal1, Play, Warning2, ArrowRight2 } from 'iconsax-react-native';

const FilterList = ({ data, selected, onSelect }: any) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
    {data.map((item: string) => (
      <TouchableOpacity 
        key={item} 
        style={[styles.filterChip, selected === item && styles.filterChipActive]}
        onPress={() => onSelect(item)}
      >
        <Text style={[styles.filterText, selected === item && styles.filterTextActive]}>{item}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [searchActive, setSearchActive] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempCountry, setTempCountry] = useState('IN');
  const [tempCategory, setTempCategory] = useState('All');
  const { 
    channels, loading, refreshing, error, retry, 
    searchQuery, setSearchQuery,
    countries, selectedCountry, setSelectedCountry,
    categories, selectedCategory, setSelectedCategory,
    toggleFavorite 
  } = useChannels();

  const openFilterModal = () => {
    setTempCountry(selectedCountry);
    setTempCategory(selectedCategory);
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setSelectedCountry(tempCountry);
    setSelectedCategory(tempCategory);
    setFilterModalVisible(false);
  };

  // Group channels by category
  const groupedChannels = React.useMemo(() => {
    const groups: Record<string, any[]> = {
      'FAVORITES': channels.filter(c => c.isFavorite)
    };
    
    const preferredOrder = ['sports', 'movies', 'movie', 'drama', 'entertainment', 'news', 'kids', 'music'];
    
    // Sort categories based on preferredOrder first, then alphabetically
    const sortedCategories = [...categories.filter(c => c !== 'All')].sort((a, b) => {
      const indexA = preferredOrder.indexOf(a.toLowerCase());
      const indexB = preferredOrder.indexOf(b.toLowerCase());
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
    
    // Pick top categories to display as rows
    const topCategories = sortedCategories.slice(0, 10);
    
    topCategories.forEach(cat => {
      groups[cat.toUpperCase()] = channels.filter(c => c.categories.includes(cat));
    });
    
    return groups;
  }, [channels, categories]);

  if (loading && channels.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2CCAD3" />
        <Text style={styles.loadingText}>Loading Live TV Channels...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => retry()} />
      </View>
    );
  }

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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <HambergerMenu color="#FFFFFF" size="28" />
        </TouchableOpacity>
        
        <Text style={styles.logoText}>Moon Sky <Text style={{fontWeight: '400', fontSize: 16, color: '#8B9DAA'}}>TV</Text></Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconCircle} onPress={openFilterModal}>
            <Setting4 color="#FFFFFF" size="20" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle} onPress={() => setSearchActive(!searchActive)}>
            <SearchNormal1 color="#FFFFFF" size="20" />
          </TouchableOpacity>
        </View>
      </View>

      {searchActive && (
        <View style={styles.searchRow}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search channels..."
            placeholderTextColor="#8B9DAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}
      
      {/* MAIN CONTENT */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedChannels).map(([title, data]) => {
          if (data.length === 0) return null;
          return (
            <View key={title} style={styles.categorySection}>
              <TouchableOpacity 
                style={styles.categoryTitleRow}
                onPress={() => navigation.navigate('Category', { title, channels: data })}
              >
                <Text style={styles.categoryTitle}>{title}</Text>
                <ArrowRight2 size="16" color="#8B9DAA" />
              </TouchableOpacity>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data.slice(0, 15)} // limit to 15 per row for perf
                keyExtractor={item => item.id}
                renderItem={renderPortraitCard}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* FLOATING PILL */}
      <View style={styles.floatingPillContainer}>
        <View style={styles.floatingPill}>
          <TouchableOpacity style={[styles.pillBtn, styles.pillBtnActive]}>
            <Text style={styles.pillTextActive}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.pillBtn} 
            onPress={() => navigation.navigate('Category', { title: 'Favorites', channels: channels.filter(c => c.isFavorite) })}
          >
            <Text style={styles.pillText}>Favorites</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)} activeOpacity={1}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Channels</Text>
            
            <Text style={styles.filterLabel}>Country</Text>
            <FilterList data={countries} selected={tempCountry} onSelect={setTempCountry} />
            
            <Text style={styles.filterLabel}>Category</Text>
            <FilterList data={categories} selected={tempCategory} onSelect={setTempCategory} />
            
            <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1319' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#0B1319' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#8B9DAA' },
  errorText: { color: '#ff4444', marginBottom: 10, textAlign: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#11222E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100, // space for floating pill
  },
  categorySection: {
    marginTop: 24,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    marginLeft: 16,
    letterSpacing: 1,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  portraitCard: {
    width: 120,
    alignItems: 'center',
    marginRight: 12,
  },
  posterArea: {
    width: 120,
    height: 160,
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
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
  },
  posterFallback: {
    color: '#2CCAD3',
    fontWeight: 'bold',
    fontSize: 48,
  },
  playOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    color: '#8B9DAA',
    fontSize: 12,
    textAlign: 'center',
    width: '100%',
  },
  floatingPillContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  floatingPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 34, 46, 0.9)',
    borderRadius: 30,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pillBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  pillBtnActive: {
    backgroundColor: '#2A303C',
  },
  pillText: {
    color: '#8B9DAA',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  searchInput: { 
    flex: 1,
    backgroundColor: '#11222E', 
    color: '#FFFFFF',
    padding: 14, 
    borderRadius: 12, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  filterBtn: {
    backgroundColor: '#11222E',
    padding: 14,
    borderRadius: 12,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterScroll: { paddingHorizontal: 16, marginBottom: 16 },
  filterChip: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    backgroundColor: '#0B1319', 
    borderRadius: 24, 
    marginRight: 10, 
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  filterChipActive: { 
    backgroundColor: '#2CCAD3', 
    borderColor: '#2CCAD3',
  },
  filterText: { color: '#8B9DAA', fontWeight: '500' },
  filterTextActive: { color: '#0B1319', fontWeight: 'bold' },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#11222E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterLabel: {
    color: '#8B9DAA',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 16,
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: '#2CCAD3',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
  },
  applyBtnText: {
    color: '#0B1319',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
