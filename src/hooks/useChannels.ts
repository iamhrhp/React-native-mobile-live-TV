import { useState, useEffect, useMemo } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { fetchIptvData } from '../api/iptv';
import { ChannelWithStream } from '../types';

export const useChannels = () => {
  const [channels, setChannels] = useState<ChannelWithStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('IN');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    // Load favorites from encrypted storage
    EncryptedStorage.getItem('favoriteChannels').then(saved => {
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    }).catch(console.error);

    loadData();
  }, []);

  const loadData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      
      const { channels: apiChannels, streams: apiStreams } = await fetchIptvData(forceRefresh);
      
      // Create a map of streams by channel ID for fast lookup
      const streamMap = new Map<string, string>();
      apiStreams.forEach(stream => {
        if (!streamMap.has(stream.channel)) {
           streamMap.set(stream.channel, stream.url);
        }
      });

      // Map streams to channels and strictly filter out anything without an HTTPS stream
      const mappedChannels: ChannelWithStream[] = apiChannels
        .map(channel => ({
          ...channel,
          streamUrl: streamMap.get(channel?.id),
        }))
        .filter(channel => channel.streamUrl && channel.streamUrl.startsWith('https://'));

      setChannels(mappedChannels);
    } catch (err) {
      setError('Failed to fetch channel data. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleFavorite = (channelId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(channelId)) next.delete(channelId);
      else next.add(channelId);
      
      // Persist to encrypted storage securely
      EncryptedStorage.setItem('favoriteChannels', JSON.stringify(Array.from(next))).catch(console.error);
      
      return next;
    });
  };

  const countries = useMemo(() => {
    const list = Array.from(new Set(channels.map(c => c.country).filter(Boolean)));
    const sorted = list.sort();
    const withoutIN = sorted.filter(c => c !== 'IN');
    if (sorted.includes('IN')) {
      return ['All', 'IN', ...withoutIN];
    }
    return ['All', ...sorted];
  }, [channels]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(channels.flatMap(c => c.categories).filter(Boolean)));
    return ['All', ...list.sort()];
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesCountry = selectedCountry === 'All' || c.country === selectedCountry;
      const matchesCategory = selectedCategory === 'All' || c.categories.includes(selectedCategory);
      return matchesSearch && matchesCountry && matchesCategory;
    }).map(c => ({ ...c, isFavorite: favorites.has(c.id) }));
  }, [channels, debouncedSearchQuery, selectedCountry, selectedCategory, favorites]);

  return {
    channels: filteredChannels,
    loading,
    refreshing,
    error,
    searchQuery,
    setSearchQuery,
    countries,
    selectedCountry,
    setSelectedCountry,
    categories,
    selectedCategory,
    setSelectedCategory,
    toggleFavorite,
    retry: loadData
  };
};
