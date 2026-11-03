// Gender identity. Never affects breeding compatibility.

export type GenderT = {
	id: string
	label: string
}

export const genders: GenderT[] = [
	{ id: 'female', label: 'Female' },
	{ id: 'male', label: 'Male' },
	{ id: 'nonBinary', label: 'Non-binary' },
	{ id: 'genderFluid', label: 'Gender-fluid' }
]

export const genderIds = genders.map((gender) => gender.id)
