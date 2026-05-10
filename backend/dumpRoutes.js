import app from './app.js';

const dumpRoutes = (stack, parent = '') => {
  stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(`${Object.keys(r.route.methods).join(',').toUpperCase()} ${parent}${r.route.path}`);
    } else if (r.handle && r.handle.stack) {
      const p = r.regexp.toString().replace('/^', '').replace('\\/?(?=\\/|$)/i', '').replace('\\/', '/').replace('\\/', '/').replace('?', '');
      // This is a bit hacky but helps
      dumpRoutes(r.handle.stack, parent + p.split('/')[1] + '/');
    }
  });
};

console.log('Registered Routes:');
dumpRoutes(app._router.stack);
process.exit();
