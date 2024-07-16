module.exports = {
  async rewrites() {
    return [
      {
        source: "/gh/:path*",
        destination: "https://zhengkyl.github.io/:path*",
      },
    ];
  },
};
