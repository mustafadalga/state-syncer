import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: "./src/state-syncer.ts",
            name: 'state-syncer',
            fileName: 'state-syncer',
        },
        rollupOptions: {
            external: [ "react" ],
            output: {
                globals: {
                    react: "React",
                },
            },
        },
    }
})