import fs from "fs";
import path from "path";
import {NextApiRequest, NextApiResponse} from "next";
import {get} from "../../../../helpers";


export default async function image(
    req: NextApiRequest,
    res: NextApiResponse
) {
    get(req, res)
    const { image } = req.query

    try {
        const filePath = path.resolve(".", `public/QR/${image}`);
        console.log(filePath)
        const imageBuffer = fs.readFileSync(filePath);
        res.setHeader("Content-Type", "image/png");
        res.status(200).send(imageBuffer)
    } catch (e) {
        console.log(e)
        res.status(404).json({'status': 'not found'});
    }
}