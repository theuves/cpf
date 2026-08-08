import esbuild from 'esbuild'

// Configuração para build de produção (IIFE)
const iifeConfig = {
  entryPoints: ['src/browser.ts'],
  bundle: true,
  minify: true,
  outfile: 'dist/cpf.min.js',
  format: 'iife',
  target: 'es2020',
  sourcemap: true,
  external: [],
}

// Configuração para build ESM
const esmConfig = {
  entryPoints: {
    cpf: 'src/index.ts',
    'cpf/index': 'src/cpf/index.ts',
    'cnpj/index': 'src/cnpj/index.ts',
  },
  bundle: true,
  outdir: 'dist',
  outExtension: { '.js': '.mjs' },
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  external: [],
}

// Configuração para CommonJS/Node.js
const cjsConfig = {
  entryPoints: {
    cpf: 'src/index.ts',
    'cpf/index': 'src/cpf/index.ts',
    'cnpj/index': 'src/cnpj/index.ts',
  },
  bundle: true,
  outdir: 'dist',
  outExtension: { '.js': '.cjs' },
  format: 'cjs',
  target: 'node16',
  sourcemap: true,
  external: [],
}

// Configuração para desenvolvimento
const devConfig = {
  entryPoints: ['src/browser.ts'],
  bundle: true,
  outfile: 'dist/cpf.js',
  format: 'iife',
  target: 'es2020',
  sourcemap: true,
  external: [],
  watch: process.argv.includes('--watch'),
}

// Função para executar builds
async function build() {
  const mode = process.argv[2]

  try {
    switch (mode) {
      case 'iife':
        await esbuild.build(iifeConfig)
        console.log('✅ IIFE build completed')
        break
      case 'esm':
        await esbuild.build(esmConfig)
        console.log('✅ ESM build completed')
        break
      case 'cjs':
        await esbuild.build(cjsConfig)
        console.log('✅ CommonJS build completed')
        break
      case 'dev':
        await esbuild.build(devConfig)
        console.log('✅ Development build completed')
        break
      default:
        // Build ambos os formatos
        await esbuild.build(iifeConfig)
        await esbuild.build(esmConfig)
        await esbuild.build(cjsConfig)
        console.log('✅ All builds completed')
    }
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  build()
}

export { iifeConfig, esmConfig, cjsConfig, devConfig }
