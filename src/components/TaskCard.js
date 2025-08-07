import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function TaskCard({ item, index }) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Box ref={provided.innerRef}
             {...provided.draggableProps}
             {...provided.dragHandleProps}
             sx={{ mb: 1, opacity: snapshot.isDragging ? 0.8 : 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">{item.title}</Typography>
              {/* autres infos */}
            </CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  );
}
