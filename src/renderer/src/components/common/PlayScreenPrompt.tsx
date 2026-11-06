import { useEffect, useState } from 'react'
import type { ScreenTarget } from '@shared/types'
import { CARD_PLAY_DEFAULT_SCREEN } from '@shared/playScreen'
import { t } from '../../i18n'
import ScreenSelect from './ScreenSelect'

type Pending = {
  targets: ScreenTarget[]
  resolve: (screen: ScreenTarget | null) => void
}

let openPrompt: ((targets: ScreenTarget[]) => Promise<ScreenTarget | null>) | null = null

/** null means cancel. The default is every screen, which is what card Play used to do. */
export function askPlayScreen(targets: ScreenTarget[]): Promise<ScreenTarget | null> {
  if (!openPrompt) return Promise.resolve(CARD_PLAY_DEFAULT_SCREEN)
  return openPrompt(targets)
}

export default function PlayScreenPrompt() {
  const [pending, setPending] = useState<Pending | null>(null)
  const [value, setValue] = useState<ScreenTarget>(CARD_PLAY_DEFAULT_SCREEN)

  useEffect(() => {
    openPrompt = (targets) => new Promise((resolve) => {
      setValue(CARD_PLAY_DEFAULT_SCREEN)
      setPending({ targets, resolve })
    })
    return () => { openPrompt = null }
  }, [])

  if (!pending) return null

  function finish(screen: ScreenTarget | null) {
    pending?.resolve(screen)
    setPending(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-8">
      <div className="w-full max-w-sm rounded-xl border border-fg/10 bg-popup p-4 shadow-2xl">
        <h3 className="text-sm font-semibold text-gray-100">{t('playlist.whichScreen')}</h3>
        <div className="mt-3">
          <ScreenSelect targets={pending.targets} value={value} onChange={setValue} title={t('playlist.whichScreen')} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => { finish(null) }}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-300 hover:bg-fg/5"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            autoFocus
            onClick={() => { finish(value) }}
            className="rounded-lg bg-accent-600 px-3 py-1.5 text-sm text-white hover:bg-accent-500"
          >
            {t('play.wallpaper')}
          </button>
        </div>
      </div>
    </div>
  )
}
