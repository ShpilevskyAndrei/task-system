import { createSelector } from '@ngrx/store';

import { IAppState } from '../index';

export const selectFeature = (state: IAppState) => state.user;

export const isLoadingSelector = createSelector(
  selectFeature,
  (state) => state.isLoading
);

export const userSelector = createSelector(
  selectFeature,
  (state) => state.user
);

export const errorSelector = createSelector(
  selectFeature,
  (state) => state.error
);
