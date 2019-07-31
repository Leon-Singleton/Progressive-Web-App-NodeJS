module.exports = {
    /**
     * executes succeeding middleware if a user is logged in else prompts user to login with a
     * flash message
     * @param req the request object
     * @param res the response object
     * @param next function which executes the succeeding middleware
     */
    ensureAuthenticated: function (req, res, next) {

        //checks if user is logged in
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/users/login');
        res.render(login.ejs);
    }
};
