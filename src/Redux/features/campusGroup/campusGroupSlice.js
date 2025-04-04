import { createSlice } from "@reduxjs/toolkit";

const createAsyncReducers = (prefix, stateKey) => ({
  [`${prefix}Request`]: (state) => {
    state.loading = true;
    state.error = null;
    state[stateKey] = null;
  },
  [`${prefix}Success`]: (state, action) => {
    state[stateKey] = action.payload;
    state.loading = false;
  },
  [`${prefix}Failure`]: (state, action) => {
    state.error = action.payload;
    state.loading = false;
    state[stateKey] = null;
  },
});

const campusGroupSlice = createSlice({
  name: "campusGroup",
  initialState: {
    campusGroupData: null,
    campusGroupPostData: null,
    campusGroupPutData: null,
    loading: false,
    error: null,
  },
  reducers: {
    ...createAsyncReducers("getCampusGroup", "campusGroupData"),
    ...createAsyncReducers("postCampusGroup", "campusGroupPostData"),
    ...createAsyncReducers("putCampusGroup", "campusGroupPutData"),
  },
});

// Now these exports will match your original names
export const {
  getCampusGroupRequest,
  getCampusGroupSuccess,
  getCampusGroupFailure,
  postCampusGroupRequest,
  postCampusGroupSuccess,
  postCampusGroupFailure,
  putCampusGroupRequest,
  putCampusGroupSuccess,
  putCampusGroupFailure,
} = campusGroupSlice.actions;

export default campusGroupSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const campusGroupSlice = createSlice({
//   name: "campusGroup",
//   initialState: {
//     campusGroupData: null,
//     campusGroupPostData: null,
//     campusGroupPutData: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     getCampusGroupRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//       state.campusGroupData = null;
//     },
//     getCampusGroupSuccess: (state, action) => {
//       state.campusGroupData = action.payload;
//       state.loading = false;
//     },
//     getCampusGroupFailure: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//       state.campusGroupData = null;
//     },
//     postCampusGroupRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//       state.campusGroupPostData = null;
//     },
//     postCampusGroupSuccess: (state, action) => {
//       state.campusGroupPostData = action.payload;
//       state.loading = false;
//     },
//     postCampusGroupFailure: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//       state.campusGroupPostData = null;
//     },
//     putCampusGroupRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//       state.campusGroupPutData = null;
//     },
//     putCampusGroupSuccess: (state, action) => {
//       state.campusGroupPutData = action.payload;
//       state.loading = false;
//     },
//     putCampusGroupFailure: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//       state.campusGroupPutData = null;
//     },
//   },
// });

// export const {
//   getCampusGroupRequest,
//   getCampusGroupSuccess,
//   getCampusGroupFailure,
//   postCampusGroupRequest,
//   postCampusGroupSuccess,
//   postCampusGroupFailure,
//   putCampusGroupRequest,
//   putCampusGroupSuccess,
//   putCampusGroupFailure,
// } = campusGroupSlice.actions;

// export default campusGroupSlice.reducer;
