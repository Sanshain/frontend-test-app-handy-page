//@ts-check

const resolve = require('@rollup/plugin-node-resolve').default;
const terser = require('@rollup/plugin-terser').default;

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
    input: './script/index.js',
    output: {
        file: './dist/index.js',
        format: 'iife'
    },
    plugins: [
        resolve({
            extensions: ['.js']
        }),
        terser()
    ]
}

module.exports = config;