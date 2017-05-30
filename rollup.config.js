export default {
	entry: 'index.es.js',
	dest: 'index.js',
	format: 'umd',
    moduleName: 'SurplusDataMixin',
    exports: 'named',
    external: ['surplus'],
    globals: { 'surplus': 'Surplus' }
}