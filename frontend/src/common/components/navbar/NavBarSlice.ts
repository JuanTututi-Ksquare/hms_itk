import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../app/store';

const initialState = {
    navToggle: false
}

const NavBarSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    showNav(state, action) {
        const toggle = !state.navToggle;
        state.navToggle = toggle;
    }
  }
})

export const {showNav} = NavBarSlice.actions;
export const selectNavStatus = (state: RootState) => state.nav.navToggle;

export default NavBarSlice.reducer