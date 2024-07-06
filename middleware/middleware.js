import { getCurrentUser } from "../services/user.service.js";

export const isValidUser = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const user = await getCurrentUser(req, res);
      console.log(user, "user", requiredRoles)
      if (user && requiredRoles.includes(user.role)) {
        next(); 
      } else {
        if (!res.headersSent) {
          return res.status(403).json({ message: "Unauthorized user" });
        }
      }
    } catch (error) {
      console.error("Error in isValidUser middleware:", error);
      if (!res.headersSent) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  };
};