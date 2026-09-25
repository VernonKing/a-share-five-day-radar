(function (scope) {
  'use strict';
  const buckets = ['chem_large', 'chem_small', 'oil', 'bj'];

  function validateBundle(bundle) {
    const snapshot = bundle?.snapshot;
    if (!snapshot || !/^\d{4}-\d{2}-\d{2}$/.test(snapshot.as_of || '') ||
        !/^\d{4}-\d{2}-\d{2}$/.test(snapshot.window_start || '') ||
        !snapshot.stats || !['CN'].every(market =>
          /^\d{4}-\d{2}-\d{2}$/.test(snapshot.market_windows?.[market]?.window_start || '') &&
          /^\d{4}-\d{2}-\d{2}$/.test(snapshot.market_windows?.[market]?.as_of || '')) ||
        !buckets.every(key => Array.isArray(snapshot.groups?.[key]?.gainers) &&
          Array.isArray(snapshot.groups?.[key]?.losers))) {
      throw new Error('榜单或分市场窗口数据结构不完整');
    }
    if (!bundle.products || typeof bundle.products !== 'object' || Array.isArray(bundle.products)) {
      throw new Error('关联品种数据结构不完整');
    }
    return bundle;
  }

  async function readJson(fetcher, url) {
    const response = await fetcher(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`读取失败：${url}`);
    return response.json();
  }

  async function loadBundle(fetcher, remoteUrl, fallback = { snapshot: './snapshot.json', products: './products.json' }) {
    try {
      const bundle = validateBundle(await readJson(fetcher, remoteUrl));
      return { ...bundle, source: 'cloud', reason: '' };
    } catch (error) {
      let snapshot = await readJson(fetcher, fallback.snapshot);
      if (!snapshot.market_windows && snapshot.window_start && snapshot.as_of) {
        snapshot = { ...snapshot,
          market_windows: {
            CN: { window_start: snapshot.window_start, as_of: snapshot.as_of },
          },
        };
      }
      let products = {};
      try { products = await readJson(fetcher, fallback.products); } catch (_) { /* stock data still usable */ }
      const bundle = validateBundle({ snapshot, products });
      return { ...bundle, source: 'fallback', reason: String(error?.message || error) };
    }
  }

  scope.SiteFeed = { loadBundle, validateBundle };
  if (typeof module !== 'undefined' && module.exports) module.exports = { loadBundle, validateBundle };
})(typeof globalThis !== 'undefined' ? globalThis : this);
