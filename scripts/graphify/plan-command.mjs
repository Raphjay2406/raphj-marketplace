function err(message) { return { exec: null, message, kind: 'error' }; }
function info(message) { return { exec: null, message, kind: 'info' }; }
function exec(cmd, args, message = '') { return { exec: [cmd, args], message, kind: 'exec' }; }

const INSTALL_HINT = 'graphify not found — run `gen:graphify install` (needs uv + Python 3.10+).';

export function planCommand(sub, args = [], caps = {}) {
  const need = () => caps.available === true;
  switch (sub) {
    case 'scan':
    case 'update':
      return need() ? exec('graphify', ['update', '.'], 'Building/updating the repo graph…') : err(INSTALL_HINT);
    case 'query':
      if (!args[0]) return err('usage: gen:graphify query "<question>"');
      return need() ? exec('graphify', ['query', args[0]]) : err(INSTALL_HINT);
    case 'explain':
      if (!args[0]) return err('usage: gen:graphify explain "<node>"');
      return need() ? exec('graphify', ['explain', args[0]]) : err(INSTALL_HINT);
    case 'path':
      if (!args[0] || !args[1]) return err('usage: gen:graphify path "<A>" "<B>"');
      return need() ? exec('graphify', ['path', args[0], args[1]]) : err(INSTALL_HINT);
    case 'status': {
      const a = caps.available ? 'available' : 'NOT available (BM25 fallback active)';
      const g = caps.graphExists ? `graph present (age ${Math.round((caps.ageMs ?? 0) / 1000)}s)` : 'no graph yet — run `gen:graphify scan`';
      return info(`graphify: ${a}\ngraph: ${g}`);
    }
    case 'install':
      return caps.available ? info('graphify already installed.') : exec('uv', ['tool', 'install', 'graphifyy'], 'Installing graphify…');
    default:
      return err(`unknown subcommand: ${sub}. Use scan|update|query|explain|path|status|install.`);
  }
}
