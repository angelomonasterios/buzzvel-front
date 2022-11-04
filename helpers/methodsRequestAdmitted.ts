import type {NextApiRequest as request, NextApiResponse as response } from 'next'

export const get = (req: request, res: response) => {
    if (req.method != 'GET') {
        return res.status(404).json({error: 'not found'});
    }

}