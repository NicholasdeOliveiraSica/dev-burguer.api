import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'


class SessionController {
    async store(req, res) {
        const schema = Yup.object({
            email: Yup.string().required().email(),
            password: Yup.string().min(6).required()
        })

        const message = () => { 
            res.status(401).json({ error: "Email ou senha incorreta. Verifique os campos e tente novamente!" })
        }

        const isValid = await schema.isValid(req.body)

        if (!isValid) {
            return message()
        }

        const { email, password } = req.body

        const user = await User.findOne({
            where: {
                email,
            }
        })

        if (!user) {
            return message()
        }

        const isSamePassword = await user.checkPassword(password)

        if (!isSamePassword) {
            return message()
        }

        return res.json({ 
            message: "Logged On!",
            user: {
                id: user.id,
                name: user.name,
                email,
                admin: user.admin,
                token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn
                })
            }
         })
    }
}

export default new SessionController()