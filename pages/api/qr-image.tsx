import type {NextApiRequest, NextApiResponse} from 'next'

import {get} from "../../helpers";
import {slugify} from "../../helpers/slugify";
import axios from "axios";

const nodeHtmlToImage = require('node-html-to-image')

type Data = {
    url?: string,
    error?: string
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    get(req, res)

    let name = req.query?.name;
    let nameUnformated = name;
    let gitHub = req.query?.gitHub;
    let linkedin = req.query?.linkedin;

    name = slugify(String(name))
    if (!!!name) {
        return res.status(500).json({error: 'not found param name'});
    }

    const dataResponseBackend = await axios.post("http://localhost:9090/api/user/qrcode", {
        'name': name,
        'gitHub': gitHub,
        'linkedin': linkedin
    });

    if (
        !!dataResponseBackend.data?.data?.error &&
        Object.keys(dataResponseBackend.data.data.error).length > 0
    ) {
        return res.status(500).json({'error': dataResponseBackend.data.data.error});
    }

    var QRCode = require('qrcode')


    var base64 = '';

    const urlOutput = `/QR/${name}.png`;
    QRCode.toDataURL(`http://localhost:3000/${name}`, async (err: any, url: string | PromiseLike<string>) => {
        base64 = await url

        nodeHtmlToImage({
            output: 'public' + urlOutput,
            html: `
        <html>
        <body style="width: 500px; height: 620px" > 
            <div style=" display: flex; flex-direction: column; justify-content: center; align-items: center"> 
            <h1 style="margin-top: 40px;">{{nameUnformated}}<h1> 
            <h1 style="margin-top: 40px;">Scan Me<h1> 
            <img src="{{url}}" style="width: 300px">
            </div> 
        </body> 
        </html>
        `,
            content: {nameUnformated: nameUnformated, url: url}
        }).then(() => console.log('The image was created successfully!'));
    })


    res.status(200).json({'url': urlOutput})
}
