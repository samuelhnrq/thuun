// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";
import { logger } from "./server/logger";

process.on("unhandledRejection", (reason) => {
  if (reason instanceof Error) {
    logger.error("Unhandled Rejection", reason.message);
  } else {
    logger.error("Unhandled Rejection", reason);
  }
});

export default createHandler(() => {
  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossorigin="anonymous"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
              rel="stylesheet"
            />
            <link rel="icon" href="/favicon.ico" />
            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});
