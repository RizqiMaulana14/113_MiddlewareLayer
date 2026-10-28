import express from 'express'
import pg from 'pg'
import Joi, { func } from 'joi'

const app = express()
const port = 3000
const { Pool } = pg
