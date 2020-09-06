export async function getWasmComputeFunc(): Promise<CallableFunction> {
  const wasmCode = await Deno.readFile("./rwasm/pkg/rwasm_bg.wasm");

  return new WebAssembly.Instance(new WebAssembly.Module(wasmCode)).exports.compute as CallableFunction;
}
