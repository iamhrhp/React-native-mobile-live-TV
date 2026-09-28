export interface ApiChannel {
  id: string;
  name: string;
  alt_names: string[];
  network: string | null;
  owners: string[];
  country: string;
  subdivision: string | null;
  city: string | null;
  broadcast_area: string[];
  languages: string[];
  categories: string[];
  is_nsfw: boolean;
  launched: string | null;
  closed: string | null;
  replaced_by: string | null;
  website: string | null;
  logo: string | null;
}

export interface ApiStream {
  channel: string;
  url: string;
  timeshift: string | null;
  http_referrer: string | null;
  user_agent: string | null;
}

export interface ChannelWithStream extends ApiChannel {
  streamUrl?: string;
  isFavorite?: boolean;
}
