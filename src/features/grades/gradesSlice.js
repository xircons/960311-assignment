import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    addGrade(state, action) {
      state.list.push(action.payload);
    },
    updateGrade(state, action) {
      const index = state.list.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        Object.assign(state.list[index], action.payload);
      }
    },
    deleteGrade(state, action) {
      state.list = state.list.filter((g) => g.id !== action.payload);
    },
  },
});

export const { addGrade, updateGrade, deleteGrade } = gradesSlice.actions;
export default gradesSlice.reducer;
