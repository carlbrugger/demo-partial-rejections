# demo-partial-rejections

This project is a demo Bun HTTP server to demo the Flatfile `@flatfile/plugin-partial-rejection-handler` package functionality. There are two endpoints that will provide validation of records. The `http://localhost:5678/reject-non-flatfile-emails` endpoint checks for that do not end in `@flatfile.io`. The `http://localhost:5678/reject-empty-cells` endpoint checks for empty cells. Both endpoints will return the offending record ids along with an error message.

## Usage

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start:watch
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
