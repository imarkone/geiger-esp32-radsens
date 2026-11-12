const REGISTER_COUNT = 0x15;
const STATIC_SECONDS = 300;
const DYNAMIC_SECONDS = 122;

function encodeRate(pulses, seconds, sensitivity) {
    if (seconds === 0 || sensitivity === 0) return 0;
    const value = pulses * 36000n / (BigInt(seconds) * BigInt(sensitivity));
    return Number(value > 1440000n ? 1440000n : value);
}

export class RadSensModel {
    #history = [];
    #total = 0n;
    #consumed = 0n;
    #pointer = 0;
    #sensitivity;

    constructor(sensitivity = 65) {
        if (!Number.isInteger(sensitivity) || sensitivity < 0 || sensitivity > 510) {
            throw new RangeError('Sensitivity must be an integer from 0 to 510');
        }
        this.#sensitivity = sensitivity;
    }

    // One call per elapsed second, including seconds with zero pulses.
    recordSecond(count) {
        if (!Number.isSafeInteger(count) || count < 0) {
            throw new RangeError('Count must be a nonnegative safe integer');
        }
        const pulses = BigInt(count);
        this.#total += pulses;
        this.#history.push(pulses);
        if (this.#history.length > STATIC_SECONDS) this.#history.shift();
    }

    selectRegister(pointer) {
        if (!Number.isInteger(pointer) || pointer < 0 || pointer > 255) {
            throw new RangeError('Pointer must be a byte');
        }
        this.#pointer = pointer < REGISTER_COUNT ? pointer : 0;
    }

    // finish(actualBytes) models the bus reporting how many bytes went out.
    // The caller serializes bus reads and can record pulses during a read.
    beginRead(requestedBytes) {
        if (!Number.isInteger(requestedBytes) || requestedBytes < 0 || requestedBytes > 255) {
            throw new RangeError('Read length must be a byte');
        }
        const start = this.#pointer;
        this.#pointer = 0;
        const snapshotTotal = this.#total;
        const remaining = snapshotTotal - this.#consumed;
        const pulseValue = Number(remaining > 65535n ? 65535n : remaining);
        const registers = Buffer.alloc(REGISTER_COUNT);
        registers[0] = 0x7d;
        registers[1] = 0x04;
        registers.writeUIntBE(this.#rate(DYNAMIC_SECONDS), 0x03, 3);
        registers.writeUIntBE(this.#rate(STATIC_SECONDS), 0x06, 3);
        registers.writeUInt16BE(pulseValue, 0x09);
        registers[0x10] = 0x66;
        registers.writeUInt16LE(this.#sensitivity, 0x12);
        const bytes = Buffer.alloc(requestedBytes, 0xff);
        registers.copy(bytes, 0, start);
        return {
            bytes,
            finish: (actualBytes) => {
                if (!Number.isInteger(actualBytes) || actualBytes < 0 || actualBytes > requestedBytes) {
                    throw new RangeError('Transferred byte count exceeds read length');
                }
                const reachedPulseRegister = actualBytes > 0 && start <= 0x0a && start + actualBytes > 0x09;
                if (reachedPulseRegister && snapshotTotal > this.#consumed) this.#consumed = snapshotTotal;
            },
        };
    }

    #rate(window) {
        const counts = this.#history.slice(-window);
        const total = counts.reduce((sum, count) => sum + count, 0n);
        return encodeRate(total, counts.length, this.#sensitivity);
    }
}
