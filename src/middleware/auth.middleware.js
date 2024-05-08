// const requireAdmin = async (req, res, next) => {
//     const userId = req.session.userId;
//     console.log(userId);
//     if (!userId) {
//         res.redirect('/');
//         return;
//     }
//     next();
// };

// export {requireAdmin}