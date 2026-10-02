import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStorage, getSafeSessionStorage } from '@/lib/storage/safeStorage';

describe('Safe Storage Adapter Unit Tests', () => {
  // UT-STO-01: MemoryStorage functionality
  describe('MemoryStorage In-Memory Implementation', () => {
    it('sets, gets, and removes values correctly in memory', () => {
      const storage = new MemoryStorage();
      assert.equal(storage.getItem('test_key'), null);
      assert.equal(storage.isMemoryFallback, true);

      storage.setItem('test_key', 'test_value');
      assert.equal(storage.getItem('test_key'), 'test_value');

      storage.removeItem('test_key');
      assert.equal(storage.getItem('test_key'), null);
    });

    it('clears all entries when clear() is invoked', () => {
      const storage = new MemoryStorage();
      storage.setItem('k1', 'v1');
      storage.setItem('k2', 'v2');

      storage.clear();
      assert.equal(storage.getItem('k1'), null);
      assert.equal(storage.getItem('k2'), null);
    });
  });

  // UT-STO-02 & UT-STO-03: getSafeSessionStorage resilience
  describe('getSafeSessionStorage Environment Handling', () => {
    it('returns an object implementing SafeStorage in server/node environment', () => {
      const storage = getSafeSessionStorage();
      assert.ok(storage);
      assert.equal(typeof storage.getItem, 'function');
      assert.equal(typeof storage.setItem, 'function');
      assert.equal(typeof storage.removeItem, 'function');
      assert.equal(typeof storage.clear, 'function');
    });

    it('safely stores and retrieves keys in Node without throwing exceptions', () => {
      const storage = getSafeSessionStorage();
      storage.setItem('probe_key', 'probe_value');
      assert.equal(storage.getItem('probe_key'), 'probe_value');
      storage.removeItem('probe_key');
      assert.equal(storage.getItem('probe_key'), null);
    });
  });
});
