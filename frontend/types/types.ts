export type RootTabParamList = {
  Home: undefined;
  Todo: undefined;
  EditorTest: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  NoteEditor: {
    noteId?: number;
    isNewNote?: boolean;
  };
};
