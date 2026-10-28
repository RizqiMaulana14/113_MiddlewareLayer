import express from 'express'
import pg from 'pg'
import Joi, { func } from 'joi'

const app = express()
const port = 3000
const { Pool } = pg

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'Password123',
    port: 5432,
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//middleware logging

app.use((req, res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start

        console.log({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration} ms`,
        })
    })

    next()
})

//response envelope

function succesResponse(res, message, data, status = 200) {
    return res.status(status).json({
        success: true,
        message,
        data,
        error: null,
    })
}

function errorResponse(res, message, status, details = null) {
    return res.status(status).json({
        success: false,
        message,
        data: null,
        error: details,
    })
}

//joi validation schema

const biodataSchema = Join.object({
    id: Joi.number().integer()/positive(),
    nama: Joi.string().trim().min(2).max(100).required(),
    nim: Joi.string().trim().min(5).max(20).required(),
    kelas: Joi.string().trim().min(1).max(20).required(),
})

const idSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
})

//middleware untuk validasi body
function validateBody(schema) {
    return(req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: true,
            convert: true,
            allowUnknown: false,
        })

        if(error) {
            return errorResponse(
                res,
                'Validasi input gagal',
                400,
                error.details.map(item => ({
                    field: item.path.join('.'),
                    message: item.message,
                }))
            )
        }

        req.body = value
        next()
    }
}
