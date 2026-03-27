'use client';

import { Howl, Howler } from 'howler';

// Sound state
let isMuted = true; // Default: muted ON

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('hexaco-sound-muted');
  isMuted = stored === null ? true : stored === 'true';
  Howler.volume(isMuted ? 0 : 0.5);
}

export function getMuted(): boolean {
  return isMuted;
}

export function setMuted(muted: boolean): void {
  isMuted = muted;
  Howler.volume(muted ? 0 : 0.5);
  if (typeof window !== 'undefined') {
    localStorage.setItem('hexaco-sound-muted', String(muted));
  }
}

export function toggleMute(): boolean {
  setMuted(!isMuted);
  return isMuted;
}

// --- Sound effects ---
// Using Web Audio API generated tones as placeholders
// Replace with real sound files later

let clickSound: Howl | null = null;
let episodeCompleteSound: Howl | null = null;
let resultRevealSound: Howl | null = null;

function getClickSound(): Howl {
  if (!clickSound) {
    // Generate a simple click tone using inline data URI
    clickSound = new Howl({
      src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='],
      volume: 0.3,
      preload: true,
    });
  }
  return clickSound;
}

function getEpisodeCompleteSound(): Howl {
  if (!episodeCompleteSound) {
    episodeCompleteSound = new Howl({
      src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='],
      volume: 0.4,
      preload: true,
    });
  }
  return episodeCompleteSound;
}

function getResultRevealSound(): Howl {
  if (!resultRevealSound) {
    resultRevealSound = new Howl({
      src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='],
      volume: 0.5,
      preload: true,
    });
  }
  return resultRevealSound;
}

// --- Public API ---
export function playClick(): void {
  if (!isMuted) getClickSound().play();
}

export function playEpisodeComplete(): void {
  if (!isMuted) getEpisodeCompleteSound().play();
}

export function playResultReveal(): void {
  if (!isMuted) getResultRevealSound().play();
}

// Ambient loops (placeholder - no actual ambient files yet)
let currentAmbient: Howl | null = null;

export function startAmbient(_episode: number): void {
  // Will be implemented when sound files are available
  // For now, this is a no-op placeholder
  stopAmbient();
}

export function stopAmbient(): void {
  if (currentAmbient) {
    currentAmbient.fade(currentAmbient.volume(), 0, 500);
    setTimeout(() => {
      currentAmbient?.stop();
      currentAmbient = null;
    }, 500);
  }
}
