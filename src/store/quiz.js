import { createSlice } from "@reduxjs/toolkit";

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    questionIsValid: true,
    imageIsValid: true,
    rightAnswerIsValid: true,
    propositions: [],
    questions: [],
  },
  reducers: {
    validateQuestions(state, action) {
      if (action.payload.data.questionInput.trim() === "") {
        state.questionIsValid = false;
      } else {
        state.questionIsValid = true;
      }

      for (const item of action.payload.data.propositions) {
        if (item.prop.trim() === "" || undefined) {
        } else {
          state.propositions.push(item);
        }
      }

      if (action.payload.data.imageInput.trim() !== "") {
        if (
          action.payload.data.imageInput.match(/\.(jpeg|jpg|gif|png)$/) === null
        ) {
          state.imageIsValid = false;
        } else {
          state.imageIsValid = true;
        }
      }

      if (action.payload.data.rightAnswer.trim() === "") {
        state.imageIsValid = false;
      } else {
        state.imageIsValid = true;
      }
      
    },

    addQuestions(state, action) {
        state.questions.push(action.payload.question);
      },
      addPropostions(state,action) {
        state.propositions.push(action.payload.item)
      }
  },
});

export const quizActions = quizSlice.actions;
export default quizSlice;
