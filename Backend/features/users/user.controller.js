import user from "./user.model.js";

export const createUser = async (req, res) => {
    try {
            const { name, email, password,  role } = req.body;

        const checkEmail = await user.findOne({
            where: {
                email
            }
        });

        if (checkEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const newuser = await user.create(req.body);

        res.status(201).json({
            success: true,
            data: newuser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
