import Cors from 'cors';
import initMiddleware from '../../../utils/api/init-middleware';
import { getAllAPIs, getAPI } from '../../../model';
import { NextApiRequest, NextApiResponse } from 'next';
import { IApi } from '../../../model';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: true,
  })
);

const extractApiAttributes = (api: IApi) => {
  const { title, slug, is_open } = api;
  return { title, slug, is_open };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { slug },
  } = req;

  if (!slug.length || slug[0] !== 'apis') {
    res.statusCode = 404;
    return res.send({ Error: 'Route does not exist' });
  }

  await cors(req, res);
  if (slug.length === 1) {
    const allApis = await getAllAPIs();
    const openApis = allApis
      .filter((api: IApi) => api)
      .map(extractApiAttributes);

    // Rest of the API logic
    res.json(openApis);
  } else {
    const api = await getAPI(slug[1]);

    // Rest of the API logic
    res.json(extractApiAttributes(api));
  }
}
