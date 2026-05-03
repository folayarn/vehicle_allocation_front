import { configureStore } from '@reduxjs/toolkit';
import { PostSlice } from './slices/PostSlices';
import { userSlice } from './slices/userSlice';
import { FetchSlice } from './slices/FetchSlices';

export const store = configureStore({
  reducer: {
    PostSlice: PostSlice.reducer,
    userSlice: userSlice.reducer,
    FetchSlice: FetchSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  
});