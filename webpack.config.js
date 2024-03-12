import TerserPlugin from 'terser-webpack-plugin';

export default {
    // other webpack configuration...
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, // Remove console.log statements
                        drop_debugger: true, // Remove debugger statements
                    },
                    output: {
                        comments: false, // Remove comments
                    },
                },
            }),
        ],
    },
};
