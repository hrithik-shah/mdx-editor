/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pixnio.com",
            },
            {
                protocol: "https",
                hostname: "cdn.example.com",
            },
        ],
    },
}

module.exports = nextConfig
