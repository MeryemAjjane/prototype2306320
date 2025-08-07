import React from 'react'

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

function KanbanBoard() {
  const [columns, setColumns] = useState({ /* états initiaux */ });

  function onDragEnd(result) {
    // logique de mise à jour des colonnes
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {Object.entries(columns).map(([colId, col]) => (
        <Droppable key={colId} droppableId={colId}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <h3>{col.title}</h3>
              {col.items.map((item, idx) => (
                <TaskCard key={item.id} item={item} index={idx} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
}
