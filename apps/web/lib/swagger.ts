import 'server-only';

import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  return createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Acadx Swagger APIs',
        version: '1.0',
      },
      security: [],
    },
  });
};
