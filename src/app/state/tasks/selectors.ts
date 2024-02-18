import { createSelector } from '@ngrx/store';

import { IAppState } from '../index';

export const selectFeature = (state: IAppState) => state.tasks;

export const isLoadingSelector = createSelector(
  selectFeature,
  (state) => state.isLoading
);

export const tasksSelector = createSelector(
  selectFeature,
  (state) => state.tasks
);

export const errorSelector = createSelector(
  selectFeature,
  (state) => state.error
);
