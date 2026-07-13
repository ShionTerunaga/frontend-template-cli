import { createOk } from 'ts-utility-kit/result';
import { createSome, optionConversion } from 'ts-utility-kit/option';
import type { Option } from 'ts-utility-kit/option';
import type { Result } from 'ts-utility-kit/result';
import type { APIView } from '../model/model-view';
import type { FetcherError } from '@/shared/error/fetcher';
import type { APIRes } from '../model/model-res';

export function parseApi(api: APIRes): Result<Option<Array<APIView>>, FetcherError> {
    const filterList: Array<APIView> = api
        .filter((item) => item.image !== '')
        .map((item) => {
            const { alternate_names, alternate_actors, dateOfBirth, yearOfBirth, wand, ...rest } =
                item;

            const value: APIView = {
                ...rest,
                alternateNames: alternate_names,
                alternateActors: alternate_actors,
                dateOfBirth: optionConversion(dateOfBirth),
                yearOfBirth: optionConversion(yearOfBirth),
                wand: {
                    wood: wand.wood,
                    core: wand.core,
                    length: optionConversion(wand.length),
                },
            };

            return value;
        });

    return createOk(createSome(filterList));
}
