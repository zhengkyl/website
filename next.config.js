module.exports = {
  images: {
    domains: ["i.scdn.co", "image.tmdb.org"],
  },
  async rewrites() {
    return [
      {
        source: "/gh/:path*",
        destination: "https://zhengkyl.github.io/:path*",
      },
    ];
  },
};
