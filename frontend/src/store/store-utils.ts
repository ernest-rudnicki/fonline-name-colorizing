/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  CreateSliceOptions,
  Slice,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import {
  FulfilledActionFromAsyncThunk,
  PendingActionFromAsyncThunk,
  RejectedActionFromAsyncThunk,
} from "@reduxjs/toolkit/dist/matchers";
import { NoInfer } from "@reduxjs/toolkit/dist/tsHelpers";
import { BaseState } from "generic/generic";

export interface RejectResponse<ErrorData> {
  error?: ErrorData | unknown;
  errorMsg?: string;
}

export interface CustomThunkConfig<ErrorData> {
  rejectValue: RejectResponse<ErrorData>;
}

export function createCustomThunk<Data, ThunkArg, ErrorData>(
  prefix: string,
  action: (payload: ThunkArg) => Promise<Data>,
  options?: {
    errorMsg: string;
  }
): AsyncThunk<Data, ThunkArg, CustomThunkConfig<ErrorData>> {
  return createAsyncThunk<Data, ThunkArg, CustomThunkConfig<ErrorData>>(
    prefix,
    async (payload, { rejectWithValue }) => {
      const { errorMsg } = options || {};
      try {
        const response = await action(payload);
        return response;
      } catch (e) {
        return rejectWithValue({ error: e, errorMsg });
      }
    }
  );
}

export interface DefaultMatchers {
  pending: (action: any) => action is PendingActionFromAsyncThunk<any>;
  fulfilled: (action: any) => action is FulfilledActionFromAsyncThunk<any>;
  rejected: (action: any) => action is RejectedActionFromAsyncThunk<any>;
}
export function createCustomSlice<
  Name extends string,
  State extends BaseState,
  CaseReducers extends SliceCaseReducers<State>
>(
  options: Omit<CreateSliceOptions<State, CaseReducers, Name>, "extraReducers">,
  defaultMatchers?: DefaultMatchers,
  buildExtraReducers?: (
    builder: ActionReducerMapBuilder<NoInfer<State>>
  ) => void
): Slice<State, CaseReducers, Name> {
  return createSlice({
    ...options,
    extraReducers: (builder) => {
      if (buildExtraReducers) {
        buildExtraReducers(builder);
      }

      if (!defaultMatchers) {
        return;
      }

      const { pending, fulfilled, rejected } = defaultMatchers;

      builder
        .addMatcher(pending, (state) => {
          state.isLoading = true;
        })
        .addMatcher(fulfilled, (state) => {
          state.isLoading = false;
        })
        .addMatcher(rejected, (state) => {
          state.isLoading = false;
        });
    },
  });
}
