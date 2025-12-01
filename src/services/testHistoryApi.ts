import type { TestResult } from '@/types/test.types'
import { Mode } from '@/types/test.types'
import { IndexedDBConnection } from '@/infrastructure/database/IndexedDBConnection'
import { TestResultRepository } from '@/infrastructure/database/TestResultRepository'

const DB_CONFIG = {
  dbName: 'PauliTestDB',
  version: 1,
  stores: [
    {
      name: 'testResults',
      keyPath: 'id',
      indexes: [
        { name: 'savedAt', keyPath: 'savedAt', unique: false },
        { name: 'mode', keyPath: 'mode', unique: false },
        { name: 'accuracy', keyPath: 'accuracy', unique: false },
      ],
    },
  ],
}

function createTestHistoryApi() {
  const connection = new IndexedDBConnection(DB_CONFIG)
  const repository = new TestResultRepository(connection)

  return {
    create: (testResult: TestResult) => repository.create(testResult),
    getAll: () => repository.getAll(),
    getById: (id: string) => repository.getById(id),
    getByMode: (mode: string) => {
      const modeEnum = mode === Mode.RANKED ? Mode.RANKED : Mode.PRACTICE
      return repository.getByMode(modeEnum)
    },
    delete: (id: string) => repository.delete(id),
    deleteAll: () => repository.deleteAll(),
    getStats: () => repository.getStats(),
    close: () => connection.close(),
  }
}

export const testHistoryApi = createTestHistoryApi()
