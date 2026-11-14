const { existsSync } = require('node:fs');
const { join } = require('node:path');

if (process.platform === 'win32' && !process.env.CHROME_BIN) {
  const pastas = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean);
  const navegadores = pastas.flatMap(pasta => [
    join(pasta, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(pasta, 'Microsoft', 'Edge', 'Application', 'msedge.exe')
  ]);
  const navegador = navegadores.find(arquivo => existsSync(arquivo));
  if (navegador) {
    process.env.CHROME_BIN = navegador;
  }
}

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    restartOnFileChange: true
  });
};
