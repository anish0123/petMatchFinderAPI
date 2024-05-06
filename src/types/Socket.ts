type ServerToClientEvents = {
  addAnimal: (message: string) => void;
  addCategory: (message: string) => void;
  modifyAnimal: (message: string) => void;
  modifyCategory: (message: string) => void;
  deleteCategory: (message: string) => void;
};

type ClientToServerEvents = {
  update: (message: string) => void;
};

export type {ServerToClientEvents, ClientToServerEvents};
