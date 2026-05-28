import { createNone, createSome, type Option } from 'ts-utility-kit/option'
import { isErr } from 'ts-utility-kit/result'
import { onMounted, ref } from 'vue'
import type { APIView } from '../model/model-view'
import { getCharacter } from '../service/get-character'
import type { FetcherError } from '@/shared/error/fetcher'

export function useGetCharacters() {
  
  const characters = ref<Option<Array<APIView>>>(createNone())
  const isLoading = ref<boolean>(true)
  const error = ref<Option<FetcherError>>(createNone())

  const getCharacters = async () => {
    isLoading.value = true

    const response = await getCharacter()

    if (isErr(response)) {
      error.value = createSome(response.err)
      isLoading.value = false
      return
    }

    characters.value = response.value

    isLoading.value = false
  }

  onMounted(() => {
    getCharacters()
  })

  return {
    characters,
    isLoading,
    error,
  }
}
