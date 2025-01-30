import { useState, useEffect } from 'react';
import { ChartProps } from '../models/ChartProps';
import { UseSelectGraphOutput } from '../models/UseSelectGraphOutput';

type Params = Pick<ChartProps, 'nameSelection'> & { names: string[] };

export const useSelectGraph = (params: Params): UseSelectGraphOutput => {
  const { nameSelection, names } = params;

  const [selectedName, setSelectedName] = useState<string>();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleNameSelectorButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseNameSelector = () => {
    setMenuAnchorEl(null);
  };

  const handleNameSelectorItemClick = (name: string) => {
    setMenuAnchorEl(null);
    setSelectedName(name);
  };

  useEffect(() => {
    if (nameSelection && names.length > 1 && !selectedName) {
      setSelectedName(names[0]);
    }
  }, [names, nameSelection]);

  return {
    selectedName,
    handleNameSelectorButtonClick,
    handleCloseNameSelector,
    handleNameSelectorItemClick,
    menuAnchorEl,
  };
};
