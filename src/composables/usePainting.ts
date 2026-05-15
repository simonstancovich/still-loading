import { ref, type DeepReadonly, type Ref } from 'vue'
import { tokenAsRgb } from '@/styles/tokens'

export interface PaintingApi {
  canvasEl: DeepReadonly<Ref<HTMLCanvasElement | null>>
  isRevealed: Ref<boolean>
  reveal: () => void
}

const canvasEl = ref<HTMLCanvasElement | null>(null)
const isRevealed = ref(false)
let ctx: CanvasRenderingContext2D | null = null
let mouseListener: ((e: MouseEvent) => void) | null = null
let touchListener: ((e: TouchEvent) => void) | null = null
let resizeListener: (() => void) | null = null

function resizeCanvas(el: HTMLCanvasElement): void {
  const dpr = Math.min(window.devicePixelRatio, 2)
  // Preserve existing strokes across a resize by snapshotting to an offscreen canvas.
  const prevW = el.width
  const prevH = el.height
  let snapshot: HTMLCanvasElement | null = null
  if (prevW > 0 && prevH > 0 && ctx) {
    snapshot = document.createElement('canvas')
    snapshot.width = prevW
    snapshot.height = prevH
    snapshot.getContext('2d')?.drawImage(el, 0, 0)
  }
  el.width = Math.max(1, Math.floor(window.innerWidth * dpr))
  el.height = Math.max(1, Math.floor(window.innerHeight * dpr))
  el.style.width = `${String(window.innerWidth)}px`
  el.style.height = `${String(window.innerHeight)}px`
  ctx = el.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)
  if (snapshot) {
    // Map the old buffer onto the new viewport size — strokes preserved proportionally.
    ctx.drawImage(snapshot, 0, 0, window.innerWidth, window.innerHeight)
  }
}

function paint(x: number, y: number): void {
  if (!ctx) return
  const [r, g, b] = tokenAsRgb('color.dust.base')
  ctx.fillStyle = `rgba(${String(Math.round(r * 255))}, ${String(Math.round(g * 255))}, ${String(
    Math.round(b * 255),
  )}, 0.06)`
  ctx.beginPath()
  ctx.arc(x, y, 4, 0, Math.PI * 2)
  ctx.fill()
}

export function attachPaintingCanvas(el: HTMLCanvasElement): void {
  canvasEl.value = el
  resizeCanvas(el)
  resizeListener = () => {
    resizeCanvas(el)
  }
  window.addEventListener('resize', resizeListener)
}

export function detachPaintingCanvas(): void {
  stopPainting()
  if (resizeListener) window.removeEventListener('resize', resizeListener)
  resizeListener = null
  canvasEl.value = null
  ctx = null
}

export function startPainting(): void {
  if (mouseListener) return
  mouseListener = (e: MouseEvent) => {
    paint(e.clientX, e.clientY)
  }
  touchListener = (e: TouchEvent) => {
    const t = e.touches[0]
    if (t) paint(t.clientX, t.clientY)
  }
  window.addEventListener('mousemove', mouseListener, { passive: true })
  window.addEventListener('touchmove', touchListener, { passive: true })
}

export function stopPainting(): void {
  if (mouseListener) {
    window.removeEventListener('mousemove', mouseListener)
    mouseListener = null
  }
  if (touchListener) {
    window.removeEventListener('touchmove', touchListener)
    touchListener = null
  }
}

export function usePainting(): PaintingApi {
  return {
    canvasEl,
    isRevealed,
    reveal: () => {
      isRevealed.value = true
    },
  }
}

export function __resetPaintingForTests(): void {
  stopPainting()
  if (resizeListener) window.removeEventListener('resize', resizeListener)
  resizeListener = null
  canvasEl.value = null
  ctx = null
  isRevealed.value = false
}
