import { markRaw, shallowRef, type ShallowRef } from 'vue'

export function rawShallow<T extends object>(value: T): ShallowRef<T> {
  return shallowRef(markRaw(value))
}

export function rawShallowNullable<T extends object>(): ShallowRef<T | null> {
  return shallowRef<T | null>(null)
}

export function assignRaw<T extends object>(ref: ShallowRef<T | null>, value: T): void {
  ref.value = markRaw(value)
}
