import { useEffect, useRef, useState } from 'react';
import { FaCaretDown, FaCircleNotch } from 'react-icons/fa6';
import { AxiosError } from 'axios';
import Badge from '../Badge';
import OptionsList from './OptionsList';
import { cn } from '@/lib/utils/cn';
import Input from './TextInput';

export type MultiSelectItemType = {
  id: number;
  name: string;
  image: string;
  episode: string[];
};

interface IMultiSelectProps {
  options: MultiSelectItemType[] | [];
  isOptionsLoading: boolean;
  isOptionsError: boolean;
  optionsError: Error | AxiosError | null;
  searchText: string;
  setSearchText: (text: string) => void;
  selected: MultiSelectItemType[] | [];
  toggleOption: (id: number) => void;
  onLoadMore: () => void;
}

const MultiSelect = ({
  options,
  isOptionsLoading,
  isOptionsError,
  optionsError,
  searchText,
  setSearchText,
  selected,
  toggleOption,
  onLoadMore,
}: IMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsWrapperRef = useRef<HTMLDivElement>(null);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedOptionIndex((prev) => Math.min(prev + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedOptionIndex((prev) => Math.max(prev - 1, 0));
    } else if ((e.key === 'Enter' || e.key === ' ') && focusedOptionIndex >= 0) {
      e.preventDefault();
      toggleOption(options[focusedOptionIndex].id);
    }
  };

  const handleErrorMessage = (error: Error | AxiosError | null) => {
    if (error && (error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.data) {
        return (axiosError.response.data as { error: string }).error || 'An error occurred';
      }
      return 'An error occurred';
    }
    return error?.message || 'An error occurred';
  };

  const handleBadgeClick = (id: number) => {
    toggleOption(id);
    setFocusedOptionIndex(-1);
    inputRef.current?.focus();
  };

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (
        (selectBoxRef.current && selectBoxRef.current.contains(event.target as Node)) ||
        (dropdownRef.current && dropdownRef.current.contains(event.target as Node))
      ) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
        setFocusedOptionIndex(-1);
        // setSearchText('');
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  useEffect(() => {
    if (optionsWrapperRef.current && !isOptionsError) {
      const optionsWrapper = optionsWrapperRef.current;
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = optionsWrapper;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          onLoadMore();
        }
      };
      optionsWrapper.addEventListener('scroll', handleScroll);
      return () => {
        optionsWrapper.removeEventListener('scroll', handleScroll);
      };
    }
  }, [options, isOptionsError]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchText.length > 0) {
      setIsOpen(true);
      setFocusedOptionIndex(0);
    }
  }, [searchText]);

  useEffect(() => {
    if (options.length > 0) {
      if (focusedOptionIndex >= 0 && optionsWrapperRef.current) {
        const focusedOption = optionsWrapperRef.current.children[focusedOptionIndex] as HTMLElement;
        focusedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedOptionIndex, options]);

  return (
    <div className="relative w-full" onKeyDown={handleKeyDown}>
      <div
        ref={selectBoxRef}
        className={cn('flex min-h-12 w-full rounded-2xl border border-slate-400', {
          'shadow-md': isOpen,
        })}
      >
        <div className="flex flex-1 justify-between">
          <div className="flex w-full flex-1 flex-wrap items-center justify-start gap-1 p-1">
            {selected.map((selectedItem) => (
              <Badge
                key={selectedItem.id}
                title={selectedItem.name}
                onClick={() => handleBadgeClick(selectedItem.id)}
              />
            ))}
            <Input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
              className="w-5 flex-1 border-0 bg-transparent px-0 text-slate-950 focus:outline-0"
            />
          </div>
          <div className="mr-3 flex flex-shrink-0 flex-grow-0 justify-center pt-3 text-slate-600">
            <FaCaretDown size={20} />
          </div>
        </div>
      </div>
      <div
        ref={dropdownRef}
        className={cn(
          'absolute left-0 right-0 top-[calc(100%_+_15px)] z-10 hidden overflow-hidden rounded-2xl border border-slate-400 shadow-md',
          {
            block: isOpen,
          }
        )}
      >
        <div ref={optionsWrapperRef} className="flex max-h-[430px] w-full flex-1 flex-col overflow-y-auto">
          {options.length > 0 && (
            <OptionsList
              options={options}
              selected={selected}
              searchText={searchText}
              focusedOptionIndex={focusedOptionIndex}
              toggleOption={toggleOption}
            />
          )}
          {isOptionsLoading && (
            <div className="flex shrink-0 justify-center p-2 text-pink-400">
              <FaCircleNotch size={24} className="animate-spin" />
            </div>
          )}
          {isOptionsError && (
            <div className="flex shrink-0 justify-center p-2 font-medium text-red-500">
              {handleErrorMessage(optionsError)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
