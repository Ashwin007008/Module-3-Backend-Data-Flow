# Node.js Runtime Features — Streams, Buffers & the File System

## Problem Statement

You will move the **same file two different ways** and feel why streams exist. The starter repo already imports `fs` and `path` and includes a large sample file, `sample-data.txt`, sitting next to `index.js`.

Your job is to implement the two functions in `index.js` and write a short explanation.

---

## What You Build

1. **`readWholeFile()` — load it all.** Use `fs.readFile` to read `sample-data.txt`. With no encoding the callback gives you a **Buffer** (raw bytes). Log the size in bytes using the buffer's `.length`. Example output:
   ```
   readFile: loaded 524288 bytes into memory at once
   ```

2. **`streamFile()` — flow it.** Create a readable stream with `fs.createReadStream(INPUT)` and a writable stream with `fs.createWriteStream(OUTPUT)`, then `pipe()` the readable into the writable to copy the file in chunks. Log a message on the writable's `finish` event. Example output:
   ```
   stream: finished copying via 64KB chunks (peak memory stays flat)
   ```

3. **Explain the difference.** In the `PART 3` comment block, write **2 to 3 sentences in your own words** on why the stream approach is preferable for large files. Your explanation must capture the core idea: `fs.readFile` holds the **whole file in memory** (memory used equals file size), while the stream moves it **in chunks** so **peak memory stays flat** no matter how big the file is.

---

## Files to Edit

* `index.js` — **the only file you edit.** Implement `readWholeFile`, `streamFile`, and the PART 3 explanation comment.

Do **not** hand-build file paths with string concatenation; use the provided `path.join(__dirname, ...)` values.

---

## How to Run

1. Open the terminal.
2. Run `npm start`.
3. You should see the `readFile` size line and the `stream` finished line, and a new `sample-copy.txt` should appear next to `index.js`.

---

## How to Submit

Commit your changes, push the branch, and **submit the pull request (PR) link**. Your submission is reviewed for:

* `fs.readFile` used correctly, logging the byte size from the Buffer.
* A readable stream piped to a writable stream that produces a copy.
* A clear, in-your-own-words explanation that mentions memory: whole file vs chunks, and why peak memory stays flat with a stream.
