import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
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
  middleware?: <Returned>(response: Data) => Returned,
  options?: {
    errorMsg: string;
  }
): AsyncThunk<Data, ThunkArg, CustomThunkConfig<ErrorData>> {
  return createAsyncThunk<Data, ThunkArg, CustomThunkConfig<ErrorData>>(
    prefix,
    async (payload, { rejectWithValue }) => {
      const { errorMsg } = options || {};
      try {
        let response = await action(payload);

        if (middleware) {
          response = middleware(response);
        }

        return response;
      } catch (e) {
        return rejectWithValue({ error: e, errorMsg });
      }
    }
  );
}
