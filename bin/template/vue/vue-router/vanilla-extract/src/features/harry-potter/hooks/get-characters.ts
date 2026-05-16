import { optionUtility, type Option } from 'ts-shared'
import { onMounted, ref } from 'vue'
import type { APIView } from '../model/model-view'
import { getCharacter } from '../service/get-character'
import type { FetcherError } from '@/shared/error/fetcher'

export function useGetCharacters() {
  const { createNone, createSome } = optionUtility

  const characters = ref<Option<Array<APIView>>>(createNone())
  const isLoading = ref<boolean>(true)
  const error = ref<Option<FetcherError>>(createNone())

  const getCharacters = async () => {
    isLoading.value = true

    const response = await getCharacter()

    if (response.isErr) {
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
