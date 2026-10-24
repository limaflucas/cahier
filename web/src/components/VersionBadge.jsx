import { api } from '../api.js';
import { useFlag } from '../flags.jsx';
import { useApi } from '../useApi.js';

/** Running version and commit, behind the version-badge flag. */
export default function VersionBadge() {
  return useFlag('version-badge') ? <Badge /> : null;
}

/** Footer line naming the build this page is served from. */
function Badge() {
  const state = useApi((signal) => api.version(signal), []);
  if (state.status !== 'done') return null;
  const { version, commit } = state.data;
  return (
    <footer data-testid="version-badge" className="px-4 py-6 text-center text-xs text-stone-400">
      Cahier {version} · {commit.slice(0, 7)}
    </footer>
  );
}
