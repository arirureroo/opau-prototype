import type { TestResult } from '@/types/test.types'
import { Mode } from '@/types/test.types'
import type { IndexedDBConnection } from './IndexedDBConnection'
import { DatabaseTransactionError } from './errors'

export interface StoredTestResult extends TestResult {
  id: string
  savedAt: number
  version: number
}

export interface TestHistoryStats {
  totalTests: number
  averageAccuracy: number
  averageAPM: number
  rankedCount: number
  practiceCount: number
}

export class TestResultRepository {
  private readonly STORE_NAME = 'testResults'
  private readonly VERSION = 1

  constructor(private connection: IndexedDBConnection) {}

  private async executeTransaction<T>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>,
    errorContext: string,
  ): Promise<T> {
    const db = await this.connection.open()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], mode)
      const objectStore = transaction.objectStore(this.STORE_NAME)
      const request = operation(objectStore)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () =>
        reject(new DatabaseTransactionError(errorContext, undefined, request.error))
    })
  }

  async create(testResult: TestResult): Promise<StoredTestResult> {
    const storedResult: StoredTestResult = {
      ...testResult,
      id: this.generateId(),
      savedAt: Date.now(),
      version: this.VERSION,
    }

    await this.executeTransaction(
      'readwrite',
      (store) => store.add(storedResult),
      'create test result',
    )

    return storedResult
  }

  async getAll(): Promise<StoredTestResult[]> {
    const db = await this.connection.open()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(this.STORE_NAME)
      const index = objectStore.index('savedAt')
      const request = index.openCursor(undefined, 'prev')

      const results: StoredTestResult[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          results.push(cursor.value)
          cursor.continue()
        } else {
          resolve(results)
        }
      }

      request.onerror = () =>
        reject(new DatabaseTransactionError('retrieve all test results', undefined, request.error))
    })
  }

  async getByMode(mode: Mode): Promise<StoredTestResult[]> {
    const db = await this.connection.open()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(this.STORE_NAME)
      const index = objectStore.index('mode')
      const request = index.getAll(mode)

      request.onsuccess = () => {
        const results = (request.result || []).sort((a, b) => b.savedAt - a.savedAt)
        resolve(results)
      }

      request.onerror = () =>
        reject(
          new DatabaseTransactionError('retrieve test results by mode', undefined, request.error),
        )
    })
  }

  async getById(id: string): Promise<StoredTestResult | undefined> {
    return this.executeTransaction(
      'readonly',
      (store) => store.get(id),
      'retrieve test result',
    ).then((result) => result || undefined)
  }

  async delete(id: string): Promise<void> {
    await this.executeTransaction('readwrite', (store) => store.delete(id), 'delete test result')
  }

  async deleteAll(): Promise<void> {
    await this.executeTransaction('readwrite', (store) => store.clear(), 'clear all test results')
  }

  async getStats(): Promise<TestHistoryStats> {
    const results = await this.getAll()

    if (results.length === 0) {
      return {
        totalTests: 0,
        averageAccuracy: 0,
        averageAPM: 0,
        rankedCount: 0,
        practiceCount: 0,
      }
    }

    const totalAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0)
    const totalAPM = results.reduce((sum, r) => sum + (r.apm || 0), 0)
    const rankedCount = results.filter((r) => r.mode === Mode.RANKED).length
    const practiceCount = results.filter((r) => r.mode === Mode.PRACTICE).length

    return {
      totalTests: results.length,
      averageAccuracy: totalAccuracy / results.length,
      averageAPM: totalAPM / results.length,
      rankedCount,
      practiceCount,
    }
  }

  private generateId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }
}
