module.exports = {
  reactStrictMode: true,
  async rewrites(){
    return [
      {
        source: '/api/sessions',
        destination: '/api/sessions'
      },
      {
        source: '/api/:path',
        destination: 'http://localhost:3000/:path'
      }
    ]
  }
}
