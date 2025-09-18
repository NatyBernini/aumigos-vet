import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePersistentStore } from '@/modules/commons/store';

describe('Persistent Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should be initialized correctly', () => {
    const persistentStore = usePersistentStore();
    expect(persistentStore.jwtToken).toBe(null);
  });
});
