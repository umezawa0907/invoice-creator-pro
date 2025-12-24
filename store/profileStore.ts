/**
 * プロフィール状態管理
 */

import { create } from 'zustand';
import { IssuerProfile, CreateProfileData, UpdateProfileData } from '@/types';
import { ProfileService } from '@/services/ProfileService';

interface ProfileState {
  // 状態
  profiles: IssuerProfile[];
  defaultProfile: IssuerProfile | null;
  isLoading: boolean;
  error: string | null;

  // アクション
  loadProfiles: () => Promise<void>;
  addProfile: (data: CreateProfileData) => Promise<string | null>;
  updateProfile: (id: string, updates: UpdateProfileData) => Promise<boolean>;
  deleteProfile: (id: string) => Promise<boolean>;
  setDefaultProfile: (id: string) => Promise<boolean>;
  refreshProfiles: () => Promise<void>;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  // 初期状態
  profiles: [],
  defaultProfile: null,
  isLoading: false,
  error: null,

  // プロフィール一覧の読み込み
  loadProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const profiles = await ProfileService.loadAll();
      const defaultProfile = profiles.find(p => p.meta.isDefault) || profiles[0] || null;
      set({ profiles, defaultProfile, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'プロフィールの読み込みに失敗しました';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // プロフィールの追加
  addProfile: async (data: CreateProfileData) => {
    set({ isLoading: true, error: null });
    try {
      const newProfile = await ProfileService.create(data);
      const profiles = [...get().profiles, newProfile];
      const defaultProfile = newProfile.meta.isDefault ? newProfile : get().defaultProfile;
      set({ profiles, defaultProfile, isLoading: false });
      return newProfile.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'プロフィールの追加に失敗しました';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  // プロフィールの更新
  updateProfile: async (id: string, updates: UpdateProfileData) => {
    set({ isLoading: true, error: null });
    try {
      const success = await ProfileService.update(id, updates);
      if (success) {
        await get().refreshProfiles();
      }
      set({ isLoading: false });
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'プロフィールの更新に失敗しました';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // プロフィールの削除
  deleteProfile: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await ProfileService.delete(id);
      if (success) {
        await get().refreshProfiles();
      }
      set({ isLoading: false });
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'プロフィールの削除に失敗しました';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // デフォルトプロフィールの設定
  setDefaultProfile: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await ProfileService.setDefault(id);
      if (success) {
        await get().refreshProfiles();
      }
      set({ isLoading: false });
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'デフォルトプロフィールの設定に失敗しました';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // プロフィール一覧の再読み込み
  refreshProfiles: async () => {
    const profiles = await ProfileService.loadAll();
    const defaultProfile = profiles.find(p => p.meta.isDefault) || profiles[0] || null;
    set({ profiles, defaultProfile });
  },

  // エラーのクリア
  clearError: () => {
    set({ error: null });
  },
}));
