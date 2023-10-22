import { atom } from 'jotai'

export const isRightColumnOpenAtom = atom(true)
isRightColumnOpenAtom.onMount = (set) => {
  if (!window.matchMedia('(min-width: 992px)').matches) {
    // breakpointがlg以下なら表示しない
    set(false)
  }
}
