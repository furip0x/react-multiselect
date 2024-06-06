import React from 'react';
import { MultiSelectItemType } from './MultiSelect';
import OptionItem from './OptionItem';

interface IOptionsListProps {
  options: MultiSelectItemType[];
  selected: MultiSelectItemType[];
  searchText: string;
  focusedOptionIndex: number;
  toggleOption: (id: number) => void;
}

const OptionsList = React.memo(
  ({ options, focusedOptionIndex, searchText, toggleOption, selected }: IOptionsListProps) => {
    return (
      <>
        {options.map((option, index) => {
          const isSelected = selected.some((item) => item.id === option.id);
          const isFocused = index === focusedOptionIndex;

          return (
            <OptionItem
              key={option.id}
              option={option}
              isSelected={isSelected}
              isFocused={isFocused}
              toggleOption={toggleOption}
              searchText={searchText}
            />
          );
        })}
      </>
    );
  }
);

export default OptionsList;
