import { useEffect, useRef } from 'react'

const OPEN_THRESHOLD_PX = 70

/**
 * Detects a deliberate drag-down gesture starting from the top of the
 * page and calls onOpen() once the threshold is crossed.
 *
 * Care taken here: mobile browsers bind "drag down from scrollY 0" to
 * native pull-to-refresh. We only call preventDefault() once we've
 * confirmed this is an intentional downward drag (not a tap, not an
 * upward scroll), so normal scrolling and refresh still work everywhere
 * else on the page.
 */
export function useDragDownToOpen(onOpen, enabled = true) {
  const startY = useRef(null)
  const dragging = useRef(false)

  useEffect(() => {
    if (!enabled) return

    function handleTouchStart(e) {
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].clientY
        dragging.current = true
      }
    }

    function handleTouchMove(e) {
      if (!dragging.current || startY.current === null) return
      const deltaY = e.touches[0].clientY - startY.current

      if (deltaY > 10 && window.scrollY <= 0) {
        // Confirmed intentional downward drag from the top — take over
        // from the browser's native pull-to-refresh.
        e.preventDefault()
      }
      if (deltaY > OPEN_THRESHOLD_PX) {
        dragging.current = false
        startY.current = null
        onOpen()
      }
    }

    function handleTouchEnd() {
      dragging.current = false
      startY.current = null
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onOpen, enabled])
}
