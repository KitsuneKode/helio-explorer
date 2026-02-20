import { createMMKV } from 'react-native-mmkv'

class LocalStorage {
  private storage: ReturnType<typeof createMMKV>

  constructor(id: string) {
    this.storage = createMMKV({ id })
  }

  getItem(key: string) {
    return this.storage.getString(key)
  }
  contains(key: string) {
    return this.storage.contains(key)
  }

  setItem(key: string, value: string) {
    this.storage.set(key, value)
  }

  removeItem(key: string) {
    this.storage.remove(key)
  }
}

export const storage = new LocalStorage('my-app-storage')
