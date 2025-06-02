export interface ApiKeyItem {
  id: string;
  name: string;
  service: string;
  key: string;
  category: string;
  description?: string;
  expiration?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PasswordItem {
  id: string;
  name: string;
  service: string;
  password: string;
  category: string;
  description?: string;
  expiration?: string;
  created_at?: string;
  updated_at?: string;
}
