export async function getWasmExports() {
  const wasmCode = await Deno.readFile("./rwasm/pkg/rwasm_bg.wasm");

  return new WebAssembly.Instance(new WebAssembly.Module(wasmCode)).exports;
}
