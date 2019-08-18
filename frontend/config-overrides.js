const {override, addBabelPlugins, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
    ...addBabelPlugins(
        "import-graphql",
    ),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {"@primary-color": "#0053a5"}
    })
);
