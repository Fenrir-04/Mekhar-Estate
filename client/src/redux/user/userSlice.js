import { createSlice } from "@reduxjs/toolkit";

// Just like we did in authController signin function
// we jsut make it globally using redux toolkit
// which help us to access data anywhere in program without
// needing to constantly carry it thru next component everytime

const initialState = {
  // declare the initail state of the user data we get from form
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  // after getting data from user,
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      // initialise the signin
      state.loading = true; // set loading as true becoz it loads after we submit the signin button
    },
    signInSuccess: (state, action) => {
      // signin is success -> credentials match
      state.currentUser = action.payload; // put the data from database in currentUSer
      state.loading = false; // set loasing false because we got the data
      state.error = null; // also no error encountered
    },
    signInFailure: (state, action) => {
      // signin failed -> if the credentials doesn't match
      state.error = action.payload; // give the error given by database after failure
      state.loading = false; // also put loading as false
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
});

export const { signInStart, signInSuccess, signInFailure,
     updateUserFailure, updateUserStart, updateUserSuccess,
     deleteUserFailure, deleteUserStart, deleteUserSuccess,
    signOutUserFailure, signOutUserStart, signOutUserSuccess } = userSlice.actions; // export them fuctions to use anywhere globally
export default userSlice.reducer;
