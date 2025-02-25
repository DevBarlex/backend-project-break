// middlewares/authMiddleware.js: Archivo que contendrá el middleware para comprobar si el usuario está autenticado. Este buscará la sesión del usuario y,
//  si no la encuentra, redirigirá al formulario de login.

const admin = require('firebase-admin');
const auth = admin.auth();
const db = admin.firestore(); // Conectar con Firestore

const checkAuth = async (req, res, next) => {
    try {
        const idCookie = req.cookies.token;
        if (!idCookie) {
            return res.status(401).send("⚠️ Acceso no autorizado (sin token)");
        }

        const decodedToken = await auth.verifyIdToken(idCookie);
        const userId = decodedToken.uid;

        // 🔍 Buscar el usuario en Firestore
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists || userDoc.data().role !== "admin") {
            return res.status(403).send("🚫 Acceso denegado. No tienes permisos de administrador.");
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("🚫 Error de autenticación:", error);
        return res.status(403).send("🚫 Token inválido o expirado");
    }
};

module.exports = checkAuth;

