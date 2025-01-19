// ($slug)._index.tsx
import {
  Content,
  fetchOneEntry,
  getBuilderSearchParams,
  isPreviewing,
} from '@builder.io/sdk-react';
import { useLoaderData } from 'react-router';
import type { Params } from 'react-router';

const apiKey = process.env.BUILDER_API_KEY || '';

interface LoaderArgs {
  params: Params;
  request: Request;
}

export async function loader({ params, request }: LoaderArgs) {
  const url = new URL(request.url);
  const urlPath = `/${params['slug'] || ''}`;

  const page = await fetchOneEntry({
    model: 'page',
    apiKey: apiKey,
    options: getBuilderSearchParams(url.searchParams),
    userAttributes: { urlPath },
  });

  if (!page && !isPreviewing(url.search)) {
    throw new Response('Page Not Found', {
      status: 404,
      statusText: 'Page not found in Builder.io',
    });
  }

  return { page };
}

export default function Page() {
  const { page } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return <Content model="page" apiKey={apiKey} content={page} />;
}