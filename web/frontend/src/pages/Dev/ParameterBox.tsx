import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";

export type Param = {
  id: string; // stable key for React, so rows don't lose focus or swap values
  key: string;
  value: string;
};

export default function ParameterBox({ title, params, setParams }: { title: string; params: Param[]; setParams: React.Dispatch<React.SetStateAction<Param[]>> }) {
  // const [params, setParams] = useState<Param[]>([]);

  // Append a new empty key/value pair
  const handleAddParam = () => {
    setParams((prev) => [...prev, { id: uuidv4(), key: "", value: "" }]);
  };

  // Update one field ("key" or "value") of one row
  const handleChange = (id: string, field: "key" | "value", text: string) => {
    setParams((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: text } : p)));
  };

  // Remove a row
  const handleRemove = (id: string) => {
    setParams((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>

      {params.map((p) => (
        <Box key={p.id} sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            label="Key"
            size="small"
            value={p.key}
            onChange={(e) => handleChange(p.id, "key", e.target.value)}
          />
          <TextField
            label="Value"
            size="small"
            value={p.value}
            onChange={(e) => handleChange(p.id, "value", e.target.value)}
          />
          <IconButton aria-label="Remove parameter" onClick={() => handleRemove(p.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <IconButton aria-label="Add parameter" onClick={handleAddParam}>
        <AddIcon />
      </IconButton>
    </Box>
  );
}
