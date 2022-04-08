import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import{ registerUser} from '../../../_action/user_action';
import { useNavigate } from 'react-router-dom';



const RegisterPage = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if( Password !== ConfirmPassword ){
            return alert ( ' Password와 ConfirmPassword는 같아야 합니다.')
        }
        let body = {
            uEmail: Email,
            uName: Name,
            uPassword: Password
        }

        dispatch(registerUser(body))
            .then(response => {
                console.log(response.payload.success,"결과")
                if (response.payload.success) {
                    navigate('/login')
                } else {
                    alert('Fail to signup')
                    console.log(response)
                }
            })


    }


    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <label>Password Confirm</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                <br />
                <button type="submit">
                    회원가입
                </button>
            </form>
        </div>
    )
};

export default RegisterPage;