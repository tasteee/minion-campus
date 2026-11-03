// Minimal promise wrapper around IndexedDB. One object store of key → value.

const DATABASE_NAME = 'minion-campus'
const DATABASE_VERSION = 1
const STORE_NAME = 'saves'

let databasePromise: Promise<IDBDatabase> | null = null

const requestToPromise = <ValueT>(request: IDBRequest<ValueT>) =>
	new Promise<ValueT>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})

const openDatabase = () => {
	const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

	request.onupgradeneeded = () => {
		const isStoreMissing = !request.result.objectStoreNames.contains(STORE_NAME)
		if (isStoreMissing) request.result.createObjectStore(STORE_NAME)
	}

	return requestToPromise(request)
}

const getDatabase = () => {
	databasePromise = databasePromise ?? openDatabase()
	return databasePromise
}

export const readValue = async <ValueT>(key: string) => {
	const database = await getDatabase()
	const store = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME)
	return (await requestToPromise(store.get(key))) as ValueT | undefined
}

export const writeValue = async (key: string, value: unknown) => {
	const database = await getDatabase()
	const store = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME)
	await requestToPromise(store.put(value, key))
}
