import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    req.id = decode.userId;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;
