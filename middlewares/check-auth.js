const jwt = require("jsonwebtoken");

function checkAuthentication(req, res, next) {
    // get token from browser
    const authHeader = req.headers.authorization; // Bearer fhjdjfhdjfh

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({
            message: "Unauthorized!",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({
            message:
                process.env.NODE_ENV === "development"
                    ? err.message
                    : "Unauthorized!",
        });
    }
}

function checkAuthorization(req, res, next) {
    const { role } = req.user;

    if (role === "admin") {
        next();
    } else {
        res.status(401).send({ message: "Unauthorized!" });
    }
}

module.exports = { checkAuthentication, checkAuthorization };
