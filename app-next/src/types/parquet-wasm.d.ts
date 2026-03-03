declare module "parquet-wasm/esm" {
  /**
   * Initialize the WASM module
   */
  export default function init(): Promise<void>;

  /**
   * Read a Parquet file and return Arrow IPC bytes
   * @param data - The Parquet file as a Uint8Array
   * @returns Arrow IPC format bytes as Uint8Array
   */
  export function readParquet(data: Uint8Array): Uint8Array;

  /**
   * Write Arrow IPC data to Parquet format
   * @param data - Arrow IPC bytes as Uint8Array
   * @returns Parquet file bytes as Uint8Array
   */
  export function writeParquet(data: Uint8Array): Uint8Array;
}
