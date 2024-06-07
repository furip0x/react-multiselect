import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCharacters } from './lib/services/rickandmorty/get-characters';
import { useQuery } from '@tanstack/react-query';
import MultiSelect, { MultiSelectItemType } from './components/MultiSelect/MultiSelect';
import useDebounce from './hooks/useDebounce';

function App() {
  const [page, setPage] = useState<number>(1);
  const [options, setOptions] = useState<MultiSelectItemType[] | []>([]);
  const [selected, setSelected] = useState<MultiSelectItemType[] | []>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const prevSearchText = useRef(searchText);
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  const {
    // isPending: isCharactersPending,
    isError: isCharactersError,
    error: charactersError,
    data: charactersData,
    isLoading: isCharactersLoading,
    refetch: refetchCharacters,
  } = useQuery({
    queryKey: ['characters', debouncedSearchText, page],
    queryFn: () => getCharacters(debouncedSearchText, page),
    // staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const toggleOption = useCallback(
    (id: number) => {
      setSelected((prev) => {
        const selectedOption = prev.find((item) => item.id === id);
        if (selectedOption) {
          return prev.filter((item) => item.id !== id);
        }

        const newOption = options.find((item) => item.id === id);
        if (newOption) {
          return [...prev, newOption];
        }

        return prev;
      });
    },
    [options]
  );

  const memoizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    if (charactersData?.data) {
      if (page === 1) {
        setOptions(charactersData.data.results);
      } else {
        setOptions((prev) => {
          const newOptions = charactersData.data.results.filter(
            (newItem) => !prev.some((prevItem) => prevItem.id === newItem.id)
          );
          return [...prev, ...newOptions];
        });
      }
      setHasMore(charactersData.data.results.length > 0);
    }
  }, [charactersData, page]);

  useEffect(() => {
    if (debouncedSearchText.trim() !== '') {
      if (prevSearchText.current !== debouncedSearchText) {
        setPage(1);
        setOptions([]);
      }
      prevSearchText.current = debouncedSearchText;

      refetchCharacters();
    }
  }, [debouncedSearchText, page]);

  const handleLoadMore = () => {
    if (hasMore && !isCharactersLoading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="grid min-h-dvh w-full justify-center bg-white p-10">
      <div className="w-96">
        <MultiSelect
          options={memoizedOptions}
          isOptionsLoading={isCharactersLoading}
          isOptionsError={isCharactersError}
          optionsError={charactersError}
          selected={selected}
          toggleOption={toggleOption}
          searchText={searchText}
          setSearchText={setSearchText}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
}

export default App;
