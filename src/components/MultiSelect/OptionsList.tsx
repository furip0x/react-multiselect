import React from 'react';
import { MultiSelectItemType } from './MultiSelect';
import OptionItem from './OptionItem';

interface IOptionsListProps {
  options: MultiSelectItemType[];
  selected: MultiSelectItemType[];
  searchText: string;
  focusedOptionIndex: number;
  handleOptionClick: (index: number, id: number) => void;
}

const OptionsList = React.memo(
  ({ options, focusedOptionIndex, searchText, handleOptionClick, selected }: IOptionsListProps) => {
    return (
      <>
        {options.map((option, index) => {
          const isSelected = selected.some((item) => item.id === option.id);
          const isFocused = index === focusedOptionIndex;

          return (
            <OptionItem
              key={option.id}
              index={index}
              option={option}
              isSelected={isSelected}
              isFocused={isFocused}
              handleOptionClick={handleOptionClick}
              searchText={searchText}
            />
          );
        })}
      </>
    );
  }
);

export default OptionsList;
