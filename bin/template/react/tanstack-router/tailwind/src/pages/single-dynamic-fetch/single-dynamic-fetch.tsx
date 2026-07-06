import { Box } from '@/lib/ui';
import { CardListView } from '@/features/harry-potter';
import { useSinglePageCharacters } from '@/features/harry-potter';
import { ja } from '@/shared/lang/ja';
import { isSome } from 'ts-utility-kit/option';

function SingleDynamicFetch() {
    const { characters, isLoading, error } = useSinglePageCharacters();

    if (isLoading) {
        return <Box>Loading...</Box>;
    }

    if (isSome(error)) {
        return <Box>Error: {error.value.message}</Box>;
    }

    if (characters.length === 0) {
        return <Box>No characters.</Box>;
    }

    return <CardListView potters={characters} title={ja.app.singleDynamicPotter.title} />;
}

export default SingleDynamicFetch;
