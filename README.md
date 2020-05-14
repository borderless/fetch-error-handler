# Fetch Error Handler

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Error handler for [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) responses, e.g. Cloudflare Workers.

## Installation

```sh
npm install @borderless/fetch-error-handler --save
```

## Usage

```js
import { compose } from "throwback";
import { errorHandler } from "@borderless/fetch-error-handler";
import { finalHandler } from "@borderless/fetch-final-handler";

const app = compose([get(), post()]);
const req = new Request("/");

const res = await app(req, finalHandler()).catch(
  errorHandler(req, { production: true })
);
```

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/@borderless/fetch-error-handler.svg?style=flat
[npm-url]: https://npmjs.org/package/@borderless/fetch-error-handler
[downloads-image]: https://img.shields.io/npm/dm/@borderless/fetch-error-handler.svg?style=flat
[downloads-url]: https://npmjs.org/package/@borderless/fetch-error-handler
[travis-image]: https://img.shields.io/travis/BorderlessLabs/fetch-error-handler.svg?style=flat
[travis-url]: https://travis-ci.org/BorderlessLabs/fetch-error-handler
[coveralls-image]: https://img.shields.io/coveralls/BorderlessLabs/fetch-error-handler.svg?style=flat
[coveralls-url]: https://coveralls.io/r/BorderlessLabs/fetch-error-handler?branch=master
