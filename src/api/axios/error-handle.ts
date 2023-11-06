import { AxiosError, isAxiosError } from "axios";

// this is all errrors allowed to receive
export type THttpError<T = any> = Error | AxiosError<T> | null;

// object that can be passed to our registy
interface ErrorHandlerObject {
  before?(error?: THttpError, options?: ErrorHandlerObject): void;
  message?: string;
  check?(error?: THttpError, options?: ErrorHandlerObject): boolean;
}

//signature of error function that can be passed to ours registry
type ErrorHandlerFunction = (
  error?: THttpError
) => ErrorHandlerObject | boolean | undefined | void;

//type that our registry accepts
type ErrorHandler = ErrorHandlerFunction | ErrorHandlerObject | string;

//interface for register many handlers once (object where key will be presented as search key for error handling
export interface ErrorHandlerMany {
  [key: string]: ErrorHandler;
}
type FunctionShowMessage = (message: string) => void;
// type guard to identify that is an ErrorHandlerObject
function isErrorHandlerObject(value: any): value is ErrorHandlerObject {
  if (typeof value === "object") {
    return ["message", "after", "before", "notify"].some((k) => k in value);
  }
  return false;
}
class ErrorHandlerRegistry {
  private handlers = new Map<string, ErrorHandler>();
  private handle_show_message?: FunctionShowMessage = undefined;
  private parent: ErrorHandlerRegistry | null = null;

  constructor(parent?: ErrorHandlerRegistry) {
    if (typeof parent !== "undefined") this.parent = parent;
  }
  // allow to register an handler
  register(key: string, handler: ErrorHandler) {
    this.handlers.set(key, handler);
    return this;
  }

  // unregister a handler
  unregister(key: string) {
    this.handlers.delete(key);
    return this;
  }

  // search a valid handler by key
  find(seek: string): ErrorHandler | undefined {
    const handler = this.handlers.get(seek);
    if (handler) return handler;
    return this.parent?.find(seek);
  }
  // search a valid handler by key
  findByError(error: THttpError): ErrorHandler | undefined {
    let res = null;
    this.handlers.forEach((handle) => {
      if (isErrorHandlerObject(handle) && handle.check && handle.check(error)) {
        res = handle;
        return;
      }
    });
    if (res) return res;
    return this.parent?.findByError(error);
  }

  // pass an object and register all keys/value pairs as handler.
  registerMany(input: ErrorHandlerMany) {
    for (const [key, value] of Object.entries(input)) {
      this.register(key, value);
    }
    return this;
  }

  // handle error seeking for key
  handleError(
    seek: (string | undefined)[] | string,
    error: THttpError
  ): boolean {
    if (Array.isArray(seek)) {
      return seek.some((key) => {
        if (key !== undefined) return this.handleError(String(key), error);
      });
    }
    let handler = this.find(String(seek));
    if (!handler) {
      handler = this.findByError(error);
    }
    if (!handler) {
      return false;
    } else if (typeof handler === "string") {
      return this.handleErrorObject(error, { message: handler });
    } else if (typeof handler === "function") {
      const result = handler(error);
      if (isErrorHandlerObject(result))
        return this.handleErrorObject(error, result);
      return !!result;
    } else if (isErrorHandlerObject(handler)) {
      return this.handleErrorObject(error, handler);
    }
    return false;
  }
  // if the error is an ErrorHandlerObject, handle here
  handleErrorObject(error: THttpError, options: ErrorHandlerObject = {}) {
    options?.before?.(error, options);
    if (options.message) {
      this.showMessage(options.message);
    }
    // showToastError(options.message ?? "Unknown Error!!", options, "error");
    return true;
  }

  // this is the function that will be registered in interceptor.
  responseErrorHandler(error: THttpError) {
    if (error === null)
      throw new Error("Unrecoverrable error!! Error is null!");
    if (isAxiosError(error)) {
      const response = error?.response;
      const seekers = [
        String(response?.status), //respose status code. Both based on Http Status codes.
        // data?.code, //Our api can send an error code to you personalize the error messsage.
        error.code, //The AxiosError has an error code too (ERR_BAD_REQUEST is one).
        error?.name //Error has a name (class name). Example: HttpError, etc..
        // String(data?.status), //Our api can send an status code as well.
      ];
      this.handleError(seekers, error);
    } else if (error instanceof Error) {
      return this.handleError(error.name, error);
    }
    //if nothings works, throw away
    return error;
  }
  showMessage(message: string) {
    if (this.handle_show_message) {
      this.handle_show_message(message);
    }
  }
  setFunctionShowMessage(cb: FunctionShowMessage) {
    this.handle_show_message = cb;
  }
}

export const GlobalHandlers = new ErrorHandlerRegistry();
// bắt dựa theo status của http hoặc hàm check
export function dealsWith(
  solutions: ErrorHandlerMany,
  ignoreGlobal: boolean = false
) {
  let global = undefined;
  if (ignoreGlobal === false) global = GlobalHandlers;
  const localHandlers = new ErrorHandlerRegistry(global);
  localHandlers.registerMany(solutions);
  return (error: any) => localHandlers.responseErrorHandler(error);
}

// Hàm được chạy khi status = 422
// "422": (e: any) => {
//     const error = e as AxiosError<LaravelValidationResponse>;
//     if (error.response) setErrorMessage(error.response.data);
//   },
// }
// hàm before được chạy khi hàm 'check' trả về true, message sẽ hiển thị tương ứng
// Unauthenticated: {
//   check: isTokenInvalid,
//   before() {
//     dispatch(logout());
//   },
//   message: "logout",
// }
// hàm before được chạy khi status = 500 hoặc hàm 'check' trả về true
// 500: {
//   check: isServerError,
//   before(e) {
//     const error = e as AxiosError<LaravelServerErrorResponse>;
//     error &&
//       error.response &&
//       error.response.data &&
//       error.response.data.message &&
//       $message.error(error.response.data.message);
//   },
// },
