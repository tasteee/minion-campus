import type { GameStateT } from '@minion-campus/sim'
import { simConfig } from '@minion-campus/sim'
import { readValue, writeValue } from './indexedDb'

// Saves are plain sim state in an envelope with a schema version.

const SAVE_SLOT_KEY = 'slot-1'
const SAVE_FORMAT = 'minion-campus-save'

export type SaveEnvelopeT = {
	format: string
	schemaVersion: number
	savedAt: string
	state: GameStateT
}

export type LoadResultT =
	| { status: 'loaded'; state: GameStateT }
	| { status: 'empty' }
	| { status: 'incompatible'; schemaVersion: number }
	| { status: 'invalid' }

const createEnvelope = (state: GameStateT): SaveEnvelopeT => ({
	format: SAVE_FORMAT,
	schemaVersion: state.schemaVersion,
	savedAt: new Date().toISOString(),
	state
})

const isEnvelope = (value: unknown): value is SaveEnvelopeT => {
	if (typeof value !== 'object' || value === null) return false
	const candidate = value as Partial<SaveEnvelopeT>
	return candidate.format === SAVE_FORMAT && typeof candidate.schemaVersion === 'number' && typeof candidate.state === 'object'
}

// Future schema changes add migrations here, oldest first.
export const readEnvelope = (value: unknown): LoadResultT => {
	if (value === undefined || value === null) return { status: 'empty' }
	if (!isEnvelope(value)) return { status: 'invalid' }
	if (value.schemaVersion !== simConfig.schemaVersion) return { status: 'incompatible', schemaVersion: value.schemaVersion }
	return { status: 'loaded', state: value.state }
}

export const loadGame = async () => readEnvelope(await readValue<unknown>(SAVE_SLOT_KEY))

export const saveGame = async (state: GameStateT) => {
	await writeValue(SAVE_SLOT_KEY, createEnvelope(state))
}

// Keeps an unreadable save instead of overwriting it.
export const backupUnreadableSave = async () => {
	const existing = await readValue<unknown>(SAVE_SLOT_KEY)
	await writeValue(`${SAVE_SLOT_KEY}-backup-${Date.now()}`, existing)
}

export const exportSaveFile = (state: GameStateT) => {
	const json = JSON.stringify(createEnvelope(state), null, 2)
	const blob = new Blob([json], { type: 'application/json' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = `minion-campus-day-${state.absoluteDay}.json`
	link.click()
	URL.revokeObjectURL(url)
}

export const parseSaveFile = async (file: File) => {
	const text = await file.text()
	const parsed = await Promise.resolve(text).then(JSON.parse).catch(() => undefined)
	if (parsed === undefined) return { status: 'invalid' } as const
	return readEnvelope(parsed)
}
