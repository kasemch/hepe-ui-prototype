const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const isUserSite = repoName.endsWith(".github.io");
const basePath = isGitHubActions && repoName && !isUserSite ? `/${repoName}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
