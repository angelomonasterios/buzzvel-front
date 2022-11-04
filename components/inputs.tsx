import {useState} from "react";
import {AppProps} from "next/app";

type props = {
    name: string,
    id: string,
    error?: string

}

export const TextGroup = ({name, id, error , ...rest}: props) => {
    const [input, setInput] = useState(false);

    return (
        <>
            <div className="input-group mb-3 d-flex">
                    <span className="input-group-text">{name}</span>
                    <input id={id} type="text" {...rest} onInput={() => setInput(true)} className={'form-control'}/>
                 <span className="text-danger w-100">{error}</span>
            </div>
        </>
    );
}