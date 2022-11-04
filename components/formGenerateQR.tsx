import {useState} from "react";
import {FormValidations} from "../helpers/FormValidations";
import {ValidationError} from "yup";
import {TextGroup} from "./inputs";
import Swal from 'sweetalert2'
import axios from "axios";


const initialFormState = {
    name: '',
    gitHub: '',
    linkedin: ''
}

export const FormGenerateQr = () => {
    const [form, setform] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [imageqr, setImageqr] = useState('');

    const validate = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        let errors = {}

        try {
            await FormValidations.validate(form, {abortEarly: false})
            setErrors(initialFormState)
        } catch (e) {
            if (e instanceof ValidationError) {
                e.inner.forEach((key) => {
                    // @ts-ignore
                    errors[key.path] = key.message;
                })
                setErrors(errors)
            }

        }
        if (Object.keys(errors).length == 0) {
            await send()
        }

    }

    const setInput = ({newValue}: { newValue: any }) => {
        setform(form => ({...form, ...newValue}))
    }

    const send = async () => {
        try {
            Swal.fire({
                title: 'Aguarde!',
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                },
            });

            const dataResponse = await axios.get("/api/qr-image", {
                params: {
                    'name': form.name,
                    'gitHub': form.gitHub,
                    'linkedin': form.linkedin
                }
            });

            Swal.close()

            if (!!dataResponse.data.url){
                setImageqr(dataResponse.data.url)
                Swal.fire({
                    icon: 'success',
                    html: '<a href="'+dataResponse.data.url+'" class="btn btn-success" download>Download</a>',
                    title: 'Image Created ',
                    text: 'Download image',
                })
            }

            if (!!dataResponse.data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'A error occurred at save',
                    text: 'Download image',
                })

            }

        } catch (e) {
            let errorResponse = e.request?.responseText ?? false;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorResponse ?? e.message,
            })
        }
    }

    return (
        <>
            <div className="container p-4">
                <div className='row m-4'>
                    <div className="col-12">
                        <h1>QR Code Image Generator </h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <form onSubmit={validate}>
                            <TextGroup error={errors.name} id={'name'} name={'name'}
                                       onChange={e => setInput({newValue: {name: e.target.value}})}/>
                            <TextGroup error={errors.linkedin} id={'Linkedin'} name={'Linkedin URL'}
                                       onChange={e => setInput({newValue: {linkedin: e.target.value}})}/>
                            <TextGroup error={errors.gitHub} id={'Github'} name={'Github  URL'}
                                       onChange={e => setInput({newValue: {gitHub: e.target.value}})}/>

                            <button type="submit" className="btn btn-outline-dark btn-lg w-50">
                                Generate Image
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}