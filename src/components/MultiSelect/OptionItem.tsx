import { cn } from '@/utils/cn';
import { highlightText } from '@/utils/highlight-text';
import { MultiSelectItemType } from './MultiSelect';

interface IOptionItemProps {
  index: number;
  option: MultiSelectItemType;
  isSelected: boolean;
  isFocused: boolean;
  searchText: string;
  handleOptionClick: (index: number, id: number) => void;
}

const OptionItem = ({ index, option, searchText, isFocused, isSelected, handleOptionClick }: IOptionItemProps) => {
  return (
    <div
      onClick={() => handleOptionClick(index, option.id)}
      className={cn('flex items-center justify-between border-b border-gray-400 bg-gray-50 px-2 py-1 last:border-0', {
        'bg-gray-200': isSelected,
        'bg-slate-200': isFocused && !isSelected,
        'bg-slate-300': isFocused && isSelected,
      })}
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
};

export default OptionItem;
