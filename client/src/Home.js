import React, { useEffect } from 'react';
import axios from 'axios'
const Home = () => {
    useEffect(() => {
        axios.get('/api/hello')
        .then( response => {console.log(response.data)})
       }, [])
    /**
     * 
        */
    return (
        <div>
          <h1>강창래3</h1>  
        </div>
    );
};

export default Home;