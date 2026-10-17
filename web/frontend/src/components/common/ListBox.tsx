import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

type Item = {
  id: string;
  label: string;
};

// Usage: <Listbox items={accounts} selectedId={selectedId} onSelect={setSelectedId} />
type Props = {
  items: Item[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function Listbox({ items, selectedId, onSelect}: Props) {

  return (
    <Box>
      <Paper variant="outlined">
        <MenuList dense>
          {items.map((item) => (
            <MenuItem
              key={item.id}
              selected={item.id === selectedId}
              onClick={() => onSelect(item.id)}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
    </Box>
  );
}