import { MultiSelectItemType } from './MultiSelect';
import { cn } from '@/lib/utils/cn';
import { highlightText } from '@/lib/utils/highlight-text';

interface IOptionsListProps {
  options: MultiSelectItemType[];
  selected: MultiSelectItemType[];
  searchText: string;
  focusedOptionIndex: number;
  toggleOption: (id: number) => void;
}

const OptionsList = ({ options, focusedOptionIndex, searchText, toggleOption, selected }: IOptionsListProps) => {
  return (
    <>
      {options.map((option, index) => {
        const isSelected = selected.some((item) => item.id === option.id);
        const isFocused = index === focusedOptionIndex;
        return (
          <div
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={cn(
              'flex items-center justify-between border-b border-gray-400 bg-gray-50 px-2 py-1 last:border-0',
              {
                'bg-gray-200': isSelected,
                'bg-slate-200': isFocused && !isSelected,
                'bg-slate-300': isFocused && isSelected,
              }
            )}
          >
            <div className="flex items-center gap-2">
              <div>
                <input type="checkbox" checked={isSelected} readOnly className="accent-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                <img src={option.image} alt={option.name} className="h-10 w-10 rounded-md" />
                <div>
                  <div className="text-slate-800">{highlightText(option.name, searchText)}</div>
                  <div className="text-gray-600">{option.episode.length} episodes</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OptionsList;
