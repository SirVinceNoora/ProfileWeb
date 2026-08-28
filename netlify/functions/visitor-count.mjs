import { getStore } from '@netlify/blobs';

export default async (request) => {
  const store = getStore({ name: 'profile-visitors', consistency: 'strong' });
  const previousCount = (await store.get('page-views', { type: 'json' }))?.count
    ?? (await store.get('total', { type: 'json' }))?.count
    ?? 0;
  const count = previousCount + 1;

  await store.setJSON('page-views', { count });

  return new Response(JSON.stringify({ count }), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    }
  });
};
