import axios from 'axios';
import { ApiChannel, ApiStream } from '../types';

const CHANNELS_URL = 'https://iptv-org.github.io/api/channels.json';
const STREAMS_URL = 'https://iptv-org.github.io/api/streams.json';

let cachePromise: Promise<{ channels: ApiChannel[], streams: ApiStream[] }> | null = null;

export const fetchIptvData = async (forceRefresh = false) => {
  if (forceRefresh || !cachePromise) {
    cachePromise = Promise.all([
      axios.get<ApiChannel[]>(CHANNELS_URL),
      axios.get<ApiStream[]>(STREAMS_URL),
    ]).then(([channelsRes, streamsRes]) => ({
      channels: channelsRes.data,
      streams: streamsRes.data,
    })).catch(err => {
      cachePromise = null;
      throw err;
    });
  }
  return cachePromise;
};
