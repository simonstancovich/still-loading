import { ref, type Ref } from 'vue'

export interface StockholmTimeState {
  date: Date
  hourFraction: number
  sunAltitude: number
  isDaylight: boolean
}

export interface StockholmTimeApi {
  state: Ref<StockholmTimeState>
}

export function useStockholmTime(): StockholmTimeApi {
  const state = ref<StockholmTimeState>({
    date: new Date(),
    hourFraction: 0,
    sunAltitude: 0,
    isDaylight: true,
  })
  return { state }
}
