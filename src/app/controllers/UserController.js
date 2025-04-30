import { v4 } from 'uuid'
import User from '../models/User'
import * as Yup from 'yup'



class UserController {
    async store(req, res) {
        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            admin: Yup.boolean()
        })

        try {
            schema.validateSync(req.body, { abortEarly: false })
        } catch (err) {
            return res.status(400).json({ error: err.errors })
        }

        const { name, email, password, admin } = req.body

        const userExist = await User.findOne({
            where: {
                email,
            }
        })

        if (userExist) {
            return res.status(409).json({ error: "Usuário já existente!" })
        }

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin
        })

        return res.status(201).json({
            message: "Usuário Criado com Sucesso!",
            user: {
                id: user.id,
                name,
                email,
                admin
            }

        })
    }
}

export default new UserController()