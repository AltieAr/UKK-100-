import authServices from "../services/authService.js";

class AuthController{
    async login(req,res){
        try {
            const result = await authServices.login(req.body.username, req.body.password);

            res.status(200).json({
                message: "Login successful",
                token : result.token,
                userData : result.userData
            });
        }catch(err){
            res.status(401).json({
                message: err.message
            });
        }
    }
}

export default new AuthController();