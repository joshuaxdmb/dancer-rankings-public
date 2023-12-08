/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['i.scdn.co','www.dancelifex.com','torontodancefridays.com'],
        unoptimized: true,
      },
}

const nextConfigProdLocal = {
  images: {
      domains: ['i.scdn.co','www.dancelifex.com','torontodancefridays.com'],
      unoptimized: true,
    },
  output: "export",
}

const nextConfigProd = {
  images: {
      domains: ['i.scdn.co','www.dancelifex.com','torontodancefridays.com'],
      unoptimized: true,
    },
}

switch(process.env.NODE_ENV) {
  case 'production':
    module.exports = nextConfigProd
    break
  case 'production-local':
    module.exports = nextConfigProdLocal
    break
  default:
    module.exports = nextConfig
}
