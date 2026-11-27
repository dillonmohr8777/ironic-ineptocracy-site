'use client';
import { useSyncExternalStore } from 'react';
import { currentMode, observeWorld, type Selection } from './worldMode';
export const useWorld = () => useSyncExternalStore(observeWorld, currentMode, () => 'daylight' as const);
export const useSelection = () => useSyncExternalStore(observeWorld, () => document.documentElement.dataset.selection as Selection, () => 'auto' as const);
export const usePaused = () => useSyncExternalStore(observeWorld, () => document.documentElement.dataset.motion === 'paused', () => false);
