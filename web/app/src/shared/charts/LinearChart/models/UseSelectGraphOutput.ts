export type UseSelectGraphOutput = {
  selectedName: string | undefined;
  handleNameSelectorButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleCloseNameSelector: () => void;
  handleNameSelectorItemClick: (name: string) => void;
  menuAnchorEl: null | HTMLElement;
};
