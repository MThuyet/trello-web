let apiRoute = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoute = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoute = 'https://mthuyet-trello-api.onrender.com'
}

export const API_ROUTE = apiRoute
