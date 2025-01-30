import { useState } from "react";
import { ChromePicker } from "react-color";
import { Box, Button, Popover } from "@mui/material";

interface Props {
  color: string;
  setColor: (color: string) => void;
}

export default function ColorPicker(props: Props) {
  const { color, setColor } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        variant="contained"
        fullWidth
        onClick={handleClick}
        sx={{ backgroundColor: color, height: '40px' }}
      >Цвет</Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <ChromePicker
          color={color}
          onChange={(updatedColor) => setColor(updatedColor.hex)}
        />
      </Popover>
    </Box>
  );
}