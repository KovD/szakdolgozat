import React, { useState } from 'react';
import axios from 'axios';

function Test() {

    let text = "Anyu"

    const handleSubmit = async () => {
          const response = await axios.post('http://localhost:5000/api/Test', { text });
    }

    handleSubmit()

    return<div>
        Sex
    </div>
}

export default Test