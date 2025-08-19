/** @type {import('tailwindcss').Config} */
export default {
   content: [
      './src/**/*.html',
      './src/**/*.js',
      './src/**/*.jsx',
      './src/index.jsx',
      './src/styles/**/*.css',
   ],
   corePlugins: {
      preflight: false,
   },
   theme: {
      extend: {
         screens: {
            // Docs: https://tailwindcss.com/docs/responsive-design
            // 'sm': '640px',
            // 'md': '768px',
            // 'lg': '1024px',
            // 'xl': '1280px',
            // '2xl': '1536px',
         },
      },
   },
}
