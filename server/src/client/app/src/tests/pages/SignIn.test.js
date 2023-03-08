/**
 * @jest-environment jsdom
 */

import SignIn from "../../pages/auth/SignIn";
import { render } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/react'
import axios from 'axios'
import { BrowserRouter as Router } from "react-router-dom";

import { ThemeProvider } from "styled-components";
import { createTheme } from "@mui/material/styles";


function setup(jsx) {
    return {
        user: userEvent.setup(),
        ...render(<ThemeProvider theme={createTheme({})}>{jsx}</ThemeProvider>),
    }
}


jest.mock("axios")

describe("User Sign In", () => {
    test("Wrong username or password", async () => {
        const {user} = setup(<Router><SignIn /></Router>);
        
        const mockServerResult = {
            "data": {
                "msg": "Wrong username or password"
            }
        }
        axios.post.mockResolvedValueOnce(mockServerResult)

        const email = screen.getByLabelText(/Email/i)
        const password = screen.getByLabelText(/Password/i)
        // const password = screen.getByRole('textbox', {id: 'password'});  // Does not work, gets the same element as email. TODO: figure out why
        const sign_in = screen.getByRole('button', {name: /Sign in/i})

        await user.type(password, "password")
        await user.type(email, "test@test.com")
        expect(password.value).toBe('password');
        expect(email.value).toBe('test@test.com');
            
        await user.click(sign_in);

        expect(axios.post).toHaveBeenCalledWith("https://www.openml.org/login", {"email": "test@test.com", "password": "password"})
        screen.find
        const h3 = screen.getByRole("heading", {level: 3})
        expect(h3.textContent).toBe('Wrong username or password');
    });
})