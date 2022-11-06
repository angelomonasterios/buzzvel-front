import {useState} from "react";
import {FormValidations} from "../helpers/FormValidations";
import {ValidationError} from "yup";
import {TextGroup} from "./inputs";
import Swal from 'sweetalert2'
import axios from "axios";

type FormType = {
    name: String | any,
    gitHub: String | any,
    linkedin: String | any
}


export const FormGenerateQr = () => {
    const initialFormState: FormType = {
        name: '',
        gitHub: '',
        linkedin: ''
    }

    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState(initialFormState);
    const [imageqr, setImageqr] = useState('');

    const validate = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        let errors = {gitHub: undefined, linkedin: undefined, name: undefined};

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
            return
        }

        await send()
    }

    // @ts-ignore
    const setInputs = (newValue) => {
        console.log(newValue)
        setForm(form => ({...form, ...newValue}))
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

            if (!!dataResponse.data.url) {
                setImageqr(dataResponse.data.url)
                Swal.fire({
                    icon: 'success',
                    html: '<a href="/api' + dataResponse.data.url + '" class="btn btn-success" download>Download</a>',
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
            // @ts-ignore
            const {request} = e;
            // @ts-ignore
            const message = e.message
            let errorResponse = request ?? message;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorResponse,
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
                            <TextGroup
                                error={errors.name} id={'name'} name={'name'}
                                onChange={(
                                    e: { target: { value: any; }; }) => setInputs({name: e.target.value}
                                )}
                            />
                            <TextGroup
                                error={errors.linkedin} id={'Linkedin'}
                                name={'Linkedin URL'}
                                onChange={(
                                    e: { target: { value: ''; }; }) => setInputs({linkedin: e.target.value}
                                )}
                            />
                            <TextGroup
                                error={errors.gitHub} id={'Github'}
                                name={'Github  URL'}
                                onChange={(
                                    e: { target: { value: any; }; }) => setInputs({gitHub: e.target.value}
                                )}
                            />

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