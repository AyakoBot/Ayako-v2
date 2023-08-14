import * as wasm from "./rust_bg.wasm";
import { __wbg_set_wasm } from "./rust_bg.js";
__wbg_set_wasm(wasm);
export * from "./rust_bg.js";
