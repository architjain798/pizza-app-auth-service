// import createError from 'http-errors'
import app from './app'
import { Config } from './config'
import logger from './config/logger'

const startServer = () => {
    const PORT = Config.PORT
    try {
        // const err = createError(401, 'Please login to view this page.')
        // throw err
        // throw new Error('Something went wrong')
        logger.debug('debug message', {})
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message)
            setTimeout(() => {
                process.exit(1)
            }, 1000)
        }
    }
}

startServer()
