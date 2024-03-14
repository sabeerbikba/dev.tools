import TerserPlugin from 'terser-webpack-plugin';

export default {
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                    },
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
};
