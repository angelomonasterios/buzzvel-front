import {useRouter} from 'next/router'
import axios from "axios";


export async function getServerSideProps(context) {
    let data = {}
    try {
        const id = context.query.id as string;
        const data = (await axios.get(`http://localhost:9090/api/user/qrcode/${id}`)).data;
        return {props: {data}}
    } catch (e) {
        return {props: data}
    }
}

const User = ({data}) => {
    if (!!!data?.data) return (<h1>Not found</h1>);

    let {name, linkedin, gitHub} = data.data;
    name = name.replaceAll('-', ' ');
    return (
        <>
            <div className="container p-5 ">
                <h1 style={{fontSize: "22px"}}> Hello, my name is: <strong style={{'textTransform': "capitalize"}}>{name}</strong></h1>
                <h1 className="mt-4" style={{fontSize: "25px"}}>  <strong>My history</strong></h1>
                <p className="w-50">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                </p>
                <div className="row">
                    <a className='btn btn-primary w-auto m-2' href={linkedin} target={"_blank"} rel="noreferrer">linkedin</a>
                    <a className='btn btn-primary w-auto m-2' href={gitHub} target={"_blank"} rel="noreferrer">gitHub</a>
                </div>
            </div>
        </>
    )
}


export default User