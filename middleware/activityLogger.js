const logDao = require("../dao/logDao");

const activityLogger = (req, res, next) => {
  const trackedMethods = ["POST", "PUT", "PATCH", "DELETE"];

  if (!trackedMethods.includes(req.method)) {
    return next();
  }

  const excludedKeywords = ["fetch", "search", "preview", "filter", "list", "log-history"];
  const urlPath = req.originalUrl.split("?")[0].toLowerCase();
  
  if (excludedKeywords.some(keyword => urlPath.includes(keyword))) {
    return next();
  }

  res.on("finish", async () => {
    if (res.statusCode >= 400 || req.skipActivityLog) {
      return;
    }

    try {
      const userId = req.user ? req.user.id : null;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");

      let actionPrefix = "";
      switch (req.method) {
        case "POST":
          actionPrefix = "Create";
          break;
        case "PUT":
        case "PATCH":
          actionPrefix = "Update";
          break;
        case "DELETE":
          actionPrefix = "Delete";
          break;
      }

      const pathParts = req.originalUrl.split("?")[0].split("/");
      let moduleName = "Unknown";

      const apiIndex = pathParts.indexOf("api");
      if (apiIndex !== -1 && pathParts.length > apiIndex + 1) {
        let firstPart = pathParts[apiIndex + 1];
        
        if (firstPart === "admin" && pathParts.length > apiIndex + 2) {
          moduleName = `${pathParts[apiIndex + 1]} ${pathParts[apiIndex + 2]}`;
        } else {
          moduleName = firstPart;
        }

        moduleName = moduleName
          .split(/[- ]+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      const actionString = `${actionPrefix} ${moduleName}`;
      let details = `Method: ${req.method}, URL: ${req.originalUrl}, Status: ${res.statusCode}`;

      await logDao.createLog({
        user_id: userId,
        action: actionString,
        details: details,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      console.error("Activity Logger Error:", error);
    }
  });

  next();
};

module.exports = activityLogger;
