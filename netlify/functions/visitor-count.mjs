import { getStore } from '@netlify/blobs';

export default async (request) => {
  const store = getStore({ name: 'profile-visitors', consistency: 'strong' });
  const hasVisitorCookie = request.headers.get('cookie')?.includes('vcn_visitor=1');
  let count = (await store.get('total', { type: 'json' }))?.count ?? 0;

  if (!hasVisitorCookie) {
    count += 1;
    await store.setJSON('total', { count });
  }

  const cookieParts = [
    'vcn_visitor=1',
    'Max-Age=31536000',
    'Path=/',
    'SameSite=Lax'
  ];

  if (new URL(request.url).protocol === 'https:') cookieParts.push('Secure');

  return new Response(JSON.stringify({ count }), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      'Set-Cookie': cookieParts.join('; ')
    }
  });
};
