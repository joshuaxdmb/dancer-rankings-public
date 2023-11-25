/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production'
const nextConfig = {
    images: {
        domains: ['i.scdn.co','www.dancelifex.com','torontodancefridays.com'],
        unoptimized: true,
      },
}

const nextConfigProd = {
  images: {
      domains: ['i.scdn.co','www.dancelifex.com','torontodancefridays.com'],
      unoptimized: true,
    },
  output: "export"
}

module.exports = isProduction? nextConfigProd : nextConfig
