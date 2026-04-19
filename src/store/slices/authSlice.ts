import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, MenuItem } from "../../types";

interface AuthState {
  token: string | null;
  user: User | null;
  menus: MenuItem[];
  permissions: string[];
  isLogin: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: null,
  menus: [],
  permissions: [],
  isLogin: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isLogin = true;
      localStorage.setItem("token", action.payload);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setMenus(state, action: PayloadAction<MenuItem[]>) {
      state.menus = action.payload;
    },
    setPermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload;
    },
    loginSuccess(
      state,
      action: PayloadAction<{
        token: string;
        user: User;
        menus: MenuItem[];
        permissions: string[];
      }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.menus = action.payload.menus;
      state.permissions = action.payload.permissions;
      state.isLogin = true;
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.menus = [];
      state.permissions = [];
      state.isLogin = false;
      localStorage.removeItem("token");
    },
  },
});

export const {
  setToken,
  setUser,
  setMenus,
  setPermissions,
  loginSuccess,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
