import { useEffect, useRef, useState } from 'react';
import { getCharacters } from './lib/services/rickandmorty/get-characters';
import { useQuery } from '@tanstack/react-query';
import MultiSelect, { MultiSelectItemType } from './components/MultiSelect/MultiSelect';

function App() {
  const [page, setPage] = useState<number>(1);
  const [options, setOptions] = useState<MultiSelectItemType[] | []>([]);
  const [selected, setSelected] = useState<MultiSelectItemType[] | []>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const prevSearchText = useRef(searchText);

  const {
    // isPending: isCharactersPending,
    isError: isCharactersError,
    error: charactersError,
    data: charactersData,
    isLoading: isCharactersLoading,
    refetch: refetchCharacters,
  } = useQuery({
    queryKey: ['characters', searchText, page],
    queryFn: () => getCharacters(searchText, page),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  function toggleOption(id: number) {
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
  }

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
    if (prevSearchText.current !== searchText) {
      setPage(1);
      setOptions([]);
    }
    prevSearchText.current = searchText;

    refetchCharacters();
  }, [searchText, page]);

  const handleLoadMore = () => {
    if (hasMore && !isCharactersLoading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="grid min-h-dvh w-full justify-center bg-white p-10">
      <div className="w-96">
        <MultiSelect
          options={options}
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