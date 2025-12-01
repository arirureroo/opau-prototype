import { DatabaseInitError } from './errors'

export interface DBConfig {
  dbName: string
  version: number
  stores: StoreConfig[]
}

export interface StoreConfig {
  name: string
  keyPath: string
  indexes?: IndexConfig[]
}

export interface IndexConfig {
  name: string
  keyPath: string
  unique: boolean
}

export class IndexedDBConnection {
  private db: IDBDatabase | null = null
  private config: DBConfig

  constructor(config: DBConfig) {
    this.config = config
  }

  async open(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version)

      request.onerror = () => {
        reject(new DatabaseInitError('Failed to open database', request.error))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(request.result)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        this.handleUpgrade(db)
      }
    })
  }

  private handleUpgrade(db: IDBDatabase): void {
    for (const storeConfig of this.config.stores) {
      if (!db.objectStoreNames.contains(storeConfig.name)) {
        const objectStore = db.createObjectStore(storeConfig.name, {
          keyPath: storeConfig.keyPath,
        })

        if (storeConfig.indexes) {
          for (const indexConfig of storeConfig.indexes) {
            objectStore.createIndex(indexConfig.name, indexConfig.keyPath, {
              unique: indexConfig.unique,
            })
          }
        }
      }
    }
  }

  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  isOpen(): boolean {
    return this.db !== null
  }
}
