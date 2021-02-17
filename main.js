const onceupon = require('onceupon.js');

module.exports = () => {
  let r = {
    use: (...modules) => {
      let f = 0;
      let t = onceupon();

      if(typeof modules !== 'object') {
        modules = [modules];
      }

      let q = (m, o) => {
        let c = q => {
          if(q?.name?.length > 0 && typeof q?.version === 'number') {
            if(typeof r._[q.name] === 'object' ? q.version > r._[q.name]?.version : true) {
              r._[q.name] = q;
            }

            t.fire(`ready-${q.name}`, q.version);
            f++;

            if(f === modules.length) {
              t.fire('ready');
            }
          }
        };

        if(typeof m === 'function') {
          m({
            core: r,
            build: c,
            options: o || {}
          });
        }
      };

      modules.forEach(module => {
        if(typeof module === 'function') {
          q(module);
        } else if(typeof module === 'object' ? (typeof module?.module === 'function') : false) {
          q(module?.module, module?.options);
        }
      });

      return {
        on: t.on,
        once: t.once,
        only: t.only
      }
    },

    _: {}
  };

  return r;
}