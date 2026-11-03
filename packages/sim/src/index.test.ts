import { describe, expect, it } from 'vitest'
import { SIM_SCHEMA_VERSION } from './index'

describe('sim package', () => {
	it('exposes a schema version', () => {
		expect(SIM_SCHEMA_VERSION).toBe(1)
	})
})
