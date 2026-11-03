import type { DayReportT } from '@minion-campus/sim'
import { setInteractionMode } from '../../world/interaction/interactionState.svelte'

export type ModalIdT = 'endDayReview' | 'dayReport' | 'gameMenu'

type ModalStateT = {
	openModalId: ModalIdT | null
	report: DayReportT | null
}

export const modalState = $state<ModalStateT>({ openModalId: null, report: null })

export const openModal = (modalId: ModalIdT) => {
	modalState.openModalId = modalId
	setInteractionMode('modal')
}

export const closeModal = () => {
	modalState.openModalId = null
	setInteractionMode('free')
}

export const showDayReport = (report: DayReportT) => {
	modalState.report = report
	openModal('dayReport')
}
