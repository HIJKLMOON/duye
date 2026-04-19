import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuItem } from "../../types";

interface MenuState {
  collapsed: boolean;
  selectedKeys: string[];
  openKeys: string[];
  menuList: MenuItem[];
}

const initialState: MenuState = {
  collapsed: false,
  selectedKeys: [],
  openKeys: [],
  menuList: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setCollapsed(state, action: PayloadAction<boolean>) {
      state.collapsed = action.payload;
    },
    setSelectedKeys(state, action: PayloadAction<string[]>) {
      state.selectedKeys = action.payload;
    },
    setOpenKeys(state, action: PayloadAction<string[]>) {
      state.openKeys = action.payload;
    },
    setMenuList(state, action: PayloadAction<MenuItem[]>) {
      state.menuList = action.payload;
    },
  },
});

export const { setCollapsed, setSelectedKeys, setOpenKeys, setMenuList } =
  menuSlice.actions;
export default menuSlice.reducer;
