exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['main-spec.js'],
  rootElement: "[ng-app]"
};