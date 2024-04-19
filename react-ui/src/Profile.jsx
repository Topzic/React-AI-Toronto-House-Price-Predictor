import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const SomeComponent = () => {
    const authUser = useAuthUser()
    const email = authUser.email;

    return (
        <div>
            <p>Email: {email}</p>
        </div>
    );
}

export default SomeComponent;
