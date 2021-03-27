const { synthesis, dictionary_dir } = require("../addon");
const path = require("path");
const { promises: fs } = require("fs");
async function test() {
  const text = await fs.readFile(path.resolve(__dirname, "./test.txt"), "utf-8");
  const p = synthesis(text, {
    htsvoice: path.resolve(__dirname, "../", "hts_voice_nitech_jp_atr503_m001-1.05", "nitech_jp_atr503_m001.htsvoice"),
    dictionary: dictionary_dir,
  });
  const p2 = fs.readFile(path.resolve(__dirname, "./test.bin"));
  const wave = await p;
  const bin = Buffer.alloc(wave.data.byteLength);
  let i = 0;
  for (const d of wave.data) {
    bin.writeInt16LE(d, i);
    i += 2;
  }
  const origin = await p2;
  if (bin.byteLength != origin.byteLength) {
    throw new Error("byteLength mismatch");
  }
  const len = bin.byteLength;
  for (let i = 0; i < len; i += 2) {
    if (bin.readInt16LE(i) != origin.readInt16LE(i)) {
      throw new Error("readInt16LE mismatch at " + i);
    }
  }
  console.log("testing OK");
}
test().catch(e => {
  console.error(e);
  process.exit(1);
});