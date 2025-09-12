{pkgs}: {
  channel = "stable-25.05";
  packages = [
    pkgs.nodejs_20
    pkgs.playwright-driver.browsers
  ];
  idx.extensions = [
    "Vue.volar"
    "vitest.explorer"
    "ms-playwright.playwright"
    "dbaeumer.vscode-eslint"
    "EditorConfig.EditorConfig"
    "esbenp.prettier-vscode"
  ];
  env = {
    PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
  };
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}
