import {
  deflate,
  deflateRaw,
  inflate,
  inflateRaw,
  encode,
  parse,
} from '../../src/UZIP.js';

/* global chai, describe, it */
const assert = chai.assert;

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();

describe('UZIP-module', () => {

  it('deflates and inflates', () => {
    const content = utf8Encoder.encode('this is a test this is a test this is a test this is a test!');
    const compressed = deflate(content);
    assert.isBelow(compressed.length, content.length);
    const uncompressed = inflate(compressed);
    assert.deepEqual(uncompressed, content);
  });

  it('deflateRaw -> inflateRaw', () => {
    const content = utf8Encoder.encode('this is a test this is a test this is a test this is a test!');
    const compressed = deflateRaw(content);
    assert.isBelow(compressed.length, content.length);
    const uncompressed = inflateRaw(compressed);
    assert.deepEqual(uncompressed, content);
  });

  it('unzips', async () => {
    const expected = {
      'stuff/': utf8Encoder.encode(''),
      'stuff/dog.txt': utf8Encoder.encode('german shepard\n'),
      'stuff/birds/': utf8Encoder.encode(''),
      'stuff/birds/bird.txt': utf8Encoder.encode('parrot\n'),
      'stuff/cat.txt': utf8Encoder.encode('siamese\n'),
      'stuff/long.txt': utf8Encoder.encode(`${new Array(200).fill('compress').join('')}\n`),
    };

    const req = await fetch('./data/stuff.zip');
    const zip = await req.arrayBuffer();
    const unzip = parse(zip);

    assert.deepEqual(unzip, expected);
  });

  it('zips', async () => {
    const data = {
      'stuff/': utf8Encoder.encode(''),
      'stuff/dog.txt': utf8Encoder.encode('german shepard\n'),
      'stuff/birds/': utf8Encoder.encode(''),
      'stuff/birds/bird.txt': utf8Encoder.encode('parrot\n'),
      'stuff/cat.txt': utf8Encoder.encode('siamese\n'),
      'stuff/long.txt': utf8Encoder.encode(`${new Array(200).fill('compress').join('')}\n`),
    };
    const zip = encode(data);
    const unzip = parse(zip);
    assert.deepEqual(unzip, data);
  });
});