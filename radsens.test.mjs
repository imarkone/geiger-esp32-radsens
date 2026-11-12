import assert from 'node:assert/strict';
import test from 'node:test';
import { RadSensModel } from './radsens.mjs';

function read(model, pointer, length) {
    model.selectRegister(pointer);
    const transfer = model.beginRead(length);
    transfer.finish(length);
    return transfer.bytes.toString('hex');
}

test('identity, invalid pointer, address, sensitivity and overread', () => {
    const model = new RadSensModel();
    assert.equal(read(model, 0, 2), '7d04');
    assert.equal(read(model, 0xff, 2), '7d04');
    assert.equal(read(model, 0x10, 1), '66');
    assert.equal(read(model, 0x12, 2), '4100');
    assert.equal(read(model, 0x14, 2), '00ff');
    assert.equal(model.beginRead(2).bytes.toString('hex'), '7d04');
});

test('13 pulses in 60 seconds encode 12.0 micro-roentgens/hour', () => {
    const model = new RadSensModel();
    for (let second = 0; second < 60; second++) model.recordSecond(second < 13 ? 1 : 0);
    assert.equal(read(model, 0x06, 3), '000078');
    for (let second = 0; second < 300; second++) model.recordSecond(0);
    assert.equal(read(model, 0x06, 3), '000000');
});

test('short transfer preserves pulses, full read consumes only its snapshot', () => {
    const model = new RadSensModel();
    model.recordSecond(258);
    model.selectRegister(0x06);
    model.beginRead(5).finish(3);
    model.selectRegister(0x09);
    const transfer = model.beginRead(2);
    assert.equal(transfer.bytes.toString('hex'), '0102');
    model.recordSecond(3);
    transfer.finish(2);
    assert.equal(read(model, 0x09, 2), '0003');
    assert.equal(read(model, 0x09, 2), '0000');
    assert.notEqual(read(model, 0x06, 3), '000000');
});

test('low-byte-only read consumes count; limits apply to pulses and rate', () => {
    const model = new RadSensModel();
    model.recordSecond(100000);
    assert.equal(read(model, 0x06, 3), '15f900');
    assert.equal(read(model, 0x0a, 1), 'ff');
    assert.equal(read(model, 0x09, 2), '0000');
});

test('zero sensitivity disables rate while pulse counter remains available', () => {
    const model = new RadSensModel(0);
    model.recordSecond(60);
    assert.equal(read(model, 0x06, 3), '000000');
    assert.equal(read(model, 0x09, 2), '003c');
});
