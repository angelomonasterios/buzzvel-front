import * as yup from 'yup';

export const FormValidations = yup.object().shape({
    name: yup.string().required('Name is required'),
    gitHub: yup.string().url().required('gitHub is required'),
    linkedin: yup.string().url().required('linkedin is required')
})