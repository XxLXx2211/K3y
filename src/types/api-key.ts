export interface ApiKeyItem {
  id: string;
  name: string;
  service: string;
  key: string;
  category: string;
  description?: string;
  expiration?: string;
}
